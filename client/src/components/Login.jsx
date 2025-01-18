import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      console.log(response.data); // Success message from backend
      history.push('/dashboard'); // Redirect to dashboard or home page after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="login-card">
      <div className="brand">
        <div className="brand-logo"></div>
        <h1>Welcome back</h1>
        <p>Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            required
          />
          <div className="error" id="emailError"></div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <div className="error" id="passwordError"></div>
        </div>

        <div className="remember-forgot">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="login-btn">
          Sign in
        </button>
      </form>

      <div className="social-login">
        <p>Or continue with</p>
        <div className="social-buttons">
          <div className="social-btn">G</div>
          <div className="social-btn">A</div>
          <div className="social-btn">F</div>
        </div>
      </div>

      <div className="signup-link">
        <p>Don't have an account? <a href="#">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
