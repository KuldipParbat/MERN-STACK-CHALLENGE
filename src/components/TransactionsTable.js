// TransactionsTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionsTable({ month }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions'); // Fetch all transactions from the backend API
        // Convert dateOfSale to Date object and filter by selected month
        const formattedTransactions = res.data
          .map(tx => ({
            ...tx,
            dateOfSale: new Date(tx.dateOfSale), // Ensure date is a Date object
          }))
          .filter(tx => {
            // Check if the transaction's month matches the selected month
            return tx.dateOfSale.toLocaleString('default', { month: 'long' }) === month;
          });

        setTransactions(formattedTransactions); // Set transactions in state
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions. Please try again later."); // Set error state
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTransactions();
  }, [month]); // Fetch transactions whenever the month changes

  return (
    <div className="chart-container">
      <h2>Transactions for {month}</h2>
      {loading ? ( // Show loading indicator
        <p>Loading...</p>
      ) : error ? ( // Show error message
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Date of Sale</th>
              <th>Sold</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.title}</td>
                <td>{tx.description}</td>
                <td>${tx.price.toFixed(2)}</td>
                <td>{tx.dateOfSale.toLocaleDateString()}</td>
                <td>{tx.sold ? 'Yes' : 'No'}</td>
                <td>{tx.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionsTable;
