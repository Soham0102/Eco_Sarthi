import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EnhancedWorkerDashboard() {
  const navigate = useNavigate();
  const [workerData, setWorkerData] = useState({
    workerId: localStorage.getItem("workerId") || "",
    name: localStorage.getItem("workerName") || "",
    role: localStorage.getItem("workerRole") || "",
    goldenPoints: parseInt(localStorage.getItem("goldenPoints")) || 0,
    area: localStorage.getItem("area") || ""
  });

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [qrScanData, setQrScanData] = useState("");

  const workerRoles = {
    garbage_collector: {
      title: "Garbage Collector",
      icon: "🗑️",
      color: "green"
    },
    dustbin_monitor: {
      title: "Dustbin Monitor",
      icon: "📊",
      color: "blue"
    },
    complaint_manager: {
      title: "Complaint Manager",
      icon: "📝",
      color: "orange"
    }
  };

  const currentRole = workerRoles[workerData.role] || workerRoles.garbage_collector;

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    try {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) return;

      // Load assigned tasks
      const tasksResponse = await axios.get(`http://localhost:5000/api/worker/tasks/${workerId}?status=assigned`);
      if (tasksResponse.data.success) {
        setAssignedTasks(tasksResponse.data.tasks);
      }

      // Load completed tasks
      const completedResponse = await axios.get(`http://localhost:5000/api/worker/tasks/${workerId}?status=completed`);
      if (completedResponse.data.success) {
        setCompletedTasks(completedResponse.data.tasks);
      }

    } catch (error) {
      console.error("Error loading worker data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isWorker");
    localStorage.removeItem("workerId");
    localStorage.removeItem("workerName");
    localStorage.removeItem("workerRole");
    localStorage.removeItem("goldenPoints");
    navigate("/worker-login");
  };

  const completeTask = async (taskId, proofFile = null, notes = "") => {
    try {
      const task = assignedTasks.find(t => (t.taskId || t.id) === taskId);
      if (!task) return;

      // Prefer proof endpoint with multipart
      if (proofFile || notes) {
        const form = new FormData();
        form.append("workerId", workerData.workerId);
        form.append("taskId", taskId);
        if (notes) form.append("notes", notes);
        if (proofFile) form.append("proof", proofFile);

        const resp = await axios.post("http://localhost:5000/api/worker/complete-task-proof", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (resp.data.success) {
          const pointsEarned = resp.data.pointsEarned || 10;
          setCompletedTasks(prev => [...prev, { ...task, status: "completed", completedAt: new Date().toISOString() }]);
          setAssignedTasks(prev => prev.filter(t => (t.taskId || t.id) !== taskId));
          setWorkerData(prev => ({ ...prev, goldenPoints: prev.goldenPoints + pointsEarned }));
          localStorage.setItem("goldenPoints", (workerData.goldenPoints + pointsEarned).toString());
          alert(`Task completed with proof! +${pointsEarned} pts`);
        }
        return;
      }

      // Fallback simple completion
      const response = await axios.post("http://localhost:5000/api/worker/complete-task", {
        workerId: workerData.workerId,
        taskId: taskId,
        taskType: task.type,
        homeNumber: task.homeNumber || task.location
      });

      if (response.data.success) {
        // Move task to completed
        setCompletedTasks(prev => [...prev, { ...task, status: "completed", completedAt: new Date().toISOString() }]);
        setAssignedTasks(prev => prev.filter(t => (t.taskId || t.id) !== taskId));
        
        // Update golden points
        const pointsEarned = response.data.pointsEarned || 10;
        setWorkerData(prev => ({ ...prev, goldenPoints: prev.goldenPoints + pointsEarned }));
        localStorage.setItem("goldenPoints", (workerData.goldenPoints + pointsEarned).toString());
        
        alert(`Task completed! You earned ${pointsEarned} golden points.`);
      }
    } catch (error) {
      console.error("Task completion error:", error);
      alert("Failed to complete task. Please try again.");
    }
  };

  const scanQR = async () => {
    if (!qrScanData.trim()) {
      alert("Please enter a QR code or home number.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/worker/scan-qr", {
        workerId: workerData.workerId,
        qrData: qrScanData,
        role: workerData.role
      });

      if (response.data.success) {
        alert(`QR scanned successfully! Home: ${response.data.homeNumber}`);
        setQrScanData("");
        
        // Update golden points
        const pointsEarned = response.data.pointsEarned || 5;
        setWorkerData(prev => ({ ...prev, goldenPoints: prev.goldenPoints + pointsEarned }));
        localStorage.setItem("goldenPoints", (workerData.goldenPoints + pointsEarned).toString());
      }
    } catch (error) {
      console.error("QR scan error:", error);
      alert("Failed to scan QR code. Please try again.");
    }
  };

  const getRoleColor = (color) => {
    const colors = {
      green: "emerald",
      blue: "blue",
      orange: "orange"
    };
    return colors[color] || "emerald";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${getRoleColor(currentRole.color)}-600 to-${getRoleColor(currentRole.color)}-700 text-white p-6`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">{currentRole.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {workerData.name}</h1>
              <p className="text-white/80">{currentRole.title} • Area: {workerData.area}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm">Golden Points</span>
              <div className="text-xl font-bold">{workerData.goldenPoints}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Golden Points</p>
                <p className="text-3xl font-bold text-yellow-600">{workerData.goldenPoints}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Assigned Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{assignedTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Efficiency</p>
                <p className="text-3xl font-bold text-purple-600">95%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>
            <div className="space-y-4">
              {assignedTasks.length > 0 ? (
                assignedTasks.map(task => (
                  <div key={task.taskId || task.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{task.title || task.type}</p>
                        <p className="text-sm text-gray-600">
                          {task.homeNumber ? `Home: ${task.homeNumber}` : `Location: ${task.location}`}
                        </p>
                        {task.time && <p className="text-sm text-gray-600">Time: {task.time}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600 cursor-pointer border px-3 py-2 rounded">
                          Upload Proof
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) completeTask(task.taskId || task.id, file, `Proof for ${task.title || task.type}`);
                          }} />
                        </label>
                        <button
                          onClick={() => completeTask(task.taskId || task.id)}
                          className={`bg-${getRoleColor(currentRole.color)}-500 text-white px-4 py-2 rounded-lg hover:bg-${getRoleColor(currentRole.color)}-600 transition-colors`}
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🎉</span>
                  <p>No assigned tasks at the moment!</p>
                </div>
              )}
            </div>
          </div>

          {/* QR Scanner */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">QR Code Scanner</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code or Home Number
                </label>
                <input
                  type="text"
                  placeholder="Scan QR or enter home number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={qrScanData}
                  onChange={(e) => setQrScanData(e.target.value)}
                />
              </div>
              <button
                onClick={scanQR}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                📱 Submit QR/Home
              </button>

              <div className="border rounded-lg p-3">
                <video id="qrVideo" className="w-full rounded" playsInline muted></video>
                <button
                  onClick={async () => {
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                      const video = document.getElementById('qrVideo');
                      if (!video) return;
                      video.srcObject = stream;
                      await video.play();

                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const scan = () => {
                        if (video.readyState === video.HAVE_ENOUGH_DATA) {
                          canvas.width = video.videoWidth;
                          canvas.height = video.videoHeight;
                          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                          // jsQR loaded via index.html
                          const code = window.jsQR && window.jsQR(imageData.data, canvas.width, canvas.height);
                          if (code && code.data) {
                            setQrScanData(code.data);
                            stream.getTracks().forEach(t => t.stop());
                            return;
                          }
                        }
                        requestAnimationFrame(scan);
                      };
                      requestAnimationFrame(scan);
                    } catch (e) {
                      alert('Camera access denied or unavailable');
                    }
                  }}
                  className="mt-2 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
                >
                  Start Camera Scan
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Scan Instructions:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Scan QR code on house number plate</li>
                  <li>• Verify house completion status</li>
                  <li>• Earn 5 golden points per scan</li>
                  <li>• Update admin dashboard automatically</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Completed Tasks Today</h3>
            <div className="space-y-3">
              {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.type}</p>
                      <p className="text-sm text-gray-600">
                        {task.homeNumber ? `Home: ${task.homeNumber}` : `Location: ${task.location}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">+10 pts</p>
                      <p className="text-xs text-gray-600">
                        {new Date(task.completedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No completed tasks yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Worker Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Task Completion Rate</span>
                <span className="font-semibold text-green-600">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">QR Scans Today</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Golden Points Earned</span>
                <span className="font-semibold text-yellow-600">+{workerData.goldenPoints}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Role Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg bg-${getRoleColor(currentRole.color)}-50 border border-${getRoleColor(currentRole.color)}-200`}>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{currentRole.icon}</span>
                <h4 className="font-semibold">{currentRole.title}</h4>
              </div>
              <p className="text-sm text-gray-700">
                {workerData.role === 'garbage_collector' && "Responsible for collecting waste from assigned homes and ensuring proper disposal."}
                {workerData.role === 'dustbin_monitor' && "Monitor dustbin status, report overflow issues, and ensure proper maintenance."}
                {workerData.role === 'complaint_manager' && "Handle citizen complaints, resolve issues, and provide status updates."}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">Daily Targets</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Complete assigned tasks: {assignedTasks.length}/10</li>
                <li>• QR scans: 12/15</li>
                <li>• Response time: &lt; 2 hours</li>
                <li>• Quality score: &gt; 90%</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">Rewards</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Task completion: +10 points</li>
                <li>• QR scan: +5 points</li>
                <li>• Early completion: +5 bonus</li>
                <li>• Perfect week: +50 bonus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
