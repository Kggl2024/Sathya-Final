import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, Trash2, Loader2, CheckCircle } from "lucide-react";
import CreatableSelect from "react-select/creatable";

const MaterialPlanning = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWorkDesc, setSelectedWorkDesc] = useState("");
  const [materialAssignments, setMaterialAssignments] = useState({});
  const [isAssigned, setIsAssigned] = useState(false);
  const [loading, setLoading] = useState({
    companies: false,
    projects: false,
    sites: false,
    materials: false,
    uoms: false,
    workDescriptions: false,
    assignedMaterials: false,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [currentDescId, setCurrentDescId] = useState(null);
  const [currentMatIndex, setCurrentMatIndex] = useState(null);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading((prev) => ({ ...prev, companies: true }));
      const response = await axios.get("http://103.118.158.127/api/project/companies");
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, companies: false }));
    }
  };

  // Fetch projects with sites
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://103.118.158.127/api/project/projects-with-sites");
      setAllProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      const response = await axios.get("http://103.118.158.127/api/material/materials");
      setMaterials(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError("Failed to load materials. Please try again.");
      setMaterials([]);
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Fetch UOMs
  const fetchUoms = async () => {
    try {
      setLoading((prev) => ({ ...prev, uoms: true }));
      const response = await axios.get("http://103.118.158.127/api/material/uom");
      setUoms(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching UOMs:", error);
      setError("Failed to load UOMs. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, uoms: false }));
    }
  };

  // Fetch work descriptions for selected site
  const fetchWorkDescriptions = async (site_id) => {
    try {
      setLoading((prev) => ({ ...prev, workDescriptions: true }));
      const response = await axios.get(`http://103.118.158.127/api/material/work-descriptions?site_id=${site_id}`);
      const descriptions = Array.isArray(response.data?.data) ? response.data.data : [];
      const uniqueDescs = Array.from(new Map(descriptions.map((desc) => [desc.desc_id, desc])).values());
      setWorkDescriptions(uniqueDescs);
      setMaterialAssignments({});
      setSelectedWorkDesc("");
      setIsAssigned(false);
    } catch (error) {
      console.error("Error fetching work descriptions:", error);
      setError("Failed to load work descriptions. Please try again.");
      setWorkDescriptions([]);
      setMaterialAssignments({});
    } finally {
      setLoading((prev) => ({ ...prev, workDescriptions: false }));
    }
  };

  // Fetch assigned materials for selected work description
  const fetchAssignedMaterials = async (site_id, desc_id) => {
    try {
      setLoading((prev) => ({ ...prev, assignedMaterials: true }));
      const response = await axios.get(`http://103.118.158.127/api/material/assigned-materials?site_id=${site_id}&desc_id=${desc_id}`);
      const assignedMaterials = Array.isArray(response.data?.data) ? response.data.data : [];
      
      if (assignedMaterials.length > 0) {
        setIsAssigned(true);
        setMaterialAssignments({
          [desc_id]: assignedMaterials.map((mat) => ({
            item_id: mat.item_id,
            uom_id: mat.uom_id?.toString() || "",
            quantity: mat.quantity?.toString() || "",
            comp_ratio_a: mat.comp_ratio_a?.toString() || "",
            comp_ratio_b: mat.comp_ratio_b?.toString() || "",
            comp_ratio_c: mat.comp_ratio_c?.toString() || "",
            rate: mat.rate?.toString() || "",
          })),
        });
      } else {
        setIsAssigned(false);
        setMaterialAssignments({
          [desc_id]: [
            {
              item_id: "",
              uom_id: "",
              quantity: "",
              comp_ratio_a: "",
              comp_ratio_b: "",
              comp_ratio_c: "",
              rate: "",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching assigned materials:", error);
      setError("Failed to load assigned materials. Please try again.");
      setMaterialAssignments({
        [desc_id]: [
          {
            item_id: "",
            uom_id: "",
            quantity: "",
            comp_ratio_a: "",
            comp_ratio_b: "",
            comp_ratio_c: "",
            rate: "",
          },
        ],
      });
      setIsAssigned(false);
    } finally {
      setLoading((prev) => ({ ...prev, assignedMaterials: false }));
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchProjects();
    fetchMaterials();
    fetchUoms();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const filteredProjects = allProjects.filter((p) => p.company_id === selectedCompany);
      setProjects(filteredProjects);
    } else {
      setProjects([]);
    }
    setSelectedProject("");
    setSelectedSite("");
    setSites([]);
    setWorkDescriptions([]);
    setSelectedWorkDesc("");
    setMaterialAssignments({});
    setIsAssigned(false);
    setError(null);
  }, [selectedCompany, allProjects]);

  useEffect(() => {
    if (selectedProject) {
      const selectedProj = allProjects.find((p) => p.project_id === selectedProject);
      const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
      setSites(projectSites);
    } else {
      setSites([]);
    }
    setSelectedSite("");
    setWorkDescriptions([]);
    setSelectedWorkDesc("");
    setMaterialAssignments({});
    setIsAssigned(false);
    setError(null);
  }, [selectedProject, allProjects]);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handleSiteChange = async (e) => {
    const site_id = e.target.value;
    setSelectedSite(site_id);
    setSelectedWorkDesc("");
    setMaterialAssignments({});
    setIsAssigned(false);
    setError(null);
    if (site_id) {
      await fetchWorkDescriptions(site_id);
    } else {
      setWorkDescriptions([]);
    }
  };

  const handleWorkDescChange = async (e) => {
    const desc_id = e.target.value;
    setSelectedWorkDesc(desc_id);
    setMaterialAssignments({});
    setIsAssigned(false);
    setError(null);
    if (desc_id) {
      await fetchAssignedMaterials(selectedSite, desc_id);
    }
  };

  const handleMaterialChange = (desc_id, matIndex, e) => {
    const { name, value } = e.target;
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: (prev[desc_id] || []).map((mat, i) =>
        i === matIndex ? { ...mat, [name]: value } : mat
      ),
    }));
    setError(null);
  };

  const handleItemSelect = (desc_id, matIndex, selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: (prev[desc_id] || []).map((mat, i) =>
        i === matIndex ? { ...mat, item_id: value } : mat
      ),
    }));
    setError(null);
  };

  const handleAddMaterial = (desc_id) => {
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: [
        ...(prev[desc_id] || []),
        {
          item_id: "",
          uom_id: "",
          quantity: "",
          comp_ratio_a: "",
          comp_ratio_b: "",
          comp_ratio_c: "",
          rate: "",
        },
      ],
    }));
    setError(null);
  };

  const handleRemoveMaterial = (desc_id, matIndex) => {
    setMaterialAssignments((prev) => {
      const materials = prev[desc_id] || [];
      if (materials.length <= 1) {
        setError(`At least one material assignment is required for the selected work description.`);
        return prev;
      }
      return {
        ...prev,
        [desc_id]: materials.filter((_, i) => i !== matIndex),
      };
    });
  };

  const calculateCompQuantities = (mat) => {
    const quantity = parseFloat(mat.quantity) || 0;
    const comp_a = parseInt(mat.comp_ratio_a) || 0;
    const comp_b = parseInt(mat.comp_ratio_b) || 0;
    const comp_c = parseInt(mat.comp_ratio_c) || 0;
    const total_parts = comp_a + comp_b + comp_c;
    if (total_parts === 0) {
      return { comp_a_qty: 0, comp_b_qty: 0, comp_c_qty: 0 };
    }
    return {
      comp_a_qty: ((comp_a / total_parts) * quantity).toFixed(2),
      comp_b_qty: ((comp_b / total_parts) * quantity).toFixed(2),
      comp_c_qty: ((comp_c / total_parts) * quantity).toFixed(2),
    };
  };

  const calculateTotalCost = (mat) => {
    const quantity = parseFloat(mat.quantity) || 0;
    const rate = parseFloat(mat.rate) || 0;
    return (quantity * rate).toFixed(2);
  };

  const handleAddNewMaterial = async (inputValue, desc_id, matIndex) => {
    if (!inputValue.trim()) {
      setError("Material name is required.");
      return;
    }

    try {
      setAddingMaterial(true);
      const response = await axios.post("http://103.118.158.127/api/material/add-material", {
        item_name: inputValue.trim(),
      });

      if (response.data?.status === 'success' && response.data?.data?.item_id) {
        await fetchMaterials();
        const newItemId = response.data.data.item_id;
        setMaterialAssignments((prev) => ({
          ...prev,
          [desc_id]: (prev[desc_id] || []).map((mat, i) =>
            i === matIndex ? { ...mat, item_id: newItemId } : mat
          ),
        }));

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Material Added!",
          text: "New material has been added and selected.",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          background: "#ecfdf5",
          iconColor: "#10b981",
        });
      } else {
        setError(response.data?.message || "Failed to add material.");
      }
    } catch (error) {
      console.error("Error adding material:", error);
      setError(error.response?.data?.message || "Failed to add material.");
    } finally {
      setAddingMaterial(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      if (!selectedCompany) {
        setError("Please select a company.");
        return;
      }
      if (!selectedProject) {
        setError("Please select a project.");
        return;
      }
      if (!selectedSite) {
        setError("Please select a site.");
        return;
      }
      if (!selectedWorkDesc) {
        setError("Please select a work description.");
        return;
      }

      const validationErrors = [];
      const usedMaterials = new Set();
      const materials = materialAssignments[selectedWorkDesc] || [];
      const descName = workDescriptions.find((desc) => desc.desc_id === selectedWorkDesc)?.desc_name || `Work Description ${selectedWorkDesc}`;

      materials.forEach((row, index) => {
        const materialKey = `${selectedWorkDesc}-${row.item_id}`;
        if (!row.item_id) {
          validationErrors.push(`${descName}, Row ${index + 1}: Material is required`);
        } else if (usedMaterials.has(materialKey)) {
          validationErrors.push(`${descName}, Row ${index + 1}: Material must be unique within this work description`);
        } else {
          usedMaterials.add(materialKey);
        }
        if (!row.uom_id) validationErrors.push(`${descName}, Row ${index + 1}: Unit of Measure is required`);
        if (!row.quantity) {
          validationErrors.push(`${descName}, Row ${index + 1}: Overall Quantity is required`);
        } else if (isNaN(row.quantity) || parseFloat(row.quantity) <= 0) {
          validationErrors.push(`${descName}, Row ${index + 1}: Overall Quantity must be a positive number`);
        }
        if (!row.rate) {
          validationErrors.push(`${descName}, Row ${index + 1}: Rate is required`);
        } else if (isNaN(row.rate) || parseFloat(row.rate) < 0) {
          validationErrors.push(`${descName}, Row ${index + 1}: Rate must be a non-negative number`);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("<br />"));
        return;
      }

      const payload = materials.map((row) => ({
        pd_id: selectedProject,
        site_id: selectedSite,
        item_id: row.item_id,
        uom_id: parseInt(row.uom_id),
        quantity: parseInt(row.quantity),
        desc_id: selectedWorkDesc,
        comp_ratio_a: row.comp_ratio_a ? parseInt(row.comp_ratio_a) : null,
        comp_ratio_b: row.comp_ratio_b ? parseInt(row.comp_ratio_b) : null,
        comp_ratio_c: row.comp_ratio_c ? parseInt(row.comp_ratio_c) : null,
        rate: parseFloat(row.rate),
      }));

      if (payload.length === 0) {
        setError("Please add at least one material assignment.");
        return;
      }

      await axios.post("http://103.118.158.127/api/material/assign-material", payload);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Materials Assigned Successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setMaterialAssignments({});
      setSelectedWorkDesc("");
      setIsAssigned(false);
      setSelectedCompany("");
      setSelectedProject("");
      setSelectedSite("");
      setSites([]);
      setWorkDescriptions([]);
    } catch (error) {
      console.error("Error submitting material assignments:", error);
      setError(error.response?.data?.message || "Failed to assign materials. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const isFormEnabled = selectedCompany && selectedProject && selectedSite && selectedWorkDesc && !isAssigned;

  const materialOptions = Array.isArray(materials) ? materials.map((material) => ({
    value: material.item_id,
    label: material.item_name,
  })) : [];

  const CustomCreateLabel = ({ inputValue }) => (
    <div className="flex items-center justify-between px-2 py-1">
      <span>Add "{inputValue}"</span>
      <button
        type="button"
        className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        onClick={() => handleAddNewMaterial(inputValue, currentDescId, currentMatIndex)}
        disabled={addingMaterial}
      >
        {addingMaterial ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Material Planning
          </h2>
          <p className="text-gray-600 text-lg">
            Assign materials to your project sites efficiently
          </p>
        </div>

        {(loading.companies || loading.projects || loading.materials || loading.uoms || loading.workDescriptions) ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              {error && (
                <div
                  className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm"
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name || "Unknown Company"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
                <select
                  value={selectedProject}
                  onChange={handleProjectChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                  required
                  disabled={!selectedCompany}
                >
                  <option value="">Select Cost Center</option>
                  {projects.map((project) => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project_name || "Unknown Project"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                <div className="relative">
                  <select
                    value={selectedSite}
                    onChange={handleSiteChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                    required
                    disabled={!selectedProject || loading.sites}
                  >
                    <option value="">Select Site</option>
                    {sites.map((siteInfo) => (
                      <option key={siteInfo.site_id} value={siteInfo.site_id}>
                        {`${siteInfo.site_name || "Unknown Site"} (PO: ${siteInfo.po_number || "N/A"})`}
                      </option>
                    ))}
                  </select>
                  {loading.sites && selectedProject && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Description</label>
              <select
                value={selectedWorkDesc}
                onChange={handleWorkDescChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
                disabled={!selectedSite || loading.workDescriptions}
                required
              >
                <option value="">Select Work Description</option>
                {workDescriptions.map((desc) => (
                  <option key={desc.desc_id} value={desc.desc_id}>
                    {desc.desc_name || "Unknown Work Description"}
                  </option>
                ))}
              </select>
              {loading.workDescriptions && selectedSite && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 animate-spin" />
              )}
            </div>

            {selectedWorkDesc && (loading.assignedMaterials ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                <p className="text-gray-600 ml-2">Loading material assignments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {isAssigned && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded text-sm">
                    Materials have already been assigned for this work description. You can view the assignments below.
                  </div>
                )}
                {(materialAssignments[selectedWorkDesc] || []).map((mat, matIndex) => {
                  const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateCompQuantities(mat);
                  const totalCost = calculateTotalCost(mat);
                  return (
                    <div key={matIndex} className="border-b pb-4 last:border-b-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Material #{matIndex + 1}
                          </label>
                          <CreatableSelect
                            options={materialOptions}
                            value={materialOptions.find((opt) => opt.value === mat.item_id) || null}
                            onChange={(opt) => {
                              setCurrentDescId(selectedWorkDesc);
                              setCurrentMatIndex(matIndex);
                              handleItemSelect(selectedWorkDesc, matIndex, opt);
                            }}
                            formatCreateLabel={(inputValue) => (
                              <CustomCreateLabel inputValue={inputValue} />
                            )}
                            isSearchable
                            isClearable
                            isDisabled={!isFormEnabled || addingMaterial}
                            className="text-sm"
                            classNamePrefix="select"
                            placeholder="Select or type material..."
                          />
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600 w-28">Comp Ratio A:</label>
                              <input
                                type="number"
                                name="comp_ratio_a"
                                value={mat.comp_ratio_a}
                                onChange={(e) => handleMaterialChange(selectedWorkDesc, matIndex, e)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                disabled={!isFormEnabled}
                                min="0"
                              />
                              <span className="text-sm text-gray-600">Qty: {comp_a_qty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600 w-28">Comp Ratio B:</label>
                              <input
                                type="number"
                                name="comp_ratio_b"
                                value={mat.comp_ratio_b}
                                onChange={(e) => handleMaterialChange(selectedWorkDesc, matIndex, e)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                disabled={!isFormEnabled}
                                min="0"
                              />
                              <span className="text-sm text-gray-600">Qty: {comp_b_qty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600 w-28">Comp Ratio C:</label>
                              <input
                                type="number"
                                name="comp_ratio_c"
                                value={mat.comp_ratio_c}
                                onChange={(e) => handleMaterialChange(selectedWorkDesc, matIndex, e)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                disabled={!isFormEnabled}
                                min="0"
                              />
                              <span className="text-sm text-gray-600">Qty: {comp_c_qty}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit of Measure
                          </label>
                          <select
                            name="uom_id"
                            value={mat.uom_id}
                            onChange={(e) => handleMaterialChange(selectedWorkDesc, matIndex, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                            required
                            disabled={!isFormEnabled}
                          >
                            <option value="">Select UOM</option>
                            {uoms.map((uom) => (
                              <option key={uom.uom_id} value={uom.uom_id}>
                                {uom.uom_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Overall Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={mat.quantity}
                            onChange={(e) => handleMaterialChange(selectedWorkDesc, matIndex, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                            required
                            disabled={!isFormEnabled}
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rate per Quantity
                          </label>
                          <input
                            type="number"
                            name="rate"
                            value={mat.rate}
                            onChange={(e) => handleMaterialChange(selectedWorkDesc, matIndex, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                            required
                            disabled={!isFormEnabled}
                            min="0"
                            step="0.01"
                          />
                          <div className="mt-2 text-sm text-gray-600">
                            Overall Cost: {totalCost}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(selectedWorkDesc, matIndex)}
                        disabled={(materialAssignments[selectedWorkDesc] || []).length <= 1 || !isFormEnabled}
                        className={`mt-2 p-1.5 rounded-md ${
                          (materialAssignments[selectedWorkDesc] || []).length <= 1 || !isFormEnabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          (materialAssignments[selectedWorkDesc] || []).length <= 1
                            ? "At least one material is required"
                            : "Remove this entry"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleAddMaterial(selectedWorkDesc)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={!isFormEnabled}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Material
                </button>
              </div>
            ))}

            {selectedWorkDesc && (
              <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading.submitting || !isFormEnabled}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading.submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Assign Materials
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      <style>{`
        .select__control {
          border-color: #d1d5db;
          min-height: 38px;
        }
        .select__control--is-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .select__menu {
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default MaterialPlanning;