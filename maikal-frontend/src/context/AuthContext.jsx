import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(localStorage.getItem('maikal_token'));
  const [admin, setAdmin]   = useState(JSON.parse(localStorage.getItem('maikal_admin') || 'null'));

  const login = (tok, adminData) => {
    setToken(tok);
    setAdmin(adminData);
    localStorage.setItem('maikal_token', tok);
    localStorage.setItem('maikal_admin', JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('maikal_token');
    localStorage.removeItem('maikal_admin');
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
