import React, { useState, useRef } from "react";
import axios from "axios";

export default function WomenChildComplaint() {
  const [recording, setRecording] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null); // hold Web Speech API instance

  // 🔤 Function to convert Hindi → Hinglish
  const transliterateToHinglish = async (text) => {
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          text
        )}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
      );
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        return data[1][0][1][0]; // Hinglish output
      }
      return text;
    } catch (err) {
      console.error("Transliteration API error:", err);
      return text;
    }
  };

  // 🎙️ Single Speak button (toggle start/stop)
  const handleSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    // If already recording → stop
    if (recording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn("Recognition already stopped.");
        }
      }
      setRecording(false);
      return;
    }

    // New instance
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";        // Hindi recognition
    recognition.continuous = true;     // keep listening
    recognition.interimResults = true; // show interim text

    recognition.onresult = async (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      // 🔤 Convert Hindi → Hinglish
      const hinglish = await transliterateToHinglish(transcript.trim());
      setComplaintText(hinglish);
    };

    recognition.onerror = (err) => {
      console.error("Speech Recognition Error:", err);
      if (err.error === "no-speech") {
        alert("No speech detected. Please try again and speak closer to the mic.");
      } else if (err.error === "not-allowed") {
        alert("Microphone permission is blocked. Please allow mic access in your browser settings.");
      }
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    // Start
    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  };

  // 📤 Submit Complaint — attaches live location automatically
  const handleSubmit = async () => {
    if (!complaintText.trim()) {
      alert("Please speak or type your complaint.");
      return;
    }

    setIsSubmitting(true);

    const submitToServer = async (coords) => {
      try {
        const formData = new FormData();
        formData.append("text", complaintText); // This will be mapped to description in backend
        formData.append("name", "Anonymous"); // Add default name
        formData.append("location", "Unknown"); // Add default location
        formData.append("department", "Police"); // Add department
        formData.append("urgency", "urgent"); // Add urgency
        formData.append("category", "Emergency");

        if (coords) {
          formData.append("latitude", coords.latitude);
          formData.append("longitude", coords.longitude);
        }

        // Use the correct women-child endpoint
        const res = await axios.post("http://localhost:5000/api/complaint/women-child", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          setToken(res.data.token);
          setComplaintText("");
          alert(`Complaint submitted successfully${coords ? " with location" : ""}!`);
        } else {
          alert(res.data?.message || "Failed to submit complaint.");
        }
      } catch (err) {
        console.error(err);
        alert("Error submitting complaint.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!navigator.geolocation) {
      await submitToServer(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await submitToServer({ latitude, longitude });
      },
      async (error) => {
        console.warn("Geolocation error:", error);
        const proceed = window.confirm(
          "We couldn't access your location. Submit complaint without location?"
        );
        if (proceed) {
          await submitToServer(null);
        } else {
          setIsSubmitting(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto m-10 p-3 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        🚨 आपातकालीन शिकायत
      </h2>

      {/* 🎙️ Speak */}
      <button
        onClick={handleSpeechToText}
        className={`w-full px-4 py-2 rounded-lg mb-3 font-semibold ${
          recording ? "bg-red-500" : "bg-purple-600"
        } text-white`}
      >
        {recording ? "बोलना रोकें" : "शिकायत बोलें"}
      </button>

      {/* 📝 Complaint Box */}
      <textarea
        placeholder="यहाँ अपनी शिकायत टाइप करें या बोलें..."
        value={complaintText}
        onChange={(e) => setComplaintText(e.target.value)}
        className="w-full border rounded-lg p-3 mb-3 h-32 focus:ring-2 focus:ring-blue-400"
      />

      {/* 📤 Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full ${
          isSubmitting ? "bg-gray-400" : "bg-green-600"
        } text-white px-4 py-2 rounded-lg font-semibold`}
      >
        {isSubmitting ? "शिकायत दर्ज हो रही है..." : " शिकायत दर्ज करें"}
      </button>

      {/* 🎫 Token Display */}
      {token && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100 shadow-sm">
          <p className="font-semibold text-green-700">✅ आपकी शिकायत सफलतापूर्वक दर्ज कर दी गई है।</p>
          <p className="text-gray-700">
            Your Token Number:{" "}
            <span className="font-mono text-lg text-black">{token}</span>
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">
        नोट: सबमिट करने पर लोकेशन अपने आप कैप्चर हो जाएगी (यह HTTPS या localhost पर ही काम करता है)।
      </p>
    </div>
  );
}
