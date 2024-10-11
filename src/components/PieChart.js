// PieChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

function PieChart({ month }) {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions'); // Fetch all transactions
        // Filter data based on the selected month
        const filteredData = res.data.filter(tx => {
          const transactionMonth = new Date(tx.dateOfSale).toLocaleString('default', { month: 'long' });
          return transactionMonth === month; // Filter by month
        });

        // Aggregate the filtered data to count items per category
        const categoriesCount = {};
        filteredData.forEach(tx => {
          categoriesCount[tx.category] = (categoriesCount[tx.category] || 0) + 1;
        });

        // Format the data for the Pie chart
        const chartData = Object.entries(categoriesCount).map(([category, count]) => ({
          _id: category,
          count: count,
        }));

        setPieData(chartData); // Set the pie data
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
        setError("Failed to fetch pie chart data. Please try again later."); // Set error state
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPieData();
  }, [month]); // Fetch pie data whenever the month changes

  const data = {
    labels: pieData.map(item => item._id), // Categories
    datasets: [{
      label: 'Items per Category',
      data: pieData.map(item => item.count), // Count of items in each category
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'], // Colors for each category
    }]
  };

  return (
    <div className="chart-container">
      <h2>Pie Chart for Categories in {month}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Pie data={data} />
      )}
    </div>
  );
}

export default PieChart;
