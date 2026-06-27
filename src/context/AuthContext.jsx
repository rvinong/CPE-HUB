
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token') || null;
    console.log('AuthContext: initial token', t);
    return t;
  });
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    console.log('AuthContext: initial user', userData);
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    console.log('AuthContext: token changed', token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    console.log('AuthContext: user changed', user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (newToken, userInfo) => {
    console.log('AuthContext: login called', newToken, userInfo);
    setToken(newToken);
    setUser(userInfo);
  };

  const logout = () => {
    console.log('AuthContext: logout called');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, isAdmin: user?.isAdmin || false }}>
      {children}
    </AuthContext.Provider>
  );
};
