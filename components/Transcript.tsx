"use client"
import React, { useState, useEffect, useRef } from 'react';

interface TranscriptEntry {
  text: string;
  isUser: boolean;
}

const ChatTranscript: React.FC = () => {
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize Web Speech API (using webkitSpeechRecognition for wider support).
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentText(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setCurrentText('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (currentText.trim() === '') return;
    // Add user's message.
    setTranscripts(prev => [...prev, { text: currentText, isUser: true }]);
    
    // Call the API route to get the AI response.
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentText }),
      });

      const data = await res.json();
      setTranscripts(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setTranscripts(prev => [...prev, { text: 'Failed to connect to AI.', isUser: false }]);
    }

    setCurrentText('');
  };

  return (
    <div className="w-full mx-auto px-4 lg:px-2 py-2 lg:w-[40%] lg:mt-2">
      {/* Transcript Display */}
      <div className="border h-36 lg:h-[59%] overflow-y-scroll border-gray-300 rounded-lg p-4 text-white">
        {transcripts.map((entry, index) => (
          <div key={index} className={`mb-2 flex ${entry.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`inline-block p-3 rounded-lg ${entry.isUser ? 'bg-black-100' : 'bg-black-100'}`}>
              {entry.text}
            </div>
          </div>
        ))}
      </div>
      {/* Input Section */}
      <div className="mt-4 h-full">
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
      </div>
    </div>
  );
};

export default ChatTranscript;