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
        const nextState = {
          loading: false,
          isAuthenticated: membership.isAuthenticated,
          hasMembership: membership.hasMembership,
          user: membership.user,
          error: null
        };

        console.log('AuthProvider initializeAuth:', membership);
        setAuthState(nextState);
      } catch (error) {
        const nextState = {
          loading: false,
          isAuthenticated: false,
          hasMembership: false,
          user: null,
          error: 'Unable to verify membership status.'
        };
        setAuthState(nextState);
        console.error('AuthProvider initialization error:', error);
      }
    }

    initializeAuth();
  }, []);

  useEffect(() => {
    console.log('AuthProvider state updated:', authState);
  }, [authState]);

  const login = () => {
    const checkoutUrl = getWhopCheckoutUrl();
    console.log('Redirecting to Whop checkout:', checkoutUrl);
    window.location.href = checkoutUrl;
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

  const clearMembership = () => {
    localStorage.removeItem('gapian_whop_membership');
    setAuthState({
      loading: false,
      isAuthenticated: false,
      hasMembership: false,
      user: null,
      error: null
    });
    console.log('Membership cleared, auth state reset');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, refresh, clearMembership }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
