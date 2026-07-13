import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import { 
  User, Mail, KeyRound, CheckCircle2, AlertTriangle, Shield, 
  Settings, Loader2 
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    
    if (!name || !email) {
      setProfileError("Fields cannot be empty.");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await api.put('/users/profile', { name, email });
      updateUser(res.data.name, res.data.email);
      setProfileSuccess("Profile details updated successfully.");
    } catch (err: any) {
      console.error(err);
      setProfileError(err.response?.data?.detail || "Failed to update profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess(null);
    setPwdError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError("All password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match.");
      return;
    }

    setPwdLoading(true);
    try {
      await api.put('/users/profile/password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      setPwdSuccess("Password updated successfully.");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setPwdError(err.response?.data?.detail || "Failed to update password. Verify your old password.");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-200">Account Settings</h2>
        <p className="text-sm text-slate-400">Update your profile parameters and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Profile Details</h3>
              <p className="text-xs text-slate-500">Update your name and contact details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 flex-1">
            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{profileError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={profileLoading}
                  required
                />
              </div>
            </div>

            <div className="bg-slate-900/30 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Assigned User Role</span>
                <span className="text-xs font-bold text-slate-300 capitalize">{user?.role} Access</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold rounded-xl text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              disabled={profileLoading}
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile details'}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">Security & Password</h3>
              <p className="text-xs text-slate-500">Change your sign-in password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 flex-1">
            {pwdSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{pwdSuccess}</span>
              </div>
            )}
            {pwdError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{pwdError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Old Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={pwdLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={pwdLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <KeyRound className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={pwdLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold rounded-xl text-white shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              disabled={pwdLoading}
            >
              {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
