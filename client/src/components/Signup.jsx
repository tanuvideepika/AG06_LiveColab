import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './signup.css'; // Assuming you're using separate CSS for signup

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', { name, email, password });
      console.log(response.data); // Success message from backend
      history.push('/login'); // Redirect to login page after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="signup-card">
      <div className="brand">
        <div className="brand-logo"></div>
        <h1>Create an account</h1>
        <p>Enter your details to get started</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>

      <div className="login-link">
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
