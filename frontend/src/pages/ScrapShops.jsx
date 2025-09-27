import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ScrapShops() {
  const [scrapShops, setScrapShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [loading, setLoading] = useState(true);

  const areas = ["all", "Area 1", "Area 2", "Area 3", "Area 4", "Area 5"];
  const cities = ["all", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];

  useEffect(() => {
    loadScrapShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [scrapShops, selectedArea, selectedCity]);

  const loadScrapShops = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/scrap-shops");
      if (response.data.success) {
        setScrapShops(response.data.shops);
      }
    } catch (error) {
      console.error("Error loading scrap shops:", error);
      // Fallback demo data if API returns empty or down
      setScrapShops([
        {
          id: 1,
          name: "Green Scrap Solutions",
          owner: "Ramesh Kumar",
          phone: "+91 98765 43210",
          email: "ramesh@greenscrap.com",
          area: "Area 1",
          city: "Mumbai",
          address: "123 Scrap Street, Area 1, Mumbai",
          services: ["Paper Collection", "Plastic Recycling", "Metal Scrap", "Electronic Waste"],
          specialties: ["Newspaper", "Cardboard", "Plastic Bottles", "Aluminum Cans"],
          rating: 4.7,
          logo: "♻️",
          workingHours: "8:00 AM - 7:00 PM",
          establishedYear: 2015,
          pickupAvailable: true,
          minimumQuantity: "5 kg"
        },
        {
          id: 2,
          name: "Eco Kabadiwala",
          owner: "Sunita Devi",
          phone: "+91 87654 32109",
          email: "sunita@ecokabadi.com",
          area: "Area 2",
          city: "Mumbai",
          address: "456 Eco Lane, Area 2, Mumbai",
          services: ["Home Pickup", "Bulk Collection", "Corporate Recycling", "E-waste"],
          specialties: ["Old Newspapers", "Plastic Items", "Steel Utensils", "Copper Wire"],
          rating: 4.5,
          logo: "🛒",
          workingHours: "7:00 AM - 8:00 PM",
          establishedYear: 2018,
          pickupAvailable: true,
          minimumQuantity: "3 kg"
        },
        {
          id: 3,
          name: "Metal Masters Scrap",
          owner: "Amit Singh",
          phone: "+91 76543 21098",
          email: "amit@metalmasters.com",
          area: "Area 3",
          city: "Mumbai",
          address: "789 Metal Road, Area 3, Mumbai",
          services: ["Metal Scrap", "Industrial Waste", "Construction Debris", "Vehicle Scrap"],
          specialties: ["Iron", "Steel", "Aluminum", "Copper", "Brass"],
          rating: 4.9,
          logo: "🔧",
          workingHours: "6:00 AM - 9:00 PM",
          establishedYear: 2012,
          pickupAvailable: true,
          minimumQuantity: "10 kg"
        },
        {
          id: 4,
          name: "Paper & Plastic Hub",
          owner: "Priya Sharma",
          phone: "+91 65432 10987",
          email: "priya@paperplastic.com",
          area: "Area 4",
          city: "Mumbai",
          address: "321 Paper Street, Area 4, Mumbai",
          services: ["Paper Recycling", "Plastic Processing", "Cardboard Collection", "Office Cleanup"],
          specialties: ["Office Paper", "Newspapers", "Plastic Bottles", "Packaging Material"],
          rating: 4.6,
          logo: "📄",
          workingHours: "9:00 AM - 6:00 PM",
          establishedYear: 2020,
          pickupAvailable: false,
          minimumQuantity: "2 kg"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = scrapShops;

    if (selectedArea !== "all") {
      filtered = filtered.filter(shop => shop.area === selectedArea);
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter(shop => shop.city === selectedCity);
    }

    setFilteredShops(filtered);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scrap shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">♻️ Scrap Shops Directory</h1>
          <p className="text-orange-100">Find local scrap dealers (Kabadiwalas) in your area for selling recyclable materials</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            Found {filteredShops.length} scrap shop{filteredShops.length !== 1 ? 's' : ''} 
            {selectedArea !== "all" && ` in ${selectedArea}`}
            {selectedCity !== "all" && `, ${selectedCity}`}
          </p>
        </div>

        {/* Scrap Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <div key={shop.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                  {shop.logo}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{shop.name}</h3>
                  <p className="text-gray-600">Owner: {shop.owner}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{shop.rating}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📍</span>
                  <span className="text-sm text-gray-700">{shop.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📞</span>
                  <span className="text-sm text-gray-700">{shop.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">⏰</span>
                  <span className="text-sm text-gray-700">{shop.workingHours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📦</span>
                  <span className="text-sm text-gray-700">Min. Quantity: {shop.minimumQuantity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">🚚</span>
                  <span className="text-sm text-gray-700">
                    {shop.pickupAvailable ? "Home Pickup Available" : "Visit Shop Only"}
                  </span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Services:</h4>
                <div className="flex flex-wrap gap-2">
                  {shop.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {shop.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCall(shop.phone)}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  📞 Call
                </button>
                <button
                  onClick={() => handleEmail(shop.email)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  📧 Email
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Est. {shop.establishedYear}</span>
                  <span>{shop.area}, {shop.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">♻️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No scrap shops found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new listings.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Why Sell to Scrap Shops?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-semibold text-gray-800 mb-2">Earn Money</h4>
              <p className="text-sm text-gray-600">Get paid for your recyclable materials instead of throwing them away</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">♻️</div>
              <h4 className="font-semibold text-gray-800 mb-2">Recycling</h4>
              <p className="text-sm text-gray-600">Contribute to the circular economy by giving materials a second life</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h4 className="font-semibold text-gray-800 mb-2">Environment</h4>
              <p className="text-sm text-gray-600">Reduce waste in landfills and conserve natural resources</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏠</div>
              <h4 className="font-semibold text-gray-800 mb-2">Convenience</h4>
              <p className="text-sm text-gray-600">Many shops offer home pickup services for your convenience</p>
            </div>
          </div>
        </div>

        {/* Price Guide */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Approximate Price Guide (per kg)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Newspaper</div>
              <div className="text-green-600">₹8-12</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Plastic Bottles</div>
              <div className="text-green-600">₹15-25</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Aluminum Cans</div>
              <div className="text-green-600">₹80-120</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Copper Wire</div>
              <div className="text-green-600">₹400-600</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            *Prices may vary based on market conditions and shop location
          </p>
        </div>
      </div>
    </div>
  );
}
