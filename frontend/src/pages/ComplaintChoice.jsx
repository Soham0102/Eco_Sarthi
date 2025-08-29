import React, { useState } from "react";
import axios from "axios";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    name: "",
    complaint: "",
    location: "",
    urgency: "normal",
    department: "",
  });

  const [photo, setPhoto] = useState(null);
  const [complaintId, setComplaintId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // file ya live photo select/capture karna
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (photo) {
        formDataToSend.append("photo", photo);
      }

      const res = await axios.post("http://localhost:5000/api/complaint", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setComplaintId(res.data.complaintId);
      setSubmitted(true);

      // reset
      setFormData({
        name: "",
        complaint: "",
        location: "",
        urgency: "normal",
        department: "",
      });
      setPhoto(null);
    } catch (err) {
      console.error("Submission failed:", err.message);
      alert("Complaint submission failed. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Complaint Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="complaint"
          value={formData.complaint}
          onChange={handleChange}
          placeholder="Describe your complaint"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full border px-3 py-2 rounded"
        />

        {/* Department */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select a Department</option>
          <option value="Public Works">Public Works</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Electricity">Electricity</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload/Click Photo
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="w-full border px-3 py-2 rounded"
          />
          {photo && (
            <p className="text-xs text-gray-500 mt-1">Selected: {photo.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {submitted && (
        <div className="mt-6 text-green-700 font-semibold">
          Complaint submitted successfully!<br />
          Your Complaint ID: <span className="font-bold">{complaintId}</span>
        </div>
      )}
    </div>
  );
}
