// pages/Analytics.jsx
// Complete Analytics & Charts Dashboard
// Admin-friendly — shows charts, cards, table, and export options

import { useEffect, useState, useMemo } from 'react';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnalyticsCard from '../components/AnalyticsCard';
import ComplaintPieChart from '../components/ComplaintPieChart';
import CategoryBarChart from '../components/CategoryBarChart';
import MonthlyLineChart from '../components/MonthlyLineChart';
import PriorityChart from '../components/PriorityChart';
import RecentComplaints from '../components/RecentComplaints';

// ─── Chart wrapper card ───────────────────────────────────────────────────────
const ChartCard = ({ title, children }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
    <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Analytics = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7d' | '30d' | '90d'

  // ── Fetch all complaints ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await complaintAPI.getAll();
        // API can return { complaints: [...] } or directly an array
        setComplaints(Array.isArray(data) ? data : data.complaints || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // ── Filter complaints by date range ──────────────────────────────────────
  const filtered = useMemo(() => {
    if (dateFilter === 'all') return complaints;
    const days = { '7d': 7, '30d': 30, '90d': 90 }[dateFilter];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return complaints.filter((c) => new Date(c.createdAt) >= cutoff);
  }, [complaints, dateFilter]);

  // ── Compute analytics from filtered data ─────────────────────────────────
  const analytics = useMemo(() => {
    // Status counts
    const statusCount = filtered.reduce((acc, c) => {
      const s = c.status || 'Pending';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    // Category counts
    const categoryCount = filtered.reduce((acc, c) => {
      const cat = c.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Monthly counts — group by "Mon YYYY"
    const monthMap = {};
    filtered.forEach((c) => {
      if (!c.createdAt) return;
      const d = new Date(c.createdAt);
      const key = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    // Sort months chronologically
    const monthlyData = Object.entries(monthMap)
      .map(([month, count]) => ({ month, count, _date: new Date(month) }))
      .sort((a, b) => a._date - b._date)
      .map(({ month, count }) => ({ month, count }));

    // AI Priority counts — field could be aiPriority or priority
    const priorityCount = filtered.reduce((acc, c) => {
      const p = c.aiPriority || c.priority || 'Low';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

    // Recent complaints — latest 10
    const recent = [...filtered]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return { statusCount, categoryCount, monthlyData, priorityCount, recent };
  }, [filtered]);

  // ── Export helpers ────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Title', 'Category', 'Status', 'Location', 'Priority', 'Created At'];
    const rows = filtered.map((c) => [
      `"${(c.title || '').replace(/"/g, '""')}"`,
      c.category || '',
      c.status || '',
      `"${(c.location || '').replace(/"/g, '""')}"`,
      c.aiPriority || c.priority || '',
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-analytics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white print:bg-white print:text-black">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Real-time insights &amp; complaint statistics
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-sm rounded-lg px-3 py-2 transition-all"
          >
            ↓ CSV
          </button>

          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg px-3 py-2 transition-all"
          >
            ↓ PDF
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <AnalyticsCard
            title="Total Complaints"
            value={filtered.length}
            icon="📋"
            color="brand"
          />
          <AnalyticsCard
            title="Pending"
            value={analytics.statusCount['Pending'] || 0}
            icon="⏳"
            color="yellow"
          />
          <AnalyticsCard
            title="Resolved"
            value={analytics.statusCount['Resolved'] || 0}
            icon="✅"
            color="green"
          />
          <AnalyticsCard
            title="High Priority"
            value={analytics.priorityCount['High'] || 0}
            icon="🔴"
            color="red"
          />
        </div>
      )}

      {/* ── Charts Row 1: Pie + Bar ── */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ChartCard title="Complaint Status Distribution">
            <ComplaintPieChart data={analytics.statusCount} />
          </ChartCard>
          <ChartCard title="Complaints by Category">
            <CategoryBarChart data={analytics.categoryCount} />
          </ChartCard>
        </div>
      )}

      {/* ── Charts Row 2: Line + Priority ── */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ChartCard title="Monthly Complaint Trend">
            <MonthlyLineChart data={analytics.monthlyData} />
          </ChartCard>
          <ChartCard title="AI Priority Distribution">
            <PriorityChart data={analytics.priorityCount} />
          </ChartCard>
        </div>
      )}

      {/* ── Recent Complaints Table ── */}
      {loading ? (
        <Skeleton className="h-64 mb-4" />
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Recent Complaints
            </h3>
            <span className="text-xs text-gray-500">
              Showing {analytics.recent.length} of {filtered.length}
            </span>
          </div>
          <RecentComplaints complaints={analytics.recent} />
        </div>
      )}
    </div>
  );
};

export default Analytics;
