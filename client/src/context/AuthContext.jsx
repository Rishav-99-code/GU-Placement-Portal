// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Load initial auth state from localStorage on component mount
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuthState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
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

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };