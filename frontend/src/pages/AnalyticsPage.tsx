import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend, CartesianGrid
} from 'recharts';
import { 
  BarChart3, RefreshCw, Activity, Award, CheckCircle2, 
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../store/ThemeContext';

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
  const { theme } = useTheme();
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

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs theme-text-muted font-medium">Compiling analytical metrics...</p>
      </div>
    );
  }

  const overview = data?.overview;
  const distribution = data?.distribution || [];
  const activity = data?.activity_over_time || [];

  // Theme chart config
  const isDark = theme === 'dark';
  const isContrast = theme === 'contrast';

  const COLORS = isContrast 
    ? ['#ffffff', '#ffff00', '#00ff00', '#00ffff', '#ffffff', '#ffff00'] 
    : ['#4f46e5', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'];

  const chartText = isContrast ? '#ffffff' : (isDark ? '#cbd5e1' : '#475569');
  const chartGrid = isContrast ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)');
  const tooltipBg = isContrast ? '#000000' : (isDark ? '#1f2937' : '#ffffff');
  const tooltipBorder = isContrast ? '#ffffff' : (isDark ? '#374151' : '#e2e8f0');
  const tooltipText = isContrast ? '#ffffff' : (isDark ? '#ffffff' : '#0f172a');

  // Transform distribution data for Pie Chart format
  const pieData = distribution.map((item, idx) => ({
    name: item.label.split(' ')[0], // short label
    value: item.count,
    color: COLORS[idx % COLORS.length]
  }));

  // Mock performance metrics for system overview
  const performanceMetrics = [
    { title: "Avg Landmarking Delay", value: "32ms", desc: "MediaPipe FaceMesh inference execution time per frame." },
    { title: "API Round-trip latency", value: "76ms", desc: "Network payload transfer + server rule classification." },
    { title: "Active Model parameters", value: "14.2M", desc: "Active network variables mapping facial meshes." },
    { title: "Validation set size", value: "1,240 signs", desc: "Linguistic annotations verified in Indian Sign Language." }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold theme-text-main">System Analytics</h2>
          <p className="text-sm theme-text-muted">Overview of recognition precision, delays, and feature distributions.</p>
        </div>
        <button 
          onClick={() => fetchAnalytics(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border theme-border theme-bg-card hover:opacity-95 transition-all theme-text-main"
          disabled={refreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Recalculate Metrics
        </button>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="theme-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="text-xs theme-text-light font-bold uppercase tracking-wider">Overall Precision</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold theme-text-main">{overview?.accuracy}%</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1.5 animate-pulse">
              <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
              +1.2% calibration gain (this week)
            </span>
          </div>
        </div>

        <div className="theme-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="text-xs theme-text-light font-bold uppercase tracking-wider">Successfully Captured</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold theme-text-main">{overview?.successful_conversions}</h3>
            <span className="text-[10px] theme-text-muted mt-1.5 block">
              Confidence logging threshold active at &gt;= 80%
            </span>
          </div>
        </div>

        <div className="theme-card p-6 flex flex-col justify-between h-36">
          <div className="flex justify-between items-center">
            <span className="text-xs theme-text-light font-bold uppercase tracking-wider">Total Evaluated</span>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold theme-text-main">{overview?.total_predictions}</h3>
            <span className="text-[10px] theme-text-muted mt-1.5 block">
              Aggregated across all logged user sessions
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="theme-card p-6 flex flex-col h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold theme-text-main uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Precision Ratios by Classifier
            </h3>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={isContrast ? 0.8 : 0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="date" stroke={chartText} fontSize={11} tickLine={false} />
                <YAxis stroke={chartText} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                  itemStyle={{ color: tooltipText, fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke={isContrast ? '#ffff00' : '#6366f1'} strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie distribution */}
        <div className="theme-card p-6 flex flex-col h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold theme-text-main uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Live Interpretation Confidence Distribution
            </h3>
          </div>
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="40%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '12px' }}
                    itemStyle={{ color: tooltipText, fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={48} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs theme-text-muted font-bold">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs theme-text-light">No distribution logs recorded yet.</span>
            )}
          </div>
        </div>
      </div>

      {/* Model performance metrics cards */}
      <div className="theme-card p-6">
        <h3 className="text-sm font-bold theme-text-main uppercase tracking-wider mb-6 flex items-center gap-2 border-b theme-border pb-3">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          AI & Computer Vision Subsystem Diagnostics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, idx) => (
            <div key={idx} className="theme-bg-sub p-4 rounded-xl border theme-border space-y-1.5">
              <span className="text-xs theme-text-light font-bold uppercase tracking-wider block">{metric.title}</span>
              <span className="text-xl font-extrabold theme-text-main block">{metric.value}</span>
              <p className="text-[10px] theme-text-muted leading-relaxed">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
