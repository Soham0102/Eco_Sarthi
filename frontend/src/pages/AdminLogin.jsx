import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { username, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Server not responding.");
    }
  };

  return (
    <div className="m-2 p-10 flex justify-center items-start min-h-screen bg-gray-100">
      <div className="bg-white border border-blue-300 shadow-2xl rounded-2xl p-8 w-96 mt-20">
        
        {/* Gradient Header */}
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          {/* Orange Gradient Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-2 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
