import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  BarChart3, RefreshCw, Activity, Award, CheckCircle2, 
  Eye, HelpCircle, AlertCircle, TrendingUp
} from 'lucide-react';

interface StatsResponse {
  overview: {
    total_predictions: number;
    successful_conversions: number;
    accuracy: number;
    error_rate: number;
  };
  distribution: Array<{
    label: string;
    count: number;
  }>;
  activity_over_time: Array<{
    date: string;
    count: number;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await api.get('/dashboard/statistics');
      setData(res.data);
    } catch (err) {
      console.error("Error fetching analytics statistics", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#3b82f6', '#4f46e5', '#818cf8', '#6366f1', '#ec4899', '#f43f5e'];

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-slate-500 font-medium">Compiling analytical metrics...</p>
      </div>
    );
  }

  const overview = data?.overview;
  const distribution = data?.distribution || [];
  const activity = data?.activity_over_time || [];

  // Transform distribution data for Pie Chart format
  const pieData = distribution.map((item, idx) => ({
    name: item.label.split(' ')[0], // short label
    value: item.count,
    color: COLORS[idx % COLORS.length]
  }));

  // Mock performance metrics for system overview
  const performanceMetrics = [
    { title: "Avg Landmarking Delay", value: "48ms", desc: "MediaPipe FaceMesh inference execution time per frame." },
    { title: "API Round-trip latency", value: "112ms", desc: "Network payload transfer + server rule classification." },
    { title: "Active Model parameters", value: "14.2M", desc: "Active network variables mapping facial meshes." },
    { title: "Validation set size", value: "1,240 vids", desc: "Linguistic annotations verified in India Sign Language." }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">System Analytics</h2>
          <p className="text-sm text-slate-400">Detailed overview of recognition accuracy and feature distributions.</p>
        </div>
        <button 
          onClick={() => fetchAnalytics(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-850 transition-all text-slate-300"
          disabled={refreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Recalculate Stats
        </button>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Precision</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-100">{overview?.accuracy}%</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +1.2% this week (model tuning)
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Successfully Captured</span>
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-100">{overview?.successful_conversions}</h3>
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              Confidence threshold locked at &gt;= 70%
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Evaluated</span>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-100">{overview?.total_predictions}</h3>
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              Aggregated across all logged user sessions
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="glass-card rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Accuracy & Load Progression
          </h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie distribution */}
        <div className="glass-card rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-500" />
            ISL Grammatical Features Ratio
          </h3>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-slate-400 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model performance metrics cards */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          AI & Computer Vision Subsystem Health
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, idx) => (
            <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
              <span className="text-xs text-slate-500 font-medium block">{metric.title}</span>
              <span className="text-xl font-bold text-slate-200 mt-2 block">{metric.value}</span>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
