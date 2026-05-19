// components/StatusBadge.jsx
// Colored badge for complaint status and priority

const statusConfig = {
  // Complaint Status
  Pending:     { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400' },
  'In Progress':{ bg: 'bg-blue-50',  text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400' },
  Resolved:    { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-400' },
  Rejected:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-400' },
  // AI Priority
  Low:         { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200',   dot: 'bg-gray-400' },
  Medium:      { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  High:        { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  Critical:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500' },
};

const StatusBadge = ({ label, showDot = true }) => {
  const config = statusConfig[label] || statusConfig['Pending'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${label === 'In Progress' ? 'animate-pulse' : ''}`} />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;
