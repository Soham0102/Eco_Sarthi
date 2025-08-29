// import React, { useState } from "react";
// import axios from "axios";

// export default function VoiceComplaint() {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [complaintId, setComplaintId] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const appendLog = (line) => {
//     setLogs((prev) => [...prev, line]);
//   };

//   const handleVoiceComplaint = async () => {
//     setLoading(true);
//     setLogs(["🎙️ Voice complaint started..."]);
//     setSubmitted(false);
//     setComplaintId(null);

//     try {
//       // 1. Trigger the Python voice bot and get structured data
//       const voiceRes = await axios.get("http://localhost:5000/api/");
//       if (voiceRes.data.status !== "success") {
//         appendLog("❌ Voice bot error: " + voiceRes.data.message);
//         return;
//       }

//       const complaintData = voiceRes.data.data;
//       appendLog("✅ Voice bot finished. Data:");
//       appendLog(JSON.stringify(complaintData, null, 2));

//       // 2. Send that same data to the complaints endpoint
//       const formRes = await axios.post(
//         "http://localhost:5000/api/complaint",
//         {
//           name: complaintData["शिकायतकर्ता का नाम"] || complaintData.name,
//           complaint: complaintData["शिकायत"] || complaintData.complaint,
//           location: complaintData["स्थान"] || complaintData.location,
//           // map any other fields if needed
//         }
//       );

//       // 3. Capture and display the Complaint ID
//       const newId = formRes.data.complaintId || formRes.data.complaintId;
//       setComplaintId(newId);
//       setSubmitted(true);
//       appendLog(`📬 Complaint submitted. ID: ${newId}`);
//     } catch (err) {
//       appendLog("❌ Error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-semibold mb-4">Voice Complaint</h2>
//       <button
//         onClick={handleVoiceComplaint}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Processing..." : "Start Voice Complaint"}
//       </button>

//       <div className="mt-6 bg-gray-900 text-green-200 p-4 rounded font-mono h-48 overflow-y-scroll">
//         {logs.map((line, i) => (
//           <div key={i}>{line}</div>
//         ))}
//       </div>

