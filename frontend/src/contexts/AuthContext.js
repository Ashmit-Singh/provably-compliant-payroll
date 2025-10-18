import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api'; // Import your API service functions
import apiClient from '../services/api'; // Import the axios instance

// Development flag - set to false when backend is ready
const USE_MOCK_AUTH = true;

// 1. Create the Context
const AuthContext = createContext(null);

// 3. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds { username, roles, token } or null
  const [isLoading, setIsLoading] = useState(true); // Track initial loading state
  const [error, setError] = useState(null);   // Store login/registration errors

  // Mock login function for development
  const mockLogin = async (username, password) => {
  if (process.env.NODE_ENV === 'development') console.log('DEV MODE: Mock login with:', username);
    
    if (username && password) {
      const mockUser = {
        id: 1,
        username: username,
        email: `${username}@company.com`,
        roles: ['ROLE_ADMIN', 'ROLE_USER'],
        firstName: 'Demo',
        lastName: 'User',
        token: 'mock-jwt-token-' + Date.now()
      };
      
      // Store in localStorage
      localStorage.setItem('authToken', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Set token for apiClient
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${mockUser.token}`;
      
      setUser(mockUser);
      return true;
    } else {
      throw new Error('Please enter both username and password');
    }
  };

  // Mock get current user
  const mockGetCurrentUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  };

  // Effect to check for existing token on initial load
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (token) {
        if (USE_MOCK_AUTH) {
          // Use mock user data for development
          const mockUser = mockGetCurrentUser();
          if (mockUser) {
            setUser(mockUser);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } else {
          // Original backend validation
          try {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const userData = await api.getCurrentUser();
            setUser({
              token: token,
              username: userData.username,
              roles: userData.roles || [],
              ...userData
            });
          } catch (fetchError) {
            console.error("Token validation/fetch failed:", fetchError);
            localStorage.removeItem('authToken');
            delete apiClient.defaults.headers.common['Authorization'];
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  // Login function
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    
    if (USE_MOCK_AUTH) {
        try {
        await mockLogin(username, password);
        setIsLoading(false);
        return true;
      } catch (err) {
        setError(err.message || 'Login failed. Please check credentials.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } else {
      // Original backend login
      try {
        const data = await api.login(username, password);
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          setUser({
            token: data.token,
            username: data.username,
            roles: data.roles || [],
            ...data
          });
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        setError(err.message || 'Login failed. Please check credentials.');
        localStorage.removeItem('authToken');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
  if (process.env.NODE_ENV === 'development') console.log("User logged out");
  };

  // Register function
  const register = async (username, email, password, roles) => {
    setIsLoading(true);
    setError(null);
    
    if (USE_MOCK_AUTH) {
      // For development, treat registration as successful login
      try {
        await mockLogin(username, password);
        setIsLoading(false);
        return { message: 'Registration successful', user: user };
      } catch (err) {
        setError(err.message || 'Registration failed.');
        setIsLoading(false);
        throw err;
      }
    } else {
      // Original backend registration
      try {
        const data = await api.register(username, email, password, roles);
        setIsLoading(false);
        return data;
      } catch (err) {
        setError(err.message || 'Registration failed.');
        setIsLoading(false);
        throw err;
      }
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Value provided by the context
  const value = {
    user, // The user object { token, username, roles } or null
    isLoading, // Loading state
    error,     // Error state
    login,     // Login function
    logout,    // Logout function
    register,  // Register function
    clearError, // Clear error function
    isAuthenticated: !!user, // Convenience boolean
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show loading spinner during initial auth check */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-slate-900">
          <div className="text-white text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};