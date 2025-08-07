import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from 'lib/supabase';
import { router } from 'expo-router';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for secure storage
const TOKEN_KEY = 'auth_token';
const SESSION_KEY = 'auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  // Runs on app start, sets isAuthenticated.
  useEffect(() => {
    checkAuthState();
  }, []);

  // Listens for auth events like sign in/sign out, updating
  // stored tokens/sessions and authentication state
  useEffect(() => {
    const { data:  {subscription} } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`LISTENER TRIGGERED WITH ${event} AND ${session}`);
        if (event == 'SIGNED_IN' && session) {
            await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session))
            await SecureStore.setItemAsync(TOKEN_KEY, session?.access_token!)
    
            setIsAuthenticated(true)
            router.replace('/(protected)/(tabs)');
        } else if (event == 'SIGNED_OUT') {
            await SecureStore.deleteItemAsync(SESSION_KEY);
            await SecureStore.deleteItemAsync(TOKEN_KEY);

            setIsAuthenticated(false);
        }
      })

      return () => subscription.unsubscribe();
  }, [])

  /** This function attempts to retrieve a stored token and session of the user,
   * used to check for authentication. If found, authenticated state is set to true.
   */
  const checkAuthState = async () => {
    try {
      // Get stored token and user data
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const session = await SecureStore.getItemAsync(SESSION_KEY);

      if (token && session) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth state:', error);

      await SecureStore.deleteItemAsync(SESSION_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /** Calls the signup endpoint creating user in Supabase, and storing tokens/session,
   * setting authentication state to true
   * 
   * @param email Email used to sign up
   * @param password Password used to sign up
   */
  const signUp = async (email: string, password: string) => {
    try {
        const response = await fetch('http://10.0.0.8:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(`Failed to sign up: ' + ${data.message}`)
        }

        console.log('SIGNUP SUCCESSFUL');
    } catch (error) {
        console.error(error);
        throw error;
    }
  }


  /** Calls the login endpoint, logging in the user and returning tokens/session data
   * in the response. If returned successfully, then the authenticated state is set to true.
   */
  const login = async (email: string, password: string) => {
    try {
        const response = await fetch('http://10.0.0.8:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(`Failed to sign in: ' + ${data.message}`)
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
  };

  /** Calls the logout endpoint, resetting the authenticated
   * state to false
   */
  const logout = async () => {
    try {
      await fetch('http://10.0.0.8:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      signUp,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};