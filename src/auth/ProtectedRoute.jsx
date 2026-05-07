import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';

function ProtectedRoute({ children }) {
  const auth = useAuth();

  console.log('ProtectedRoute auth state:', auth);

  if (auth.loading) {
    console.log('ProtectedRoute: loading auth state');
    return (
      <div className="min-h-screen grid place-items-center bg-[#05070B] text-[#F8FAFC] p-6">
        <div className="inline-flex items-center gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 backdrop-blur-xl">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-[#3B82F6]" />
          <span className="text-sm text-[#CBD5E1]">Verifying membership...</span>
        </div>
      </div>
    );
  }

  if (!auth.hasMembership) {
    console.log('ProtectedRoute: redirecting to /access-denied');
    return <Navigate to="/access-denied" replace />;
  }

  console.log('ProtectedRoute: access granted');
  return children;
}

export default ProtectedRoute;
