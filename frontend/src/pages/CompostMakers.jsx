import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CompostMakers() {
  const [compostMakers, setCompostMakers] = useState([]);
  const [filteredMakers, setFilteredMakers] = useState([]);
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [loading, setLoading] = useState(true);

  const areas = ["all", "Area 1", "Area 2", "Area 3", "Area 4", "Area 5"];
  const cities = ["all", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];

  useEffect(() => {
    loadCompostMakers();
  }, []);

  useEffect(() => {
    filterMakers();
  }, [compostMakers, selectedArea, selectedCity]);

  const loadCompostMakers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/compost-makers");
      if (response.data.success) {
        setCompostMakers(response.data.makers);
      }
    } catch (error) {
      console.error("Error loading compost makers:", error);
      // Fallback demo data if API returns empty or down
      setCompostMakers([
        {
          id: 1,
          name: "Green Earth Composting",
          owner: "Rajesh Kumar",
          phone: "+91 98765 43210",
          email: "rajesh@greenearth.com",
          area: "Area 1",
          city: "Mumbai",
          address: "123 Green Street, Area 1, Mumbai",
          services: ["Organic Waste Composting", "Garden Waste Processing", "Compost Supply"],
          capacity: "500 kg/day",
          rating: 4.8,
          logo: "🌱",
          workingHours: "8:00 AM - 6:00 PM",
          establishedYear: 2020
        },
        {
          id: 2,
          name: "Eco Compost Solutions",
          owner: "Priya Sharma",
          phone: "+91 87654 32109",
          email: "priya@ecocompost.com",
          area: "Area 2",
          city: "Mumbai",
          address: "456 Eco Lane, Area 2, Mumbai",
          services: ["Kitchen Waste Composting", "Leaf Composting", "Compost Training"],
          capacity: "300 kg/day",
          rating: 4.6,
          logo: "♻️",
          workingHours: "7:00 AM - 7:00 PM",
          establishedYear: 2019
        },
        {
          id: 3,
          name: "Nature's Compost Hub",
          owner: "Amit Singh",
          phone: "+91 76543 21098",
          email: "amit@naturescompost.com",
          area: "Area 3",
          city: "Mumbai",
          address: "789 Nature Road, Area 3, Mumbai",
          services: ["Industrial Composting", "Bulk Compost Supply", "Compost Consultation"],
          capacity: "1000 kg/day",
          rating: 4.9,
          logo: "🌿",
          workingHours: "6:00 AM - 8:00 PM",
          establishedYear: 2018
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterMakers = () => {
    let filtered = compostMakers;

    if (selectedArea !== "all") {
      filtered = filtered.filter(maker => maker.area === selectedArea);
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter(maker => maker.city === selectedCity);
    }

    setFilteredMakers(filtered);
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compost makers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🌱 Compost Makers Directory</h1>
          <p className="text-emerald-100">Find local compost makers in your area for organic waste processing</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Filter by Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city === "all" ? "All Cities" : city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area === "all" ? "All Areas" : area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredMakers.length} compost maker{filteredMakers.length !== 1 ? 's' : ''} 
            {selectedArea !== "all" && ` in ${selectedArea}`}
            {selectedCity !== "all" && `, ${selectedCity}`}
          </p>
        </div>

        {/* Compost Makers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMakers.map(maker => (
            <div key={maker.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
                  {maker.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{maker.name}</h3>
                  <p className="text-gray-600">Owner: {maker.owner}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{maker.rating}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📍</span>
                  <span className="text-sm text-gray-700">{maker.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📞</span>
                  <span className="text-sm text-gray-700">{maker.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">⏰</span>
                  <span className="text-sm text-gray-700">{maker.workingHours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📊</span>
                  <span className="text-sm text-gray-700">Capacity: {maker.capacity}</span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Services Offered:</h4>
                <div className="flex flex-wrap gap-2">
                  {maker.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCall(maker.phone)}
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                >
                  📞 Call
                </button>
                <button
                  onClick={() => handleEmail(maker.email)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  📧 Email
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Est. {maker.establishedYear}</span>
                  <span>{maker.area}, {maker.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMakers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No compost makers found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new listings.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Why Use Compost Makers?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">♻️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Waste Reduction</h4>
              <p className="text-sm text-gray-600">Convert organic waste into valuable compost instead of sending it to landfills</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h4 className="font-semibold text-gray-800 mb-2">Soil Enrichment</h4>
              <p className="text-sm text-gray-600">Get nutrient-rich compost to improve your garden soil quality</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h4 className="font-semibold text-gray-800 mb-2">Environmental Impact</h4>
              <p className="text-sm text-gray-600">Reduce methane emissions and contribute to a circular economy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
