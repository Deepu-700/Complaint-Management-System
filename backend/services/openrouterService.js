// services/openrouterService.js
// Integration with OpenRouter AI API

/**
 * Sends a message to OpenRouter AI and returns the response
 * @param {string} prompt - The prompt to send to AI
 * @param {string} model - The AI model to use (default: openai/gpt-4o-mini)
 * @returns {Promise<string>} - The AI response text
 */
export const callOpenRouterAI = async (prompt, model = 'openai/gpt-4o-mini') => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://complaint-system.app', // Required by OpenRouter
        'X-Title': 'AI Complaint Management System',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert complaint management AI assistant for a government system. Always respond with valid JSON only when asked for structured data.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3, // Lower = more consistent outputs
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract the text content from the response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    return content;
  } catch (error) {
    console.error('OpenRouter AI Error:', error.message);
    throw error;
  }
};

/**
 * Parse JSON from AI response (handles markdown code blocks)
 * @param {string} aiResponse - Raw AI response
 * @returns {Object} - Parsed JSON object
 */
export const parseAIResponse = (aiResponse) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = aiResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error('Failed to parse AI response as JSON');
  }
};
