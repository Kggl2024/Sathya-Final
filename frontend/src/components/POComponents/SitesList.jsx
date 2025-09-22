// src/components/POComponents/SitesList.jsx
import React from "react";
import { MapPin } from "lucide-react";
import SiteCard from "./SiteCard";

const SitesList = ({
  selectedCompanyId,
  sites,
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
  if (!selectedCompanyId || sites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Sites for Selected Client</h2>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {sites.length} sites
        </div>
      </div>

      <div className="space-y-4">
        {sites.map((site, index) => (
          <SiteCard
            key={site.site_id}
            site={site}
            index={index}
            expandedSite={expandedSite}
            handleToggleSite={handleToggleSite}
            editingSiteId={editingSiteId}
            editSiteData={editSiteData}
            handleEditSiteChange={handleEditSiteChange}
            handleDropdownChange={handleDropdownChange}
            inchargeTypes={inchargeTypes}
            locations={locations}
            reckonerTypes={reckonerTypes}
            loading={loading}
            handleUpdateSite={handleUpdateSite}
            setEditingSiteId={setEditingSiteId}
            handleEditSite={handleEditSite}
            siteReckonerData={siteReckonerData}
            creatingReckonerSiteId={creatingReckonerSiteId}
            handleCreateReckoner={handleCreateReckoner}
          >
            {children}
          </SiteCard>
        ))}
      </div>
    </div>
  );
};

export default SitesList;