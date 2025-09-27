import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RewardsPerformance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("points");
  const [workerStats, setWorkerStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Check if worker is logged in
    const isWorker = localStorage.getItem("isWorker");
    if (!isWorker) {
      navigate("/worker-login");
      return;
    }

    // Mock data - replace with API call
    const mockWorkerStats = {
      totalPoints: 1250,
      weeklyPoints: 180,
      monthlyPoints: 650,
      rank: 3,
      tasksCompleted: 45,
      perfectDays: 12,
      streak: 5,
      level: "Gold",
      nextLevelPoints: 200
    };

    const mockLeaderboard = [
      { id: 1, name: "Rajesh Kumar", points: 1850, level: "Platinum", avatar: "👨‍💼", tasks: 67 },
      { id: 2, name: "Priya Sharma", points: 1650, level: "Gold", avatar: "👩‍💼", tasks: 58 },
      { id: 3, name: "Demo Worker", points: 1250, level: "Gold", avatar: "👨‍🔧", tasks: 45 },
      { id: 4, name: "Amit Singh", points: 1100, level: "Silver", avatar: "👨‍🔧", tasks: 42 },
      { id: 5, name: "Sunita Devi", points: 950, level: "Silver", avatar: "👩‍🔧", tasks: 38 },
      { id: 6, name: "Vikram Patel", points: 800, level: "Bronze", avatar: "👨‍🔧", tasks: 35 },
      { id: 7, name: "Kavita Yadav", points: 750, level: "Bronze", avatar: "👩‍🔧", tasks: 32 },
      { id: 8, name: "Ramesh Kumar", points: 650, level: "Bronze", avatar: "👨‍🔧", tasks: 28 }
    ];

    const mockAchievements = [
      {
        id: 1,
        title: "Perfect Week",
        description: "Complete all tasks for 7 consecutive days",
        icon: "🏆",
        earned: true,
        earnedDate: "2024-01-10",
        points: 100
      },
      {
        id: 2,
        title: "Safety Champion",
        description: "Complete 5 safety training modules",
        icon: "🛡️",
        earned: true,
        earnedDate: "2024-01-08",
        points: 75
      },
      {
        id: 3,
        title: "Eco Warrior",
        description: "Report 10 environmental issues",
        icon: "🌱",
        earned: true,
        earnedDate: "2024-01-05",
        points: 50
      },
      {
        id: 4,
        title: "Speed Demon",
        description: "Complete 20 tasks in a single day",
        icon: "⚡",
        earned: false,
        earnedDate: null,
        points: 150
      },
      {
        id: 5,
        title: "Team Player",
        description: "Help 5 colleagues with their tasks",
        icon: "🤝",
        earned: false,
        earnedDate: null,
        points: 100
      },
      {
        id: 6,
        title: "Quiz Master",
        description: "Score 100% on 3 consecutive quizzes",
        icon: "🧠",
        earned: false,
        earnedDate: null,
        points: 125
      }
    ];

    const mockRecentActivities = [
      {
        id: 1,
        type: "task_completed",
        description: "Completed collection task at Sector 15",
        points: 25,
        timestamp: "2 hours ago",
        icon: "✅"
      },
      {
        id: 2,
        type: "quiz_completed",
        description: "Completed PPE Safety Quiz with 100% score",
        points: 50,
        timestamp: "4 hours ago",
        icon: "🧠"
      },
      {
        id: 3,
        type: "achievement_earned",
        description: "Earned 'Safety Champion' achievement",
        points: 75,
        timestamp: "1 day ago",
        icon: "🏆"
      },
      {
        id: 4,
        type: "issue_reported",
        description: "Reported overflowing bin at Sector 16",
        points: 15,
        timestamp: "2 days ago",
        icon: "📢"
      },
      {
        id: 5,
        type: "perfect_day",
        description: "Perfect day - all tasks completed on time",
        points: 30,
        timestamp: "3 days ago",
        icon: "⭐"
      }
    ];

    setWorkerStats(mockWorkerStats);
    setLeaderboard(mockLeaderboard);
    setAchievements(mockAchievements);
    setRecentActivities(mockRecentActivities);
  }, [navigate]);

  const getLevelColor = (level) => {
    switch (level) {
      case "Platinum": return "bg-purple-100 text-purple-800";
      case "Gold": return "bg-yellow-100 text-yellow-800";
      case "Silver": return "bg-gray-100 text-gray-800";
      case "Bronze": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "task_completed": return "✅";
      case "quiz_completed": return "🧠";
      case "achievement_earned": return "🏆";
      case "issue_reported": return "📢";
      case "perfect_day": return "⭐";
      default: return "📝";
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
              <h1 className="text-2xl font-bold text-gray-900">Rewards & Performance</h1>
              <p className="text-gray-600">Track your points, achievements, and performance</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{workerStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "points", label: "My Points", icon: "⭐" },
              { key: "leaderboard", label: "Leaderboard", icon: "🏆" },
              { key: "achievements", label: "Achievements", icon: "🎖️" },
              { key: "activity", label: "Recent Activity", icon: "📊" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Points Tab */}
        {activeTab === "points" && (
          <div className="space-y-6">
            {/* Points Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{workerStats.totalPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{workerStats.weeklyPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Rank</p>
                    <p className="text-2xl font-bold text-gray-900">#{workerStats.rank}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(workerStats.level)}`}>
                  {workerStats.level} Level
                </span>
                <span className="text-sm text-gray-600">
                  {workerStats.totalPoints} / {workerStats.totalPoints + workerStats.nextLevelPoints} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(workerStats.totalPoints / (workerStats.totalPoints + workerStats.nextLevelPoints)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {workerStats.nextLevelPoints} points to next level
              </p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{workerStats.tasksCompleted}</div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{workerStats.perfectDays}</div>
                <p className="text-sm text-gray-600">Perfect Days</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{workerStats.streak}</div>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="divide-y divide-gray-200">
                {leaderboard.map((worker, index) => (
                  <div key={worker.id} className={`p-4 ${worker.name === "Demo Worker" ? "bg-blue-50" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="text-2xl">{worker.avatar}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                          <p className="text-sm text-gray-600">{worker.tasks} tasks completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{worker.points}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(worker.level)}`}>
                          {worker.level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`bg-white rounded-lg shadow-sm border p-6 ${achievement.earned ? "ring-2 ring-green-200" : "opacity-60"}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">+{achievement.points} pts</span>
                      {achievement.earned ? (
                        <span className="text-green-600 text-sm">✓ Earned</span>
                      ) : (
                        <span className="text-gray-400 text-sm">Locked</span>
                      )}
                    </div>
                    {achievement.earned && achievement.earnedDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-600">{activity.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-semibold">+{activity.points}</span>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
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
