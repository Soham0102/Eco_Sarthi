// import React, { useState } from "react";
// import axios from "axios";
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

// export default function ComplaintForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     complaint: "",
//     location: "",
//     urgency: "normal",
//     department: "",
//   });

//   const [photo, setPhoto] = useState(null);
//   const [complaintId, setComplaintId] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // location select handler
//   const handleSelect = async (address) => {
//     setFormData({ ...formData, location: address });
//     try {
//       const results = await geocodeByAddress(address);
//       const latLng = await getLatLng(results[0]);
//       console.log("Coordinates: ", latLng); // agar latitude/longitude bhi chahiye backend ke liye
//     } catch (error) {
//       console.error("Error fetching coordinates", error);
//     }
//   };

//   const handlePhotoChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setPhoto(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formDataToSend = new FormData();
//       Object.keys(formData).forEach((key) => {
//         formDataToSend.append(key, formData[key]);
//       });
//       if (photo) {
//         formDataToSend.append("photo", photo);
//       }

//       const res = await axios.post("http://localhost:5000/api/complaint", formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setComplaintId(res.data.complaint.complaintId);
//       setSubmitted(true);

//       setFormData({
//         name: "",
//         complaint: "",
//         location: "",
//         urgency: "normal",
//         department: "",
//       });
//       setPhoto(null);
//     } catch (err) {
//       console.error("Submission failed:", err.message);
//       alert("Complaint submission failed. Try again.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-semibold mb-4">Complaint Form</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Your Name"
//           required
//           className="w-full border px-3 py-2 rounded"
//         />
//         <textarea
//           name="complaint"
//           value={formData.complaint}
//           onChange={handleChange}
//           placeholder="Describe your complaint"
//           required
//           className="w-full border px-3 py-2 rounded"
//         />

//         {/* Location Autocomplete */}
//         <PlacesAutocomplete
//           value={formData.location}
//           onChange={(address) => setFormData({ ...formData, location: address })}
//           onSelect={handleSelect}
//           searchOptions={{ componentRestrictions: { country: ["in"] } }} // restrict to India
//         >
//           {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//             <div>
//               <input
//                 {...getInputProps({
//                   placeholder: "Search Location (India only)",
//                   className: "w-full border px-3 py-2 rounded",
//                 })}
//               />
//               <div className="border rounded bg-white mt-1">
//                 {loading && <div className="p-2 text-gray-500">Loading...</div>}
//                 {suggestions.map((suggestion) => {
//                   const className = suggestion.active
//                     ? "p-2 bg-blue-100 cursor-pointer"
//                     : "p-2 cursor-pointer";
//                   return (
//                     <div
//                       {...getSuggestionItemProps(suggestion, { className })}
//                       key={suggestion.placeId}
//                     >
//                       {suggestion.description}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </PlacesAutocomplete>

//         {/* Department */}
//         <select
//           name="department"
//           value={formData.department}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//           required
//         >
//           <option value="">Select a Department</option>
//           <option value="Public Works">Public Works</option>
//           <option value="Water Supply">Water Supply</option>
//           <option value="Sanitation">Sanitation</option>
//           <option value="Electricity">Electricity</option>
//           <option value="Other">Other</option>
//         </select>

//         {/* Urgency */}
//         <select
//           name="urgency"
//           value={formData.urgency}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//         >
//           <option value="normal">Normal</option>
//           <option value="urgent">Urgent</option>
//         </select>

//         {/* Photo Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Upload / Capture Photo
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             capture="environment"
//             onChange={handlePhotoChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//           {photo && (
//             <p className="text-xs text-gray-500 mt-1">Selected: {photo.name}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </form>

//       {submitted && (
//         <div className="mt-6 text-green-700 font-semibold">
//           Complaint submitted successfully!<br />
//           Your Complaint ID: <span className="font-bold">{complaintId}</span>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveCoords, setLiveCoords] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Google Places Autocomplete handler
  const handleSelect = async (address) => {
    setFormData({ ...formData, location: address });
    setLiveCoords(null); // Clear live coords if user selects an address
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      console.log("Selected Location Coordinates: ", latLng);
      // You can store these coords in state if your backend needs them
    } catch (error) {
      console.error("Error fetching coordinates", error);
    }
  };

  // Live location button handler
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLiveCoords({ latitude, longitude });
        setFormData({ ...formData, location: "Live Location Captured" });
        alert("Live location successfully captured!");
        setIsSubmitting(false);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        alert("⚠ Location not available. Please enable GPS for accurate location.");
        setLiveCoords(null);
        setIsSubmitting(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      // Backend expects 'description'; mirror from 'complaint'
      if (formData.complaint && !formData.description) {
        formDataToSend.append("description", formData.complaint);
      }

      if (photo) {
        formDataToSend.append("photo", photo);
      }

      // Logic to determine which location to send
      let latLng = null;
      if (liveCoords) {
        // Option 1: Live location is captured
        latLng = liveCoords;
      } else if (formData.location) {
        // Option 2: User typed and selected a location
        const results = await geocodeByAddress(formData.location);
        latLng = await getLatLng(results[0]);
      }

      if (latLng) {
        formDataToSend.append("latitude", latLng.latitude);
        formDataToSend.append("longitude", latLng.longitude);
      }

      // include citizenId if logged in so backend can award points
      const citizenId = localStorage.getItem('citizenId');
      if (citizenId) formDataToSend.append('citizenId', citizenId);

      const res = await axios.post("http://localhost:5000/api/complaint", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setComplaintId(res.data.complaintId);
      setSubmitted(true);
      alert(`Complaint submitted successfully! Your Complaint ID is: ${res.data.complaintId}`);

      // Reset form
      setFormData({
        name: "",
        complaint: "",
        location: "",
        urgency: "normal",
        department: "",
      });
      setPhoto(null);
      setLiveCoords(null);
    } catch (err) {
      console.error("Submission failed:", err.message);
      alert("Complaint submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Complaint Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields */}
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

        {/* Location Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="flex gap-2">
            <PlacesAutocomplete
              value={formData.location}
              onChange={(address) => {
                setFormData({ ...formData, location: address });
                setLiveCoords(null);
              }}
              onSelect={handleSelect}
              searchOptions={{ componentRestrictions: { country: ["in"] } }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="w-full">
                  <input
                    {...getInputProps({
                      placeholder: "Search Location...",
                      className: "w-full border px-3 py-2 rounded",
                    })}
                  />
                  <div className="border rounded bg-white mt-1">
                    {loading && <div className="p-2 text-gray-500">Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "p-2 bg-blue-100 cursor-pointer"
                        : "p-2 cursor-pointer";
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                          key={suggestion.placeId}
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <button
              type="button"
              onClick={handleLiveLocation}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-sm text-white ${
                isSubmitting ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              Live
            </button>
          </div>
          {liveCoords && (
            <p className="text-xs text-green-600 mt-1">
              Live Location: {liveCoords.latitude.toFixed(4)}, {liveCoords.longitude.toFixed(4)}
            </p>
          )}
        </div>

        {/* Other form elements */}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload / Capture Photo
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
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600"
          } text-white px-4 py-2 rounded hover:bg-blue-700`}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
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