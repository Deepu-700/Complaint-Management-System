// models/Complaint.js
// Mongoose schema for Complaint

import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allow anonymous complaints
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
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
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    // AI-generated fields
    aiAnalysis: {
      priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: null },
      department: { type: String, default: null },
      summary: { type: String, default: null },
      response: { type: String, default: null },
    },
    // Timeline tracking
    timeline: [
      {
        status: String,
        note: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Text index for search
complaintSchema.index({ title: 'text', description: 'text', location: 'text' });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
