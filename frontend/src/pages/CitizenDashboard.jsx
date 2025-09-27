import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCodeGenerator from "../components/QRCodeGenerator";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [citizenData, setCitizenData] = useState({
    name: localStorage.getItem("citizenName") || "",
    homeNumber: localStorage.getItem("homeNumber") || "",
    greenPoints: parseInt(localStorage.getItem("greenPoints")) || 0,
    area: localStorage.getItem("area") || "",
    streak: 0,
    rank: 0
  });

  const [pickupSchedule, setPickupSchedule] = useState([]);
  const [nextPickup, setNextPickup] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [workerTop, setWorkerTop] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    loadCitizenData();
  }, []);

  const loadCitizenData = async () => {
    try {
      const citizenId = localStorage.getItem("citizenId");
      if (!citizenId) return;

      // Load citizen activities
      const activitiesResponse = await axios.get(`http://localhost:5000/api/citizen/activities/${citizenId}`);
      if (activitiesResponse.data.success) {
        setRecentActivities(activitiesResponse.data.activities);
      }

      // Load leaderboard
      const leaderboardResponse = await axios.get(`http://localhost:5000/api/citizen/leaderboard?area=${citizenData.area}`);
      if (leaderboardResponse.data.success) {
        setLeaderboard(leaderboardResponse.data.leaderboard);
      }

      // Load worker leaderboard (golden points) for visibility to citizens
      try {
        const workerLb = await axios.get(`http://localhost:5000/api/worker/leaderboard?area=${citizenData.area}`);
        if (workerLb.data.success) {
          setWorkerTop(workerLb.data.leaderboard);
        }
      } catch {}

      // Load pickup schedule (this would come from backend)
      const scheduleResponse = await axios.get(`http://localhost:5000/api/citizen/schedule/${citizenId}`);
      if (scheduleResponse.data.success && scheduleResponse.data.schedule) {
        const s = scheduleResponse.data.schedule;
        setPickupSchedule([
          {
            day: 'Daily',
            time: s.pickupTime,
            type: 'Daily Pickup',
            status: 'scheduled',
            nextPickupAt: s.nextPickupAt
          }
        ]);
        setNextPickup({ time: s.pickupTime, at: s.nextPickupAt });
        // Schedule a 15-minute notification
        try {
          const nextAt = new Date(s.nextPickupAt);
          const warnAt = new Date(nextAt.getTime() - 15 * 60 * 1000);
          const ms = warnAt.getTime() - Date.now();
          if (ms > 0) {
            setTimeout(() => {
              try {
                // Browser notification
                if ("Notification" in window) {
                  if (Notification.permission === "granted") {
                    new Notification("EcoSarthi: Pickup in 15 minutes", { body: `Your daily pickup is at ${s.pickupTime}` });
                  } else if (Notification.permission !== "denied") {
                    Notification.requestPermission();
                  }
                }
                // Fallback alert
                alert(`Reminder: Your daily pickup is at ${s.pickupTime} (in 15 minutes).`);
              } catch {}
            }, ms);
          }
        } catch {}
      }

      // Load complaints (keep empty until wired to a specific endpoint)
      setComplaints([]);

    } catch (error) {
      console.error("Error loading citizen data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isCitizen");
    localStorage.removeItem("citizenId");
    localStorage.removeItem("homeNumber");
    localStorage.removeItem("citizenName");
    localStorage.removeItem("greenPoints");
    navigate("/user-login");
  };

  const requestPickup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/citizen/request-pickup", {
        citizenId: localStorage.getItem("citizenId"),
        homeNumber: citizenData.homeNumber,
        type: "emergency",
        description: "Emergency pickup request"
      });
      
      if (response.data.success) {
        alert("Pickup request submitted successfully!");
        // Add to recent activities
        setRecentActivities(prev => [{
          id: Date.now(),
          activityType: "Pickup Request",
          pointsEarned: response.data.pointsEarned,
          createdAt: new Date().toISOString(),
          status: "pending"
        }, ...prev]);
        setCitizenData(prev => ({ ...prev, greenPoints: prev.greenPoints + (response.data.pointsEarned || 0) }));
      }
    } catch (error) {
      console.error("Pickup request error:", error);
      alert("Failed to submit pickup request. Please try again.");
    }
  };

  const askAI = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await axios.post("http://localhost:5000/api/citizen/ai-segregation", {
        citizenId: localStorage.getItem("citizenId"),
        query: searchQuery
      });
      
      setAiResponse(response.data.response);
      // Add to recent activities
      setRecentActivities(prev => [{
        id: Date.now(),
        activityType: "AI Segregation Help",
        pointsEarned: response.data.pointsEarned,
        createdAt: new Date().toISOString(),
        status: "completed"
      }, ...prev]);
      setCitizenData(prev => ({ ...prev, greenPoints: prev.greenPoints + (response.data.pointsEarned || 0) }));
    } catch (error) {
      console.error("AI query error:", error);
      setAiResponse("Sorry, I couldn't process your request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍃</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {citizenData.name}</h1>
              <p className="text-emerald-100">Home: {citizenData.homeNumber} | Area: {citizenData.area}</p>
              {nextPickup && (
                <p className="text-emerald-100 text-sm">Daily pickup: {nextPickup.time} • Next: {new Date(nextPickup.at).toLocaleString()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm">Green Points</span>
              <div className="text-xl font-bold">{citizenData.greenPoints}</div>
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: "🏠" },
            { id: "pickup", label: "Pickup & Schedule", icon: "🗑️" },
            { id: "ai", label: "AI Assistant", icon: "🤖" },
            { id: "activities", label: "My Activities", icon: "📊" },
            { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { id: "complaints", label: "Complaints", icon: "📝" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Green Points</p>
                  <p className="text-3xl font-bold text-emerald-600">{citizenData.greenPoints}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍃</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Current Streak</p>
                  <p className="text-3xl font-bold text-orange-600">{citizenData.streak} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Area Rank</p>
                  <p className="text-3xl font-bold text-blue-600">#{citizenData.rank}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-6 shadow-sm md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-2">Your Home QR</h3>
              <p className="text-sm text-gray-600 mb-3">Show this to the worker for verified pickup.</p>
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">Home Number</div>
                  <div className="text-gray-900">{citizenData.homeNumber}</div>
                </div>
                <div className="flex-1">
                  <QRCodeGenerator homeNumber={citizenData.homeNumber} onGenerate={() => {}} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={requestPickup}
                  className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  🗑️ Request Pickup
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🤖 Ask AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab("complaints")}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  📝 File Complaint
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-sm md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 4).map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.activityType}</p>
                        <p className="text-sm text-gray-600">{activity.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-semibold">+{activity.pointsEarned} pts</p>
                        <p className="text-sm text-gray-600">{activity.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">📊</span>
                    <p>No activities yet. Start using EcoSarthi to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pickup" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Pickup Schedule</h3>
              <div className="space-y-4">
                {pickupSchedule.length > 0 ? (
                  pickupSchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{schedule.day} - {schedule.time}</p>
                        <p className="text-gray-600">{schedule.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                        schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">🗑️</span>
                    <p>No pickup schedule available yet.</p>
                    <p className="text-sm">Request a pickup to get started!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Request Pickup</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={requestPickup}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">🚨</span>
                    <p className="font-medium">Emergency Pickup</p>
                    <p className="text-sm text-gray-600">+20 points</p>
                  </div>
                </button>
                <button
                  onClick={requestPickup}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">♻️</span>
                    <p className="font-medium">Recycling Pickup</p>
                    <p className="text-sm text-gray-600">+15 points</p>
                  </div>
                </button>
                <button
                  onClick={requestPickup}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">🌱</span>
                    <p className="font-medium">Compost Pickup</p>
                    <p className="text-sm text-gray-600">+25 points</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">AI Waste Segregation Assistant</h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Ask about waste segregation, recycling, or composting..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                  />
                  <button
                    onClick={askAI}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Ask AI
                  </button>
                </div>
                
                {aiResponse && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="font-medium text-emerald-800">AI Assistant Response:</p>
                        <p className="text-emerald-700 mt-1">{aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Quick Questions:</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSearchQuery("How to segregate plastic waste?")}
                        className="block w-full text-left text-sm text-blue-700 hover:text-blue-900"
                      >
                        • How to segregate plastic waste?
                      </button>
                      <button
                        onClick={() => setSearchQuery("What can be composted?")}
                        className="block w-full text-left text-sm text-blue-700 hover:text-blue-900"
                      >
                        • What can be composted?
                      </button>
                      <button
                        onClick={() => setSearchQuery("How to dispose of electronic waste?")}
                        className="block w-full text-left text-sm text-blue-700 hover:text-blue-900"
                      >
                        • How to dispose of electronic waste?
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Eco Tips:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Separate wet and dry waste</li>
                      <li>• Clean containers before recycling</li>
                      <li>• Use cloth bags instead of plastic</li>
                      <li>• Compost organic kitchen waste</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Activity History</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, idx) => (
                <div key={activity.id || idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">{activity.activityType}</p>
                      <p className="text-sm text-gray-600">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-600 font-semibold">+{activity.pointsEarned} pts</p>
                    <p className="text-sm text-gray-600">{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Area Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.map((person, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                      person.homeNumber === citizenData.homeNumber ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          person.rank === 1 ? 'bg-yellow-500' :
                          person.rank === 2 ? 'bg-gray-400' :
                          person.rank === 3 ? 'bg-orange-500' :
                          'bg-gray-300'
                        }`}>
                          {person.rank}
                        </div>
                        <div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-gray-600">{person.homeNumber} • {person.area}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-semibold">{person.points} pts</p>
                        {person.homeNumber === citizenData.homeNumber && (
                          <p className="text-xs text-emerald-600">You</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">🏆</span>
                    <p>No leaderboard data available yet.</p>
                    <p className="text-sm">Start earning points to see your ranking!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Monthly Awards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <span className="text-3xl mb-2 block">🥇</span>
                  <p className="font-medium">Top Performer</p>
                  <p className="text-sm text-gray-600">Highest points this month</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <span className="text-3xl mb-2 block">🌱</span>
                  <p className="font-medium">Eco Champion</p>
                  <p className="text-sm text-gray-600">Best waste segregation</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-3xl mb-2 block">🏆</span>
                  <p className="font-medium">Community Leader</p>
                  <p className="text-sm text-gray-600">Most active citizen</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Top Workers (Golden Points)</h3>
              <div className="space-y-3">
                {workerTop.length > 0 ? (
                  workerTop.map((w, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold">
                          {w.rank}
                        </div>
                        <div>
                          <p className="font-medium">{w.name} ({w.role.replace('_',' ')})</p>
                          <p className="text-sm text-gray-600">{w.area}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-700 font-semibold">{w.goldenPoints} pts</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl mb-2 block">⭐</span>
                    <p>No worker leaderboard available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "complaints" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">My Complaints</h3>
              <div className="space-y-3">
                {complaints.map(complaint => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-sm text-gray-600">Filed on {complaint.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">File New Complaint</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/complaint")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">🚨</span>
                    <p className="font-medium">Garbage Collection Issue</p>
                    <p className="text-sm text-gray-600">+5 points</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate("/complaint")}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">🗑️</span>
                    <p className="font-medium">Dustbin Problem</p>
                    <p className="text-sm text-gray-600">+5 points</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
