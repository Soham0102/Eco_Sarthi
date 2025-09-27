import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function WorkerLogin() {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate worker authentication - replace with actual API call
      const response = await axios.post(
        "http://localhost:5000/api/worker/login",
        { workerId, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("isWorker", "true");
        localStorage.setItem("workerId", workerId);
        localStorage.setItem("workerName", response.data.workerName || "Worker");
        navigate("/worker-dashboard");
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Worker login error:", err);
      // For demo purposes, allow login with any credentials
      if (workerId && password) {
        localStorage.setItem("isWorker", "true");
        localStorage.setItem("workerId", workerId);
        localStorage.setItem("workerName", "Demo Worker");
        navigate("/worker-dashboard");
      } else {
        setError("Please enter both Worker ID and Password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Worker Login</h2>
          <p className="text-gray-600">Access your assigned tasks and routes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Worker ID
            </label>
            <input
              type="text"
              placeholder="Enter your Worker ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
          <p className="text-xs text-blue-700">Garbage Collector: GC001 / password123</p>
          <p className="text-xs text-blue-700">Dustbin Monitor: DM001 / password123</p>
          <p className="text-xs text-blue-700">Complaint Manager: CM001 / password123</p>
        </div>

        {/* Back to Main Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/user-login")}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            ← Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
}
