// src/components/POComponents/HeaderSection.jsx
import React from "react";
import { Settings, Building2, Plus, X } from "lucide-react";
import SearchableClientDropdown from "./SearchableClientDropdown";

const HeaderSection = ({
  companies,
  selectedCompanyId,
  handleCompanyChange,
  onShowProjectModal,
  loading
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Master PO Creation
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Create and manage project work orders
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
            <Building2 size={16} />
            Select Client
          </label>
          <SearchableClientDropdown
            options={companies}
            value={selectedCompanyId}
            onChange={handleCompanyChange}
            placeholder="Search client"
            disabled={loading.companies}
            isLoading={loading.companies}
          />
        </div>

        {selectedCompanyId && (
          <div className="lg:w-auto flex items-end">
            <button
              onClick={() => handleCompanyChange("")}
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
              <X size={16} />
              Clear Selection
            </button>
          </div>
        )}

        <div className="lg:w-auto flex items-end">
          <button
            onClick={onShowProjectModal}
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            disabled={!selectedCompanyId}
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            Create Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;