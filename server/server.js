const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Properly configure CORS
app.use(cors({
  origin: "*", // Adjust this to your specific frontend URL for production
  optionsSuccessStatus: 200
}));
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: "BPCTljDDgqnfjRLNlghwE22T2XnJW8_Z79GsLJsqOgRwgljeEmzW7-E-IWjsDtf69H9FkD_Mo6vgt2Vxqti5FLA",
  privateKey: "x8hc5g0EknCi5C28JHjJ4UjX7-MBEuflsySFUH8SEkw"
};

webPush.setVapidDetails(
  'mailto:example@yourdomain.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// MongoDB connection
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://zadanie3:zadanie3@pwa-app.6bue08s.mongodb.net/?retryWrites=true&w=majority&appName=pwa-app";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db, collection;

async function connectDB() {
  await client.connect();
  db = client.db('pwa-app');
  collection = db.collection('subscriptions');
  console.log("Connected to MongoDB!");
}

connectDB().catch(console.error);

app.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  try {
    // Check if the subscription already exists
    const exists = await collection.findOne({ endpoint: subscription.endpoint });
    if (exists) {
      console.log('Subscription already exists');
      return res.status(409).json({ message: 'Subscription already exists' });
    }
    
    // Insert new subscription
    await collection.insertOne(subscription);
    console.log('Subscription saved');
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Failed to subscribe', err);
    res.status(500).json({ message: 'Failed to subscribe' });
  }
});

app.post('/notify', async (req, res) => {
  const notificationPayload = {
    title: 'Notification Title',
    body: req.body.message,
  };

  try {
    const subscriptions = await collection.find({}).toArray();
    if (subscriptions.length === 0) {
      console.log('No subscriptions found.');
      return res.status(404).json({ message: 'No subscriptions available to send notifications.' });
    }

    const promises = subscriptions.map(subscription => webPush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .catch(err => {
        console.error('Failed to send notification:', err);
        if (err.statusCode === 410) { // GCM/FCM returns 410 if the subscription is no longer valid
          console.log('Removing invalid subscription from the database');
          return collection.deleteOne({ _id: subscription._id });
        }
      }));

    await Promise.all(promises);
    console.log('All notifications sent.');
    res.json({ message: 'Notifications sent successfully.' });
  } catch (err) {
    console.error('Error in sending notifications:', err);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});


app.listen(8000, () => console.log('Server started on port 8000'));
