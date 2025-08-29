// src/pages/UserLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    // Simulate login — can integrate real auth later
    localStorage.setItem("isUser", "true");
    navigate("/user-options"); // ✅ Redirecting to new options page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">User Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone number"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Complaint Without Login */}
        <div className="mt-6 text-center text-sm">
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
