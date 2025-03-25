"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface ChatSession {
  _id: string;
  sessionId: string;
  messages: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatHistoryProps {
  userId: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ userId }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`/api/chat-session?userId=${userId}`);
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  if (loading) return <div>Loading chat history...</div>;

  return (
    <div>
      <h2>Last 10 Chat Sessions</h2>
      {sessions.map((session) => (
        <div key={session._id} style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0" }}>
          <strong>Session ID:</strong> {session.sessionId} <br />
          <strong>Last Updated:</strong> {new Date(session.updatedAt).toLocaleString()} <br />
          <strong>Messages:</strong> {session.messages.join(" | ")}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;