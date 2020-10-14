import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';

interface Credentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: Credentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

interface AuthState {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
    }

    return token && user
      ? { token, user: JSON.parse(user) }
      : ({} as AuthState);
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ user, token });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (updateData: User) => {
      setData({
        token: data.token,
        user: {
          ...data.user,
          ...updateData,
        },
      });
      localStorage.setItem('@GoBarber:user', JSON.stringify(updateData));
    },
    [data],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
};

export { AuthProvider, useAuth };
