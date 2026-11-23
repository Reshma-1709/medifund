import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medifund_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('medifund_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('medifund_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('medifund_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.fullName}!`);
        return { success: true, user: data.user };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('medifund_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success('Registration successful! Welcome to Medifund.');
        return { success: true, user: data.user };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('medifund_token');
    setToken(null);
    setUser(null);
    toast.success('Signed out successfully');
    window.location.href = '/';
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDashboardPath = (userRole) => {
    const role = userRole || user?.role;
    switch (role) {
      case 'patient': return '/patient/dashboard';
      case 'donor': return '/donor/dashboard';
      case 'hospital': return '/hospital/dashboard';
      case 'ngo': return '/ngo/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    getDashboardPath,
    isPatient: user?.role === 'patient',
    isDonor: user?.role === 'donor',
    isHospital: user?.role === 'hospital',
    isNgo: user?.role === 'ngo',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
