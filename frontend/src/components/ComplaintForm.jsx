// components/ComplaintForm.jsx
// Form for submitting new complaints

import { useState } from 'react';
import { complaintAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const CATEGORIES = [
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

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!form.name || !form.email || !form.title || !form.description || !form.category || !form.location) {
      return setError('All fields are required');
    }

    try {
      setLoading(true);
      const { data } = await complaintAPI.create(form);
      setSuccess('Complaint submitted successfully!');
      setTimeout(() => navigate(`/complaints/${data._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text" name="name" value={form.name}
            onChange={handleChange} placeholder="Your full name"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com"
            className="input-field"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title *</label>
        <input
          type="text" name="title" value={form.title}
          onChange={handleChange} placeholder="Brief title of your complaint"
          className="input-field"
        />
      </div>

      {/* Category + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text" name="location" value={form.location}
            onChange={handleChange} placeholder="e.g. Sector 14, Ghaziabad"
            className="input-field"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description" value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your complaint in detail..."
          className="input-field resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000 characters</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <Loader size="sm" /> : null}
        {loading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
