// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2, Package, FileText, X } from "lucide-react";
// import DispatchReport from "../../components/DispatchReport";
// // import DispatchReport from "./DispatchReport";

// const DispatchedMaterials = () => {
//   const [companies, setCompanies] = useState([]);
//   const [allProjects, setAllProjects] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [workDescriptions, setWorkDescriptions] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [selectedWorkDescription, setSelectedWorkDescription] = useState("");
//   const [dispatchedMaterials, setDispatchedMaterials] = useState([]);
//   const [loading, setLoading] = useState({
//     companies: false,
//     projects: false,
//     sites: false,
//     workDescriptions: false,
//     materials: false,
//   });
//   const [error, setError] = useState(null);
//   const [commonDispatchDetails, setCommonDispatchDetails] = useState({
//     dc_no: "",
//     dispatch_date: "",
//     order_no: "",
//     vendor_code: "",
//     gst_number: "",
//     order_date: "",
//     destination: "",
//     travel_expense: "",
//     vehicle_number: "",
//     driver_name: "",
//     driver_mobile: "",
//   });
//   const [showDispatchReport, setShowDispatchReport] = useState(false);

//   // Fetch companies
//   const fetchCompanies = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, companies: true }));
//       const response = await axios.get("http://localhost:5000/project/companies");
//       setCompanies(response.data || []);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setError("Failed to load companies. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, companies: false }));
//     }
//   };

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, projects: true }));
//       const response = await axios.get("http://localhost:5000/project/projects-with-sites");
//       setAllProjects(response.data || []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to load projects. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, projects: false }));
//     }
//   };

//   // Fetch sites based on selected project
//   const fetchSites = async (pd_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, sites: true }));
//       const selectedProj = allProjects.find((project) => project.project_id === pd_id);
//       const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
//       setSites(projectSites);
//     } catch (error) {
//       console.error("Error fetching sites:", error);
//       setError("Failed to load sites. Please try again.");
//       setSites([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, sites: false }));
//     }
//   };

//   // Fetch work descriptions based on selected site
//   const fetchWorkDescriptions = async (site_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, workDescriptions: true }));
//       const response = await axios.get("http://localhost:5000/material/work-descriptions", {
//         params: { site_id },
//       });
//       setWorkDescriptions(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching work descriptions:", error);
//       setError("Failed to load work descriptions. Please try again.");
//       setWorkDescriptions([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, workDescriptions: false }));
//     }
//   };

//   // Fetch dispatched materials for selected project, site, and work description
//   const fetchDispatchedMaterials = async () => {
//     if (!selectedProject || !selectedSite || !selectedWorkDescription) return;
//     try {
//       setLoading((prev) => ({ ...prev, materials: true }));
//       setError(null);
//       const response = await axios.get("http://localhost:5000/material/dispatch-details", {
//         params: { pd_id: selectedProject, site_id: selectedSite, desc_id: selectedWorkDescription },
//       });
//       const materials = response.data.data || [];
//       setDispatchedMaterials(materials);

//       // Set common dispatch details from the first record
//       if (materials.length > 0) {
//         const firstMaterial = materials[0];
//         setCommonDispatchDetails({
//           dc_no: firstMaterial.dc_no || "N/A",
//           dispatch_date: firstMaterial.dispatch_date
//             ? new Date(firstMaterial.dispatch_date).toLocaleDateString("en-US", { dateStyle: "medium" })
//             : "N/A",
//           order_no: firstMaterial.order_no || "N/A",
//           vendor_code: firstMaterial.vendor_code || "N/A",
//           gst_number: firstMaterial.gst_number || "N/A",
//           order_date: firstMaterial.order_date
//             ? new Date(firstMaterial.order_date).toLocaleDateString("en-US", { dateStyle: "medium" })
//             : "N/A",
//           destination: firstMaterial.transport_details?.destination || "N/A",
//           travel_expense: firstMaterial.transport_details?.travel_expense
//             ? firstMaterial.transport_details.travel_expense.toLocaleString()
//             : "N/A",
//           vehicle_number: firstMaterial.transport_details?.vehicle?.vehicle_number || "N/A",
//           driver_name: firstMaterial.transport_details?.driver?.driver_name || "N/A",
//           driver_mobile: firstMaterial.transport_details?.driver?.driver_mobile || "N/A",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching dispatched materials:", error);
//       setError(
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to load dispatched materials. Please try again."
//       );
//     } finally {
//       setLoading((prev) => ({ ...prev, materials: false }));
//     }
//   };

