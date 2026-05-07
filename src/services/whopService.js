// NOTE: This service is a frontend-only placeholder for Whop integration.
// Do not store or expose secret Whop API keys in frontend code.
// Use a backend endpoint for secure membership verification whenever possible.

const WHOP_APP_ID = import.meta.env.VITE_WHOP_APP_ID;
const WHOP_API_KEY = import.meta.env.VITE_WHOP_API_KEY;
const MEMBERSHIP_PRODUCT_ID = import.meta.env.VITE_WHOP_MEMBERSHIP_PRODUCT_ID;

// NOTE: Backend validation is required for production. Do not use WHOP_API_KEY in the browser.
const CALLBACK_PATH = '/dashboard';
const buildRedirectUrl = () => `${window.location.origin}${CALLBACK_PATH}?member_status=active`;

export function getWhopCheckoutUrl() {
  // TODO: Replace with your Whop App ID and membership product ID in .env.
  // Example .env entries:
  // VITE_WHOP_APP_ID=your_whop_app_id
  // VITE_WHOP_MEMBERSHIP_PRODUCT_ID=your_membership_product_id
  
  const appId = WHOP_APP_ID || '<WHOP_APP_ID>';
  const productId = MEMBERSHIP_PRODUCT_ID || '<MEMBERSHIP_PRODUCT_ID>';

  return `https://whop.com/checkout/${appId}?product_ids=${productId}&redirect_url=${encodeURIComponent(buildRedirectUrl())}`;
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

  return {
    isAuthenticated: Boolean(stored),
    hasMembership: stored === 'active',
    user: stored ? { name: 'Whop member' } : null
  };
}

export function clearMembershipState() {
  localStorage.removeItem('gapian_whop_membership');
}
