// App.js
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';
import './styles.css'; // Assuming you have some styles

function App() {
  const [month, setMonth] = useState('March'); // Default month

  const handleMonthChange = (e) => {
    setMonth(e.target.value); // Update month on selection
  };

  return (
    <div>
      <h1>Transaction Dashboard</h1>

      <label htmlFor="month">Select Month:</label>
      <select id="month" value={month} onChange={handleMonthChange}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <TransactionsTable month={month} />

      {/* Container for Pie and Bar charts */}
      <div className="pie-bar-container">
        <div className="pie-chart">
          <PieChart month={month} />
        </div>
        <div className="bar-chart">
          <BarChart month={month} />
        </div>
      </div>

      {/* Footer with Name */}
      <div className="footer">Kartik Bhapkar</div>
    </div>
  );
}

export default App;
