import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data?.session || null);
      } catch (err) {
        console.error('Auth error:', err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
      });

      return () => subscription?.unsubscribe();
    } catch (err) {
      console.error('Auth state change error:', err);
    }
  }, []);

  const signUp = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setSession(data?.session || null);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  return {
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    user: session?.user || null,
  };
}
