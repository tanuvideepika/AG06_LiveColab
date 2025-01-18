// App.js

import React from 'react';
import ChartUploader from './components/ChartUploader'; // Import the ChartUploader component
import './App.css';

function App() {
  return (
    <div className="container">
      <h1 className="title">GET IT VISUALIZED</h1>
      <ChartUploader /> {/* Use the ChartUploader component */}
    </div>
  );
}

export default App;
