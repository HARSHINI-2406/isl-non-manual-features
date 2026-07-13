import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Cpu, AlertTriangle, KeyRound, Mail, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if redirected from profile expiry or register success
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';
  const isRegistered = queryParams.get('registered') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      // Navigate to intended page or fall back to dashboard
      const origin = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(origin);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Could not sign in. Please verify your email and password connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Lights background */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Sign in to your account</h2>
          <p className="text-sm text-slate-400 mt-2">Access your sign recognition workspace</p>
        </div>

        {/* Notices */}
        {isExpired && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Session expired. Please log in again to continue.</span>
          </div>
        )}
        {isRegistered && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 text-emerald-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Registration successful! You can now sign in below.</span>
          </div>
        )}

        {/* Form Container */}
        <div className="glass-card rounded-3xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex gap-3 text-red-400 text-xs leading-normal">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-slate-950 accent-blue-500 text-blue-500 focus:ring-0 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="text-xs text-slate-400">Remember my session</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
