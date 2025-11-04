
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Initialize state from localStorage during initial render
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          token,
          user,
          isAuthenticated: true,
          isLoading: false
        };
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
  });

  // Verify token validity on mount and after any navigation
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !authState.isAuthenticated) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              setAuthState({
                token,
                user: JSON.parse(userStr),
                isAuthenticated: true,
                isLoading: false
              });
            }
          } else {
            // Token is invalid
            logout();
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
        }
      }
    };

    verifyAuth();
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
    // We'll use our toast context to show the message
    window.dispatchEvent(new CustomEvent('showToast', {
      detail: {
        title: 'Logged Out',
        description: 'You have been logged out successfully',
        variant: 'info'
      }
    }));
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