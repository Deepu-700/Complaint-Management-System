// controllers/aiController.js
// Handles AI-powered complaint analysis using OpenRouter

import Complaint from '../models/Complaint.js';
import { callOpenRouterAI, parseAIResponse } from '../services/openrouterService.js';
import { buildAnalysisPrompt } from '../utils/aiPromptBuilder.js';

/**
 * @desc    Analyze a complaint using AI
 * @route   POST /api/ai/analyze
 * @access  Private
 */
export const analyzeComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ message: 'Complaint ID is required' });
    }

    // Fetch the complaint
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Build the AI prompt
    const prompt = buildAnalysisPrompt({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      location: complaint.location,
    });

    // Call OpenRouter AI
    const aiResponse = await callOpenRouterAI(prompt);

    // Parse the JSON response
    const analysis = parseAIResponse(aiResponse);

    // Save AI analysis back to the complaint
    complaint.aiAnalysis = {
      priority: analysis.priority,
      department: analysis.department,
      summary: analysis.summary,
      response: analysis.response,
    };

    await complaint.save();

    res.json({
      message: 'AI analysis completed successfully',
      complaintId: complaint._id,
      analysis: {
        ...analysis,
        ...complaint.aiAnalysis,
      },
    });
  } catch (error) {
    // If AI fails, return a friendly error (don't crash the server)
    if (error.message.includes('OpenRouter') || error.message.includes('parse')) {
      return res.status(503).json({
        message: 'AI service temporarily unavailable. Please try again.',
        error: error.message,
      });
    }
    next(error);
  }
};

/**
 * @desc    Analyze complaint from request body (without saving to DB)
 * @route   POST /api/ai/quick-analyze
 * @access  Public
 */
export const quickAnalyze = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const prompt = buildAnalysisPrompt({
      title,
      description,
      category: category || 'Other',
      location: location || 'Not specified',
    });

    const aiResponse = await callOpenRouterAI(prompt);
    const analysis = parseAIResponse(aiResponse);

    res.json({ analysis });
  } catch (error) {
    next(error);
  }
};
