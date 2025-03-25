"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, Video, Send } from "lucide-react";
import axios from "axios";

interface TranscriptEntry {
  text: string;
  isUser: boolean;
}

const ChatTranscript: React.FC = () => {
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // Use a ref to store the transcript (avoiding stale closures)
  const transcriptRef = useRef("");
  const [cameraActive, setCameraActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize SpeechRecognition (using webkitSpeechRecognition for broader support)
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    // Use non-continuous mode so that recognition stops automatically after a pause
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcriptRef.current = transcript;
      setCurrentText(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // If there is text captured, automatically send it once recognition stops
      if (transcriptRef.current.trim() !== "") {
        handleSubmit();
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Adjust the textarea height based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [currentText]);

  // Toggle camera on/off
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

  // Start or stop speech recording
  const toggleRecording = () => {
    // Stop the current AI response
    window.speechSynthesis.cancel();

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      transcriptRef.current = "";
      setCurrentText("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // Submit the message and call the API
  const handleSubmit = async () => {
    const finalTranscript = transcriptRef.current;
    if (finalTranscript.trim() === "") return;

    // Add user's message to transcript
    setTranscripts((prev) => [
      ...prev,
      { text: finalTranscript, isUser: true },
    ]);
    transcriptRef.current = ""; // Reset the transcript ref

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "unique-user-id", // Replace with the actual user ID if needed
          message: finalTranscript,
        }),
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
      utterance.rate =1.5; // Adjust this value for faster or slower speech (default is 1.0)
      utterance.pitch = 1.0; // Optional: Adjust pitch for better clarity
      window.speechSynthesis.speak(utterance);

      // Save the chat session
      await axios.post("/api/chat-session", {
        userId: "unique-user-id", // Replace with the actual user ID if needed
        sessionId: "unique-session-id", // Replace with the actual session ID if needed
        messages: transcripts.map((entry) => entry.text),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setTranscripts((prev) => [
        ...prev,
        { text: "Failed to connect to AI.", isUser: false },
      ]);
    }

    setCurrentText("");
  };

  // Clear the transcript
  const clearTranscript = () => {
    setTranscripts([]);
    setCurrentText("");
    transcriptRef.current = "";
  };

  // Stop the current instance of the AI response
  const stopAIResponse = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="w-full lg:px-2 py-2 lg:w-[40%] lg:mt-1">
      {/* Transcript Display */}
      <div className="border h-54 lg:h-[60%] overflow-y-scroll border-gray-300 rounded-lg p-4 text-white">
        {transcripts.map((entry, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              entry.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div className="inline-block p-3 rounded-lg bg-black-100">
              {entry.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input and Controls */}
      <div className="fixed lg:left-[12%] bottom-5 w-full">
        <div className="flex flex-col w-[90%] lg:w-[70%] lg:ml-8 items-center gap-2 py-3 bg-black border-2 border-white rounded-lg shadow-md">
          <div className="w-full px-2 mx-auto">
            <textarea
              ref={textareaRef}
              placeholder="Ask me anything..."
              value={currentText}
              onChange={(e) => {
                setCurrentText(e.target.value);
                transcriptRef.current = e.target.value;
              }}
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

            {/* Buttons to clear transcript and stop AI response */}
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={clearTranscript}
                className="p-2 rounded-full border bg-white text-gray-700 font-semibold"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={stopAIResponse}
                className="p-2 rounded-full border bg-white text-gray-700 font-semibold"
              >
                Stop
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
    </div>
  );
};

export default ChatTranscript;