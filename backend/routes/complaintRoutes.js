// routes/complaintRoutes.js
import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getStats,
} from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getComplaints);
router.get('/stats', getStats);
router.get('/:id', getComplaintById);
router.post('/', createComplaint); // Anyone can submit a complaint

// Protected routes (require login)
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, adminOnly, deleteComplaint); // Admin only

export default router;
