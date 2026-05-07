// NOTE: This service is a frontend-only placeholder for Whop integration.
// Do not store or expose secret Whop API keys in frontend code.
// Use a backend endpoint for secure membership verification whenever possible.

const WHOP_APP_ID = import.meta.env.VITE_WHOP_APP_ID;
const WHOP_API_KEY = import.meta.env.VITE_WHOP_API_KEY;
const MEMBERSHIP_PRODUCT_ID = import.meta.env.VITE_WHOP_MEMBERSHIP_PRODUCT_ID;
const WHOP_REDIRECT_URL = import.meta.env.VITE_WHOP_REDIRECT_URL;

// NOTE: Backend validation is required for production. Do not use WHOP_API_KEY in the browser.
const CALLBACK_PATH = '/dashboard';
const buildRedirectUrl = () => {
  if (WHOP_REDIRECT_URL) {
    return `${WHOP_REDIRECT_URL}?member_status=active`;
  }
  return `${window.location.origin}${CALLBACK_PATH}?member_status=active`;
};

export function getWhopCheckoutUrl() {
  // Use the direct Whop product page URL with redirect parameter
  const redirectUrl = encodeURIComponent(buildRedirectUrl());
  const checkoutUrl = `https://whop.com/gapianai/gapian-ai-access/?redirect_url=${redirectUrl}`;
  return checkoutUrl;
}

export async function getMembershipStatus() {
  // Placeholder membership flow:
  // 1. Whop should redirect back to an application callback URL.
  // 2. The callback should be verified by a backend service using a Whop secret API key.
  // 3. For this MVP, we preserve a local membership marker.
  
  const urlParams = new URLSearchParams(window.location.search);
  const memberStatus = urlParams.get('member_status');

  if (memberStatus === 'active') {
    localStorage.setItem('gapian_whop_membership', 'active');
    // Remove the query param after storing membership state.
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (memberStatus === 'inactive') {
    localStorage.removeItem('gapian_whop_membership');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const stored = localStorage.getItem('gapian_whop_membership');
  const membershipState = {
    isAuthenticated: Boolean(stored),
    hasMembership: stored === 'active',
    user: stored ? { name: 'Whop member' } : null
  };

  return membershipState;
}

export function clearMembershipState() {
  localStorage.removeItem('gapian_whop_membership');
}
