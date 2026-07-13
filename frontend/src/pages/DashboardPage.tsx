import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Video, CheckCircle2, Award, Activity, Clock, FileText, ArrowRight,
  TrendingUp, RefreshCw, Cpu
} from 'lucide-react';

interface StatsResponse {
  overview: {
    total_predictions: number;
    successful_conversions: number;
    accuracy: number;
    error_rate: number;
  };
  recent_activity: Array<{
    id: number;
    input_file: string;
    output_text: string;
    confidence: number;
    created_at: string;
  }>;
  distribution: Array<{
    label: string;
    count: number;
  }>;
  activity_over_time: Array<{
    date: string;
    count: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await api.get('/dashboard/statistics');
      setData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard statistics", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ['#3b82f6', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-medium animate-pulse">Aggregating system statistics...</p>
      </div>
    );
  }

  const overview = data?.overview;
  const recent = data?.recent_activity || [];
  const distribution = data?.distribution || [];
  const activity = data?.activity_over_time || [];

  return (
    <div className="space-y-6">
      {/* Upper bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Welcome Back</h2>
          <p className="text-sm text-slate-400">Here is the latest analysis on your NMF translations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchStats(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-850 transition-all text-slate-300"
            disabled={refreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link 
            to="/workspace"
            className="glow-button flex items-center gap-2 px-4.5 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
          >
            <Video className="w-3.5 h-3.5" />
            Launch Workspace
          </Link>
        </div>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Predictions */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-inner">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Interpretations</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{overview?.total_predictions}</h3>
          </div>
        </div>

        {/* Successful Conversions */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 shadow-inner">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Successful Translates</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{overview?.successful_conversions}</h3>
          </div>
        </div>

        {/* Avg Accuracy */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 shadow-inner">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Confidence</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{overview?.accuracy}%</h3>
          </div>
        </div>

        {/* Error rate */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Error Margin</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{overview?.error_rate}%</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Area Chart: Activity over time */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Conversions Over Time
            </h3>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bar Chart: Gestures distribution */}
        <div className="glass-card rounded-2xl p-6 flex flex-col h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Frequently Detected NMFs
            </h3>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#475569" fontSize={9} tickLine={false} interval={0} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Section: Recent activity table */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Recent Activity Log
          </h3>
          <Link 
            to="/history" 
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 hover:underline"
          >
            View all history
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No activity registered yet. Visit the Workspace to make your first sign interpretation!
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Input Type</th>
                  <th className="py-3 px-4">Translated Text</th>
                  <th className="py-3 px-4 text-center">Confidence Score</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((item) => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      <span className="capitalize">{item.input_file.split('.').pop() || 'Webcam'}</span>
                      <span className="text-[10px] block text-slate-500 truncate max-w-xs">{item.input_file}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-medium">
                      {item.output_text}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.confidence >= 0.85 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : item.confidence >= 0.70 
                            ? 'bg-amber-500/10 text-amber-400' 
                            : 'bg-red-500/10 text-red-400'
                      }`}>
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
