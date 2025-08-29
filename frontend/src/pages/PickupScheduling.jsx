import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Package, AlertCircle, CheckCircle, XCircle, Leaf } from 'lucide-react';
import axios from 'axios';

const PickupScheduling = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
    materials: [],
    quantity: 'Medium',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [pickupId, setPickupId] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  // Available recyclable materials
  const availableMaterials = [
    'Paper & Cardboard',
    'Plastic Bottles & Containers',
    'Glass Bottles & Jars',
    'Metal Cans & Scrap',
    'Electronics & E-waste',
    'Textiles & Clothing',
    'Organic Waste',
    'Batteries',
    'Light Bulbs',
    'Other'
  ];

  // Time slots
  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  // Get current date and minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30); // Allow scheduling up to 30 days in advance

  useEffect(() => {
    // Get user's location if they allow it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.log('Location access denied or error:', error);
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialToggle = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address || formData.materials.length === 0 || !formData.preferredDate || !formData.preferredTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.materials.length === 0) {
      setError('Please select at least one recyclable material');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/pickup/request', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setPickupId(response.data.pickupId);
        setSubmittedData({...formData}); // Store the submitted data
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          latitude: '',
          longitude: '',
          materials: [],
          quantity: 'Medium',
          preferredDate: '',
          preferredTime: '',
          specialInstructions: ''
        });
      } else {
        setError(response.data.message || 'Failed to create pickup request');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setPickupId('');
    setSubmittedData(null);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Pickup Request Submitted!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for contributing to a greener environment!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-3">
                Your Pickup Request Details
              </h2>
              <div className="text-left space-y-2">
                <p><span className="font-medium">Request ID:</span> <span className="font-mono text-green-600">{pickupId}</span></p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Pending</span></p>
                <p><span className="font-medium">Name:</span> {submittedData?.name || 'N/A'}</p>
                <p><span className="font-medium">Phone:</span> {submittedData?.phone || 'N/A'}</p>
                <p><span className="font-medium">Address:</span> {submittedData?.address || 'N/A'}</p>
                <p><span className="font-medium">Preferred Date:</span> {submittedData?.preferredDate || 'N/A'}</p>
                <p><span className="font-medium">Preferred Time:</span> {submittedData?.preferredTime || 'N/A'}</p>
                <p><span className="font-medium">Materials:</span> {submittedData?.materials?.join(', ') || 'N/A'}</p>
                <p><span className="font-medium">Quantity:</span> {submittedData?.quantity || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                We'll review your request and contact you within 24 hours to confirm the pickup schedule.
              </p>
              <button
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-300"
              >
                Schedule Another Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-2xl">
              <Package className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">♻️</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            🌱 Schedule Recycling Pickup
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Join EcoSarthi in creating a sustainable future by scheduling pickup of your recyclable materials. 
            Our team will collect and ensure proper recycling of your waste for a greener tomorrow.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Quick & Easy • 24/7 Support • Eco-Friendly
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              📋 Pickup Request Form
            </h2>
            <p className="text-gray-600">Fill in the details below to schedule your recycling pickup</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <select
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="Small">Small (1-2 bags)</option>
                  <option value="Medium">Medium (3-5 bags)</option>
                  <option value="Large">Large (6+ bags)</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your complete address including landmarks"
                  required
                />
              </div>
            </div>

            {/* Recyclable Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Recyclable Materials <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableMaterials.map((material) => (
                  <label
                    key={material}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.materials.includes(material)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.materials.includes(material)}
                      onChange={() => handleMaterialToggle(material)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={today}
                    max={maxDate.toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select preferred time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Any special instructions for pickup (e.g., gate code, access instructions, etc.)"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto px-12 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scheduling Pickup...
                  </div>
                ) : (
                  'Schedule Pickup Request'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-3xl shadow-2xl p-8 border border-emerald-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              🌍 Why Choose EcoSarthi for Recycling?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to making recycling convenient, efficient, and impactful for everyone
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <Package className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs">🚚</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Convenient Collection</h3>
              <p className="text-gray-600 leading-relaxed">We come to your doorstep at your preferred time to collect recyclable materials.</p>
            </div>
            <div className="group text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <CheckCircle className="w-10 h-10 text-teal-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs">✅</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Proper Recycling</h3>
              <p className="text-gray-600 leading-relaxed">We ensure all materials are properly sorted and sent to authorized recycling facilities.</p>
            </div>
            <div className="group text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <Leaf className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs">🌱</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Environmental Impact</h3>
              <p className="text-gray-600 leading-relaxed">Reduce landfill waste and contribute to a cleaner, more sustainable environment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupScheduling;
