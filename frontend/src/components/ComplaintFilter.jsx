// components/ComplaintFilter.jsx
// Filter and search bar for complaints list

const CATEGORIES = [
  'All Categories',
  'Water Supply',
  'Electricity',
  'Roads & Infrastructure',
  'Sanitation',
  'Public Safety',
  'Healthcare',
  'Education',
  'Noise Pollution',
  'Air Pollution',
  'Other',
];

const STATUSES = ['All Status', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const ComplaintFilter = ({ filters, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="card p-4 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="flex-1 min-w-48">
        <input
          type="text"
          placeholder="Search complaints..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input-field text-sm"
        />
      </div>

      {/* Location */}
      <div className="min-w-36">
        <input
          type="text"
          placeholder="Filter by location..."
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="input-field text-sm"
        />
      </div>

      {/* Category */}
      <select
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value === 'All Categories' ? '' : e.target.value)}
        className="input-field text-sm min-w-40"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c === 'All Categories' ? '' : c}>{c}</option>
        ))}
      </select>

      {/* Status */}
      <select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value === 'All Status' ? '' : e.target.value)}
        className="input-field text-sm min-w-36"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s === 'All Status' ? '' : s}>{s}</option>
        ))}
      </select>

      {/* Clear Filters */}
      {(filters.search || filters.location || filters.category || filters.status) && (
        <button
          onClick={() => onChange({ page: 1 })}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
        >
          Clear ×
        </button>
      )}
    </div>
  );
};

export default ComplaintFilter;
