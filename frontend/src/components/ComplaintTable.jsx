// components/ComplaintTable.jsx
// Table view for complaints (used in admin/list views)

import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ComplaintTable = ({ complaints }) => {
  if (!complaints?.length) {
    return (
      <div className="card p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 font-medium">No complaints found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Complaint</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Category</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Location</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Priority</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {complaints.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.name}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{c.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{c.location}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={c.status} />
                </td>
                <td className="px-4 py-3">
                  {c.aiAnalysis?.priority ? (
                    <StatusBadge label={c.aiAnalysis.priority} showDot={false} />
                  ) : (
                    <span className="text-xs text-gray-300">No AI</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/complaints/${c._id}`}
                    className="text-brand-600 hover:text-brand-700 text-xs font-medium"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