//   // Handle company selection
//   const handleCompanyChange = (e) => {
//     const company_id = e.target.value;
//     setSelectedCompany(company_id);
//     setSelectedProject("");
//     setSelectedSite("");
//     setSelectedWorkDescription("");
//     setSites([]);
//     setWorkDescriptions([]);
//     setDispatchedMaterials([]);
//     setCommonDispatchDetails({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: "",
//       gst_number: "",
//       order_date: "",
//       destination: "",
//       travel_expense: "",
//       vehicle_number: "",
//       driver_name: "",
//       driver_mobile: "",
//     });
//     setError(null);
//     setShowDispatchReport(false);
//   };

//   // Handle project selection
//   const handleProjectChange = async (e) => {
//     const pd_id = e.target.value;
//     setSelectedProject(pd_id);
//     setSelectedSite("");
//     setSelectedWorkDescription("");
//     setSites([]);
//     setWorkDescriptions([]);
//     setDispatchedMaterials([]);
//     setCommonDispatchDetails({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: "",
//       gst_number: "",
//       order_date: "",
//       destination: "",
//       travel_expense: "",
//       vehicle_number: "",
//       driver_name: "",
//       driver_mobile: "",
//     });
//     setError(null);
//     setShowDispatchReport(false);
//     if (pd_id) {
//       await fetchSites(pd_id);
//     }
//   };

//   // Handle site selection
//   const handleSiteChange = async (e) => {
//     const site_id = e.target.value;
//     setSelectedSite(site_id);
//     setSelectedWorkDescription("");
//     setWorkDescriptions([]);
//     setDispatchedMaterials([]);
//     setCommonDispatchDetails({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: "",
//       gst_number: "",
//       order_date: "",
//       destination: "",
//       travel_expense: "",
//       vehicle_number: "",
//       driver_name: "",
//       driver_mobile: "",
//     });
//     setError(null);
//     setShowDispatchReport(false);
//     if (site_id) {
//       await fetchWorkDescriptions(site_id);
//     }
//   };

//   // Handle work description selection
//   const handleWorkDescriptionChange = (e) => {
//     setSelectedWorkDescription(e.target.value);
//     setDispatchedMaterials([]);
//     setCommonDispatchDetails({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: "",
//       gst_number: "",
//       order_date: "",
//       destination: "",
//       travel_expense: "",
//       vehicle_number: "",
//       driver_name: "",
//       driver_mobile: "",
//     });
//     setError(null);
//     setShowDispatchReport(false);
//   };

//   // Toggle Dispatch Report visibility
//   const handleViewDC = () => {
//     setShowDispatchReport(true);
//   };

//   // Helper function to format component ratios
//   const formatComponentRatios = (comp_ratio_a, comp_ratio_b, comp_ratio_c) => {
//     const ratios = [comp_ratio_a, comp_ratio_b];
//     if (comp_ratio_c !== null) {
//       ratios.push(comp_ratio_c);
//     }
//     return ` (${ratios.join(':')})`;
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       const filteredProjects = allProjects.filter((project) => project.company_id === selectedCompany);
//       setProjects(filteredProjects);
//       if (!filteredProjects.some((project) => project.project_id === selectedProject)) {
//         setSelectedProject("");
//         setSites([]);
//         setSelectedSite("");
//         setWorkDescriptions([]);
//         setSelectedWorkDescription("");
//       }
//     } else {
//       setProjects([]);
//       setSelectedProject("");
//       setSites([]);
//       setSelectedSite("");
//       setWorkDescriptions([]);
//       setSelectedWorkDescription("");
//     }
//   }, [selectedCompany, allProjects]);

