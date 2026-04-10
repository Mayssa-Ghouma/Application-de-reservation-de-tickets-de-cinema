import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Admin {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  isAdmin: boolean;
  admin: Admin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedAdmin = localStorage.getItem('admin');
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          setAdmin(adminData);
          setIsAdmin(true);
        } catch (error) {
          console.error('Error parsing saved admin data:', error);
          localStorage.removeItem('admin');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:8081/api/admins/login', {
        username,
        password
      });

      if (response.data && response.data.id) {
        const adminData: Admin = response.data;
        setAdmin(adminData);
        setIsAdmin(true);
        localStorage.setItem('admin', JSON.stringify(adminData));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Fallback pour le développement
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.warn('Backend not available, using fallback authentication');
        if (username === 'admin' && password === 'admin') {
          const fallbackAdmin: Admin = {
            id: 1,
            username: 'admin',
            email: 'admin@cinema.tn'
          };
          setAdmin(fallbackAdmin);
          setIsAdmin(true);
          localStorage.setItem('admin', JSON.stringify(fallbackAdmin));
          return true;
        }
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setIsAdmin(false);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin, 
      admin,
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ CET EXPORT EST ESSENTIEL
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};