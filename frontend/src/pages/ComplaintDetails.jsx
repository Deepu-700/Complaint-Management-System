// pages/ComplaintDetails.jsx
// Full complaint detail view with timeline, AI analysis, and status update

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import AIResultCard from '../components/AIResultCard';
import Loader from '../components/Loader';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [note, setNote] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const { data } = await complaintAPI.getById(id);
      setComplaint(data);
      setStatusUpdate(data.status);
    } catch (err) {
      setError('Complaint not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!user) return alert('Please login to use AI analysis');
    try {
      setAiLoading(true);
      const { data } = await aiAPI.analyze(id);
      setComplaint((prev) => ({ ...prev, aiAnalysis: data.analysis }));
    } catch (err) {
      alert(err.response?.data?.message || 'AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!user) return;
    try {
      setUpdateLoading(true);
      const { data } = await complaintAPI.update(id, { status: statusUpdate, note });
      setComplaint(data);
      setNote('');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await complaintAPI.delete(id);
      navigate('/complaints');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" text="Loading complaint..." />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="card p-12 text-center">
        <p className="text-4xl mb-3">❌</p>
        <p className="text-gray-500">{error || 'Complaint not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
      >
        ← Back to complaints
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display font-bold text-xl text-gray-900 leading-tight">
                  {complaint.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StatusBadge label={complaint.status} />
                  {complaint.aiAnalysis?.priority && (
                    <StatusBadge label={complaint.aiAnalysis.priority} showDot={false} />
                  )}
                  <span className="badge bg-brand-50 text-brand-700 border border-brand-100">
                    {complaint.category}
                  </span>
                </div>
              </div>
              {user?.role === 'admin' && (
                <button onClick={handleDelete} className="btn-danger text-xs">
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Submitted by</p>
                <p className="text-gray-800 font-medium">{complaint.name}</p>
                <p className="text-gray-500 text-xs">{complaint.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Location</p>
                <p className="text-gray-800 font-medium">📍 {complaint.location}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-400 text-xs mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed text-sm">{complaint.description}</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-gray-800">AI Analysis</h2>
              <button
                onClick={handleAIAnalyze}
                disabled={aiLoading}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                {aiLoading ? <Loader size="sm" /> : '◎'}
                {aiLoading ? 'Analyzing...' : complaint.aiAnalysis?.priority ? 'Re-analyze' : 'Run AI Analysis'}
              </button>
            </div>
            <AIResultCard analysis={complaint.aiAnalysis} loading={aiLoading} />
            {!complaint.aiAnalysis && !aiLoading && (
              <div className="card p-6 border-dashed border-2 border-gray-200 text-center">
                <p className="text-2xl mb-2">◎</p>
                <p className="text-gray-500 text-sm">No AI analysis yet. Click "Run AI Analysis" to get insights.</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-gray-800 mb-4">Timeline</h2>
            <div className="space-y-3">
              {complaint.timeline?.map((event, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-brand-500 rounded-full mt-1.5 flex-shrink-0" />
                    {idx < complaint.timeline.length - 1 && (
                      <div className="w-px bg-gray-200 flex-1 mt-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <StatusBadge label={event.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(event.updatedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status Update (logged in users) */}
          {user && (
            <div className="card p-5">
              <h3 className="font-display font-semibold text-gray-800 mb-4">Update Status</h3>
              <div className="space-y-3">
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="input-field text-sm"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note (optional)..."
                  rows={3}
                  className="input-field text-sm resize-none"
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateLoading || statusUpdate === complaint.status}
                  className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                >
                  {updateLoading && <Loader size="sm" />}
                  Update Status
                </button>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-gray-800 mb-4">Quick Info</h3>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'ID', value: `#${complaint._id.slice(-8).toUpperCase()}` },
                { label: 'Category', value: complaint.category },
                { label: 'Location', value: complaint.location },
                { label: 'Status', value: <StatusBadge label={complaint.status} /> },
                complaint.aiAnalysis?.department && {
                  label: 'Department',
                  value: complaint.aiAnalysis.department,
                },
                complaint.aiAnalysis?.estimatedResolutionDays && {
                  label: 'Est. Resolution',
                  value: `${complaint.aiAnalysis.estimatedResolutionDays} days`,
                },
              ]
                .filter(Boolean)
                .map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <dt className="text-gray-400">{label}</dt>
                    <dd className="text-gray-700 font-medium text-right">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
