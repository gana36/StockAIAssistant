import React from 'react';

const StockTable = ({ data, loading }) => {
  // Take just the most recent 10 days of data
  const recentData = [...data].slice(0, 10);
  
  if (loading) {
    return <div className="loading-table">Loading stock data...</div>;
  }
  
  if (recentData.length === 0) {
    return <div className="empty-table">Enter a ticker symbol to view stock data</div>;
  }
  
  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {recentData.map((day, index) => (
            <tr key={index}>
              <td>{day.date}</td>
              <td>${day.open.toFixed(2)}</td>
              <td>${day.high.toFixed(2)}</td>
              <td>${day.low.toFixed(2)}</td>
              <td>${day.close.toFixed(2)}</td>
              <td>{day.volume.toLocaleString()}</td>
              <td className={day.change >= 0 ? 'positive' : 'negative'}>
                {day.change >= 0 ? '+' : ''}{day.change.toFixed(2)} ({day.percentChange.toFixed(2)}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;