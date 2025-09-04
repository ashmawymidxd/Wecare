import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const fetchUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${config.apiBaseUrl}api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (token) => {
    localStorage.setItem('authToken', token);
    await fetchUser();
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Check for user on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};