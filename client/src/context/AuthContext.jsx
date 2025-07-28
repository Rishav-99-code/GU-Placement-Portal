
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null, // user object from backend will be stored here
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user'); // This will be a JSON string
    if (token && user) {
      try {
        setAuthState({
          token,
          user: JSON.parse(user), // Parse the user object from string
          isAuthenticated: true,
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        // Clear invalid data if parsing fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (token, user) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(user)); // Stringify user object
    setAuthState({
      token,
      user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  // NEW: Add the updateUser function
  const updateUser = (updatedUser) => {
    setAuthState(prevState => {
      const newState = {
        ...prevState,
        user: updatedUser, // Update the user object in state
      };
      // Also update localStorage if a token exists (meaning a user is logged in)
      if (prevState.token) {
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage with the new user object
      }
      return newState;
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };