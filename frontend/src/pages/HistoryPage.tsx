import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import { 
  Search, Trash2, Calendar, FileText, ArrowLeft, ArrowRight,
  RefreshCw
} from 'lucide-react';

interface HistoryItem {
  id: number;
  user_id: number;
  input_file: string;
  output_text: string;
  confidence: number;
  created_at: string;
  detected_features?: any;
}

const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [inputType, setInputType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const params: any = { skip, limit };
      
      if (search.trim()) params.search = search;
      if (inputType) params.input_type = inputType;
      
      const res = await api.get('/history', { params });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, inputType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this history log?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/history/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error deleting history item", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("WARNING: This will permanently delete your entire prediction history. Are you sure?")) return;
    setClearing(true);
    try {
      await api.delete('/history');
      setItems([]);
      setTotal(0);
    } catch (err) {
      console.error("Error clearing history", err);
    } finally {
      setClearing(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold theme-text-main">Translation Logs</h2>
          <p className="text-sm theme-text-muted">Search and audit previous sign translations.</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="px-4 py-2 border border-red-500/20 hover:bg-red-550/10 text-red-550 dark:text-red-400 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {clearing ? 'Purging logs...' : 'Purge History Logs'}
          </button>
        )}
      </div>

      {/* Search & Filters block */}
      <div className="theme-card p-4 flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Search by translated sign meaning..."
            className="w-full pl-11 pr-4 py-2.5 theme-input rounded-xl text-sm focus:outline-none placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center theme-text-light hover:theme-text-main"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </form>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select
              className="w-full pl-4 pr-10 py-2.5 theme-input rounded-xl text-xs focus:outline-none cursor-pointer"
              value={inputType}
              onChange={(e) => {
                setInputType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Input Formats</option>
              <option value="webcam">Live Webcam Feed</option>
              <option value="video">Uploaded Video File</option>
              <option value="image">Static Image File</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setInputType('');
              setPage(1);
              fetchHistory();
            }}
            className="px-4 py-2.5 theme-bg-sub border theme-border hover:opacity-90 text-xs font-semibold rounded-xl theme-text-muted transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="mt-4 text-xs theme-text-muted font-medium">Fetching database logs...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="theme-card p-12 text-center theme-text-light">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h4 className="font-bold theme-text-main mb-1">No matches found</h4>
          <p className="text-xs theme-text-muted max-w-sm mx-auto">
            Try adjusting your search criteria, selecting a different filter, or launch the workspace to capture signs.
          </p>
        </div>
      ) : (
        <div className="theme-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b theme-border theme-text-light font-bold text-xs uppercase tracking-wider theme-bg-sub bg-zinc-900/10">
                  {user?.role === 'admin' && <th className="py-3.5 px-6">User ID</th>}
                  <th className="py-3.5 px-6">Input Source</th>
                  <th className="py-3.5 px-6">Translated Text</th>
                  <th className="py-3.5 px-6 text-center">Confidence Score</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {items.map((item) => {
                  const ext = item.input_file.split('.').pop() || '';
                  const type = item.input_file.includes('live') 
                    ? 'Webcam' 
                    : ['mp4', 'avi', 'mov'].includes(ext) 
                      ? 'Video File' 
                      : 'Image File';

                  return (
                    <tr key={item.id} className="hover:bg-slate-550/5 transition-colors">
                      {user?.role === 'admin' && (
                        <td className="py-4 px-6 font-semibold theme-text-light text-xs">
                          USR-{item.user_id}
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <span className="font-semibold theme-text-main">{type}</span>
                        <span className="text-[10px] theme-text-light block truncate max-w-xs">{item.input_file}</span>
                      </td>
                      <td className="py-4 px-6 theme-text-main font-semibold">
                        "{item.output_text}"
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.confidence >= 85 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : item.confidence >= 70 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-red-500/10 text-red-650 dark:text-red-400'
                        }`}>
                          {Math.round(item.confidence)}%
                        </span>
                      </td>
                      <td className="py-4 px-6 theme-text-muted text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 rounded-lg border theme-border hover:border-red-500/30 theme-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                          title="Delete log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t theme-border theme-bg-sub bg-zinc-900/10">
              <span className="text-xs theme-text-muted">
                Showing page {page} of {totalPages} ({total} logs total)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border theme-border theme-text-muted hover:theme-text-main transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg border theme-border theme-text-muted hover:theme-text-main transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
