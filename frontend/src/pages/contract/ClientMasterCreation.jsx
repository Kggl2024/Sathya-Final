import React, { useState, useEffect } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import { Search } from "lucide-react";
import CompanyCreation from "../../components/CompanyCreation";

const ClientMasterCreation = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/project/companies");
      const data = Array.isArray(response.data) ? response.data : [];
      setClients(data);
      setFilteredClients(data);
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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Client Master</h2>
        <button
          onClick={() => setShowCompanyModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Create Client Master
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company, SPOC, address, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm sm:text-base animate-pulse">
          {error}
        </div>
      )}

      {!loading && !error && filteredClients.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No clients found.
        </div>
      )}

      {!loading && !error && filteredClients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Address</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">SPOC Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">SPOC Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <React.Fragment key={client.company_id}>
                  <tr
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(client.company_id)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{client.company_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.company_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.spoc_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.spoc_contact_no}</td>
                  </tr>
                  {expandedId === client.company_id && (
                    <tr>
                      <td colSpan="5" className="px-4 py-3 bg-gray-50">
                        <div className="p-4 border border-gray-200 rounded-md">
                          <div className="flex flex-wrap gap-4 justify-start">
                            <div className="text-sm text-gray-600">
                              <strong>GST Number:</strong> {client.gst_number || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Vendor Code:</strong> {client.vendor_code || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>City:</strong> {client.city_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>State:</strong> {client.state_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Pincode:</strong> {client.pincode || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Created At:</strong> {formatDate(client.created_at)}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Updated At:</strong> {formatDate(client.updated_at)}
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
      )}

      {showCompanyModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0 animate-fade-in"
          onClick={() => setShowCompanyModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Create Client Modal"
        >
          <div
            className="w-full max-w-[90%] sm:max-w-md md:max-w-lg transform transition-all duration-300 animate-slide-in-up bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CompanyCreation onCompanyCreated={handleCompanyCreated} onClose={() => setShowCompanyModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientMasterCreation;