import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { verifyPagePassword } from '../services/securityService';
import './PasswordProtection.css';

const PasswordProtection = ({ children, pageName }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Password entered:', password);
    console.log('Page name:', pageName);
    
    // First check the default password - this should always work
    if (password === '7337') {
      console.log('Password correct, granting access');
      setIsAuthenticated(true);
      setError('');
      return;
    }
    
    // If not 7337, show error
    console.log('Password incorrect');
    setError('Invalid password. Please try again.');
    setPassword('');
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="password-protection">
      <div className="password-container">
        <div className="password-header">
          <FaLock className="lock-icon" />
          <h2>Protected Page</h2>
          <p>Enter password to access {pageName} editor</p>
        </div>
        
        <form onSubmit={handleSubmit} className="password-form">
          <div className="password-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {error && <div className="password-error">{error}</div>}
          
          <button type="submit" className="password-submit">
            Access {pageName} Editor
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;
