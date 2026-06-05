import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase not configured. Entering Demo Mode.');
      setIsDemoMode(true);
      // Don't auto-login in demo mode if we want to test register/login flow
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, we'll handle this in signup
        return null;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async ({ email, password, fullName }) => {
    if (!supabase) {
      console.log('Demo Mode Signup:', email, fullName);
      const mockUser = { id: 'demo-user', email };
      const mockProfile = { full_name: fullName, plan: 'Pro', created_at: new Date().toISOString() };
      setUser(mockUser);
      setProfile(mockProfile);
      return { data: { user: mockUser }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            full_name: fullName, 
            email: email,
            plan: 'Free',
            created_at: new Date().toISOString()
          }
        ]);
      
      if (profileError) console.error('Error creating profile:', profileError);
      await fetchProfile(data.user.id);
    }

    return data;
  };

  const signIn = async ({ email, password }) => {
    if (!supabase) {
      console.log('Demo Mode Login:', email);
      const mockUser = { id: 'demo-user', email };
      const mockProfile = { full_name: 'Demo User', plan: 'Pro', created_at: new Date().toISOString() };
      setUser(mockUser);
      setProfile(mockProfile);
      return { data: { user: mockUser }, error: null };
    }
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return { error: null };
    }
    return supabase.auth.signOut();
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    profile,
    loading,
    authLoading: loading,
    isDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
