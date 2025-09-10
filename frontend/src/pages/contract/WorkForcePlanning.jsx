import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { Save, Users, UserCheck, Calendar, Building, HardHat } from "lucide-react";
import { useParams } from "react-router-dom";

const WorkForcePlanning = () => {
  const { encodedUserId } = useParams();
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWorkDesc, setSelectedWorkDesc] = useState(null);
  const [selectedIncharges, setSelectedIncharges] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("incharge"); // "incharge" or "labour"

  // Separate from/to dates for Incharge/Labour
  const [inchargeFromDate, setInchargeFromDate] = useState(new Date().toISOString().split('T'));
  const [inchargeToDate, setInchargeToDate] = useState(new Date().toISOString().split('T'));
  const [labourFromDate, setLabourFromDate] = useState(new Date().toISOString().split('T'));
  const [labourToDate, setLabourToDate] = useState(new Date().toISOString().split('T'));

  useEffect(() => {
    const fetchProjectsAndSites = async () => {
      try {
        const response = await axios.get("http://103.118.158.127/api/project/projects-with-sites");
        setProjects(response.data || []);
      } catch (err) {
        setError("Failed to fetch projects and sites");
        toast.error("Failed to fetch projects and sites");
      }
    };
    fetchProjectsAndSites();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://103.118.158.127/api/site-incharge/employees");
        setEmployees(response.data.data || []);
        setError(null);
      } catch (err) {
        toast.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const selectedProjectData = projects.find(project => project.project_id === selectedProject.value);
      setSites(selectedProjectData ? selectedProjectData.sites : []);
      setSelectedSite(null);
      setSelectedWorkDesc(null);
      setSelectedIncharges([]);
      setSelectedEmployees([]);
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      const fetchWorkDescriptions = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://103.118.158.127/api/site-incharge/work-descriptions?site_id=${selectedSite.value}`);
          setWorkDescriptions(response.data.data || []);
          setError(null);
        } catch (err) {
          toast.error("Failed to fetch work descriptions");
        } finally {
          setLoading(false);
        }
      };
      fetchWorkDescriptions();
    }
  }, [selectedProject, selectedSite]);

  const handleSaveAssignments = async () => {
    let user_id;
    try {
      user_id = atob(encodedUserId);
      if (!/^\d+$/.test(user_id)) throw new Error();
    } catch {
      toast.error("Invalid User ID in URL");
      return;
    }

    const hasIncharge = selectedIncharges.length > 0;
    const hasLabour = selectedEmployees.length > 0;

    if (!hasIncharge && !hasLabour) {
      toast.error("Please select at least one site incharge or labour employees");
      return;
    }

    if (!selectedProject || !selectedSite || !selectedWorkDesc) {
      toast.error("Please fill all required fields: project, site and work description");
      return;
    }

    // Separate date validations
    if (hasIncharge && (new Date(inchargeToDate) < new Date(inchargeFromDate))) {
      toast.error("Incharge: To Date must be after From Date");
      return;
    }
    if (hasLabour && (new Date(labourToDate) < new Date(labourFromDate))) {
      toast.error("Labour: To Date must be after From Date");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Save site incharges
      if (hasIncharge) {
        const inchargePayload = selectedIncharges.map(emp => ({
          from_date: inchargeFromDate,
          to_date: inchargeToDate,
          pd_id: selectedProject.value,
          site_id: selectedSite.value,
          emp_id: emp.value,
          desc_id: selectedWorkDesc.value,
          created_by: parseInt(user_id)
        }));

        console.log('Sending incharge payload:', inchargePayload);
        const inchargeResponse = await axios.post(
          "http://103.118.158.127/api/material/assign-incharge", 
          inchargePayload
        );
        toast.success(inchargeResponse.data.message || "Site incharges assigned successfully");
      }

      // Save labour assignments
      if (hasLabour) {
        const labourPayload = {
          project_id: selectedProject.value,
          site_id: selectedSite.value,
          desc_id: selectedWorkDesc.value,
          emp_ids: selectedEmployees.map(emp => emp.value),
          from_date: labourFromDate,
          to_date: labourToDate,
          created_by: parseInt(user_id)
        };

        console.log('Sending labour payload:', labourPayload);
        const labourResponse = await axios.post(
          "http://103.118.158.127/api/site-incharge/save-labour-assignment", 
          labourPayload
        );
        toast.success(labourResponse.data.message || "Labours assigned successfully");
      }

      setSelectedWorkDesc(null);
      setSelectedIncharges([]);
      setSelectedEmployees([]);
    } catch (err) {
      console.error('Error saving assignments:', err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save assignments");
    } finally {
      setSubmitting(false);
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.project_id,
    label: project.project_name
  }));

  const siteOptions = sites.map(site => ({
    value: site.site_id,
    label: site.site_name
  }));

  const workDescOptions = workDescriptions.map(desc => ({
    value: desc.desc_id,
    label: desc.desc_name
  }));

  const employeeOptions = employees.map(employee => ({
    value: employee.emp_id,
    label: `${employee.emp_id} - ${employee.full_name}`
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-5 md:p-7">
        <div className="flex items-center justify-center mb-2">
          <Building className="text-blue-600 mr-2" size={28} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Assign Site Personnel</h1>
        </div>
        <p className="text-gray-600 text-center mb-6">Manage site assignments for projects</p>

        <div className="mb-6 space-y-5">
          {/* Project and Site Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                <HardHat size={16} className="mr-1" />
                Project
              </label>
              <Select
                options={projectOptions}
                value={selectedProject}
                onChange={setSelectedProject}
                placeholder="Select Project..."
                isSearchable
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                <Building size={16} className="mr-1" />
                Site
              </label>
              <Select
                options={siteOptions}
                value={selectedSite}
                onChange={setSelectedSite}
                placeholder="Select Site..."
                isSearchable
                isDisabled={!selectedProject}
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Work Description */}
          {(selectedProject && selectedSite) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Work Description
              </label>
              <Select
                options={workDescOptions}
                value={selectedWorkDesc}
                onChange={setSelectedWorkDesc}
                placeholder="Select work description..."
                isSearchable
                isDisabled={loading}
                className="w-full"
                classNamePrefix="react-select"
              />
              <p className="text-xs text-blue-600 mt-2">
                Required for both site incharge and labour assignments
              </p>
            </div>
          )}

          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              className={`py-3 px-5 font-medium flex items-center ${activeTab === "incharge" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("incharge")}
            >
              <UserCheck size={18} className="mr-2" />
              Assign Site Incharge
            </button>
            <button
              className={`py-3 px-5 font-medium flex items-center ${activeTab === "labour" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("labour")}
            >
              <Users size={18} className="mr-2" />
              Assign Labour
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-4">
            {activeTab === "incharge" && (
              <div className="bg-blue-50 p-5 rounded-lg">
                {/* Incharge Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Calendar size={16} className="mr-1" />
                      From Date
                    </label>
                    <input
                      type="date"
                      value={inchargeFromDate}
                      onChange={(e) => setInchargeFromDate(e.target.value)}
                      className="w-full p-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Calendar size={16} className="mr-1" />
                      To Date
                    </label>
                    <input
                      type="date"
                      value={inchargeToDate}
                      onChange={(e) => setInchargeToDate(e.target.value)}
                      className="w-full p-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <label className="block text-sm font-medium text-blue-800">
                    Select Site Incharge(s)
                  </label>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {inchargeFromDate} to {inchargeToDate}
                  </div>
                </div>
                <Select
                  options={employeeOptions}
                  value={selectedIncharges}
                  onChange={setSelectedIncharges}
                  placeholder="Search employees..."
                  isSearchable
                  isMulti
                  isDisabled={loading || !selectedProject || !selectedSite || !selectedWorkDesc}
                  className="w-full"
                  classNamePrefix="react-select"
                />
                <p className="text-xs text-blue-600 mt-2">
                  Select one or more site incharges to assign to this site
                </p>
              </div>
            )}

            {activeTab === "labour" && (
              <div className="space-y-5">
                <div className="bg-blue-50 p-5 rounded-lg">
                  {/* Labour Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <Calendar size={16} className="mr-1" />
                        From Date
                      </label>
                      <input
                        type="date"
                        value={labourFromDate}
                        onChange={(e) => setLabourFromDate(e.target.value)}
                        className="w-full p-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <Calendar size={16} className="mr-1" />
                        To Date
                      </label>
                      <input
                        type="date"
                        value={labourToDate}
                        onChange={(e) => setLabourToDate(e.target.value)}
                        className="w-full p-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4 flex justify-between items-center">
                    <label className="block text-sm font-medium text-blue-800">
                      Select Labour Employees
                    </label>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {labourFromDate} to {labourToDate}
                    </div>
                  </div>
                  <Select
                    options={employeeOptions}
                    value={selectedEmployees}
                    onChange={setSelectedEmployees}
                    placeholder="Search employees..."
                    isSearchable
                    isMulti
                    isDisabled={loading || !selectedProject || !selectedSite || !selectedWorkDesc}
                    className="w-full"
                    classNamePrefix="react-select"
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    Select one or more employees to assign as labour
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-5 text-sm text-blue-600 bg-blue-50 rounded-lg">
            Loading data, please wait...
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleSaveAssignments}
          className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center justify-center mt-5 shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          disabled={submitting || !selectedProject || !selectedSite || !selectedWorkDesc}
        >
          <Save size={18} className="mr-2" />
          {submitting ? 'Processing...' : 'Save Assignments'}
        </button>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Assigning personnel to: {selectedProject?.label || 'No project selected'} / {selectedSite?.label || 'No site selected'}</p>
          <p className="mt-1">Work: {selectedWorkDesc?.label || 'No work description selected'}</p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default WorkForcePlanning;
