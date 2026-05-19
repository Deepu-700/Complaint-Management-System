// pages/Dashboard.jsx
// Main dashboard with stats, charts, and recent complaints

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatCard = ({ label, value, color, icon }) => (
  <div className={`card p-5 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="font-display font-bold text-2xl text-gray-900">{value}</p>
      </div>
      <span className="text-2xl opacity-60">{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          complaintAPI.getStats(),
          complaintAPI.getAll({ limit: 5 }),
        ]);
        setStats(statsRes.data);
        setRecent(complaintsRes.data.complaints);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Chart data
  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    datasets: [{
      data: [stats?.pending || 0, stats?.inProgress || 0, stats?.resolved || 0, stats?.rejected || 0],
      backgroundColor: ['#fbbf24', '#60a5fa', '#34d399', '#f87171'],
      borderWidth: 0,
    }],
  };

  const categoryLabels = stats?.categoryStats?.slice(0, 6).map(c => c._id) || [];
  const categoryValues = stats?.categoryStats?.slice(0, 6).map(c => c.count) || [];

  const barData = {
    labels: categoryLabels,
    datasets: [{
      label: 'Complaints',
      data: categoryValues,
      backgroundColor: '#6272f5',
      borderRadius: 6,
    }],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">
          {user ? `Hello, ${user.username} 👋` : 'Dashboard'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with complaints today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Complaints" value={stats?.total || 0} color="border-brand-500" icon="📋" />
        <StatCard label="Pending" value={stats?.pending || 0} color="border-amber-400" icon="⏳" />
        <StatCard label="In Progress" value={stats?.inProgress || 0} color="border-blue-400" icon="🔄" />
        <StatCard label="Resolved" value={stats?.resolved || 0} color="border-green-400" icon="✅" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="flex justify-center">
            <div style={{ width: 220, height: 220 }}>
              <Doughnut
                data={doughnutData}
                options={{
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } } },
                  cutout: '65%',
                }}
              />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Top Categories</h3>
          <Bar
            data={barData}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { ticks: { font: { size: 10 } } },
              },
              maintainAspectRatio: false,
            }}
            style={{ height: 200 }}
          />
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-display font-semibold text-gray-800">Recent Complaints</h3>
          <Link to="/complaints" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No complaints yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((c) => (
              <Link
                key={c._id}
                to={`/complaints/${c._id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.location} · {c.category}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <StatusBadge label={c.status} />
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
