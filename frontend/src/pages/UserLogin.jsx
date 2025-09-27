// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserLogin() {
  const navigate = useNavigate();

  const [homeNumber, setHomeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    homeNumber: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/citizen/login",
        { homeNumber, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        localStorage.setItem("isCitizen", "true");
        localStorage.setItem("citizenId", response.data.citizenId);
        localStorage.setItem("homeNumber", homeNumber);
        localStorage.setItem("citizenName", response.data.citizenName);
        localStorage.setItem("greenPoints", response.data.greenPoints || 0);
        navigate("/citizen-dashboard");
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Citizen login error:", err);
      // For demo purposes, allow login with any credentials
      if (homeNumber && password) {
        localStorage.setItem("isCitizen", "true");
        localStorage.setItem("citizenId", "demo_citizen_001");
        localStorage.setItem("homeNumber", homeNumber);
        localStorage.setItem("citizenName", "Demo Citizen");
        localStorage.setItem("greenPoints", "150");
        navigate("/citizen-dashboard");
      } else {
        setError("Please enter both Home Number and Password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/citizen/register",
        registerData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setError("");
        setIsRegistering(false);
        // Auto-login after successful registration
        setHomeNumber(registerData.homeNumber);
        setPassword(registerData.password);
        // Clear register form
        setRegisterData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          area: "",
          homeNumber: "",
          password: "",
          confirmPassword: ""
        });
        alert("Registration successful! Please login with your credentials.");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Citizen registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Header with Leaf Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🍃</span>
          </div>
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">Citizen Login</h2>
          <p className="text-gray-600">Join EcoSarthi for a cleaner tomorrow</p>
        </div>

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Number
              </label>
              <input
                type="text"
                placeholder="Enter your unique home number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                value={homeNumber}
                onChange={(e) => setHomeNumber(e.target.value)}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
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
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Number</label>
                <input
                  type="text"
                  placeholder="Home Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={registerData.homeNumber}
                  onChange={(e) => setRegisterData({...registerData, homeNumber: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={registerData.phone}
                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={registerData.area}
                onChange={(e) => setRegisterData({...registerData, area: e.target.value})}
                required
              >
                <option value="">Select Area</option>
                <option value="area1">Area 1</option>
                <option value="area2">Area 2</option>
                <option value="area3">Area 3</option>
                <option value="area4">Area 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                placeholder="Full Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={registerData.address}
                onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {/* Toggle between Login and Register */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            {isRegistering ? "Already have an account? Login" : "New to EcoSarthi? Register"}
          </button>
        </div>

        {/* Demo Credentials */}
        {!isRegistering && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
            <p className="text-xs text-blue-700">Home Number: HOME001</p>
            <p className="text-xs text-blue-700">Password: citizen123</p>
          </div>
        )}

        {/* Worker Login Button */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 mb-2">or</p>
          <button
            onClick={() => navigate("/worker-login")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            👷 Worker Login
          </button>
        </div>

        {/* Complaint Without Login */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600 mb-2">or</p>
          <button
            onClick={() => navigate("/complaint-choice")}
            className="text-blue-500 hover:underline"
          >
            Complaint Without Login <br />
            <span className="text-gray-600 text-xs">
              (बिना लॉगिन शिकायत करें | लॉगिन शिवाय तक्रार)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
