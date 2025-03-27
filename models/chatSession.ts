import mongoose, { Schema, Document } from 'mongoose';

interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  messages: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);