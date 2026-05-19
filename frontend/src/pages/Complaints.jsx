// pages/Complaints.jsx
// Page showing all complaints with filtering, search, and pagination

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintFilter from '../components/ComplaintFilter';
import ComplaintTable from '../components/ComplaintTable';
import Loader from '../components/Loader';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [filters, setFilters] = useState({ page: 1, limit: 9 });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const { data } = await complaintAPI.getAll(filters);
        setComplaints(data.complaints);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [filters]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">All Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total} complaint{total !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${viewMode === 'cards' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
            >
              Table
            </button>
          </div>
          <Link to="/submit" className="btn-primary">
            + New Complaint
          </Link>
        </div>
      </div>

      {/* Filters */}
      <ComplaintFilter filters={filters} onChange={setFilters} />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" text="Loading complaints..." />
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {complaints.length === 0 ? (
            <div className="col-span-3 card p-12 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No complaints found</p>
              <Link to="/submit" className="btn-primary mt-4 inline-block">Submit First Complaint</Link>
            </div>
          ) : (
            complaints.map((c) => <ComplaintCard key={c._id} complaint={c} />)
          )}
        </div>
      ) : (
        <ComplaintTable complaints={complaints} />
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="btn-secondary disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                p === filters.page ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pages}
            className="btn-secondary disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Complaints;
