import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Automatically log the user in if a token exists in localStorage
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optional: Fetch user profile here later
      setUser(JSON.parse(localStorage.getItem('user')));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { token: newToken, id,role, fullName } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({ id,email, role, fullName }));
      
      setToken(newToken);
      setUser({id, email, role, fullName });
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};