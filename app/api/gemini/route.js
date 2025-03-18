import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API Key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Model Configuration
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// POST API Handler
export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Start Chat Session
    const chatSession = model.startChat({ generationConfig, history: [] });

    // Send message to Gemini API
    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Failed to connect to AI." }, { status: 500 });
  }
}
