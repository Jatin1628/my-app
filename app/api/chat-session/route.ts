// /app/api/chat-session/route.ts
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import ChatSession from "../../../models/chatSession";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await dbConnect();
  // Extract userId from the query string
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 });
  }

  try {
    const sessions = await ChatSession.find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .limit(10)
      .exec();
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userId, sessionId, messages } = await req.json();
    if (!userId || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Update or create the session
    const session = await ChatSession.findOneAndUpdate(
      { userId, sessionId },
      { $set: { messages, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    // Enforce a maximum of 10 sessions per user:
    const sessions = await ChatSession.find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .exec();
    if (sessions.length > 10) {
      const sessionsToRemove = sessions.slice(10);
      for (const s of sessionsToRemove) {
        await ChatSession.deleteOne({ _id: s._id });
      }
    }
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error saving session:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
