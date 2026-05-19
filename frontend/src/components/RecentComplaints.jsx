// components/RecentComplaints.jsx
// Table showing the most recent complaints

import { useNavigate } from 'react-router-dom';

// Status badge colors
const statusColor = {
  Pending:      'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'In Progress':'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Resolved:    'bg-green-500/15 text-green-400 border-green-500/30',
  Rejected:    'bg-red-500/15 text-red-400 border-red-500/30',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const RecentComplaints = ({ complaints = [] }) => {
  const navigate = useNavigate();

  if (!complaints.length) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">No recent complaints found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {/* Table Head */}
        <thead>
          <tr className="border-b border-gray-800">
            {['Title', 'Category', 'Status', 'Location', 'Date'].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {complaints.map((c) => (
            <tr
              key={c._id}
              onClick={() => navigate(`/complaints/${c._id}`)}
              className="border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4 text-gray-200 font-medium max-w-[180px] truncate">
                {c.title || '—'}
              </td>
              <td className="py-3 px-4 text-gray-400">{c.category || '—'}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                    statusColor[c.status] || 'bg-gray-700 text-gray-300 border-gray-600'
                  }`}
                >
                  {c.status || '—'}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-400 max-w-[120px] truncate">
                {c.location || '—'}
              </td>
              <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                {formatDate(c.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentComplaints;
