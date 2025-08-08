import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from 'lib/supabase';
import * as Linking from 'expo-linking';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for secure storage
const TOKEN_KEY = 'auth_token';
const SESSION_KEY = 'auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const url = Linking.useLinkingURL();

  useEffect(() => {
    if (url) {
      console.log('Magic link clicked!', url);
      handleDeepLink(url);
    }
  }, [url]);

  // Runs on app start, sets isAuthenticated.
  useEffect(() => {
    checkAuthState();
  }, []);

  const handleDeepLink = async (url: string) => {
    console.log('🔥 DEEP LINK HANDLER TRIGGERED');
    
    // Parse tokens from URL
    const { params } = QueryParams.getQueryParams(url);
    const { access_token, refresh_token } = params;
    
    if (access_token && refresh_token) {
      console.log('🔥 TOKENS FOUND, CREATING SESSION');
      
      // Create session
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      
      if (!error) {
        console.log('🔥 SESSION CREATED, USER AUTHENTICATED');

        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(data.session))
        
        setIsAuthenticated(true);
        setAwaitingConfirmation(false);
      }
    }
  };

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
      console.log(`Authenticated?: ${isAuthenticated}`);
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

  const sendMagicLink = async (email: string) => {
    const redirect: string = makeRedirectUri();
    try {
        const response = await fetch('http://10.0.0.8:3000/auth/magic-link/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({email, redirect})
        });

        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(`Failed to sign up: ' + ${data.message}`)
        }

        console.log(data.message);
        setAwaitingConfirmation(true);
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
      sendMagicLink,
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