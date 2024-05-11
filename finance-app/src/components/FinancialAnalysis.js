import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

function FinancialAnalysis({ transactions }) {
    const pieData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            label: 'Financial Overview',
            data: [0, 0],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1,
        }]
    };

    const incomeData = {
        labels: transactions.map((_, index) => index + 1),
        datasets: [{
            label: 'Incomes Over Time',
            data: transactions.map(t => t.amount > 0 ? t.amount : 0),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
        }]
    };

    const expensesData = {
        labels: transactions.map((_, index) => index + 1),
        datasets: [{
            label: 'Expenses Over Time',
            data: transactions.map(t => t.amount < 0 ? Math.abs(t.amount) : 0),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
        }]
    };

    const balanceData = {
        labels: transactions.map((_, index) => index + 1),
        datasets: [{
            label: 'Balance Over Time',
            data: transactions.reduce((acc, t) => [...acc, (acc.length > 0 ? acc[acc.length - 1] : 0) + t.amount], []),
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
        }]
    };

    // Obliczanie sumy przychodów i wydatków
    transactions.forEach(transaction => {
        if (transaction.amount > 0) {
            pieData.datasets[0].data[0] += transaction.amount;
        } else {
            pieData.datasets[0].data[1] += Math.abs(transaction.amount);
        }
    });

    

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15%', maxWidth: '1000px', margin: 'auto' }}>
            <div style={{ width: '100%', height: '85%' }}>
                <h3>Financial Overview</h3>
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ width: '100%', height: '85%' }}>
                <h3>Incomes Over Time</h3>
                <Line data={incomeData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ width: '100%', height: '85%' }}>
                <h3>Expenses Over Time</h3>
                <Line data={expensesData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ width: '100%', height: '85%' }}>
                <h3>Balance Over Time</h3>
                <Line data={balanceData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
    );
}

export default FinancialAnalysis;
