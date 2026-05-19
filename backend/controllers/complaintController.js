// controllers/complaintController.js
// Handles all complaint CRUD operations

import Complaint from '../models/Complaint.js';

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Public
 */
export const createComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    // Validate required fields
    if (!name || !email || !title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create complaint
    const complaint = await Complaint.create({
      user: req.user?._id || null, // Attach user if logged in
      name,
      email,
      title,
      description,
      category,
      location,
      status: 'Pending',
      timeline: [{ status: 'Pending', note: 'Complaint registered successfully' }],
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints (with search & filter)
 * @route   GET /api/complaints
 * @access  Public
 */
export const getComplaints = async (req, res, next) => {
  try {
    const { location, category, status, page = 1, limit = 10, search } = req.query;

    // Build query object
    const query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Complaint.countDocuments(query);

    const complaints = await Complaint.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(Number(limit));

    res.json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Public
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'username email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint (status, notes, etc.)
 * @route   PUT /api/complaints/:id
 * @access  Private
 */
export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { status, note } = req.body;

    // Update status and add to timeline if status changed
    if (status && status !== complaint.status) {
      complaint.status = status;
      complaint.timeline.push({
        status,
        note: note || `Status updated to ${status}`,
        updatedAt: new Date(),
      });
    }

    // Update other allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'location'];
    allowedUpdates.forEach((field) => {
      if (req.body[field]) complaint[field] = req.body[field];
    });

    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private/Admin
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaint statistics for dashboard
 * @route   GET /api/complaints/stats
 * @access  Private
 */
export const getStats = async (req, res, next) => {
  try {
    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Rejected' }),
    ]);

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      categoryStats,
      monthlyTrend,
    });
  } catch (error) {
    next(error);
  }
};
