// utils/aiPromptBuilder.js
// Builds structured prompts for AI analysis

/**
 * Builds a detailed prompt for complaint analysis
 * @param {Object} complaint - The complaint object with title, description, category, location
 * @returns {string} - The formatted prompt
 */
export const buildAnalysisPrompt = (complaint) => {
  return `You are an AI assistant for a government complaint management system. Analyze the following complaint and provide a structured JSON response.

COMPLAINT DETAILS:
- Title: ${complaint.title}
- Category: ${complaint.category}
- Location: ${complaint.location}
- Description: ${complaint.description}

Please analyze this complaint and respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "priority": "Low | Medium | High | Critical",
  "department": "Name of the responsible government department",
  "summary": "A concise 1-2 sentence summary of the complaint",
  "response": "A professional automated response message to send to the complainant",
  "estimatedResolutionDays": number
}

Guidelines:
- priority: Critical if it's life-threatening or affects many people; High if urgent public issue; Medium if important but not urgent; Low if minor issue
- department: Be specific (e.g., "Municipal Water Department", "Public Works Department", "Electricity Board")
- summary: Clear and factual, under 100 words
- response: Empathetic, professional, informative - between 50-100 words
- estimatedResolutionDays: Realistic estimate (1-30 days)`;
};

/**
 * Builds a prompt for generating complaint statistics summary
 */
export const buildStatsSummaryPrompt = (stats) => {
  return `Summarize these complaint statistics in 2-3 sentences for a dashboard:
Total: ${stats.total}, Pending: ${stats.pending}, In Progress: ${stats.inProgress}, Resolved: ${stats.resolved}
Top category: ${stats.topCategory}. Average resolution time: ${stats.avgResolutionDays} days.`;
};
