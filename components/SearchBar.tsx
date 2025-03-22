"use client";

import { useState } from "react";

const SearchBar = ({ userId }: { userId: string | undefined }) => {
  const [query, setQuery] = useState("");

  const handleSend = async () => {
    if (!query.trim() || !userId) return;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message: query }),
      });

      const data = await response.json();
      console.log("Response from Gemini:", data.response);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setQuery("");
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Send
      </button>
    </div>
  );
};

export default SearchBar;