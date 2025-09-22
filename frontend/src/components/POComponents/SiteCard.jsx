// src/components/POComponents/SiteCard.jsx
import React from "react";
import { ChevronDown, ChevronUp, Building2, FileText } from "lucide-react";
import SiteDetailsDisplay from "./SiteDetailsDisplay";
import SiteDetailsForm from "./SiteDetailsForm";
import WorkDescriptionsSection from "./WorkDescriptionsSection";

const SiteCard = ({
  site,
  index,
  expandedSite,
  handleToggleSite,
  editingSiteId,
  editSiteData,
  handleEditSiteChange,
  handleDropdownChange,
  inchargeTypes,
  locations,
  reckonerTypes,
  loading,
  handleUpdateSite,
  setEditingSiteId,
  handleEditSite,
  siteReckonerData,
  creatingReckonerSiteId,
  handleCreateReckoner,
  children
}) => {
  const isExpanded = expandedSite === site.site_id;
  const isEditing = editingSiteId === site.site_id;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div
        className="flex justify-between items-center p-6 bg-gradient-to-r from-slate-50 to-slate-100 cursor-pointer hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-slate-200"
        onClick={() => handleToggleSite(site.site_id)}
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {index + 1}
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-lg">{site.site_name}</span>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-slate-600 text-sm flex items-center gap-1">
                  <FileText size={14} />
                  PO: {site.po_number}
                </span>
                <span className="text-slate-800 text-sm flex items-center gap-1">
                  <Building2 size={14} />
                  Cost Center: {site.project_name}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors duration-200">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-slate-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-600" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Site Details Section */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 shadow-inner">
            {isEditing ? (
              <SiteDetailsForm
                editSiteData={editSiteData}
                handleEditSiteChange={handleEditSiteChange}
                handleDropdownChange={handleDropdownChange}
                inchargeTypes={inchargeTypes}
                locations={locations}
                reckonerTypes={reckonerTypes}
                loading={loading}
                handleUpdateSite={handleUpdateSite}
                siteId={site.site_id}
                setEditingSiteId={setEditingSiteId}
              />
            ) : (
              <SiteDetailsDisplay
                site={site}
                handleEditSite={handleEditSite}
              />
            )}
          </div>

          {/* Work Descriptions Section */}
          <WorkDescriptionsSection
            site={site}
            siteReckonerData={siteReckonerData}
            creatingReckonerSiteId={creatingReckonerSiteId}
            handleCreateReckoner={handleCreateReckoner}
          >
            {children}
          </WorkDescriptionsSection>
        </div>
      )}
    </div>
  );
};

export default SiteCard;