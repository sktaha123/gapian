import { createContext, useContext, useEffect, useState } from 'react';
import { getMembershipStatus, getWhopCheckoutUrl } from '../services/whopService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    hasMembership: false,
    user: null,
    error: null
  });

  useEffect(() => {
    async function initializeAuth() {
      try {
        const membership = await getMembershipStatus();
        setAuthState({
          loading: false,
          isAuthenticated: membership.isAuthenticated,
          hasMembership: membership.hasMembership,
          user: membership.user,
          error: null
        });
      } catch (error) {
        setAuthState({
          loading: false,
          isAuthenticated: false,
          hasMembership: false,
          user: null,
          error: 'Unable to verify membership status.'
        });
        console.error('AuthProvider initialization error:', error);
      }
    }

    initializeAuth();
  }, []);

  const login = () => {
    window.location.href = getWhopCheckoutUrl();
  };

  const refresh = async () => {
    setAuthState((current) => ({ ...current, loading: true }));
    try {
      const membership = await getMembershipStatus();
      setAuthState({
        loading: false,
        isAuthenticated: membership.isAuthenticated,
        hasMembership: membership.hasMembership,
        user: membership.user,
        error: null
      });
    } catch (error) {
      setAuthState((current) => ({
        ...current,
        loading: false,
        isAuthenticated: false,
        hasMembership: false,
        user: null,
        error: 'Unable to refresh membership status.'
      }));
      console.error('AuthProvider refresh error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
