import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Search, 
  Plus, 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import CompanyCreation from "../../components/CompanyCreation";

const ClientMasterCreation = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/project/companies");
      const data = Array.isArray(response.data) ? response.data : [];
      
      // Sort clients by creation date (newest first)
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Descending order
      });
      
      setClients(sortedData);
      setFilteredClients(sortedData);
      setCurrentPage(1); // Reset to first page when data is fetched
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to load clients. Please try again.");
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.spoc_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.spoc_contact_no.includes(searchQuery)
    );
    setFilteredClients(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, clients]);

  const handleCompanyCreated = () => {
    fetchClients();
    setShowCompanyModal(false);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Client created successfully!",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: "#ecfdf5",
      iconColor: "#10b981",
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedId(null); // Close any expanded rows when changing pages
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Master Client Creation
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage and organize your client database
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCompanyModal(true)}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 font-medium"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              Create Client
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by company, SPOC, address, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base bg-slate-50 hover:bg-white transition-all duration-200 placeholder-slate-500"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
                  {filteredClients.length} results
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {loading && (
            <div className="flex flex-col justify-center items-center h-96 p-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 animate-pulse"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium">Loading clients...</p>
            </div>
          )}

          {error && (
            <div className="m-6 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && filteredClients.length === 0 && (
            <div className="flex flex-col justify-center items-center h-96 p-8">
              <div className="p-4 bg-slate-100 rounded-2xl mb-4">
                <Building2 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-slate-800 font-semibold text-lg mb-2">No clients found</h3>
              <p className="text-slate-600 text-center">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first client"}
              </p>
            </div>
          )}

          {!loading && !error && filteredClients.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FileText size={14} />
                          ID
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} />
                          Company
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          Address
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          SPOC Name
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          Contact
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentClients.map((client, index) => (
                      <React.Fragment key={client.company_id}>
                        <tr 
                          className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                          onClick={() => toggleExpand(client.company_id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                {client.company_id}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900 text-sm">
                              {client.company_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-600 text-sm max-w-xs truncate">
                              {client.address}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-900 font-medium text-sm">
                              {client.spoc_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-600 text-sm font-mono">
                              {client.spoc_contact_no}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                              {expandedId === client.company_id ? (
                                <ChevronUp size={16} className="text-slate-500" />
                              ) : (
                                <ChevronDown size={16} className="text-slate-500" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedId === client.company_id && (
                          <tr>
                            <td colSpan="6" className="px-6 py-0">
                              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-500 p-6 mx-6 my-4 rounded-xl shadow-inner">
                                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                  <FileText size={16} />
                                  Additional Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                                      GST Number
                                    </div>
                                    <div className="text-slate-800 font-mono text-sm">
                                      {client.gst_number || "N/A"}
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                                      Vendor Code
                                    </div>
                                    <div className="text-slate-800 font-mono text-sm">
                                      {client.vendor_code || "N/A"}
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                                      City
                                    </div>
                                    <div className="text-slate-800 text-sm">
                                      {client.city_name || "N/A"}
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                                      State
                                    </div>
                                    <div className="text-slate-800 text-sm">
                                      {client.state_name || "N/A"}
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                                      Pincode
                                    </div>
                                    <div className="text-slate-800 font-mono text-sm">
                                      {client.pincode || "N/A"}
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1 flex items-center gap-1">
                                      <Calendar size={12} />
                                      Created At
                                    </div>
                                    <div className="text-slate-800 text-xs">
                                      {formatDate(client.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>
                        Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{' '}
                        <span className="font-semibold text-slate-800">{Math.min(endIndex, filteredClients.length)}</span> of{' '}
                        <span className="font-semibold text-slate-800">{filteredClients.length}</span> results
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-all duration-200 flex items-center gap-1 ${
                          currentPage === 1
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <ChevronLeft size={16} />
                        <span className="text-sm">Previous</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-all duration-200 flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-sm">Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Statistics Footer */}
        {!loading && !error && filteredClients.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Total Clients: <span className="font-semibold text-slate-800">{clients.length}</span></span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Filtered Results: <span className="font-semibold text-slate-800">{filteredClients.length}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showCompanyModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowCompanyModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create Client Modal"
        >
          <div
            className="w-full max-w-[90%] sm:max-w-md md:max-w-lg transform transition-all duration-300 animate-slide-in-up bg-white rounded-2xl shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <CompanyCreation 
              onCompanyCreated={handleCompanyCreated} 
              onClose={() => setShowCompanyModal(false)} 
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ClientMasterCreation;
