import React from 'react';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please sign in to access this page.</p>
        <a href="/auth">Go to Sign In</a>
      </div>
    );
  }

  return children;
}
