import React, { useState, useRef, useEffect } from "react";

export default function SpeechTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Ready");
  const [browserInfo, setBrowserInfo] = useState({});
  const recognitionRef = useRef(null);

  // Check browser compatibility on component mount
  useEffect(() => {
    checkBrowserCompatibility();
  }, []);

  const checkBrowserCompatibility = () => {
    const info = {
      userAgent: navigator.userAgent,
      isChrome: navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edge'),
      isEdge: navigator.userAgent.includes('Edge'),
      isSafari: navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'),
      isFirefox: navigator.userAgent.includes('Firefox'),
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      mediaDevices: !!navigator.mediaDevices,
      permissions: !!navigator.permissions,
      secureContext: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      language: navigator.language,
      platform: navigator.platform
    };
    setBrowserInfo(info);
  };

  const startRecording = async () => {
    setError("");
    setStatus("Starting...");
    
    // Step 1: Check secure context
    if (!browserInfo.secureContext) {
      setError("❌ Speech recognition requires HTTPS or localhost for security reasons.");
      setStatus("Error");
      return;
    }

    // Step 2: Check browser support
    if (!browserInfo.speechRecognition) {
      setError("❌ Speech recognition not supported in this browser. Use Chrome, Edge, or Safari.");
      setStatus("Error");
      return;
    }

    // Step 3: Request microphone permission
    try {
      setStatus("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setStatus("Microphone permission granted");
    } catch (permissionError) {
      setError(`❌ Microphone permission denied: ${permissionError.message}`);
      setStatus("Error");
      return;
    }

    // Step 4: Start speech recognition
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure settings
      recognition.lang = "en-US"; // Start with English for better compatibility
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Event handlers
      recognition.onstart = () => {
        setIsRecording(true);
        setStatus("🎙️ Listening... Speak now!");
        console.log("🎙️ Speech recognition started");
      };

      recognition.onresult = (event) => {
        console.log("🎯 Speech result:", event);
        
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          console.log(`Result ${i}: "${transcript}" (confidence: ${confidence})`);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + " " + finalTranscript.trim());
          setStatus("✅ Speech processed!");
        }
        
        if (interimTranscript) {
          setStatus(`🎯 Hearing: "${interimTranscript}"`);
        }
      };

      recognition.onerror = (err) => {
        console.error("❌ Speech recognition error:", err);
        let errorMessage = "";
        
        switch (err.error) {
          case "no-speech":
            errorMessage = "No speech detected. Please try again and speak clearly.";
            break;
          case "not-allowed":
            errorMessage = "Microphone permission denied. Please refresh and allow access.";
            break;
          case "network":
            errorMessage = "Network error. Check your internet connection.";
            break;
          case "audio-capture":
            errorMessage = "No microphone found. Please connect a microphone.";
            break;
          case "service-not-allowed":
            errorMessage = "Speech recognition service not allowed.";
            break;
          case "bad-grammar":
            errorMessage = "Grammar error. Try speaking more clearly.";
            break;
          case "language-not-supported":
            errorMessage = "Language not supported. Trying English...";
            recognition.lang = "en-US";
            return;
          default:
            errorMessage = `Error: ${err.error}`;
        }
        
        setError(errorMessage);
        setStatus("Error");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setStatus("Stopped");
        console.log("🏁 Speech recognition ended");
      };

      recognition.onaudiostart = () => {
        setStatus("🎵 Audio captured, speak now!");
      };

      recognition.onspeechstart = () => {
        setStatus("🗣️ Speech detected! Keep speaking...");
      };

      recognition.onspeechend = () => {
        setStatus("🤐 Processing speech...");
      };

      // Start recognition
      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error("❌ Failed to start speech recognition:", error);
      setError(`Failed to start: ${error.message}`);
      setStatus("Error");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setStatus("Stopping...");
      } catch (e) {
        console.warn("Recognition already stopped");
      }
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setError("");
    setStatus("Ready");
  };

  const testMicrophone = async () => {
    try {
      setStatus("Testing microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("✅ Microphone working!");
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setError(`❌ Microphone test failed: ${error.message}`);
      setStatus("Error");
    }
  };

  const checkPermissions = async () => {
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        console.log("🎤 Microphone permission:", permission.state);
        setStatus(`Microphone permission: ${permission.state}`);
        return permission.state;
      } catch (e) {
        console.log("🎤 Permission query failed:", e);
        setStatus("Permission query failed");
        return "unknown";
      }
    } else {
      setStatus("Permissions API not supported");
      return "not-supported";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🎙️ Speech Recognition Diagnostic Tool
      </h1>

      {/* Status Display */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isRecording 
          ? "bg-red-50 border-red-200 text-red-700" 
          : error 
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-blue-50 border-blue-200 text-blue-700"
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${
            isRecording ? "bg-red-500 animate-pulse" : error ? "bg-red-500" : "bg-blue-500"
          }`}></div>
          <span className="font-medium">{status}</span>
        </div>
        {error && <p className="text-sm mt-1">{error}</p>}
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isRecording ? "⏹ Stop" : "🎙️ Start"}
        </button>
        
        <button
          onClick={clearTranscript}
          className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          🗑️ Clear
        </button>
        
        <button
          onClick={testMicrophone}
          className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          🎤 Test Mic
        </button>
        
        <button
          onClick={checkPermissions}
          className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
        >
          🔍 Permissions
        </button>
      </div>

      {/* Transcript Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speech Transcript:
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="w-full border rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Your speech will appear here..."
        />
      </div>

      {/* Browser Compatibility Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🌐 Browser Information</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Browser:</span>
              <span className={browserInfo.isChrome ? "text-green-600" : browserInfo.isEdge ? "text-blue-600" : browserInfo.isSafari ? "text-orange-600" : "text-red-600"}>
                {browserInfo.isChrome ? "✅ Chrome" : browserInfo.isEdge ? "✅ Edge" : browserInfo.isSafari ? "✅ Safari" : browserInfo.isFirefox ? "❌ Firefox" : "❌ Unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform:</span>
              <span>{browserInfo.platform}</span>
            </div>
            <div className="flex justify-between">
              <span>Language:</span>
              <span>{browserInfo.language}</span>
            </div>
            <div className="flex justify-between">
              <span>User Agent:</span>
              <span className="text-xs">{browserInfo.userAgent.substring(0, 40)}...</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🎤 Speech Recognition</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Speech API:</span>
              <span className={browserInfo.speechRecognition ? "text-green-600" : "text-red-600"}>
                {browserInfo.speechRecognition ? "✅ Supported" : "❌ Not Supported"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Media Devices:</span>
              <span className={browserInfo.mediaDevices ? "text-green-600" : "text-red-600"}>
                {browserInfo.mediaDevices ? "✅ Available" : "❌ Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Permissions API:</span>
              <span className={browserInfo.permissions ? "text-green-600" : "text-red-600"}>
                {browserInfo.permissions ? "✅ Available" : "❌ Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Secure Context:</span>
              <span className={browserInfo.secureContext ? "text-green-600" : "text-red-600"}>
                {browserInfo.secureContext ? "✅ Yes" : "❌ No (Required)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">🔧 Troubleshooting Guide:</h3>
        <div className="text-xs text-yellow-700 space-y-2">
          <div><strong>If speech recognition doesn't work:</strong></div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use Google Chrome browser (most reliable)</li>
            <li>Allow microphone permission when prompted</li>
            <li>Speak clearly and close to the microphone</li>
            <li>Check browser console (F12) for error messages</li>
            <li>Ensure you're on HTTPS or localhost</li>
            <li>Try refreshing the page if permissions are blocked</li>
          </ul>
          
          <div className="mt-2"><strong>Common issues:</strong></div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Firefox: Not supported, use Chrome/Edge/Safari</li>
            <li>HTTP sites: Speech recognition requires HTTPS</li>
            <li>Blocked permissions: Check browser settings</li>
            <li>No microphone: Connect external microphone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
