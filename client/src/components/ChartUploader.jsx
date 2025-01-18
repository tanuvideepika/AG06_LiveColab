// ChartUploader.jsx

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './ChartUploader.css'; // Optional for styling

const ChartUploader = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!authToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (acceptedFiles) => {
    if (!isLoggedIn) {
      setError('Please log in to upload and visualize data.');
      return;
    }

    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

      const filteredData = excelData.filter((item) => !Object.values(item).every((value) => value === null));
      setFilteredData(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const apiUrl = "http://localhost:5000"; // Use the API URL
    
    try {
      const response = await axios.post(`${apiUrl}/api/authentication/login`, { email: trimmedEmail, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid login credentials.');
    }
  };

  const handleSignup = async () => {
    const trimmedEmail = email.trim();
    const apiUrl = "http://localhost:5000"; // API URL
    
    try {
      const response = await axios.post(`${apiUrl}/api/authentication/register`, { email: trimmedEmail, password });
      console.log('Signup response:', response.data);
      setError('Signup successful! Please log in.');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Email might already be registered.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsLoggedIn(false);
    setFilteredData(null);
    setUploadedFile(null);
    setError('');
  };

  const renderCharts = () => {
    if (!isLoggedIn) return <p>Please log in to visualize data.</p>;

    if (filteredData && filteredData.length > 0) {
      const columns = Object.keys(filteredData[0]);

      const traces = columns.map((column) => ({
        x: filteredData.map((item) => item[column]),
        y: filteredData.map((item) => item[column]),
        type: 'scatter',
        mode: 'lines+markers',
        name: column,
      }));

      return (
        <>
          <h2>Scatter Plot</h2>
          <div className="chart-container">
            <Plot data={traces} layout={{ title: 'Scatter Plot' }} config={{ responsive: true }} />
          </div>
        </>
      );
    } else {
      return <p>No data to visualize. Upload an Excel file to get started.</p>;
    }
  };

  return (
    <div className="chart-uploader-container">
      {!isLoggedIn && (
        <div className="auth-container">
          <h2>{error ? error : 'Login or Signup'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      )}

      {isLoggedIn && (
        <>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <Dropzone onDrop={handleFileUpload}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag n drop an Excel file here, or click to select one.</p>
                {uploadedFile && <p className="file-info">Uploaded File: {uploadedFile.name}</p>}
              </div>
            )}
          </Dropzone>
          {renderCharts()}
        </>
      )}
    </div>
  );
};

export default ChartUploader;
