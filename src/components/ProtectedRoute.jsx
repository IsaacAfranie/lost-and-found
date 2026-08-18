import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      window.location.hash = 'auth';
    }
  }, [loading, session]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return children;
}
