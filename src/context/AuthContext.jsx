import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getSession() is the authoritative initial check — reads from local storage synchronously-ish
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    // onAuthStateChange handles changes AFTER initial load.
    // We skip INITIAL_SESSION to avoid a race condition: onAuthStateChange fires
    // INITIAL_SESSION almost immediately (sometimes before getSession resolves) and
    // can briefly pass null, causing ProtectedRoute to flash "Please sign in".
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return;
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback((email, password) =>
    supabase.auth.signUp({ email, password }), []);

  const signIn = useCallback((email, password) =>
    supabase.auth.signInWithPassword({ email, password }), []);

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signUp,
    signIn,
    signOut,
  }), [session, loading, signUp, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