//   useEffect(() => {
//     if (selectedProject && selectedSite && selectedWorkDescription) {
//       fetchDispatchedMaterials();
//     }
//   }, [selectedProject, selectedSite, selectedWorkDescription]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//             <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
//             Dispatched Materials
//           </h2>
//           <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
//             View details of materials dispatched to your project sites
//           </p>
//         </div>

//         {/* Company, Project, Site, and Work Description Selection */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-lg">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Company</label>
//             <select
//               value={selectedCompany}
//               onChange={handleCompanyChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.companies}
//             >
//               <option value="">Select Company</option>
//               {companies.map((company) => (
//                 <option key={company.company_id} value={company.company_id}>
//                   {company.company_name || "Unknown Company"}
//                 </option>
//               ))}
//             </select>
//             {loading.companies && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Cost Center</label>
//             <select
//               value={selectedProject}
//               onChange={handleProjectChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
//               disabled={loading.projects || !selectedCompany}
//             >
//               <option value="">Select Cost Center</option>
//               {projects.map((project) => (
//                 <option key={project.project_id} value={project.project_id}>
//                   {project.project_name || "Unknown Project"}
//                 </option>
//               ))}
//             </select>
//             {loading.projects && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Site</label>
//             <select
//               value={selectedSite}
//               onChange={handleSiteChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
//               disabled={!selectedProject || loading.sites}
//             >
//               <option value="">Select Site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {`${site.site_name || "Unknown Site"} (PO: ${site.po_number || "N/A"})`}
//                 </option>
//               ))}
//             </select>
//             {loading.sites && selectedProject && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">Select Work Description</label>
//             <select
//               value={selectedWorkDescription}
//               onChange={handleWorkDescriptionChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
//               disabled={!selectedSite || loading.workDescriptions}
//             >
//               <option value="">Select Work Description</option>
//               {workDescriptions.map((desc) => (
//                 <option key={desc.desc_id} value={desc.desc_id}>
//                   {desc.desc_name || "Unknown Description"}
//                 </option>
//               ))}
//             </select>
//             {loading.workDescriptions && selectedSite && (
//               <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//             )}
//           </div>
//         </div>

//         {/* View DC Button */}
//         {dispatchedMaterials.length > 0 && (
//           <div className="mb-6 text-right">
//             <button
//               onClick={handleViewDC}
//               className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
//             >
//               View DC
//             </button>
//           </div>
//         )}

