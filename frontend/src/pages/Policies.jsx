import React, { useState, useRef } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "नमस्ते! मैं आपकी सहायता के लिए यहां हूँ। कृपया अपना सवाल पूछें।",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botReply = response.data?.reply || "माफ़ कीजिए, उत्तर नहीं मिल पाया।";
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "माफ़ कीजिए, कुछ गलत हो गया। कृपया बाद में कोशिश करें।",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          💬 सहायता चैटबॉट
        </h1>

        <div className="h-96 overflow-y-auto space-y-4 bg-gray-50 p-4 rounded-md border">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md max-w-xs whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-green-200 ml-auto text-right"
                  : "bg-white text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-gray-500">उत्तर आ रहा है...</p>}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none"
            placeholder="अपना सवाल लिखें..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={startListening}
            className={`bg-yellow-500 text-white px-4 py-2 ${
              listening ? "animate-pulse" : ""
            }`}
            title="Speak"
          >
            🎙
          </button>
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-6 py-2 rounded-r-md hover:bg-green-700"
          >
            भेजें
          </button>
        </div>
      </div>
    </div>
  );
}