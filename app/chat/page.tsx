"use client"
import { useState, useEffect } from "react";

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setChatLog((prev) => [...prev, finalTranscript.trim()]);
          setTranscript((prev) => prev + " " + finalTranscript.trim());
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={toggleListening}
        className={`px-4 py-2 text-white rounded ${isListening ? "bg-red-500" : "bg-blue-500"}`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      <div className="border p-2 h-40 overflow-auto">
        <h3 className="font-bold">Chat Log:</h3>
        {chatLog.map((msg, index) => (
          <p key={index} className="border-b py-1">{msg}</p>
        ))}
      </div>
      <div className="border p-2 h-40 overflow-auto">
        <h3 className="font-bold">Transcript:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
}