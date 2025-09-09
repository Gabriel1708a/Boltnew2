import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  clientId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated user database
  const users = [
    {
      id: '1',
      email: 'admin@laysinais.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'admin' as const
    },
    {
      id: '2',
      email: 'cliente1@email.com',
      password: 'cliente123',
      name: 'Cliente 1',
      role: 'client' as const,
      clientId: 'client-1'
    },
    {
      id: '3',
      email: 'cliente2@email.com',
      password: 'cliente123',
      name: 'Cliente 2',
      role: 'client' as const,
      clientId: 'client-2'
    },
    {
      id: '4',
      email: 'cliente3@email.com',
      password: 'cliente123',
      name: 'Cliente 3',
      role: 'client' as const,
      clientId: 'client-3'
    },
    {
      id: '5',
      email: 'cliente4@email.com',
      password: 'cliente123',
      name: 'Cliente 4',
      role: 'client' as const,
      clientId: 'client-4'
    }
  ];

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userToSave = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        clientId: foundUser.clientId
      };
      
      setUser(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};