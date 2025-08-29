import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, Clock, User, MapPin, Package, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const PickupManagement = () => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchPickupRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        status: statusFilter !== "All" ? statusFilter : "All",
        date: dateFilter !== "All" ? dateFilter : "All"
      });

      const res = await axios.get(`/api/pickup/requests?${params}`);
      if (res.data.success) {
        setPickupRequests(res.data.data);
        setFilteredRequests(res.data.data);
        setTotalPages(res.data.pagination.pages);
      } else {
        console.error(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching pickup requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/pickup/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchPickupRequests();
    fetchStats();
  }, [currentPage, statusFilter, dateFilter]);

  // Filter requests based on search
  useEffect(() => {
    let filtered = pickupRequests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, pickupRequests]);

  const updateStatus = async (requestId, newStatus, notes = "") => {
    try {
      const response = await axios.put(`/api/pickup/request/${requestId}/status`, {
        status: newStatus,
        notes: notes
      });

      if (response.data.success) {
        // Update local state
        setPickupRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
              : req
          )
        );
        
        // Refresh stats
        fetchStats();
        
        // Show success message
        setSuccessMessage(`Status updated to ${newStatus} successfully!`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // Close modal if status was updated
        if (selectedRequest?.id === requestId) {
          setShowModal(false);
          setSelectedRequest(null);
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <AlertTriangle className="w-4 h-4" />;
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString || 'Not specified';
  };

  if (loading && pickupRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 hover:text-green-800"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🌱 EcoSarthi Pickup Management</h2>
          <p className="text-gray-600">Manage recyclable material pickup requests for a sustainable future</p>
        </div>
        <button
          onClick={() => { 
            setCurrentPage(1);
            fetchPickupRequests(); 
            fetchStats(); 
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.statusCounts.pending}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Requests</p>
                <p className="text-2xl font-bold text-blue-600">{stats.timeBased.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">{stats.timeBased.thisWeek}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone, address, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
            </select>
            
            <button
              onClick={() => {
                setStatusFilter("All");
                setDateFilter("All");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Pickup Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading pickup requests...</span>
          </div>
        )}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.id}</div>
                      <div className="text-sm text-gray-500">{formatDate(request.createdAt)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.name}</div>
                      <div className="text-sm text-gray-500">{request.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {request.materials.slice(0, 2).map((material, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {material}
                        </span>
                      ))}
                      {request.materials.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{request.materials.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{request.preferredDate}</div>
                      <div className="text-sm text-gray-500">{formatTime(request.preferredTime)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
                     </table>
         </div>
       )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No Results */}
      {!loading && filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pickup requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "All" || dateFilter !== "All"
              ? "Try adjusting your search or filter criteria."
              : "There are no pickup requests at the moment."}
          </p>
        </div>
      )}

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Pickup Request Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Request ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-1">{selectedRequest.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedRequest.phone}</p>
                  </div>
                </div>

                {selectedRequest.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{selectedRequest.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Materials</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRequest.materials.map((material, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <p className="text-sm text-gray-900">{selectedRequest.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                    <p className="text-sm text-gray-900">{selectedRequest.preferredDate}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                  <p className="text-sm text-gray-900">{formatTime(selectedRequest.preferredTime)}</p>
                </div>

                {selectedRequest.specialInstructions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                    <p className="text-sm text-gray-900">{selectedRequest.specialInstructions}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedRequest.updatedAt)}</p>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedRequest.id, status)}
                        disabled={selectedRequest.status === status}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedRequest.status === status
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupManagement;
