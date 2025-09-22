// src/components/POComponents/WorkDescriptionsSection.jsx
import React from "react";
import { FileText, Plus, X } from "lucide-react";

const WorkDescriptionsSection = ({ 
  site, 
  siteReckonerData, 
  creatingReckonerSiteId, 
  handleCreateReckoner, 
  children 
}) => {
    console.log("siteReckonerData:", siteReckonerData);
  const hasSiteReckoner = siteReckonerData[site.site_id]?.length > 0;
  const isCreatingReckoner = creatingReckonerSiteId === site.site_id;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-6 rounded-xl border border-slate-200 shadow-inner">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Work Descriptions</h3>
      </div>

      {hasSiteReckoner ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siteReckonerData[site.site_id].map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {item.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {item.desc_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : isCreatingReckoner ? (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Plus className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-700">
              Create Reckoner for {site.site_name}
            </h4>
          </div>
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-red-100 rounded-2xl">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-red-600 font-medium">Reckoner Not Created</p>
          <button
            onClick={() => handleCreateReckoner(site.site_id)}
            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            Create Reckoner
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkDescriptionsSection;