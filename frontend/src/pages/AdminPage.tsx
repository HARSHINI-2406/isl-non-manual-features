import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import { 
  Shield, User, Users, Server, Trash2, CheckCircle2, 
  AlertTriangle, RefreshCw, Layers, Database, Tag
} from 'lucide-react';

interface DBUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface ModelMeta {
  name: string;
  version: string;
  accuracy: number;
  created_at: string;
}

interface AdminStats {
  total_users: number;
  total_predictions_all: number;
  active_models: number;
  models_list: ModelMeta[];
}

const AdminPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  
  const [users, setUsers] = useState<DBUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAdminData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // Parallel requests to get users list and stats
      const [usersRes, statsRes] = await Promise.all([
        api.get('/users'),
        api.get('/dashboard/statistics')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data.admin_stats);
    } catch (err) {
      console.error("Error fetching admin data", err);
      setErrorMsg("Failed to load administration database records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (userId === currentAdmin?.id) {
      alert("You cannot delete your own admin account.");
      return;
    }
    if (!window.confirm("WARNING: This will permanently delete this user account and all their corresponding translation histories. Proceed?")) return;
    
    setDeleteLoadingId(userId);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (stats) {
        setStats({
          ...stats,
          total_users: Math.max(0, stats.total_users - 1)
        });
      }
      setSuccessMsg(`User accounts USR-${userId} deleted successfully.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to delete user.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="mt-4 text-xs text-slate-500 font-medium">Mounting administration database session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-200">Administration Console</h2>
            <p className="text-sm text-slate-400">Manage user accounts, database sizes, and active ML models.</p>
          </div>
        </div>
        <button 
          onClick={() => fetchAdminData(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-850 transition-all text-slate-300"
          disabled={refreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Force Reload
        </button>
      </div>

      {/* Notices */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mini Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total User Accounts</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{stats?.total_users}</h3>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Global Prediction Logs</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{stats?.total_predictions_all}</h3>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Registered AI Models</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{stats?.active_models}</h3>
          </div>
        </div>
      </div>

      {/* Grid: User list table & Models Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users list (2 columns) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Registered User Accounts
          </h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-semibold text-xs uppercase tracking-wider bg-slate-900/10">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((dbUser) => (
                  <tr key={dbUser.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200 block">{dbUser.name}</span>
                      <span className="text-xs text-slate-500 block truncate max-w-xs">{dbUser.email}</span>
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dbUser.role === 'admin' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                      }`}>
                        {dbUser.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(dbUser.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(dbUser.id)}
                        disabled={deleteLoadingId === dbUser.id || dbUser.id === currentAdmin?.id}
                        className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/20 text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                        title="Delete user account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loaded AI Models list (1 column) */}
        <div className="glass-card rounded-2xl p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-500" />
            Loaded Machine Learning Models
          </h3>

          <div className="space-y-4">
            {stats?.models_list.map((m, idx) => (
              <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Model Engine</span>
                    <span className="text-xs font-bold text-slate-200 block mt-1 leading-tight">{m.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-[10px] font-bold text-white uppercase shrink-0">
                    {m.version}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Validation Accuracy</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {Math.round(m.accuracy * 1000) / 10}%
                  </span>
                </div>
                <div className="text-[9px] text-slate-600 text-right">
                  Registered: {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
