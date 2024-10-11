// BarChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

function BarChart({ month }) {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions'); // Fetch all transactions
        // Filter data based on the selected month
        const filteredData = res.data.filter(tx => {
          const transactionMonth = new Date(tx.dateOfSale).toLocaleString('default', { month: 'long' });
          return transactionMonth === month; // Filter by month
        });

        // Create price range counts
        const priceRanges = {
          '0 - 100': 0,
          '101 - 200': 0,
          '201 - 300': 0,
          '301 - 400': 0,
          '401 - 500': 0,
          '501 - 600': 0,
          '601 - 700': 0,
          '701 - 800': 0,
          '801 - 900': 0,
          '901 - above': 0,
        };

        // Count transactions in each price range
        filteredData.forEach(tx => {
          const price = tx.price;
          if (price <= 100) priceRanges['0 - 100']++;
          else if (price <= 200) priceRanges['101 - 200']++;
          else if (price <= 300) priceRanges['201 - 300']++;
          else if (price <= 400) priceRanges['301 - 400']++;
          else if (price <= 500) priceRanges['401 - 500']++;
          else if (price <= 600) priceRanges['501 - 600']++;
          else if (price <= 700) priceRanges['601 - 700']++;
          else if (price <= 800) priceRanges['701 - 800']++;
          else if (price <= 900) priceRanges['801 - 900']++;
          else priceRanges['901 - above']++;
        });

        // Prepare data for the Bar chart
        const chartData = Object.keys(priceRanges).map(range => ({
          _id: range,
          count: priceRanges[range],
        }));

        setBarData(chartData); // Set the bar data
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
        setError("Failed to fetch bar chart data. Please try again later."); // Set error state
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBarData();
  }, [month]); // Fetch bar data whenever the month changes

  const data = {
    labels: barData.map(item => item._id), // Price ranges
    datasets: [{
      label: 'Items in Price Range',
      data: barData.map(item => item.count), // Count of items in each price range
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="chart-container">
      <h2>Bar Chart for Price Range in {month}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Bar data={data} />
      )}
    </div>
  );
}

export default BarChart;
