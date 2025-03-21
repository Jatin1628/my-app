"use client";
import React, { useState, useEffect, useRef } from "react";

import { Mic, Video, Send } from "lucide-react";

interface TranscriptEntry {
  text: string;
  isUser: boolean;
}

const ChatTranscript: React.FC = () => {
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [query, setQuery] = useState("");
  // const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize Web Speech API (using webkitSpeechRecognition for wider support).
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log("Transcript received:", transcript);
      setCurrentText(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [currentText]);

  // const handleSend = () => {
  //   if (!query.trim()) return;
  //   // Process your query here (send it to your API or route)
  //   console.log("Sending query:", query);
  //   setQuery("");
  // };

  const handleCameraToggle = async () => {
    setCameraActive((prev) => !prev);
    if (!cameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
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

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setCurrentText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (currentText.trim() === "") return;
    // Add user's message.
    setTranscripts((prev) => [...prev, { text: currentText, isUser: true }]);

    // Call the API route to get the AI response.
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "unique-user-id",
          message: currentText,
        }), // Replace 'unique-user-id' with actual user ID
      });

      const data = await res.json();
      const responseText = data.response;
      setTranscripts((prev) => [
        ...prev,
        { text: responseText, isUser: false },
      ]);

      // Use text-to-speech to read out the response
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error sending message:", error);
      setTranscripts((prev) => [
        ...prev,
        { text: "Failed to connect to AI.", isUser: false },
      ]);
    }

    setCurrentText("");
  };

  return (
    <div className="w-full lg:px-2 py-2 lg:w-[40%] lg:mt-1">
      {/* Transcript Display */}
      <div className="border h-54 lg:h-[60%] overflow-y-scroll border-gray-300 rounded-lg p-4 text-white">
        Transcript section (Baad m krunga)
        {transcripts.map((entry, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              entry.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                entry.isUser ? "bg-black-100" : "bg-black-100"
              }`}
            >
              {entry.text}
            </div>
          </div>
        ))}
      </div>

      {/* //SearchBar */}
      <div className="fixed lg:left-[12%] bottom-5 w-full">
        <div className="flex flex-col w-[90%] lg:w-[70%] lg:ml-8 items-center gap-2 py-3 bg-black border-2 border-white rounded-lg shadow-md">
          <div className="w-full px-2 mx-auto">
            <textarea
              ref={textareaRef}
              placeholder="Ask me anything..."
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-auto max-h-32"
              rows={1}
              style={{ minHeight: "2.5rem" }}
            />
          </div>

          <div className="flex justify-between px-2 py-2 w-full">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full border ${
                  isRecording
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleCameraToggle}
                className={`p-2 rounded-full border ${
                  cameraActive
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <Video className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="p-2 rounded-full bg-white text-gray-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {cameraActive && (
            <div className="w-full lg:w-[20%] px-2 mx-auto">
              <video ref={videoRef} className="w-full rounded-lg" />
            </div>
          )}
        </div>
      </div>
      {/* Input Section */}
      {/* <div className="mt-4 h-full">
        <textarea
          className="w-full h-16 lg:h-[16%] overflow-y-scroll p-3 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="Speak or type your message..."
          rows={3}
        />
        <div className="flex space-x-2">
          <button
            onClick={toggleRecording}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Send
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ChatTranscript;
