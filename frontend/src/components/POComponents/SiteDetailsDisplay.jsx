// src/components/POComponents/SiteDetailsDisplay.jsx
import React from "react";
import { Building2, FileText, Calendar, User, MapPin, Settings, Edit } from "lucide-react";

const SiteDetailsDisplay = ({ site, handleEditSite }) => {
  const siteInfo = [
     {label: "PO Type", value: site.type_name || "N/A", icon: Settings },
    { label: "Site Name", value: site.site_name, icon: Building2 },
    { label: "PO Number", value: site.po_number, icon: FileText },
    { label: "Start Date", value: site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "End Date", value: site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Incharge Type", value: site.incharge_type || "N/A", icon: User },
    { label: "Location", value: site.location_name || "N/A", icon: MapPin },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Site Details</h3>
        </div>
        <button
          onClick={() => handleEditSite(site.site_id)}
          className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Edit className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
          Edit Site Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteInfo.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
              <item.icon size={12} />
              {item.label}
            </div>
            <div className="text-slate-800 font-medium text-sm">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SiteDetailsDisplay;