//       {submitted && (
//         <div className="mt-6 text-green-700 font-semibold">
//           Complaint submitted successfully!<br />
//           Your Complaint ID: <span className="font-bold">{complaintId}</span>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Phone, PhoneCall, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export default function VoiceComplaint() {
  const [callState, setCallState] = useState("idle"); // idle, calling, connected, ended
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (callState === "connected") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const appendLog = (line, type = "info") => {
    setLogs((prev) => [...prev, { message: line, type, time: new Date().toLocaleTimeString() }]);
  };

  const startCall = async () => {
    setCallState("calling");
    setCallDuration(0);
    setLogs([]);
    setComplaintId(null);
    setSubmitted(false);
    setCurrentStep("Connecting to JantaVoice...");
    
    // Simulate connecting
    setTimeout(() => {
      setCallState("connected");
      setCurrentStep("Connected - Starting voice complaint process");
      appendLog("🔗 Connected to JantaVoice system", "success");
      handleVoiceComplaint();
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    setIsListening(false);
    setIsSpeaking(false);
    setCurrentStep(submitted ? "Call completed successfully" : "Call ended");
    setTimeout(() => {
      setCallState("idle");
      setCurrentStep("");
    }, 3000);
  };

  const handleVoiceComplaint = async () => {
    setLoading(true);
    setIsSpeaking(true);
    appendLog("🎙️ Voice complaint started...", "info");
    setCurrentStep("Processing voice input...");

    try {
      // 1. Trigger the Python voice bot and get structured data
      setCurrentStep("Connecting to voice bot...");
      appendLog("📞 Connecting to voice bot system...", "info");
      
      const voiceRes = await fetch("http://localhost:5000/api/voice-complaint");
      const voiceData = await voiceRes.json();
      
      if (voiceData.status !== "success") {
        appendLog("❌ Voice bot error: " + voiceData.message, "error");
        setCurrentStep("Voice bot connection failed");
        setIsSpeaking(false);
        return;
      }

      const complaintData = voiceData.data;
      setIsSpeaking(false);
      setCurrentStep("Voice conversation completed");
      appendLog("✅ Voice bot finished. Data collected:", "success");
      appendLog(JSON.stringify(complaintData, null, 2), "data");

      // Show conversation details in a user-friendly way
      if (complaintData["शिकायत"]) {
        appendLog(`📝 Complaint: ${complaintData["शिकायत"]}`, "conversation");
      }
      if (complaintData["स्थान"]) {
        appendLog(`📍 Location: ${complaintData["स्थान"]}`, "conversation");
      }
      if (complaintData["शिकायतकर्ता का नाम"]) {
        appendLog(`👤 Name: ${complaintData["शिकायतकर्ता का नाम"]}`, "conversation");
      }
      if (complaintData["मोबाइल नंबर"]) {
        appendLog(`📱 Phone: ${complaintData["मोबाइल नंबर"]}`, "conversation");
      }
      if (complaintData["विभाग"]) {
        appendLog(`🏢 Department: ${complaintData["विभाग"]}`, "conversation");
      }

      // 2. Send that same data to the complaints endpoint
      setCurrentStep("Submitting to admin dashboard...");
      appendLog("📤 Submitting complaint to admin dashboard...", "info");
      
      const formRes = await fetch("http://localhost:5000/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: complaintData["शिकायतकर्ता का नाम"] || complaintData.name || "Anonymous",
            description: complaintData["शिकायत"] || complaintData.complaint || "No description",
            location: complaintData["स्थान"] || complaintData.location || "Unknown",
            urgency: "normal", // Add missing urgency field
            department: complaintData["विभाग"] || complaintData.department || "General",
        }),

      });

      const formData = await formRes.json();

      // 3. Capture and display the Complaint ID
      const newId = formData.complaintId || complaintData.complaint_id || "CMP-" + Date.now();
      setComplaintId(newId);
      setSubmitted(true);
      setCurrentStep("Complaint registered successfully!");
      appendLog(`📬 Complaint submitted to admin dashboard!`, "success");
      appendLog(`🆔 Complaint ID: ${newId}`, "success");
      appendLog("✅ Admin will review and take action soon", "success");

    } catch (err) {
      appendLog("❌ Error: " + err.message, "error");
      setCurrentStep("Error occurred during processing");
    } finally {
      setLoading(false);
      setIsSpeaking(false);
      setIsListening(false);
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "conversation": return "💬";
      case "data": return "📊";
      default: return "ℹ️";
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case "success": return "text-green-400";
      case "error": return "text-red-400";
      case "conversation": return "text-blue-400";
      case "data": return "text-yellow-400";
      default: return "text-gray-300";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">EcoSarthi</h2>
        <div className="text-sm text-gray-300">आवाज़ शिकायत प्रणाली</div>
      </div>

      {/* Call Status */}
      <div className="text-center mb-8">
        {callState === "idle" && (
          <div>
            <div className="w-24 h-24 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <Phone size={32} />
            </div>
            <div className="text-lg">कॉल करने के लिए तैयार</div>
            <div className="text-sm text-gray-400">वॉइस शिकायत शुरू करने के लिए टैप करें</div>
          </div>
        )}

        {callState === "calling" && (
          <div>
            <div className="w-24 h-24 mx-auto mb-4 bg-yellow-600 rounded-full flex items-center justify-center animate-pulse">
              <PhoneCall size={32} />
            </div>
            <div className="text-lg">Connecting...</div>
            <div className="text-sm text-gray-400">Please wait</div>
          </div>
        )}

        {callState === "connected" && (
          <div>
            <div className="w-24 h-24 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center relative">
              <PhoneCall size={32} />
              {(isListening || isSpeaking) && (
                <div className="absolute -inset-2 border-4 border-green-400 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="text-lg">Connected</div>
            <div className="text-sm text-gray-400">Duration: {formatTime(callDuration)}</div>
            <div className="text-xs text-blue-400 mt-1">{currentStep}</div>
          </div>
        )}

        {callState === "ended" && (
          <div>
            <div className="w-24 h-24 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <Phone size={32} />
            </div>
            <div className="text-lg">Call Ended</div>
            <div className="text-sm text-gray-400">
              {complaintId ? `Complaint ID: ${complaintId}` : "Call completed"}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      {callState === "connected" && (
        <div className="flex justify-center space-x-8 mb-6">
          <div className={`flex items-center space-x-2 ${isSpeaking ? 'text-blue-400' : 'text-gray-500'}`}>
            {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-sm">Bot</span>
          </div>
          <div className={`flex items-center space-x-2 ${isListening ? 'text-green-400' : 'text-gray-500'}`}>
            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            <span className="text-sm">You</span>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        {callState === "idle" && (
          <button
            onClick={startCall}
            disabled={loading}
            className="w-16 h-16 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
          >
            <Phone size={24} />
          </button>
        )}

        {(callState === "connected" || callState === "calling") && (
          <button
            onClick={endCall}
            className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          >
            <Phone size={24} className="transform rotate-45" />
          </button>
        )}
      </div>

      {/* Real-time Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
          <div className="text-sm text-gray-400 mb-2">Live Process Log:</div>
          {logs.map((log, index) => (
            <div key={index} className="mb-2 text-sm">
              <div className={`${getLogColor(log.type)} break-words`}>
                <span className="mr-2">{getLogIcon(log.type)}</span>
                {log.message}
                <div className="text-xs opacity-50 ml-6">{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="p-4 bg-green-900 border border-green-600 rounded-lg text-center">
          <div className="text-green-400 font-semibold">✅ Complaint Registered!</div>
          <div className="text-sm text-green-300 mt-1">ID: {complaintId}</div>
          <div className="text-xs text-green-200 mt-2">
            Your complaint has been sent to the admin dashboard
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center text-blue-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <div className="text-sm">Processing...</div>
        </div>
      )}
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";

// export default function VoiceComplaint() {
//   // 1. State mirrors ComplaintForm
//   const [formData, setFormData] = useState({
//     name: "",
//     complaint: "",
//     location: "",
//     urgency: "normal",
//   });

//   const [complaintId, setComplaintId] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // helper to append to console‑style logs
//   const appendLog = (line) => setLogs((prev) => [...prev, line]);

//   const handleVoiceComplaint = async () => {
//     setLoading(true);
//     setLogs(["🎙️ Starting voice complaint..."]);
//     setSubmitted(false);
//     setComplaintId(null);

//     try {
//       // 2. Trigger your backend voice route
//       const voiceRes = await axios.get("http://localhost:5000/api/voice-complaint");
//       if (voiceRes.data.status !== "success") {
//         appendLog("Thank You!");
//         return;
//       }

//       // 3. Pull out structured data
//       const data = voiceRes.data.data;
//       appendLog("✅ Voice data received:");
//       appendLog(JSON.stringify(data, null, 2));


//       // // 4. Map it into the exact same formData shape
//       // const mapped = {
//       //   name: data["शिकायतकर्ता का नाम"] || "",
//       //   location: data["स्थान"] || "",
//       //   department: data["विभाग"] || "",
//       //   description: data["शिकायत"] || "",
//       //   urgency: "normal",
//       // };

//       const aiData = voiceRes.data.data;

//       const payload = {
//         name: aiData["शिकायतकर्ता का नाम"] || "",
//         location: aiData["स्थान"] || "",
//         department: aiData["विभाग"] || "",
//         description: aiData["शिकायत"] || "",
//       };

//       await axios.post("http://localhost:5000/api/complaint", payload);


//       setFormData(mapped);

//       // 5. POST to the same endpoint as ComplaintForm
//       const res = await axios.post("http://localhost:5000/api/complaint", mapped);
//       setComplaintId(res.data.complaintId);
//       setSubmitted(true);
//       appendLog(`📬 Complaint submitted. ID: ${res.data.complaintId}`);
//     } catch (err) {
//       appendLog("❌ Submission error: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-semibold mb-4">Voice Complaint</h2>

//       {/* Start button */}
//       <button
//         onClick={handleVoiceComplaint}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Processing..." : "Start Voice Complaint"}
//       </button>

//       {/* Console logs */}
//       <div className="mt-4 bg-gray-900 text-green-200 p-4 rounded font-mono h-48 overflow-y-scroll">
//         {logs.length === 0 ? <div>Logs will appear here...</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
//       </div>

//       {/* Confirmation */}
//       {submitted && (
//         <div className="mt-6 text-green-700 font-semibold">
//           Complaint submitted successfully!<br />
//           Your Complaint ID: <span className="font-bold">{complaintId}</span>
//         </div>
//       )}
//     </div>
//   );
// }



// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { 
//   Phone, 
//   PhoneOff, 
//   Mic, 
//   MicOff, 
//   Volume2, 
//   VolumeX, 
//   User, 
//   Bot, 
//   CheckCircle, 
//   AlertCircle, 
//   Clock,
//   Signal,
//   PhoneCall
// } from "lucide-react";

// export default function VoiceComplaint() {
//   const [conversation, setConversation] = useState([]);
//   const [isListening, setIsListening] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [callActive, setCallActive] = useState(false);
//   const [callConnecting, setCallConnecting] = useState(false);
//   const [complaintId, setComplaintId] = useState(null);
//   const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active, completed, error
//   const [audioEnabled, setAudioEnabled] = useState(true);
//   const [currentStep, setCurrentStep] = useState('');
//   const [sessionId, setSessionId] = useState(null);
//   const [connectionError, setConnectionError] = useState(null);
//   const [callDuration, setCallDuration] = useState(0);
  
//   const conversationRef = useRef(null);
//   const eventSourceRef = useRef(null);
//   const callStartTimeRef = useRef(null);
//   const callTimerRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);
//   const maxReconnectAttempts = 3;
//   const reconnectAttempts = useRef(0);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (conversationRef.current) {
//       conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
//     }
//   }, [conversation]);

//   // Call duration timer
//   useEffect(() => {
//     if (callActive && callStartTimeRef.current) {
//       callTimerRef.current = setInterval(() => {
//         const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
//         setCallDuration(elapsed);
//       }, 1000);
//     } else {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//         callTimerRef.current = null;
//       }
//     }

//     return () => {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
//     };
//   }, [callActive]);

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       endCall();
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, []);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const addMessage = useCallback((sender, message, type = 'text', metadata = {}) => {
//     const newMessage = {
//       id: Date.now() + Math.random(),
//       sender, // 'bot' or 'user'
//       message,
//       type, // 'text', 'status', 'json', 'error', 'system'
//       timestamp: new Date(),
//       metadata
//     };
//     setConversation(prev => [...prev, newMessage]);
//   }, []);

//   const startCall = async () => {
//     try {
//       setCallConnecting(true);
//       setCallStatus('connecting');
//       setConversation([]);
//       setConnectionError(null);
//       reconnectAttempts.current = 0;
      
//       addMessage('system', 'कॉल कनेक्ट हो रही है...', 'status');
      
//       // Start voice session
//       const response = await fetch('http://localhost:5000/api/start-voice-session', { 
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (!data.success) {
//         throw new Error(data.error || 'Failed to start session');
//       }

//       setSessionId(data.session_id);
      
//       // Wait a moment for session to initialize
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Start SSE connection
//       await setupSSEConnection();
      
//     } catch (error) {
//       console.error('Error starting call:', error);
//       setConnectionError(error.message);
//       addMessage('system', `कॉल कनेक्ट करने में समस्या: ${error.message}`, 'error');
//       setCallConnecting(false);
//       setCallStatus('error');
//     }
//   };

//   const setupSSEConnection = async () => {
//     try {
//       // Close existing connection
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }

//       eventSourceRef.current = new EventSource('http://localhost:5000/api/voice-complaint-stream', {
//         withCredentials: true
//       });
      
//       eventSourceRef.current.onopen = () => {
//         console.log('SSE connection opened');
//         setCallConnecting(false);
//         setCallActive(true);
//         setCallStatus('active');
//         callStartTimeRef.current = Date.now();
//         setCallDuration(0);
//         addMessage('system', 'कॉल कनेक्ट हो गई', 'status');
//         reconnectAttempts.current = 0;
//       };

//       eventSourceRef.current.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           handleRealtimeUpdate(data);
//         } catch (error) {
//           console.error('Error parsing SSE data:', error);
//         }
//       };

//       eventSourceRef.current.onerror = (error) => {
//         console.error('SSE Error:', error);
        
//         if (reconnectAttempts.current < maxReconnectAttempts) {
//           addMessage('system', 'कनेक्शन में समस्या, पुनः कनेक्ट कर रहे हैं...', 'status');
//           reconnectAttempts.current += 1;
          
//           reconnectTimeoutRef.current = setTimeout(() => {
//             if (callActive) {
//               setupSSEConnection();
//             }
//           }, 2000 * reconnectAttempts.current); // Exponential backoff
//         } else {
//           addMessage('system', 'कनेक्शन में लगातार समस्या हो रही है। कृपया दोबारा कॉल करें।', 'error');
//           endCall();
//         }
//       };

//     } catch (error) {
//       console.error('Error setting up SSE:', error);
//       setConnectionError(error.message);
//       endCall();
//     }
//   };

//   const handleRealtimeUpdate = useCallback((data) => {
//     if (!data || !data.type) return;

//     console.log('Received update:', data.type, data);

//     switch (data.type) {
//       case 'connected':
//         addMessage('system', 'कॉल सफलतापूर्वक कनेक्ट हुई', 'status');
//         break;

//       case 'bot_question':
//       case 'bot_speaking':
//         setIsSpeaking(true);
//         setCurrentStep(data.step || 'बोट बोल रहा है');
//         addMessage('bot', data.message, 'text', { step: data.step });
//         // Simulate speaking duration based on message length
//         const speakingDuration = Math.max(2000, data.message.length * 100);
//         setTimeout(() => setIsSpeaking(false), speakingDuration);
//         break;
        
//       case 'listening_start':
//         setIsListening(true);
//         setIsSpeaking(false);
//         setIsProcessing(false);
//         setCurrentStep('आपकी आवाज़ सुन रहे हैं...');
//         addMessage('system', 'अब बोलें...', 'status');
//         break;
        
//       case 'listening_end':
//         setIsListening(false);
//         setCurrentStep('आपकी बात समझ रहे हैं...');
//         break;
        
//       case 'user_response':
//         setIsProcessing(false);
//         addMessage('user', data.message, 'text');
//         setCurrentStep('');
//         break;
        
//       case 'processing':
//         setIsProcessing(true);
//         setCurrentStep(data.message || 'प्रोसेसिंग...');
//         break;
        
//       case 'complaint_structured':
//         setCallStatus('processing');
//         addMessage('bot', 'आपकी शिकायत का विवरण तैयार हो गया:', 'status');
//         if (data.data) {
//           addMessage('bot', JSON.stringify(data.data, null, 2), 'json', { complaintData: data.data });
//         }
//         break;
        
//       case 'complaint_submitted':
//         setCallStatus('completed');
//         setComplaintId(data.complaintId);
//         addMessage('bot', `आपकी शिकायत सफलतापूर्वक दर्ज हो गई है!`, 'status');
//         addMessage('bot', `शिकायत नंबर: ${data.complaintId}`, 'text', { complaintId: data.complaintId });
//         setCurrentStep('शिकायत दर्ज हो गई');
//         // Auto end call after 5 seconds
//         setTimeout(() => endCall(), 5000);
//         break;
        
//       case 'summary':
//         addMessage('bot', data.message, 'status');
//         break;
        
//       case 'final_message':
//         addMessage('bot', data.message, 'status');
//         break;
        
//       case 'error':
//         addMessage('bot', data.message, 'error');
//         setCallStatus('error');
//         break;

//       case 'retry':
//         addMessage('system', data.message, 'status');
//         break;

//       case 'validation_error':
//         addMessage('bot', data.message, 'error');
//         break;

//       case 'session_ended':
//         addMessage('system', 'कॉल समाप्त हो गई', 'status');
//         endCall();
//         break;

//       case 'heartbeat':
//         // Keep connection alive, don't show to user
//         break;
        
//       default:
//         console.log('Unknown message type:', data.type, data);
//     }
//   }, [addMessage]);

//   const endCall = async () => {
//     try {
//       // Stop backend session
//       if (sessionId) {
//         await fetch('http://localhost:5000/api/stop-voice-session', { 
//           method: 'POST',
//           credentials: 'include'
//         });
//       }
//     } catch (error) {
//       console.error('Error stopping session:', error);
//     }

//     // Cleanup local state
//     if (eventSourceRef.current) {
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }

//     if (callTimerRef.current) {
//       clearInterval(callTimerRef.current);
//       callTimerRef.current = null;
//     }

//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }

//     setCallActive(false);
//     setCallConnecting(false);
//     setIsListening(false);
//     setIsProcessing(false);
//     setIsSpeaking(false);
//     setCurrentStep('');
//     setSessionId(null);
//     callStartTimeRef.current = null;
//     setCallDuration(0);
    
//     if (callStatus !== 'completed') {
//       setCallStatus('idle');
//       addMessage('system', 'कॉल समाप्त हो गई', 'status');
//     }
//   };

//   const formatMessage = (msg) => {
//     if (msg.type === 'json') {
//       try {
//         const data = JSON.parse(msg.message);
//         return (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
//             <h4 className="font-semibold text-blue-800 mb-2">शिकायत का विवरण:</h4>
//             <div className="space-y-1 text-sm">
//               {data["शिकायतकर्ता का नाम"] && (
//                 <p><span className="font-medium">नाम:</span> {data["शिकायतकर्ता का नाम"]}</p>
//               )}
//               {data["स्थान"] && (
//                 <p><span className="font-medium">स्थान:</span> {data["स्थान"]}</p>
//               )}
//               {data["विभाग"] && (
//                 <p><span className="font-medium">विभाग:</span> {data["विभाग"]}</p>
//               )}
//               {data["शिकायत"] && (
//                 <p><span className="font-medium">शिकायत:</span> {data["शिकायत"]}</p>
//               )}
//               {data["मोबाइल नंबर"] && (
//                 <p><span className="font-medium">मोबाइल:</span> {data["मोबाइल नंबर"]}</p>
//               )}
//             </div>
//           </div>
//         );
//       } catch (e) {
//         return <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{msg.message}</pre>;
//       }
//     }
//     return msg.message;
//   };

//   const getMessageIcon = (msg) => {
//     if (msg.sender === 'bot') {
//       if (msg.type === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
//       if (msg.type === 'status') return <CheckCircle className="w-4 h-4 text-green-500" />;
//       return <Bot className="w-4 h-4 text-blue-500" />;
//     }
//     if (msg.sender === 'system') {
//       return <Signal className="w-4 h-4 text-gray-500" />;
//     }
//     return <User className="w-4 h-4 text-purple-500" />;
//   };

//   const getCallStatusColor = () => {
//     switch (callStatus) {
//       case 'connecting': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
//       case 'active': return 'text-green-600 bg-green-100 border-green-200';
//       case 'processing': return 'text-blue-600 bg-blue-100 border-blue-200';
//       case 'completed': return 'text-green-600 bg-green-100 border-green-200';
//       case 'error': return 'text-red-600 bg-red-100 border-red-200';
//       default: return 'text-gray-600 bg-gray-100 border-gray-200';
//     }
//   };

//   const getCallStatusText = () => {
//     switch (callStatus) {
//       case 'connecting': return 'कनेक्ट हो रही है...';
//       case 'active': return 'कॉल सक्रिय';
//       case 'processing': return 'शिकायत प्रोसेस हो रही है';
//       case 'completed': return 'शिकायत पूर्ण';
//       case 'error': return 'कनेक्शन में समस्या';
//       default: return 'तैयार';
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <div className="flex items-center justify-center mb-4">
//           <PhoneCall className="w-8 h-8 text-blue-600 mr-3" />
//           <h2 className="text-3xl font-bold text-gray-900">जनता वॉइस कॉल</h2>
//         </div>
//         <p className="text-gray-600">हिंदी में अपनी शिकायत के लिए कॉल करें</p>
//       </div>

//       {/* Call Status Bar */}
//       <div className={`flex items-center justify-between p-4 rounded-lg mb-6 border ${getCallStatusColor()}`}>
//         <div className="flex items-center space-x-3">
//           <div className="flex items-center space-x-2">
//             {callConnecting && <Clock className="w-5 h-5 animate-spin" />}
//             {callActive && !isListening && !isSpeaking && !isProcessing && (
//               <Signal className="w-5 h-5 animate-pulse" />
//             )}
//             {isListening && <Mic className="w-5 h-5 animate-pulse text-green-600" />}
//             {isSpeaking && <Volume2 className="w-5 h-5 animate-pulse text-blue-600" />}
//             {isProcessing && <Clock className="w-5 h-5 animate-spin text-yellow-600" />}
//             <span className="font-medium">
//               {currentStep || getCallStatusText()}
//             </span>
//           </div>
//         </div>
//         <div className="text-sm font-mono">
//           {callActive && `${formatTime(callDuration)}`}
//         </div>
//       </div>

//       {/* Call Control */}
//       <div className="flex justify-center mb-6">
//         {!callActive && !callConnecting ? (
//           <button
//             onClick={startCall}
//             disabled={callConnecting}
//             className="flex items-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-colors font-medium text-lg shadow-lg transform hover:scale-105"
//           >
//             <Phone className="w-6 h-6" />
//             <span>कॉल शुरू करें</span>
//           </button>
//         ) : (
//           <button
//             onClick={endCall}
//             className="flex items-center space-x-3 bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-medium text-lg shadow-lg transform hover:scale-105"
//           >
//             <PhoneOff className="w-6 h-6" />
//             <span>कॉल समाप्त करें</span>
//           </button>
//         )}
//       </div>

//       {/* Connection Error */}
//       {connectionError && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
//           <div className="flex items-center space-x-2">
//             <AlertCircle className="w-5 h-5" />
//             <span>कनेक्शन एरर: {connectionError}</span>
//           </div>
//         </div>
//       )}

//       {/* Call Log */}
//       <div 
//         ref={conversationRef}
//         className="bg-gray-900 text-white rounded-lg p-4 h-96 overflow-y-auto border border-gray-700"
//         style={{
//           background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
//           fontFamily: 'monospace'
//         }}
//       >
//         {conversation.length === 0 ? (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             <div className="text-center">
//               <PhoneCall className="w-12 h-12 mx-auto mb-3 text-gray-500" />
//               <p>कॉल लॉग यहाँ दिखाई जाएगा...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {conversation.map((msg) => (
//               <div
//                 key={msg.id}
//                 className="flex items-start space-x-3"
//               >
//                 <div className="flex-shrink-0 text-xs text-gray-400 w-16">
//                   {msg.timestamp.toLocaleTimeString('hi-IN', { 
//                     hour12: false,
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     second: '2-digit'
//                   })}
//                 </div>
//                 <div className={`flex-shrink-0 p-1 rounded-full ${
//                   msg.sender === 'user' ? 'bg-purple-600' : 
//                   msg.sender === 'system' ? 'bg-gray-600' :
//                   msg.type === 'error' ? 'bg-red-600' :
//                   msg.type === 'status' ? 'bg-green-600' : 'bg-blue-600'
//                 }`}>
//                   {getMessageIcon(msg)}
//                 </div>
//                 <div className="flex-1">
//                   <div className={`text-sm ${
//                     msg.sender === 'user' 
//                       ? 'text-purple-300' 
//                       : msg.sender === 'system'
//                       ? 'text-gray-300'
//                       : msg.type === 'error'
//                       ? 'text-red-300'
//                       : msg.type === 'status'
//                       ? 'text-green-300'
//                       : 'text-blue-300'
//                   }`}>
//                     <span className="font-medium">
//                       {msg.sender === 'user' ? 'आप' : 
//                        msg.sender === 'system' ? 'सिस्टम' : 'बॉट'}:
//                     </span>
//                   </div>
//                   <div className="text-white text-sm mt-1 break-words">
//                     {formatMessage(msg)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Current Activity Indicator */}
//       {callActive && (
//         <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
//           {isListening && (
//             <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full border border-green-200">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <Mic className="w-4 h-4 text-green-600" />
//               <span className="text-green-700 font-medium">सुन रहे हैं...</span>
//             </div>
//           )}
//           {isSpeaking && (
//             <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//               <Volume2 className="w-4 h-4 text-blue-600" />
//               <span className="text-blue-700 font-medium">बॉट बोल रहा है...</span>
//             </div>
//           )}
//           {isProcessing && (
//             <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
//               <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
//               <Clock className="w-4 h-4 text-yellow-600" />
//               <span className="text-yellow-700 font-medium">प्रोसेसिंग...</span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Final Result */}
//       {complaintId && (
//         <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-green-800 flex items-center space-x-2">
//                 <CheckCircle className="w-5 h-5" />
//                 <span>शिकायत सफलतापूर्वक दर्ज!</span>
//               </h3>
//               <p className="text-green-700 mt-1">
//                 आपका शिकायत नंबर: <span className="font-mono font-bold text-lg">{complaintId}</span>
//               </p>
//               <p className="text-green-600 text-sm mt-1">
//                 कृपया इस नंबर को अपने पास सुरक्षित रखें
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Audio Controls */}
//       <div className="mt-4 flex justify-center">
//         <button
//           onClick={() => setAudioEnabled(!audioEnabled)}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm ${
//             audioEnabled 
//               ? 'bg-green-100 text-green-700 hover:bg-green-200' 
//               : 'bg-red-100 text-red-700 hover:bg-red-200'
//           } transition-colors`}
//         >
//           {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
//           <span>{audioEnabled ? 'आवाज़ चालू' : 'आवाज़ बंद'}</span>
//         </button>
//       </div>
//     </div>
//   );
// }