// pages/AIAnalysis.jsx
// Page for quick AI analysis without saving to DB

import { useState } from 'react';
import { aiAPI } from '../services/api';
import AIResultCard from '../components/AIResultCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  'Water Supply', 'Electricity', 'Roads & Infrastructure', 'Sanitation',
  'Public Safety', 'Healthcare', 'Education', 'Noise Pollution', 'Air Pollution', 'Other',
];

const AIAnalysis = () => {
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return setError('Title and description are required');
    }
    setError('');
    setAnalysis(null);
    try {
      setLoading(true);
      const { data } = await aiAPI.quickAnalyze(form);
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">AI Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">
          Test AI analysis without submitting a complaint. Get instant priority, department, and response recommendations.
        </p>
      </div>

      {/* How it works */}
      <div className="card p-5 bg-brand-50 border-brand-100">
        <h3 className="font-display font-semibold text-brand-800 text-sm mb-3">How AI Analysis Works</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { step: '1', label: 'Input complaint details', icon: '📝' },
            { step: '2', label: 'AI reads & understands', icon: '◎' },
            { step: '3', label: 'Detects urgency & dept.', icon: '🎯' },
            { step: '4', label: 'Generates response', icon: '✉️' },
          ].map(({ step, label, icon }) => (
            <div key={step} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-brand-700 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-gray-800 mb-4">Enter Complaint Details</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title *</label>
            <input
              type="text" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Water pipeline burst near main market"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., Sector 14, Ghaziabad"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder="Describe the complaint in detail..."
              className="input-field resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader size="sm" /> : <span>◎</span>}
            {loading ? 'AI is analyzing...' : 'Analyze with AI'}
          </button>
        </form>
      </div>

      {/* Results */}
      {(loading || analysis) && (
        <AIResultCard analysis={analysis} loading={loading} />
      )}
    </div>
  );
};

export default AIAnalysis;
