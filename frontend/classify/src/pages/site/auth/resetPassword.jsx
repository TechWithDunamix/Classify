import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {api} from "../../../utils"

const ResetPassword = () => {
  const { token } = useParams();  // Get token from URL params
  const [tokenValid, setTokenValid] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validate token when the component mounts
  useEffect(() => {
    const validateToken = async () => {
     api.put()
    };

    validateToken();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

  }
  if (tokenValid === null) {
    return <div>Validating token...</div>;
  }

  if (!tokenValid) {
    return <div>Invalid or expired token</div>;
  }

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {!success && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
