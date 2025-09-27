import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CollectionTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, completed
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      navigate("/worker-login");
      return;
    }

    // Mock collection tasks - replace with API call
    const mockTasks = [
      {
        id: 1,
        address: "123 Sector 15, Gurgaon",
        type: "Household Waste",
        scheduledTime: "09:00 AM",
        status: "pending",
        priority: "high",
        binType: "Mixed",
        estimatedWeight: "15 kg",
        specialInstructions: "Handle with care - glass items present"
      },
      {
        id: 2,
        address: "456 Sector 16, Gurgaon",
        type: "Commercial Waste",
        scheduledTime: "10:30 AM",
        status: "pending",
        priority: "medium",
        binType: "Organic",
        estimatedWeight: "25 kg",
        specialInstructions: "Large quantity expected"
      },
      {
        id: 3,
        address: "789 Sector 17, Gurgaon",
        type: "Household Waste",
        scheduledTime: "12:00 PM",
        status: "completed",
        priority: "low",
        binType: "Recyclable",
        estimatedWeight: "8 kg",
        specialInstructions: "None"
      },
      {
        id: 4,
        address: "321 Sector 18, Gurgaon",
        type: "Household Waste",
        scheduledTime: "01:30 PM",
        status: "pending",
        priority: "high",
        binType: "Mixed",
        estimatedWeight: "12 kg",
        specialInstructions: "Resident requested early pickup"
      }
    ];

    setTasks(mockTasks);
  }, [navigate]);

  const handleTaskAction = (taskId, action) => {
    if (action === "complete") {
      setSelectedTask(tasks.find(task => task.id === taskId));
      setShowModal(true);
    } else if (action === "skip") {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: "skipped" } : task
      );
      setTasks(updatedTasks);
    }
  };

  const handleCompleteTask = () => {
    if (selectedTask) {
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id 
          ? { ...task, status: "completed", notes, photo: photo ? URL.createObjectURL(photo) : null }
          : task
      );
      setTasks(updatedTasks);
      setShowModal(false);
      setNotes("");
      setPhoto(null);
      setSelectedTask(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "skipped": return "bg-red-100 text-red-800";
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
              <h1 className="text-2xl font-bold text-gray-900">Collection Tasks</h1>
              <p className="text-gray-600">Mark pickups as done or not done</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{tasks.filter(t => t.status === "completed").length}</span> completed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "all", label: "All Tasks", count: tasks.length },
                { key: "pending", label: "Pending", count: tasks.filter(t => t.status === "pending").length },
                { key: "completed", label: "Completed", count: tasks.filter(t => t.status === "completed").length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Task #{task.id}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{task.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Time</p>
                      <p className="font-medium text-gray-900">{task.scheduledTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Waste Type</p>
                      <p className="font-medium text-gray-900">{task.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bin Type</p>
                      <p className="font-medium text-gray-900">{task.binType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Weight</p>
                      <p className="font-medium text-gray-900">{task.estimatedWeight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Special Instructions</p>
                      <p className="font-medium text-gray-900">{task.specialInstructions}</p>
                    </div>
                  </div>
                </div>

                {task.status === "pending" && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleTaskAction(task.id, "complete")}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Mark Done
                    </button>
                    <button
                      onClick={() => handleTaskAction(task.id, "skip")}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all" ? "No tasks assigned yet." : `No ${filter} tasks found.`}
            </p>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Complete Task #{selectedTask.id}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Address: {selectedTask.address}</p>
                <p className="text-sm text-gray-600">Waste Type: {selectedTask.type}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any notes about the collection..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNotes("");
                    setPhoto(null);
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteTask}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                  Complete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
