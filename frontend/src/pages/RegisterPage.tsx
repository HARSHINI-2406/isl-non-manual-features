import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Cpu, AlertTriangle, KeyRound, Mail, User, Shield, Loader2 } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword, role);
      navigate('/login?registered=true');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Could not register user. This email may already be in use.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background decoration */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight theme-text-main">Create a new account</h2>
          <p className="text-sm theme-text-muted mt-2">Get started with the SignLink AI platform</p>
        </div>

        {/* Form Container */}
        <div className="theme-card p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex gap-3 text-red-655 dark:text-red-400 text-xs leading-normal">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center theme-text-light pointer-events-none">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 theme-input rounded-xl text-sm focus:outline-none placeholder:text-slate-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center theme-text-light pointer-events-none">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 theme-input rounded-xl text-sm focus:outline-none placeholder:text-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2">
                Role Selection
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center theme-text-light pointer-events-none">
                  <Shield className="w-4.5 h-4.5" />
                </span>
                <select
                  id="role"
                  className="w-full pl-11 pr-4 py-3 theme-input rounded-xl text-sm focus:outline-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="user" className="theme-text-main">Standard User</option>
                  <option value="admin" className="theme-text-main">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center theme-text-light pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 theme-input rounded-xl text-sm focus:outline-none placeholder:text-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center theme-text-light pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 theme-input rounded-xl text-sm focus:outline-none placeholder:text-slate-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm theme-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="theme-accent-text hover:underline font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
