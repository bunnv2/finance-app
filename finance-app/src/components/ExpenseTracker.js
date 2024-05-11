import React, { useState } from 'react';

function ExpenseTracker({ transactions, setTransactions, totalAmount, setTotalAmount }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('income');
  const [error, setError] = useState('');

  const updateBalance = (transList) => {
    const total = transList.reduce((acc, curr) => acc + curr.amount, 0);
    setTotalAmount(total);
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const newAmount = transactionType === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    if (transactionType === 'expense' && totalAmount + newAmount < 0) {
      setError('Insufficient funds to complete this transaction.');
      return;
    }
    setError('');
    const newTransaction = {
      description,
      amount: newAmount,
      id: Math.random()
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    updateBalance(updatedTransactions);
    setDescription('');
    setAmount('');
    setTransactionType('income');
  };

  const clearIncomes = () => {
    const filteredTransactions = transactions.filter(t => t.amount < 0);
    setTransactions(filteredTransactions);
    updateBalance(filteredTransactions);
  };

  const clearExpenses = () => {
    const filteredTransactions = transactions.filter(t => t.amount >= 0);
    setTransactions(filteredTransactions);
    updateBalance(filteredTransactions);
  };

  const clearAll = () => {
    setTransactions([]);
    setTotalAmount(0);
  };

  return (
    <div>
      <h2>Your Transactions</h2>
      <h3>Balance: ${totalAmount.toFixed(2)}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addTransaction}>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
      <div>
        <button onClick={clearIncomes}>Clear Incomes</button>
        <button onClick={clearExpenses}>Clear Expenses</button>
        <button onClick={clearAll}>Clear All</button>
      </div>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id} className={transaction.amount >= 0 ? 'income' : 'expense'}>
            {transaction.description} - ${Math.abs(transaction.amount).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;
