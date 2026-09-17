import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => sessionStorage.getItem('auth-email') || '');
  const [token, setToken] = useState(() => sessionStorage.getItem('auth-token') || '');

  const persistAuth = (newEmail, newToken) => {
    setEmail(newEmail);
    setToken(newToken);
    sessionStorage.setItem('auth-email', newEmail);
    sessionStorage.setItem('auth-token', newToken);
  };

  const clearAuth = () => {
    setEmail('');
    setToken('');
    sessionStorage.removeItem('auth-email');
    sessionStorage.removeItem('auth-token');
  };

  const login = async (userEmail, password) => {
    try {
      const res = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        persistAuth(data.name, data.csrfToken);
        return { success: true };
      }
      return {
        success: false,
        error: `Authentication failed: ${data?.message || 'Invalid Credentials'}`,
      };
    } catch {
      return { success: false, error: 'Network error during login' };
    }
  };

  const logout = async () => {
    if (!token) {
      clearAuth();
      return { success: true };
    }

    try {
      const response = await fetch('/api/users/logoff', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include',
      });

      clearAuth();

      if (response.ok) return { success: true };
      return { success: false, error: 'Logout request failed, but you have been logged out locally.' };
    } catch {
      clearAuth();
      return { success: false, error: 'Network error during logout' };
    }
  };

  const value = { email, token, isAuthenticated: !!token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}