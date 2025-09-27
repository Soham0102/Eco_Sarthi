import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SegregationCheck() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState([]);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [segregationStatus, setSegregationStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [violationType, setViolationType] = useState("");

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      navigate("/worker-login");
      return;
    }

    // Mock segregation checks - replace with API call
    const mockChecks = [
      {
        id: 1,
        location: "Sector 15, Gurgaon - Block A",
        scheduledTime: "12:00 PM",
        status: "pending",
        priority: "high",
        binType: "Mixed Waste Bin",
        expectedSegregation: "Organic, Recyclable, Non-recyclable",
        lastCheck: "2 days ago",
        violationHistory: 2
      },
      {
        id: 2,
        location: "Sector 16, Gurgaon - Block B",
        scheduledTime: "01:30 PM",
        status: "pending",
        priority: "medium",
        binType: "Organic Waste Bin",
        expectedSegregation: "Organic only",
        lastCheck: "1 day ago",
        violationHistory: 0
      },
      {
        id: 3,
        location: "Sector 17, Gurgaon - Block C",
        scheduledTime: "03:00 PM",
        status: "completed",
        priority: "low",
        binType: "Recyclable Waste Bin",
        expectedSegregation: "Recyclable only",
        lastCheck: "3 hours ago",
        violationHistory: 1
      }
    ];

    setChecks(mockChecks);
  }, [navigate]);

  const handleStartCheck = (checkId) => {
    const check = checks.find(c => c.id === checkId);
    setSelectedCheck(check);
    setShowModal(true);
    setSegregationStatus("");
    setNotes("");
    setPhotos([]);
    setViolationType("");
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      timestamp: new Date().toISOString()
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitCheck = () => {
    if (!segregationStatus) {
      alert("Please select segregation status");
      return;
    }

    if (segregationStatus === "mixed" && !violationType) {
      alert("Please select violation type for mixed waste");
      return;
    }

    const updatedChecks = checks.map(check =>
      check.id === selectedCheck.id
        ? {
            ...check,
            status: "completed",
            segregationStatus,
            violationType: segregationStatus === "mixed" ? violationType : null,
            notes,
            photos: photos.map(p => p.preview),
            completedAt: new Date().toISOString()
          }
        : check
    );

    setChecks(updatedChecks);
    setShowModal(false);
    setSelectedCheck(null);
    setSegregationStatus("");
    setNotes("");
    setPhotos([]);
    setViolationType("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getViolationColor = (violations) => {
    if (violations === 0) return "text-green-600";
    if (violations <= 2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <button
                onClick={() => navigate("/worker-dashboard")}
                className="text-blue-600 hover:text-blue-700 mb-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Segregation Check</h1>
              <p className="text-gray-600">Upload photos if waste is mixed</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{checks.filter(c => c.status === "completed").length}</span> completed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Segregation Check Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check if waste is properly segregated according to bin type</li>
            <li>• Take clear photos if mixed waste is found</li>
            <li>• Document any violations with detailed notes</li>
            <li>• Report recurring violations for follow-up action</li>
          </ul>
        </div>

        {/* Checks List */}
        <div className="space-y-4">
          {checks.map((check) => (
            <div key={check.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Check #{check.id}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                      {check.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(check.priority)}`}>
                      {check.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{check.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Time</p>
                      <p className="font-medium text-gray-900">{check.scheduledTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bin Type</p>
                      <p className="font-medium text-gray-900">{check.binType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Segregation</p>
                      <p className="font-medium text-gray-900">{check.expectedSegregation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Check</p>
                      <p className="font-medium text-gray-900">{check.lastCheck}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Violation History</p>
                      <p className={`font-medium ${getViolationColor(check.violationHistory)}`}>
                        {check.violationHistory} violations
                      </p>
                    </div>
                  </div>

                  {check.status === "completed" && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Check Result</p>
                      <p className="font-medium text-gray-900">
                        Status: {check.segregationStatus === "proper" ? "✅ Properly Segregated" : "❌ Mixed Waste Found"}
                      </p>
                      {check.violationType && (
                        <p className="text-sm text-red-600">Violation: {check.violationType}</p>
                      )}
                      {check.notes && (
                        <p className="text-sm text-gray-700 mt-1">Notes: {check.notes}</p>
                      )}
                    </div>
                  )}
                </div>

                {check.status === "pending" && (
                  <div className="ml-4">
                    <button
                      onClick={() => handleStartCheck(check.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Start Check
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {checks.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No segregation checks assigned</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for assigned tasks.</p>
          </div>
        )}
      </div>

      {/* Check Modal */}
      {showModal && selectedCheck && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Segregation Check #{selectedCheck.id}
              </h3>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Location: {selectedCheck.location}</p>
                <p className="text-sm text-gray-600 mb-1">Bin Type: {selectedCheck.binType}</p>
                <p className="text-sm text-gray-600">Expected: {selectedCheck.expectedSegregation}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segregation Status *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="segregationStatus"
                      value="proper"
                      checked={segregationStatus === "proper"}
                      onChange={(e) => setSegregationStatus(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-green-600">✅ Properly Segregated</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="segregationStatus"
                      value="mixed"
                      checked={segregationStatus === "mixed"}
                      onChange={(e) => setSegregationStatus(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-600">❌ Mixed Waste Found</span>
                  </label>
                </div>
              </div>

              {segregationStatus === "mixed" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Violation Type *
                  </label>
                  <select
                    value={violationType}
                    onChange={(e) => setViolationType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select violation type</option>
                    <option value="organic_in_recyclable">Organic waste in recyclable bin</option>
                    <option value="recyclable_in_organic">Recyclable waste in organic bin</option>
                    <option value="hazardous_mixed">Hazardous waste mixed with regular waste</option>
                    <option value="non_segregated">Completely non-segregated waste</option>
                    <option value="other">Other violation</option>
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Required for mixed waste)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any additional notes about the segregation check..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedCheck(null);
                    setSegregationStatus("");
                    setNotes("");
                    setPhotos([]);
                    setViolationType("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCheck}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Submit Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
