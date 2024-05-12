import React, { useState, useEffect } from 'react';
import ExpenseTracker from './components/ExpenseTracker';
import FinancialAnalysis from './components/FinancialAnalysis';
import './App.css';
import { subscribeUser, unsubscribeUser } from './utils/push-notifications';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [totalAmount, setTotalAmount] = useState(() => {
    const savedBalance = localStorage.getItem('totalAmount');
    return savedBalance ? parseFloat(savedBalance) : 0;
  });
  const [view, setView] = useState('tracker');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalAmount', totalAmount.toString());
  }, [transactions, totalAmount]);

  useEffect(() => {
    const totalIncomes = transactions.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, curr) => -acc - curr.amount, 0);

    if (totalIncomes > 0 && (totalExpenses / totalIncomes) >= 0.9) {
      sendPushNotification();
    }
  }, [transactions]);

  const sendPushNotification = () => {
    fetch('http://localhost:8000/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Budget Alert', message: 'Your spending is near the budget limit!' })
    })
    .then(response => response.json())
    .then(data => console.log('Notification sent:', data))
    .catch(err => console.error('Error sending notification:', err));
  };

  return (
    <div className="App">
      <header>
        <h1>Finance Manager</h1>
        <p>Manage your income and expenses effectively. Switch between tracking and analyzing your financial data.</p>
        <nav>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={{ width: '48%', marginRight: '10px' }} onClick={() => setView('tracker')}>Expense Tracker</button>
            <button style={{ width: '48%' }} onClick={() => setView('analysis')}>Financial Analysis</button>
          </div>
        </nav>
      </header>
      {view === 'tracker' ?
        <ExpenseTracker transactions={transactions} setTransactions={setTransactions} totalAmount={totalAmount} setTotalAmount={setTotalAmount} /> :
        <FinancialAnalysis transactions={transactions} />
      }
    <button onClick={subscribeUser}>Subscribe</button>
    <button onClick={unsubscribeUser}>Unsubscribe</button>
    </div>

  );
}

export default App;
