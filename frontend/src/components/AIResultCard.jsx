// components/AIResultCard.jsx
// Displays AI analysis results for a complaint

import StatusBadge from './StatusBadge';

const AIResultCard = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="card p-6 border-l-4 border-brand-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-brand-600">◎</span>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-1" />
            <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="card p-6 border-l-4 border-brand-500 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
          <span className="text-brand-600 text-sm">◎</span>
        </div>
        <div>
          <h3 className="font-display font-semibold text-gray-900 text-sm">AI Analysis Results</h3>
          <p className="text-xs text-gray-400">Powered by OpenRouter AI</p>
        </div>
      </div>

      {/* Grid of AI fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Priority Level</p>
          {analysis.priority ? (
            <StatusBadge label={analysis.priority} />
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Est. Resolution</p>
          <p className="text-sm font-medium text-gray-800">
            {analysis.estimatedResolutionDays ? `${analysis.estimatedResolutionDays} days` : '—'}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-400 mb-1">Responsible Department</p>
        <p className="text-sm font-medium text-gray-800">{analysis.department || '—'}</p>
      </div>

      <div className="bg-brand-50 rounded-lg p-3 mb-3">
        <p className="text-xs text-brand-600 font-medium mb-1">AI Summary</p>
        <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary || '—'}</p>
      </div>

      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
        <p className="text-xs text-green-700 font-medium mb-1">Automated Response</p>
        <p className="text-sm text-gray-700 leading-relaxed italic">"{analysis.response || '—'}"</p>
      </div>
    </div>
  );
};

export default AIResultCard;
