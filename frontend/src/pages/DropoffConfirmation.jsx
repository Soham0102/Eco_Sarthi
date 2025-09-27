import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DropoffConfirmation() {
  const navigate = useNavigate();
  const [dropoffs, setDropoffs] = useState([]);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [facilityType, setFacilityType] = useState("");
  const [wasteWeight, setWasteWeight] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [facilityStaff, setFacilityStaff] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      navigate("/worker-login");
      return;
    }

    // Mock dropoff tasks - replace with API call
    const mockDropoffs = [
      {
        id: 1,
        facilityName: "Gurgaon Waste Processing Facility",
        facilityAddress: "Sector 25, Gurgaon",
        scheduledTime: "02:00 PM",
        status: "pending",
        priority: "high",
        wasteTypes: ["Organic", "Recyclable", "Mixed"],
        estimatedWeight: "150 kg",
        vehicleNumber: "HR-26-AB-1234",
        route: "Sector 15-18 Collection Route"
      },
      {
        id: 2,
        facilityName: "Recycling Center - Sector 20",
        facilityAddress: "Sector 20, Gurgaon",
        scheduledTime: "04:30 PM",
        status: "pending",
        priority: "medium",
        wasteTypes: ["Recyclable"],
        estimatedWeight: "75 kg",
        vehicleNumber: "HR-26-AB-1234",
        route: "Commercial Area Route"
      },
      {
        id: 3,
        facilityName: "Composting Facility",
        facilityAddress: "Sector 30, Gurgaon",
        scheduledTime: "06:00 PM",
        status: "completed",
        priority: "low",
        wasteTypes: ["Organic"],
        estimatedWeight: "200 kg",
        vehicleNumber: "HR-26-AB-1234",
        route: "Residential Area Route"
      }
    ];

    setDropoffs(mockDropoffs);
  }, [navigate]);

  const handleStartDropoff = (dropoffId) => {
    const dropoff = dropoffs.find(d => d.id === dropoffId);
    setSelectedDropoff(dropoff);
    setShowModal(true);
    setFacilityType("");
    setWasteWeight("");
    setWasteType("");
    setFacilityStaff("");
    setNotes("");
    setPhoto(null);
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files[0]) {
      setPhoto({
        file: e.target.files[0],
        preview: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSubmitDropoff = () => {
    if (!facilityType || !wasteWeight || !wasteType || !facilityStaff) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedDropoffs = dropoffs.map(dropoff =>
      dropoff.id === selectedDropoff.id
        ? {
            ...dropoff,
            status: "completed",
            facilityType,
            actualWeight: wasteWeight,
            actualWasteType: wasteType,
            facilityStaff,
            notes,
            photo: photo ? photo.preview : null,
            completedAt: new Date().toISOString()
          }
        : dropoff
    );

    setDropoffs(updatedDropoffs);
    setShowModal(false);
    setSelectedDropoff(null);
    setFacilityType("");
    setWasteWeight("");
    setWasteType("");
    setFacilityStaff("");
    setNotes("");
    setPhoto(null);
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
              <h1 className="text-2xl font-bold text-gray-900">Drop-off Confirmation</h1>
              <p className="text-gray-600">Confirm waste delivered to facility</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{dropoffs.filter(d => d.status === "completed").length}</span> completed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Drop-off Guidelines</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Verify facility type and waste acceptance criteria</li>
            <li>• Weigh the waste and record accurate measurements</li>
            <li>• Get confirmation from facility staff</li>
            <li>• Take photo evidence of successful delivery</li>
            <li>• Note any issues or special handling requirements</li>
          </ul>
        </div>

        {/* Dropoffs List */}
        <div className="space-y-4">
          {dropoffs.map((dropoff) => (
            <div key={dropoff.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Drop-off #{dropoff.id}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dropoff.status)}`}>
                      {dropoff.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(dropoff.priority)}`}>
                      {dropoff.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Facility Name</p>
                      <p className="font-medium text-gray-900">{dropoff.facilityName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Time</p>
                      <p className="font-medium text-gray-900">{dropoff.scheduledTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Facility Address</p>
                      <p className="font-medium text-gray-900">{dropoff.facilityAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Number</p>
                      <p className="font-medium text-gray-900">{dropoff.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Waste Types</p>
                      <p className="font-medium text-gray-900">{dropoff.wasteTypes.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Weight</p>
                      <p className="font-medium text-gray-900">{dropoff.estimatedWeight}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-medium text-gray-900">{dropoff.route}</p>
                    </div>
                  </div>

                  {dropoff.status === "completed" && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Delivery Confirmation</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <p className="text-sm"><span className="font-medium">Facility Type:</span> {dropoff.facilityType}</p>
                        <p className="text-sm"><span className="font-medium">Actual Weight:</span> {dropoff.actualWeight}</p>
                        <p className="text-sm"><span className="font-medium">Waste Type:</span> {dropoff.actualWasteType}</p>
                        <p className="text-sm"><span className="font-medium">Staff:</span> {dropoff.facilityStaff}</p>
                      </div>
                      {dropoff.notes && (
                        <p className="text-sm text-gray-700 mt-2">Notes: {dropoff.notes}</p>
                      )}
                    </div>
                  )}
                </div>

                {dropoff.status === "pending" && (
                  <div className="ml-4">
                    <button
                      onClick={() => handleStartDropoff(dropoff.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Confirm Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {dropoffs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No drop-off tasks assigned</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for assigned deliveries.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedDropoff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Delivery - Drop-off #{selectedDropoff.id}
              </h3>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Facility: {selectedDropoff.facilityName}</p>
                <p className="text-sm text-gray-600 mb-1">Address: {selectedDropoff.facilityAddress}</p>
                <p className="text-sm text-gray-600">Expected Waste: {selectedDropoff.wasteTypes.join(", ")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Type *
                  </label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select facility type</option>
                    <option value="waste_processing">Waste Processing Facility</option>
                    <option value="recycling_center">Recycling Center</option>
                    <option value="composting_facility">Composting Facility</option>
                    <option value="landfill">Landfill</option>
                    <option value="transfer_station">Transfer Station</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={wasteWeight}
                    onChange={(e) => setWasteWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter weight in kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waste Type Delivered *
                  </label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select waste type</option>
                    <option value="organic">Organic Waste</option>
                    <option value="recyclable">Recyclable Waste</option>
                    <option value="mixed">Mixed Waste</option>
                    <option value="hazardous">Hazardous Waste</option>
                    <option value="construction">Construction Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Staff Name *
                  </label>
                  <input
                    type="text"
                    value={facilityStaff}
                    onChange={(e) => setFacilityStaff(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter staff name"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {photo && (
                  <div className="mt-2">
                    <img
                      src={photo.preview}
                      alt="Delivery photo"
                      className="w-full h-32 object-cover rounded border"
                    />
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
                  placeholder="Add any notes about the delivery..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDropoff(null);
                    setFacilityType("");
                    setWasteWeight("");
                    setWasteType("");
                    setFacilityStaff("");
                    setNotes("");
                    setPhoto(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDropoff}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                  Confirm Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
