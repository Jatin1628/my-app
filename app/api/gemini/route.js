import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load API Key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Model Configuration
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const generationConfig = {
  temperature: 0.7, // Adjusted for more human-like responses
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 150, // Limit the response length
  responseMimeType: 'text/plain',
};

// In-memory store for user conversation history
const userHistories = {};

// POST API Handler
export async function POST(request) {
  try {
    const { userId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json({ error: 'User ID and message are required.' }, { status: 400 });
    }

    // Initialize user history if not present
    if (!userHistories[userId]) {
      userHistories[userId] = [];
    }

    // Add user message to history
    userHistories[userId].push({ role: 'user', content: message });

    // Transform history into the format expected by the Gemini API
    const formattedHistory = userHistories[userId].map((entry) => ({
      author: entry.role === 'user' ? 'user' : 'bot',
      parts: [entry.content],
    }));

    // Ensure the first entry in the history has the role 'user'
    if (formattedHistory.length === 0 || formattedHistory[0].author !== 'user') {
      console.error('Invalid history format:', formattedHistory);
      return NextResponse.json({ error: 'Conversation history must start with a user message.' }, { status: 400 });
    }

    // Start Chat Session with formatted history
    const chatSession = model.startChat({ generationConfig, history: formattedHistory });

    // Send message to Gemini API
    const result = await chatSession.sendMessage(`Please respond like a human and keep it concise: ${message}`);
    const responseText = await result.response.text();

    // Add AI response to history
    userHistories[userId].push({ role: 'ai', content: responseText });

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to connect to AI.' }, { status: 500 });
  }
}