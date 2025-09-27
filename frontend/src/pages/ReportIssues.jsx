import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportIssues() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [photos, setPhotos] = useState([]);
  const [gpsLocation, setGpsLocation] = useState(null);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      navigate("/worker-login");
      return;
    }

    // Mock reported issues - replace with API call
    const mockReports = [
      {
        id: 1,
        type: "Overflowing Bin",
        location: "Sector 15, Gurgaon - Near Metro Station",
        description: "Waste bin is overflowing and creating health hazard",
        priority: "high",
        status: "reported",
        reportedAt: "2024-01-15 10:30 AM",
        photos: ["/images/overflow1.jpg"],
        gpsLocation: { lat: 28.4595, lng: 77.0266 }
      },
      {
        id: 2,
        type: "Roadblock",
        location: "Sector 16, Gurgaon - Main Road",
        description: "Construction debris blocking waste collection route",
        priority: "medium",
        status: "in_progress",
        reportedAt: "2024-01-15 09:15 AM",
        photos: ["/images/roadblock1.jpg"],
        gpsLocation: { lat: 28.4605, lng: 77.0276 }
      },
      {
        id: 3,
        type: "Damaged Bin",
        location: "Sector 17, Gurgaon - Residential Area",
        description: "Waste bin lid is broken and needs replacement",
        priority: "low",
        status: "resolved",
        reportedAt: "2024-01-14 02:45 PM",
        photos: ["/images/damaged1.jpg"],
        gpsLocation: { lat: 28.4615, lng: 77.0286 }
      }
    ];

    setReports(mockReports);
  }, [navigate]);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get current location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmitReport = () => {
    if (!issueType || !location || !description || !priority) {
      alert("Please fill in all required fields");
      return;
    }

    if (photos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    const newReport = {
      id: reports.length + 1,
      type: issueType,
      location,
      description,
      priority,
      status: "reported",
      reportedAt: new Date().toLocaleString(),
      photos: photos.map(p => p.preview),
      gpsLocation
    };

    setReports(prev => [newReport, ...prev]);
    setShowReportModal(false);
    setIssueType("");
    setLocation("");
    setDescription("");
    setPriority("");
    setPhotos([]);
    setGpsLocation(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reported": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
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
              <h1 className="text-2xl font-bold text-gray-900">Report Issues</h1>
              <p className="text-gray-600">Report overflowing bins and roadblocks</p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              + Report New Issue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Overflowing Bins</h3>
                <p className="text-sm text-gray-600">Report bins that are full</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Roadblocks</h3>
                <p className="text-sm text-gray-600">Report route obstructions</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Other Issues</h3>
                <p className="text-sm text-gray-600">Report other problems</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Issue #{report.id}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Issue Type</p>
                      <p className="font-medium text-gray-900">{report.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reported At</p>
                      <p className="font-medium text-gray-900">{report.reportedAt}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{report.location}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium text-gray-900">{report.description}</p>
                    </div>
                  </div>

                  {report.photos && report.photos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Photos</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {report.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Issue photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {report.gpsLocation && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">GPS Location</p>
                      <p className="text-sm text-gray-900">
                        Lat: {report.gpsLocation.lat.toFixed(6)}, Lng: {report.gpsLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No issues reported yet</h3>
            <p className="mt-1 text-sm text-gray-500">Report any issues you encounter during your work.</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Report New Issue
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type *
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select issue type</option>
                    <option value="Overflowing Bin">Overflowing Bin</option>
                    <option value="Roadblock">Roadblock</option>
                    <option value="Damaged Bin">Damaged Bin</option>
                    <option value="Missing Bin">Missing Bin</option>
                    <option value="Hazardous Waste">Hazardous Waste</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter exact location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select priority</option>
                    <option value="high">High - Immediate attention required</option>
                    <option value="medium">Medium - Address within 24 hours</option>
                    <option value="low">Low - Address when possible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos * (At least one required)
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPS Location
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={getCurrentLocation}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Get Current Location
                    </button>
                    {gpsLocation && (
                      <span className="text-sm text-gray-600 self-center">
                        Lat: {gpsLocation.lat.toFixed(6)}, Lng: {gpsLocation.lng.toFixed(6)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setIssueType("");
                    setLocation("");
                    setDescription("");
                    setPriority("");
                    setPhotos([]);
                    setGpsLocation(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
