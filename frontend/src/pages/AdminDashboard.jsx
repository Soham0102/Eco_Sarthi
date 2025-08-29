import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, Download, RefreshCw, Calendar, Clock, User, MapPin, Building, AlertTriangle, PlusCircle, Package } from "lucide-react";
import axios from 'axios';
import CasesByDepartment from "./CasesByDepartment";
import CasesByCity from "./CasesByCity";
import MonthlyTrend from "./MonthlyTrend";
import TopCities from "./TopCities";
import PickupManagement from "../components/PickupManagement";

const toNumberOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Agar latitude 90 se bada ho (invalid) aur longitude valid range me ho,
// to assume karo values swap ho gayi thi — display ke liye correct kar do.
const normalizeLatLng = (lat, lng) => {
  const la = toNumberOrNull(lat);
  const lo = toNumberOrNull(lng);
  if (la === null || lo === null) return { lat: null, lng: null, swapped: false };
  if (Math.abs(la) > 90 && Math.abs(lo) <= 90) return { lat: lo, lng: la, swapped: true };
  return { lat: la, lng: lo, swapped: false };
};

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // New state for history toggle
  const [activeTab, setActiveTab] = useState("complaints"); // New state for tab management

  // Reverse geocoded address (modal)
  const [revAddress, setRevAddress] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/complaints");
      const data = res.data;
      if (data.success) {
        setComplaints(data.complaints);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(); // Pehli baar data fetch karein jab component load ho

    const intervalId = setInterval(() => {
        fetchComplaints(); // Har 10 second mein naya data fetch karein
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Filter complaints based on search and filters
  useEffect(() => {
    // Dynamic departments list yahaan update hogi
    const uniqueDepartments = [...new Set(complaints.map(c => c.department).filter(Boolean))];
    setDepartments(uniqueDepartments);

    let filtered = complaints;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== "All") {
      filtered = filtered.filter(c => c.department === departmentFilter);
    }

    // Date filter
    if (dateFilter !== "All") {
      const now = new Date();
      filtered = filtered.filter(c => {
        const complaintDate = new Date(c.timestamp);
        switch (dateFilter) {
          case "Today":
            return complaintDate.toDateString() === now.toDateString();
          case "This Week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return complaintDate >= weekAgo;
          case "This Month":
            return complaintDate.getMonth() === now.getMonth() &&
                   complaintDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter, departmentFilter, dateFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.post("/api/admin/update_status", { id, status: newStatus });
      const data = res.data;
      
      if (data.success) {
        setComplaints(prev =>
          prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyColor = urgency => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getPriorityIcon = urgency => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    processing: complaints.filter(c => c.status === "Processing").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    today: complaints.filter(c => {
      const today = new Date().toDateString();
      return new Date(c.timestamp).toDateString() === today;
    }).length,
    thisWeek: complaints.filter(c => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(c.timestamp) >= weekAgo;
    }).length
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Location", "Department", "Status", "Urgency", "Description", "Timestamp", "Token"];
    const csvContent = [
      headers.join(","),
      ...filteredComplaints.map(c => [
        c.id,
        c.name,
        c.location,
        c.department || "Unknown",
        c.status,
        c.urgency || "Normal",
        `"${c.description?.replace(/"/g, '""') || ''}"`,
        new Date(c.timestamp).toLocaleString(),
        c.token
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaints_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  // 👉 Selected complaint ke lat/lng ko normalize karke rakho
  const selectedLatLng = selectedComplaint
    ? normalizeLatLng(selectedComplaint.latitude, selectedComplaint.longitude)
    : { lat: null, lng: null, swapped: false };

  // 👉 Modal open hote hi reverse geocoding (OpenStreetMap/Nominatim)
  useEffect(() => {
    if (!showModal || !selectedComplaint) return;

    const { lat, lng } = selectedLatLng;
    if (lat === null || lng === null) {
      setRevAddress(null);
      setAddrError(null);
      setAddrLoading(false);
      return;
    }

    setAddrLoading(true);
    setAddrError(null);
    setRevAddress(null);

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(j => setRevAddress(j?.display_name || null))
      .catch(() => setAddrError("Address lookup failed"))
      .finally(() => setAddrLoading(false));
  }, [showModal, selectedComplaint, selectedLatLng]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🌱</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  EcoSarthi Admin Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and track all environmental services and pickup requests in your system
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab("complaints")}
              className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === "complaints"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <span>♻️</span>
              <span>Environmental Services</span>
            </button>
            <button
              onClick={() => setActiveTab("pickup")}
              className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === "pickup"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              <span>📦</span>
              <span>Pickup Management</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Complaints Tab Content */}
      {activeTab === "complaints" && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pickup Statistics Card */}
        <div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab("pickup")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pickup Requests</p>
              <p className="text-2xl font-bold text-green-600">
                <span className="text-sm">View in</span><br />
                <span className="text-lg">Pickup Tab</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No complaints found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints
                  .filter(c => c.status !== "Resolved") // Only show active complaints
                  .map((complaint) => {
                  const ll = normalizeLatLng(complaint.latitude, complaint.longitude);
                  return (
                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {complaint.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {complaint.id}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 break-words leading-relaxed max-h-20 overflow-y-auto">
                              {complaint.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {complaint.location}
                          </p>
                          {ll.lat !== null && ll.lng !== null && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Lat: {ll.lat.toFixed(5)}, Lng: {ll.lng.toFixed(5)}
                            </p>
                          )}
                          <p className="text-gray-500 flex items-center mt-1">
                            <Building className="w-4 h-4 mr-1 text-gray-400" />
                            {complaint.department || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <select
                            value={complaint.status}
                            onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(complaint.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          {complaint.urgency && (
                            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${getUrgencyColor(complaint.urgency)}`}>
                              {getPriorityIcon(complaint.urgency)}
                              <span className="ml-1">{complaint.urgency}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>{new Date(complaint.timestamp).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(complaint.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewComplaint(complaint)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showing results count */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredComplaints.length} of {complaints.length} complaints
      </div>

      {/* Analytics Graphs Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Analytics Dashboard</h3>
        
        {/* First Row - 2 Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Cases by Department</h4>
            <CasesByDepartment complaints={complaints} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Cases by City</h4>
            <CasesByCity complaints={complaints} />
          </div>
        </div>
        
        {/* Second Row - 2 Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Monthly Trend</h4>
            <MonthlyTrend complaints={complaints} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Top Cities</h4>
            <TopCities complaints={complaints} />
          </div>
        </div>
      </div>

      {/* History Section for Resolved Complaints */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Resolved Complaints History</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showHistory ? "Hide History" : "Show History"}
            <Clock className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        {showHistory && (
          <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location & Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolution Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints
                    .filter(c => c.status === "Resolved")
                    .map((complaint) => {
                      const ll = normalizeLatLng(complaint.latitude, complaint.longitude);
                      return (
                        <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-green-600" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {complaint.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {complaint.id}
                                </p>
                                <p className="text-sm text-gray-600 mt-2 break-words leading-relaxed max-h-20 overflow-y-auto">
                                  {complaint.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p className="text-gray-900 flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {complaint.location}
                              </p>
                              <p className="text-gray-500 flex items-center mt-1">
                                <Building className="w-4 h-4 mr-1 text-gray-400" />
                                {complaint.department || "Unknown"}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span>{new Date(complaint.timestamp).toLocaleDateString()}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(complaint.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => viewComplaint(complaint)}
                              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {complaints.filter(c => c.status === "Resolved").length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No resolved complaints found in history.
              </div>
            )}
          </div>
        )}
      </div>
        </>
      )}

      {/* Pickup Management Tab Content */}
      {activeTab === "pickup" && (
        <PickupManagement />
      )}

      {/* Modal for viewing complaint details */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complaint ID
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedComplaint.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedComplaint.token}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedComplaint.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedComplaint.location || "—"}
                    </p>

                    {/* Lat/Lng + Map link */}
                    {selectedLatLng.lat !== null && selectedLatLng.lng !== null && (
                      <p className="text-xs text-gray-500 mt-1">
                        Lat: {selectedLatLng.lat.toFixed(6)}, Lng: {selectedLatLng.lng.toFixed(6)}
                        <a
                          href={`https://www.google.com/maps?q=${selectedLatLng.lat},${selectedLatLng.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline ml-2"
                        >
                          View on Map
                        </a>
                      </p>
                    )}
                    {selectedLatLng.swapped && (
                      <p className="text-[10px] text-orange-500 mt-0.5">
                        Note: input looked swapped; auto-corrected for display.
                      </p>
                    )}

                    {/* Reverse geocoded address */}
                    {(selectedLatLng.lat !== null && selectedLatLng.lng !== null) && (
                      <div className="mt-2">
                        <span className="block text-xs font-medium text-gray-700 mb-1">
                          Address
                        </span>
                        {addrLoading && (
                          <span className="text-xs text-gray-400">Fetching address…</span>
                        )}
                        {!addrLoading && addrError && (
                          <span className="text-xs text-red-500">{addrError}</span>
                        )}
                        {!addrLoading && !addrError && (
                          <p className="text-xs text-gray-700">{revAddress || "—"}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedComplaint.department || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedComplaint.type || "Text"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency
                    </label>
                    <span className={`text-xs px-3 py-1 rounded-full ${getUrgencyColor(selectedComplaint.urgency)}`}>
                      {selectedComplaint.urgency || "Normal"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded min-h-[100px]">
                    {selectedComplaint.description || "No description provided"}
                  </div>
                </div>
                
                <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
               </label>
               {selectedComplaint.photoUrl ? (
              <img src={`http://localhost:5000${selectedComplaint.photoUrl}`} 

              alt="Complaint"
              className="w-full max-h-64 object-contain rounded border"
              />
              ) : (
             <p className="text-sm text-gray-500">No photo uploaded</p>
              )}
             </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timestamp
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {new Date(selectedComplaint.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;