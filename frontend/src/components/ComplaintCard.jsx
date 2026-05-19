// components/ComplaintCard.jsx
// Card component for displaying a single complaint summary

import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint }) => {
  const { _id, title, description, category, location, status, createdAt, aiAnalysis } = complaint;

  const date = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link
      to={`/complaints/${_id}`}
      className="card p-5 block hover:shadow-md hover:border-brand-200 transition-all duration-200 animate-slide-up group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 text-sm leading-tight truncate group-hover:text-brand-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <span>📍</span> {location}
          </p>
        </div>
        <StatusBadge label={status} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="badge bg-brand-50 text-brand-700 border border-brand-100">
            {category}
          </span>
          {aiAnalysis?.priority && (
            <StatusBadge label={aiAnalysis.priority} showDot={false} />
          )}
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      {/* AI Department Tag */}
      {aiAnalysis?.department && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            <span className="text-brand-500 font-medium">◎ AI →</span> {aiAnalysis.department}
          </p>
        </div>
      )}
    </Link>
  );
};

export default ComplaintCard;
