import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/ui';
import '../styles/Auth.css';

export default function Auth({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(
          isSignUp
            ? 'Sign up successful! Redirecting...'
            : 'Sign in successful! Redirecting...'
        );
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else window.location.hash = 'browse';
        }, 1500);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Campus Lost & Found</h1>
        <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Campus Email</label>
            <Input
              id="email"
              type="email"
              placeholder="your.name@knust.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}
            >
              {message}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <p className="toggle-auth">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
            }}
            className="toggle-button"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
