import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>
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

  // Runs on app start, sets isAuthenticated.
  useEffect(() => {
    checkAuthState();
  }, []);

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

      await clearAuthData();

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
    callEndpoint('/auth/signup', 'Failed to sign up', email, password);
  }

  /** Calls the login endpoint, logging in the user and returning tokens/session data
   * in the response. If returned successfully, then the authenticated state is set to true.
   */
  const login = async (email: string, password: string) => {
    callEndpoint('/auth/login', 'Failed to login', email, password)
  };

  const callEndpoint = async(url: string, errorMessage: string, email: string, password: string) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({email, password})
        })
    
        if (!response.ok) {
            throw new Error(errorMessage)
        }
    
        const data = await response.json()
        const { access_token, refresh_token, user, expires_at, expires_in } = data;

        // Store token securely
        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
  
        const sessionData = {
          access_token,
          refresh_token,
          user,
          expires_at,
          expires_in
        };
  
        // Store complete session successfully
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionData));
        setIsAuthenticated(true);
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
  }

  /** Calls the logout endpoint, resetting the authenticated
   * state to false
   */
  const logout = async () => {
    try {
      await clearAuthData();
      await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // clears any stored tokens/sessions 
  const clearAuthData = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(SESSION_KEY);
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