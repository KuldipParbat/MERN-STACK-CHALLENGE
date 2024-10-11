import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Statistics({ month }) {
  const [statistics, setStatistics] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      const res = await axios.get(`http://localhost:5000/statistics`, { params: { month } });
      setStatistics(res.data);
    };

    fetchStatistics();
  }, [month]);

  return (
    <div>
      <h2>Statistics for {month}</h2>
      <p>Total Sales: ${statistics.totalSales}</p>
      <p>Total Sold Items: {statistics.totalSold}</p>
      <p>Total Not Sold Items: {statistics.totalNotSold}</p>
    </div>
  );
}

export default Statistics;