//         {/* Common Dispatch Details */}
//         {dispatchedMaterials.length > 0 && (
//           <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <p className="text-xs font-medium text-gray-600">DC No</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.dc_no}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Dispatch Date</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.dispatch_date}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Order No</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.order_no}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Vendor Code / GSTIN</p>
//                 <p className="text-sm text-gray-900">
//                   {commonDispatchDetails.vendor_code} {commonDispatchDetails.gst_number !== "N/A" ? `/ ${commonDispatchDetails.gst_number}` : ""}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Order Date</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.order_date}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Destination</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.destination}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Travel Expense</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.travel_expense}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Vehicle Number</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.vehicle_number}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Driver Name</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.driver_name}</p>
//               </div>
//               <div>
//                 <p className="text-xs font-medium text-gray-600">Driver Mobile</p>
//                 <p className="text-sm text-gray-900">{commonDispatchDetails.driver_mobile}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
//             <div className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
//               <span>{error}</span>
//             </div>
//             <button
//               onClick={() => setError(null)}
//               className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
//               aria-label="Close error message"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading.materials ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
//               <p className="text-gray-600 text-lg font-medium">Loading dispatched materials...</p>
//             </div>
//           </div>
//         ) : !selectedCompany || !selectedProject || !selectedSite || !selectedWorkDescription ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">Please select a company, project, site, and work description.</p>
//           </div>
//         ) : dispatchedMaterials.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">No dispatched materials found for this project, site, and work description.</p>
//             <p className="text-gray-500 mt-2">Dispatch materials to this project, site, and work description to see them listed here.</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         #
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Material Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Quantity & UOM
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Dispatched Quantities
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
//                         Remarks
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {dispatchedMaterials.map((dispatch, index) => (
//                       <tr
//                         key={dispatch.id}
//                         className="hover:bg-teal-50 transition-colors duration-200"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <p className="font-medium">
//                             {dispatch.item_name || "N/A"}{formatComponentRatios(dispatch.comp_ratio_a, dispatch.comp_ratio_b, dispatch.comp_ratio_c)}
//                           </p>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <p>
//                             {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"} {dispatch.uom_name || ""}
//                           </p>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-1">
//                             {dispatch.comp_a_qty !== null && (
//                               <p className="text-sm">
//                                 Component A: {dispatch.comp_a_qty}
//                               </p>
//                             )}
//                             {dispatch.comp_b_qty !== null && (
//                               <p className="text-sm">
//                                 Component B: {dispatch.comp_b_qty}
//                               </p>
//                             )}
//                             {dispatch.comp_c_qty !== null && (
//                               <p className="text-sm">
//                                 Component C: {dispatch.comp_c_qty}
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <div className="space-y-1">
//                             {dispatch.comp_a_remarks && (
//                               <p className="text-sm">
//                                 <span className="font-medium">A:</span> {dispatch.comp_a_remarks}
//                               </p>
//                             )}
//                             {dispatch.comp_b_remarks && (
//                               <p className="text-sm">
//                                 <span className="font-medium">B:</span> {dispatch.comp_b_remarks}
//                               </p>
//                             )}
//                             {dispatch.comp_c_remarks && (
//                               <p className="text-sm">
//                                 <span className="font-medium">C:</span> {dispatch.comp_c_remarks}
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-6">
//               {dispatchedMaterials.map((dispatch, index) => (
//                 <div
//                   key={dispatch.id}
//                   className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
//                 >
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Material Name</p>
//                       <p className="text-sm text-gray-600">
//                         {dispatch.item_name || "N/A"}{formatComponentRatios(dispatch.comp_ratio_a, dispatch.comp_ratio_b, dispatch.comp_ratio_c)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
//                       <p className="text-sm text-gray-600">
//                         {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"} {dispatch.uom_name || ""}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Dispatched Quantities</p>
//                       <div className="space-y-1">
//                         {dispatch.comp_a_qty !== null && (
//                           <p className="text-sm text-gray-600">
//                             Component A: {dispatch.comp_a_qty}
//                           </p>
//                         )}
//                         {dispatch.comp_b_qty !== null && (
//                           <p className="text-sm text-gray-600">
//                             Component B: {dispatch.comp_b_qty}
//                           </p>
//                         )}
//                         {dispatch.comp_c_qty !== null && (
//                           <p className="text-sm text-gray-600">
//                             Component C: {dispatch.comp_c_qty}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Remarks</p>
//                       <div className="space-y-1">
//                         {dispatch.comp_a_remarks && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">A:</span> {dispatch.comp_a_remarks}
//                           </p>
//                         )}
//                         {dispatch.comp_b_remarks && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">B:</span> {dispatch.comp_b_remarks}
//                           </p>
//                         )}
//                         {dispatch.comp_c_remarks && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">C:</span> {dispatch.comp_c_remarks}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Dispatch Report */}
//             {showDispatchReport && (
//               <DispatchReport
//                 commonDispatchDetails={commonDispatchDetails}
//                 dispatchedMaterials={dispatchedMaterials}
//               />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DispatchedMaterials;













import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Package, FileText, X } from "lucide-react";
import DispatchReport from "../../components/DispatchReport";

const DispatchedMaterials = () => {
  const [companies, setCompanies] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWorkDescription, setSelectedWorkDescription] = useState("");
  const [dispatchedMaterials, setDispatchedMaterials] = useState([]);
  const [loading, setLoading] = useState({
    companies: false,
    projects: false,
    sites: false,
    workDescriptions: false,
    materials: false,
  });
  const [error, setError] = useState(null);
  const [commonDispatchDetails, setCommonDispatchDetails] = useState({
    dc_no: "",
    dispatch_date: "",
    order_no: "",
    vendor_code: "",
    gst_number: "",
    order_date: "",
    destination: "",
    travel_expense: "",
    vehicle_number: "",
    driver_name: "",
    driver_mobile: "",
  });
  const [showDispatchReport, setShowDispatchReport] = useState(false);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading((prev) => ({ ...prev, companies: true }));
      const response = await axios.get("http://localhost:5000/project/companies");
      setCompanies(response.data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, companies: false }));
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://localhost:5000/project/projects-with-sites");
      setAllProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Fetch sites based on selected project
  const fetchSites = async (pd_id) => {
    try {
      setLoading((prev) => ({ ...prev, sites: true }));
      const selectedProj = allProjects.find((project) => project.project_id === pd_id);
      const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
      setSites(projectSites);
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load sites. Please try again.");
      setSites([]);
    } finally {
      setLoading((prev) => ({ ...prev, sites: false }));
    }
  };

  // Fetch work descriptions based on selected site
  const fetchWorkDescriptions = async (site_id) => {
    try {
      setLoading((prev) => ({ ...prev, workDescriptions: true }));
      const response = await axios.get("http://localhost:5000/material/work-descriptions", {
        params: { site_id },
      });
      setWorkDescriptions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching work descriptions:", error);
      setError("Failed to load work descriptions. Please try again.");
      setWorkDescriptions([]);
    } finally {
      setLoading((prev) => ({ ...prev, workDescriptions: false }));
    }
  };

  // Fetch dispatched materials for selected project, site, and work description
  const fetchDispatchedMaterials = async () => {
    if (!selectedProject || !selectedSite || !selectedWorkDescription) return;
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      setError(null);
      const response = await axios.get("http://localhost:5000/material/dispatch-details", {
        params: { pd_id: selectedProject, site_id: selectedSite, desc_id: selectedWorkDescription },
      });
      const materials = response.data.data || [];
      setDispatchedMaterials(materials);

      // Set common dispatch details from the first record
      if (materials.length > 0) {
        const firstMaterial = materials[0];
        setCommonDispatchDetails({
          dc_no: firstMaterial.dc_no || "N/A",
          dispatch_date: firstMaterial.dispatch_date
            ? new Date(firstMaterial.dispatch_date).toLocaleDateString("en-US", { dateStyle: "medium" })
            : "N/A",
          order_no: firstMaterial.order_no || "N/A",
          vendor_code: firstMaterial.vendor_code || "N/A",
          gst_number: firstMaterial.gst_number || "N/A",
          order_date: firstMaterial.order_date
            ? new Date(firstMaterial.order_date).toLocaleDateString("en-US", { dateStyle: "medium" })
            : "N/A",
          destination: firstMaterial.transport_details?.destination || "N/A",
          travel_expense: firstMaterial.transport_details?.travel_expense
            ? firstMaterial.transport_details.travel_expense.toLocaleString()
            : "N/A",
          vehicle_number: firstMaterial.transport_details?.vehicle?.vehicle_number || "N/A",
          driver_name: firstMaterial.transport_details?.driver?.driver_name || "N/A",
          driver_mobile: firstMaterial.transport_details?.driver?.driver_mobile || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching dispatched materials:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to load dispatched materials. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Handle company selection
  const handleCompanyChange = (e) => {
    const company_id = e.target.value;
    setSelectedCompany(company_id);
    setSelectedProject("");
    setSelectedSite("");
    setSelectedWorkDescription("");
    setSites([]);
    setWorkDescriptions([]);
    setDispatchedMaterials([]);
    setCommonDispatchDetails({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: "",
      gst_number: "",
      order_date: "",
      destination: "",
      travel_expense: "",
      vehicle_number: "",
      driver_name: "",
      driver_mobile: "",
    });
    setError(null);
    setShowDispatchReport(false);
  };

  // Handle project selection
  const handleProjectChange = async (e) => {
    const pd_id = e.target.value;
    setSelectedProject(pd_id);
    setSelectedSite("");
    setSelectedWorkDescription("");
    setSites([]);
    setWorkDescriptions([]);
    setDispatchedMaterials([]);
    setCommonDispatchDetails({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: "",
      gst_number: "",
      order_date: "",
      destination: "",
      travel_expense: "",
      vehicle_number: "",
      driver_name: "",
      driver_mobile: "",
    });
    setError(null);
    setShowDispatchReport(false);
    if (pd_id) {
      await fetchSites(pd_id);
    }
  };

  // Handle site selection
  const handleSiteChange = async (e) => {
    const site_id = e.target.value;
    setSelectedSite(site_id);
    setSelectedWorkDescription("");
    setWorkDescriptions([]);
    setDispatchedMaterials([]);
    setCommonDispatchDetails({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: "",
      gst_number: "",
      order_date: "",
      destination: "",
      travel_expense: "",
      vehicle_number: "",
      driver_name: "",
      driver_mobile: "",
    });
    setError(null);
    setShowDispatchReport(false);
    if (site_id) {
      await fetchWorkDescriptions(site_id);
    }
  };

  // Handle work description selection
  const handleWorkDescriptionChange = (e) => {
    setSelectedWorkDescription(e.target.value);
    setDispatchedMaterials([]);
    setCommonDispatchDetails({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: "",
      gst_number: "",
      order_date: "",
      destination: "",
      travel_expense: "",
      vehicle_number: "",
      driver_name: "",
      driver_mobile: "",
    });
    setError(null);
    setShowDispatchReport(false);
  };

  // Toggle Dispatch Report visibility
  const handleViewDC = () => {
    setShowDispatchReport(true);
  };

  // Helper function to format component ratios
  const formatComponentRatios = (comp_ratio_a, comp_ratio_b, comp_ratio_c) => {
    const ratios = [comp_ratio_a, comp_ratio_b];
    if (comp_ratio_c !== null) {
      ratios.push(comp_ratio_c);
    }
    return ` (${ratios.join(':')})`;
  };

  // Group dispatches by material_assign_id and sort by created_at
  const groupDispatches = () => {
    const grouped = dispatchedMaterials.reduce((acc, dispatch) => {
      const key = dispatch.material_assign_id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(dispatch);
      return acc;
    }, {});

    // Sort each group by created_at
    Object.values(grouped).forEach((group) => {
      group.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    });

    return grouped;
  };

  // Format created_at as "Dispatched At"
  const formatDispatchedAt = (created_at) => {
    if (!created_at) return "N/A";
    return new Date(created_at).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchCompanies();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const filteredProjects = allProjects.filter((project) => project.company_id === selectedCompany);
      setProjects(filteredProjects);
      if (!filteredProjects.some((project) => project.project_id === selectedProject)) {
        setSelectedProject("");
        setSites([]);
        setSelectedSite("");
        setWorkDescriptions([]);
        setSelectedWorkDescription("");
      }
    } else {
      setProjects([]);
      setSelectedProject("");
      setSites([]);
      setSelectedSite("");
      setWorkDescriptions([]);
      setSelectedWorkDescription("");
    }
  }, [selectedCompany, allProjects]);

  useEffect(() => {
    if (selectedProject && selectedSite && selectedWorkDescription) {
      fetchDispatchedMaterials();
    }
  }, [selectedProject, selectedSite, selectedWorkDescription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Dispatched Materials
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            View details of materials dispatched to your project sites
          </p>
        </div>

        {/* Company, Project, Site, and Work Description Selection */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Company</label>
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.companies}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.company_name || "Unknown Company"}
                </option>
              ))}
            </select>
            {loading.companies && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Cost Center</label>
            <select
              value={selectedProject}
              onChange={handleProjectChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
              disabled={loading.projects || !selectedCompany}
            >
              <option value="">Select Cost Center</option>
              {projects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name || "Unknown Project"}
                </option>
              ))}
            </select>
            {loading.projects && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Site</label>
            <select
              value={selectedSite}
              onChange={handleSiteChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
              disabled={!selectedProject || loading.sites}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {`${site.site_name || "Unknown Site"} (PO: ${site.po_number || "N/A"})`}
                </option>
              ))}
            </select>
            {loading.sites && selectedProject && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Work Description</label>
            <select
              value={selectedWorkDescription}
              onChange={handleWorkDescriptionChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50"
              disabled={!selectedSite || loading.workDescriptions}
            >
              <option value="">Select Work Description</option>
              {workDescriptions.map((desc) => (
                <option key={desc.desc_id} value={desc.desc_id}>
                  {desc.desc_name || "Unknown Description"}
                </option>
              ))}
            </select>
            {loading.workDescriptions && selectedSite && (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
            )}
          </div>
        </div>

        {/* View DC Button */}
        {dispatchedMaterials.length > 0 && (
          <div className="mb-6 text-right">
            <button
              onClick={handleViewDC}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            >
              View DC
            </button>
          </div>
        )}

        {/* Common Dispatch Details */}
        {dispatchedMaterials.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-600">DC No</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.dc_no}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Dispatch Date</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.dispatch_date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Order No</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.order_no}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Vendor Code / GSTIN</p>
                <p className="text-sm text-gray-900">
                  {commonDispatchDetails.vendor_code} {commonDispatchDetails.gst_number !== "N/A" ? `/ ${commonDispatchDetails.gst_number}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Order Date</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.order_date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Destination</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.destination}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Travel Expense</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.travel_expense}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Vehicle Number</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.vehicle_number}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Driver Name</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.driver_name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Driver Mobile</p>
                <p className="text-sm text-gray-900">{commonDispatchDetails.driver_mobile}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
              aria-label="Close error message"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading.materials ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">Loading dispatched materials...</p>
            </div>
          </div>
        ) : !selectedCompany || !selectedProject || !selectedSite || !selectedWorkDescription ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">Please select a company, project, site, and work description.</p>
          </div>
        ) : dispatchedMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">No dispatched materials found for this project, site, and work description.</p>
            <p className="text-gray-500 mt-2">Dispatch materials to this project, site, and work description to see them listed here.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              {Object.entries(groupDispatches()).map(([material_assign_id, dispatches]) => (
                <div key={material_assign_id} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-6 py-4 bg-gray-50 text-sm font-medium text-gray-700">
                    Material Assignment ID: {material_assign_id}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                            Dispatch
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                            Material Name
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                            Dispatched At
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                            Quantity & UOM
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                            Dispatched Quantities
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dispatches.map((dispatch, index) => (
                          <tr
                            key={`${dispatch.material_assign_id}-${dispatch.created_at}`}
                            className="hover:bg-teal-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dispatches.length > 1 ? `Dispatch ${index + 1}` : "Dispatch"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <p className="font-medium">
                                {dispatch.item_name || "N/A"}
                                {formatComponentRatios(
                                  dispatch.comp_ratio_a,
                                  dispatch.comp_ratio_b,
                                  dispatch.comp_ratio_c
                                )}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDispatchedAt(dispatch.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <p>
                                {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"}{" "}
                                {dispatch.uom_name || ""}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div className="space-y-4">
                                {dispatch.comp_a_qty !== null && (
                                  <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-700">Component A:</label>
                                    <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">
                                      {dispatch.comp_a_qty}
                                    </span>
                                  </div>
                                )}
                                {dispatch.comp_b_qty !== null && (
                                  <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-700">Component B:</label>
                                    <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">
                                      {dispatch.comp_b_qty}
                                    </span>
                                  </div>
                                )}
                                {dispatch.comp_c_qty !== null && (
                                  <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-700">Component C:</label>
                                    <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">
                                      {dispatch.comp_c_qty}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div className="space-y-4">
                                {dispatch.comp_a_remarks && (
                                  <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-700">A:</label>
                                    <span className="text-sm">{dispatch.comp_a_remarks}</span>
                                  </div>
                                )}
                                {dispatch.comp_b_remarks && (
                                  <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-700">B:</label>
                                    <span className="text-sm">{dispatch.comp_b_remarks}</span>
                                  </div>
                                )}
                                {dispatch.comp_c_remarks && (
                                  <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-700">C:</label>
                                    <span className="text-sm">{dispatch.comp_c_remarks}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6 mb-6">
              {Object.entries(groupDispatches()).map(([material_assign_id, dispatches]) => (
                <div key={material_assign_id} className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="px-5 py-4 bg-gray-50 text-sm font-medium text-gray-700">
                    Material Assignment ID: {material_assign_id}
                  </div>
                  {dispatches.map((dispatch, index) => (
                    <div
                      key={`${dispatch.material_assign_id}-${dispatch.created_at}`}
                      className="p-5 space-y-6 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {dispatches.length > 1 ? `Dispatch ${index + 1}` : "Dispatch"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Material Name</p>
                        <p className="text-sm text-gray-600">
                          {dispatch.item_name || "N/A"}
                          {formatComponentRatios(
                            dispatch.comp_ratio_a,
                            dispatch.comp_ratio_b,
                            dispatch.comp_ratio_c
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dispatched At</p>
                        <p className="text-sm text-gray-600">{formatDispatchedAt(dispatch.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Quantity & UOM</p>
                        <p className="text-sm text-gray-600">
                          {dispatch.dispatch_qty || dispatch.assigned_quantity || "0"}{" "}
                          {dispatch.uom_name || ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dispatched Quantities</p>
                        <div className="space-y-4 mt-2">
                          {dispatch.comp_a_qty !== null && (
                            <div className="flex items-center gap-4">
                              <label className="w-24 text-sm font-medium text-gray-700">Component A:</label>
                              <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">
                                {dispatch.comp_a_qty}
                              </span>
                            </div>
                          )}
                          {dispatch.comp_b_qty !== null && (
                            <div className="flex items-center gap-4">
                              <label className="w-24 text-sm font-medium text-gray-700">Component B:</label>
                              <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">
                                {dispatch.comp_b_qty}
                              </span>
                            </div>
                          )}
                          {dispatch.comp_c_qty !== null && (
                            <div className="flex items-center gap-4">
                              <label className="w-24 text-sm font-medium text-gray-700">Component C:</label>
                              <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">
                                {dispatch.comp_c_qty}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Remarks</p>
                        <div className="space-y-4 mt-2">
                          {dispatch.comp_a_remarks && (
                            <div className="flex items-center gap-4">
                              <label className="w-24 text-sm font-medium text-gray-700">A:</label>
                              <span className="text-sm text-gray-600">{dispatch.comp_a_remarks}</span>
                            </div>
                          )}
                          {dispatch.comp_b_remarks && (
                            <div className="flex items-center gap-4">
                              <label className="w-24 text-sm font-medium text-gray-700">B:</label>
                              <span className="text-sm text-gray-600">{dispatch.comp_b_remarks}</span>
                            </div>
                          )}
                          {dispatch.comp_c_remarks && (
                            <div className="flex items-center gap-4">
                              <label className="w-24 text-sm font-medium text-gray-700">C:</label>
                              <span className="text-sm text-gray-600">{dispatch.comp_c_remarks}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Dispatch Report */}
            {showDispatchReport && (
              <DispatchReport
                commonDispatchDetails={commonDispatchDetails}
                dispatchedMaterials={dispatchedMaterials}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DispatchedMaterials;