import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCodeGenerator from "../components/QRCodeGenerator";

export default function EnhancedAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [workers, setWorkers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [qrScans, setQrScans] = useState([]);

  const [newTask, setNewTask] = useState({
    workerId: "",
    taskType: "",
    title: "",
    description: "",
    homeNumber: "",
    location: "",
    priority: "medium"
  });

  const [newWorker, setNewWorker] = useState({
    workerId: "",
    fullName: "",
    email: "",
    phone: "",
    role: "garbage_collector",
    area: "",
    password: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load workers
      const workersResponse = await axios.get("http://localhost:5000/api/admin/workers");
      setWorkers(workersResponse.data.workers || []);

      // Load citizens
      const citizensResponse = await axios.get("http://localhost:5000/api/admin/citizens");
      setCitizens(citizensResponse.data.citizens || []);

      // Load tasks
      const tasksResponse = await axios.get("http://localhost:5000/api/admin/tasks");
      setTasks(tasksResponse.data.tasks || []);

      // Load QR scans
      const qrResponse = await axios.get("http://localhost:5000/api/admin/qr-scans");
      setQrScans(qrResponse.data.scans || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/worker/assign-task", newTask);
      if (response.data.success) {
        alert("Task assigned successfully!");
        setNewTask({
          workerId: "",
          taskType: "",
          title: "",
          description: "",
          homeNumber: "",
          location: "",
          priority: "medium"
        });
        loadData();
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task. Please try again.");
    }
  };

  const registerWorker = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/worker/register", newWorker);
      if (response.data.success) {
        alert("Worker registered successfully!");
        setNewWorker({
          workerId: "",
          fullName: "",
          email: "",
          phone: "",
          role: "garbage_collector",
          area: "",
          password: ""
        });
        loadData();
      }
    } catch (error) {
      console.error("Error registering worker:", error);
      alert("Failed to register worker. Please try again.");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      garbage_collector: "green",
      dustbin_monitor: "blue",
      complaint_manager: "orange"
    };
    return colors[role] || "gray";
  };

  const getRoleIcon = (role) => {
    const icons = {
      garbage_collector: "🗑️",
      dustbin_monitor: "📊",
      complaint_manager: "📝"
    };
    return icons[role] || "👷";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-white/80">EcoSarthi Management System</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "workers", label: "Workers", icon: "👷" },
            { id: "citizens", label: "Citizens", icon: "👥" },
            { id: "tasks", label: "Task Assignment", icon: "📋" },
            { id: "qr-scans", label: "QR Scans", icon: "📱" },
            { id: "qr-generator", label: "QR Generator", icon: "🔲" },
            { id: "analytics", label: "Analytics", icon: "📈" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Workers</p>
                  <p className="text-3xl font-bold text-blue-600">{workers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👷</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Citizens</p>
                  <p className="text-3xl font-bold text-green-600">{citizens.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Tasks</p>
                  <p className="text-3xl font-bold text-orange-600">{tasks.filter(t => t.status === 'assigned').length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">QR Scans Today</p>
                  <p className="text-3xl font-bold text-purple-600">{qrScans.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.taskId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">Assigned to: {task.workerId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "workers" && (
          <div className="space-y-6">
            {/* Register New Worker */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Register New Worker</h3>
              <form onSubmit={registerWorker} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Worker ID"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.workerId}
                  onChange={(e) => setNewWorker({...newWorker, workerId: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.fullName}
                  onChange={(e) => setNewWorker({...newWorker, fullName: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.email}
                  onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({...newWorker, phone: e.target.value})}
                  required
                />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.role}
                  onChange={(e) => setNewWorker({...newWorker, role: e.target.value})}
                  required
                >
                  <option value="garbage_collector">Garbage Collector</option>
                  <option value="dustbin_monitor">Dustbin Monitor</option>
                  <option value="complaint_manager">Complaint Manager</option>
                </select>
                <input
                  type="text"
                  placeholder="Area"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.area}
                  onChange={(e) => setNewWorker({...newWorker, area: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newWorker.password}
                  onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                  required
                />
                <button
                  type="submit"
                  className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Register Worker
                </button>
              </form>
            </div>

            {/* Workers List */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">All Workers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Worker ID</th>
                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Role</th>
                      <th className="text-left py-3">Area</th>
                      <th className="text-left py-3">Golden Points</th>
                      <th className="text-left py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(worker => (
                      <tr key={worker.workerId} className="border-b">
                        <td className="py-3">{worker.workerId}</td>
                        <td className="py-3">{worker.fullName}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm bg-${getRoleColor(worker.role)}-100 text-${getRoleColor(worker.role)}-800`}>
                            {getRoleIcon(worker.role)} {worker.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3">{worker.area}</td>
                        <td className="py-3">{worker.goldenPoints}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            worker.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {worker.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "citizens" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">All Citizens</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Home Number</th>
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Area</th>
                    <th className="text-left py-3">Green Points</th>
                    <th className="text-left py-3">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.map(citizen => (
                    <tr key={citizen.citizenId} className="border-b">
                      <td className="py-3">{citizen.homeNumber}</td>
                      <td className="py-3">{citizen.fullName}</td>
                      <td className="py-3">{citizen.email}</td>
                      <td className="py-3">{citizen.area}</td>
                      <td className="py-3">
                        <span className="text-green-600 font-semibold">{citizen.greenPoints}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-orange-600 font-semibold">{citizen.streak} days</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-6">
            {/* Assign New Task */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Assign New Task</h3>
              <form onSubmit={assignTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.workerId}
                  onChange={(e) => setNewTask({...newTask, workerId: e.target.value})}
                  required
                >
                  <option value="">Select Worker</option>
                  {workers.map(worker => (
                    <option key={worker.workerId} value={worker.workerId}>
                      {worker.fullName} ({worker.role})
                    </option>
                  ))}
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({...newTask, taskType: e.target.value})}
                  required
                >
                  <option value="">Task Type</option>
                  <option value="daily_collection">Daily Collection</option>
                  <option value="emergency_pickup">Emergency Pickup</option>
                  <option value="recycling_collection">Recycling Collection</option>
                  <option value="dustbin_check">Dustbin Check</option>
                  <option value="complaint_resolution">Complaint Resolution</option>
                </select>
                <input
                  type="text"
                  placeholder="Task Title"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Home Number"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.homeNumber}
                  onChange={(e) => setNewTask({...newTask, homeNumber: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.location}
                  onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  type="submit"
                  className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Assign Task
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Task ID</th>
                      <th className="text-left py-3">Title</th>
                      <th className="text-left py-3">Worker</th>
                      <th className="text-left py-3">Type</th>
                      <th className="text-left py-3">Priority</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task.taskId} className="border-b">
                        <td className="py-3">{task.taskId}</td>
                        <td className="py-3">{task.title}</td>
                        <td className="py-3">{task.workerId}</td>
                        <td className="py-3">{task.taskType}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3">{new Date(task.assignedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "qr-scans" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">QR Scan Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Scan ID</th>
                    <th className="text-left py-3">Worker</th>
                    <th className="text-left py-3">Home Number</th>
                    <th className="text-left py-3">Scan Type</th>
                    <th className="text-left py-3">Points Earned</th>
                    <th className="text-left py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {qrScans.map(scan => (
                    <tr key={scan.scanId} className="border-b">
                      <td className="py-3">{scan.scanId}</td>
                      <td className="py-3">{scan.workerId}</td>
                      <td className="py-3">{scan.homeNumber}</td>
                      <td className="py-3">{scan.scanType}</td>
                      <td className="py-3">
                        <span className="text-yellow-600 font-semibold">+{scan.pointsEarned}</span>
                      </td>
                      <td className="py-3">{new Date(scan.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "qr-generator" && (
          <div className="space-y-6">
            <QRCodeGenerator />
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">QR Code Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Benefits of QR System:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Real-time house visit tracking</li>
                    <li>• Automatic worker verification</li>
                    <li>• Reduced manual paperwork</li>
                    <li>• Improved accountability</li>
                    <li>• Data-driven insights</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Implementation Steps:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. Generate QR codes for all houses</li>
                    <li>2. Print and install on house number plates</li>
                    <li>3. Train workers on QR scanning</li>
                    <li>4. Monitor scan data in admin dashboard</li>
                    <li>5. Reward workers for consistent scanning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Worker Performance</h3>
              <div className="space-y-4">
                {workers.slice(0, 5).map(worker => (
                  <div key={worker.workerId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{worker.fullName}</p>
                      <p className="text-sm text-gray-600">{worker.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-600 font-semibold">{worker.goldenPoints} pts</p>
                      <p className="text-sm text-gray-600">95% efficiency</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Citizen Engagement</h3>
              <div className="space-y-4">
                {citizens.slice(0, 5).map(citizen => (
                  <div key={citizen.citizenId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{citizen.fullName}</p>
                      <p className="text-sm text-gray-600">{citizen.homeNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">{citizen.greenPoints} pts</p>
                      <p className="text-sm text-gray-600">{citizen.streak} day streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
