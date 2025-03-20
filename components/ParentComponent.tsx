"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Video, Send } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSend = () => {
    if (!query.trim()) return;
    // Process your query here (send it to your API or route)
    console.log("Sending query:", query);
    setQuery("");
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  const handleCameraToggle = async () => {
    setCameraActive((prev) => !prev);
    if (!cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleMicToggle = async () => {
    setMicActive((prev) => !prev);
    if (!micActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (audioRef.current && audioRef.current.srcObject) {
        const stream = audioRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        audioRef.current.srcObject = null;
      }
    }
  };

  return (
    <div className="flex flex-col w-[90%] lg:w-[70%] items-center gap-2 py-3 bg-black border-2 border-white rounded-lg shadow-md">
      <div className="w-full px-2 mx-auto">
        <textarea
          ref={textareaRef}
          placeholder="Ask me anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-auto max-h-32"
          rows={1}
          style={{ minHeight: "2.5rem" }}
        />
      </div>

      <div className="flex justify-between px-2 py-2 w-full">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-2 rounded-full border ${
              micActive ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleCameraToggle}
            className={`p-2 rounded-full border ${
              cameraActive ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            }`}
          >
            <Video className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleSend}
          className="p-2 rounded-full bg-white text-gray-700"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {cameraActive && (
        <div className="w-full px-2 mx-auto">
          <video ref={videoRef} className="w-full rounded-lg" />
        </div>
      )}

      {micActive && (
        <audio ref={audioRef} className="hidden" />
      )}
    </div>
  );
};

export default SearchBar;