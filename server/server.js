const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(bodyParser.json());

cors({credentials: true, origin: true});
app.use(cors());

const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  'mailto:example@yourdomain.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://zadanie3:zadanie3@pwa-app.6bue08s.mongodb.net/?retryWrites=true&w=majority&appName=pwa-app"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  await client.connect();
  await client.db("pwa-app").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

app.listen(8000, () => console.log('Server started on port 8000'));
run().catch(console.dir);

const db = client.db('pwa-app');
const collection = db.collection('subscriptions');

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    collection.insertOne(subscription, (err, result) => {
        if (err) {
            console.error('An error occurred while inserting the subscription:', err);
            res.status(500).json({ message: 'Failed to subscribe' });
            return;
        }

        res.status(201).json({ message: 'Subscribed successfully' });
    });
});

app.post('/notify', (req, res) => {
    const notificationPayload = {
        title: 'High Expense Alert',
        body: req.body.message,
    };

    collection.find({}).toArray((err, subscriptions) => {
        if (err) {
            console.error('An error occurred while fetching subscriptions:', err);
            res.status(500).json({ message: 'Failed to send notifications' });
            return;
        }

        const promises = [];
        subscriptions.forEach(sub => {
            promises.push(
                webPush.sendNotification(sub, JSON.stringify(notificationPayload))
                    .catch(error => {
                        console.error("Error sending notification, reason: ", error);
                        collection.deleteOne({ endpoint: sub.endpoint });
                    })
            );
        });

        Promise.all(promises).then(() => res.json({ message: 'Notifications sent successfully.' }));
    });
});




