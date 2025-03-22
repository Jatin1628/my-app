import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 50,
  maxOutputTokens: 300,
};

const userHistories = {};

export async function POST(request) {
  try {
    const { userId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json({ error: 'User ID and message are required.' }, { status: 400 });
    }

    if (!userHistories[userId]) {
      userHistories[userId] = [];
    }

    userHistories[userId].push({ role: 'user', parts: [{ text: String(message) }] });

    const formattedHistory = userHistories[userId].map(entry => ({
      role: entry.role, 
      parts: entry.parts.map(part => ({ text: String(part.text) }))
    }));

    const chatSession = model.startChat({
      generationConfig,
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(message);

    // 🔍 Debugging: Log the entire API response
    console.log("Full Gemini API Response:", JSON.stringify(result, null, 2));

    // ✅ Ensure correct response extraction
    const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";

    // 🔥 Debugging: Check if responseText is extracted properly
    console.log("Extracted Response Text:", responseText);

    userHistories[userId].push({ role: 'model', parts: [{ text: responseText }] });

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to connect to AI.' }, { status: 500 });
  }
}
