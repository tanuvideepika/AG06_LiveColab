// LineChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { io } from 'socket.io-client';

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Days
    datasets: [
      {
        label: 'Stock Price',
        data: [], // Prices
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4, // Smoothing the line
      },
    ],
  });

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Adjust to your backend server URL

    socket.on('stockData', ({ price, day }) => {
      setChartData((prev) => ({
        labels: [...prev.labels, `Day ${day}`],
        datasets: [
          {
            ...prev.datasets[0],
            data: [...prev.datasets[0].data, price],
          },
        ],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <h2>Live Stock Price</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Days',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Stock Price',
              },
              beginAtZero: false,
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
