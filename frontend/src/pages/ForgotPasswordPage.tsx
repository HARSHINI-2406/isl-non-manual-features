import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Reset your password</h2>
          <p className="text-sm text-slate-400 mt-2">Recover your sign recognition account</p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-xl">
          {submitted ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">Check your email</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                If the email <strong>{email}</strong> is registered, password reset instructions have been sent to you.
              </p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 text-slate-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                disabled={loading || !email}
              >
                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
