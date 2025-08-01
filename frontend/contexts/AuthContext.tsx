import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
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

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthState();
  }, []);

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

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { token, user: userData } = data;

      // Store token and user data securely
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(userData));

    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw so login component can handle the error
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuthData = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
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