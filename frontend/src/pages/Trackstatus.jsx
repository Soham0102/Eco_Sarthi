import React, { useState } from "react";
import axios from "axios";

export default function TrackStatus() {
  const [complaintId, setComplaintId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!complaintId.trim()) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/complaint/${complaintId.trim()}`);

      if (res.data.success) {
        setResult(res.data);
        setError("");
      } else {
        setResult(null);
        setError("शिकायत नहीं मिली। कृपया सही Complaint ID दर्ज करें।");
      }
    } catch (err) {
      setResult(null);
      setError("सर्वर से कनेक्ट नहीं हो सका या शिकायत नहीं मिली।");
    }
  };

  return (
    <div className="m-2 p-10 flex justify-center items-start min-h-screen bg-gray-100">
      <div className="bg-white border border-blue-300 shadow-2xl rounded-2xl p-8 w-96 mt-20">
        
        {/* Gradient Header */}
        <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          शिकायत की स्थिति ट्रैक करें
        </h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Complaint ID दर्ज करें"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
        />

        {/* Orange Gradient Button */}
        <button
          onClick={handleTrack}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-2 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
        >
          ट्रैक करें
        </button>

        {/* Error */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* Result */}
        {result && (
          <div className="mt-6 border-t pt-4 text-sm space-y-2">
            <p><strong>स्थिति:</strong> {result.status}</p>
            <p><strong>शिकायतकर्ता:</strong> {result.name}</p>
            <p><strong>स्थान:</strong> {result.location}</p>
            <p><strong>विभाग:</strong> {result.department}</p>
            <p><strong>विवरण:</strong> {result.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
