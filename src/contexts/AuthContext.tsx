import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'support' | 'engineer';
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && API_URL) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_URL}/users/me`)
        .then(res => {
          if (res.data && (res.data.id || res.data.user)) {
            setUser(res.data.user || res.data);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone: string, password: string) => {
    if (!API_URL) throw new Error('API URL not configured');
    const res = await axios.post(`${API_URL}/auth/login`, { phone, password });
    const token = res.data.access_token;
    const userData = res.data.user;
    if (!token) throw new Error('Login failed: no token received');
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
