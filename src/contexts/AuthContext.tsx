import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext<AuthContextType | null>(null);

// Map Express backend user to frontend user format
function mapUser(data: any): User {
  return {
    id: String(data.id || ''),
    name: data.full_name || data.name || data.username || '',
    username: data.username || '',
    role: data.role || 'technician',
    phone: data.phone || '',
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && API_URL) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_URL}/auth/me`)
        .then(res => {
          if (res.data?.success && res.data?.data) {
            setUser(mapUser(res.data.data));
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

  const login = async (username: string, password: string) => {
    if (!API_URL) throw new Error('API URL not configured');

    const res = await axios.post(`${API_URL}/auth/login`, { username, password });

    // Express backend format: { success: true, data: { token, user } }
    const responseData = res.data?.data || res.data;
    const token = responseData.access_token || responseData.token;
    const userData = responseData.user;

    if (!token) throw new Error('Login failed: no token received');

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (userData) {
      setUser(mapUser(userData));
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
