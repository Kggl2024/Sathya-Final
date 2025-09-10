import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Eye, 
  Edit,
  Building2,
  MapPin,
  Calendar,
  User,
  Settings,
  FileText,
  Trash2,
  Check,
  X
} from "lucide-react";

const getRandomColor = (index) => {
  const colors = [
    "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
    "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
    "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200",
    "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200",
    "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200",
    "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200",
    "bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200",
    "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200",
    "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200",
    "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200",
  ];
  return colors[index % colors.length];
};

const initialFormData = {
  poNumber: "",
  siteId: "",
  categories: [
    {
      categoryName: "",
      categoryId: "",
      items: [
        {
          itemNo: "",
          descId: "",
          descName: "",
          subcategories: [],
          poQuantity: "",
          unitOfMeasure: "",
          rate: "",
          value: "",
        },
      ],
    },
  ],
};

const SearchableDropdown = ({ options, value, onChange, placeholder, disabled, isLoading, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || "");
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes((value || "").toLowerCase())
      )
    );
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    onChange(option.name, option.id);
    setSearchTerm(option.name);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (onCreate && searchTerm && !filteredOptions.some(opt => opt.name.toLowerCase() === searchTerm.toLowerCase())) {
      try {
        await onCreate(searchTerm);
        setSearchTerm("");
        setIsOpen(false);
      } catch (error) {
        console.error("Error creating new option:", error);
      }
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-3 border text-sm bg-white hover:bg-slate-50 transition-all duration-200"
        disabled={disabled || isLoading}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">
              {onCreate && searchTerm ? (
                <button
                  onClick={handleCreate}
                  className="w-full text-left hover:text-blue-600 transition-colors duration-200"
                >
                  + Create "{searchTerm}"
                </button>
              ) : (
                "No options found"
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchableClientDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // Reset search term when value changes externally
  useEffect(() => {
    if (!value || !searchTerm) {
      setSearchTerm("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term when closing if no value is selected
        if (!value) {
          setSearchTerm("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    onChange(option.company_id);
    setSearchTerm(option.company_name); // Set the display name
    setIsOpen(false);
  };

  const getCurrentDisplayValue = () => {
    if (searchTerm) {
      return searchTerm;
    }
    if (value) {
      const selectedOption = options.find((opt) => opt.company_id === value);
      return selectedOption ? selectedOption.company_name : "";
    }
    return "";
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        value={getCurrentDisplayValue()}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-3 border text-sm bg-white hover:bg-slate-50 transition-all duration-200"
        disabled={disabled || isLoading}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.company_id}
                className="px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                onClick={() => handleSelect(option)}
              >
                {option.company_name}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">
              No clients found
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const POMasterCreation = ({
  onShowCompanyModal,
  onShowProjectModal,
  selectedCompany,
  onCompanySelect,
  companies,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [sites, setSites] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(selectedCompany || "");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [inchargeTypes, setInchargeTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [reckonerTypes, setReckonerTypes] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [loading, setLoading] = useState({
    companies: false,
    sites: false,
    categories: false,
    subcategories: false,
    workItems: false,
    inchargeTypes: false,
    locations: false,
    reckonerTypes: false,
    submitting: false,
    processing: false,
  });
  const [openCategories, setOpenCategories] = useState({ 0: true });
  const [expandedSite, setExpandedSite] = useState(null);
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [creatingReckonerSiteId, setCreatingReckonerSiteId] = useState(null);
  const [siteReckonerData, setSiteReckonerData] = useState({});
  const [editSiteData, setEditSiteData] = useState({
    site_name: "",
    po_number: "",
    start_date: "",
    end_date: "",
    incharge_id: "",
    location_id: "",
    reckoner_type_id: "",
    incharge_type: "",
    location_name: "",
    type_name: "",
  });

useEffect(() => {
  setSelectedCompanyId(selectedCompany || "");
  
  // Reset form and related states when selectedCompany prop changes
  if (selectedCompany !== selectedCompanyId) {
    setFormData({ ...initialFormData });
    setSites([]);
    setSiteReckonerData({});
    setExpandedSite(null);
    setEditingSiteId(null);
    setCreatingReckonerSiteId(null);
    setOpenCategories({ 0: true });
  }
}, [selectedCompany]);


  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading((prev) => ({ ...prev, inchargeTypes: true }));
        const inchargeResponse = await axios.get("http://103.118.158.127/api/reckoner/incharge-types");
        setInchargeTypes(
          inchargeResponse.data.data.map((item) => ({
            id: item.incharge_id,
            name: item.incharge_type,
          }))
        );

        setLoading((prev) => ({ ...prev, locations: true }));
        const locationResponse = await axios.get("http://103.118.158.127/api/reckoner/locations");
        setLocations(
          locationResponse.data.data.map((item) => ({
            id: item.location_id,
            name: item.location_name,
          }))
        );

        setLoading((prev) => ({ ...prev, reckonerTypes: true }));
        const reckonerTypeResponse = await axios.get("http://103.118.158.127/api/reckoner/reckoner-types");
        setReckonerTypes(
          reckonerTypeResponse.data.data.map((item) => ({
            id: item.type_id,
            name: item.type_name,
          }))
        );
      } catch (err) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to load dropdown data",
          text: err.response?.data?.message || "Please try again later",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: "#fef2f2",
          iconColor: "#ef4444",
        });
      } finally {
        setLoading((prev) => ({
          ...prev,
          inchargeTypes: false,
          locations: false,
          reckonerTypes: false,
        }));
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      const fetchSites = async () => {
        try {
          setLoading((prev) => ({ ...prev, sites: true }));
          const response = await axios.get(
            `http://103.118.158.127/api/reckoner/sites-by-company/${selectedCompanyId}`
          );
          const sitesData = response.data.data || [];
          setSites(sitesData);

          const siteReckonerPromises = sitesData.map(async (site) => {
            try {
              const reckonerResponse = await axios.get(
                `http://103.118.158.127/api/reckoner/site-reckoner/${site.site_id}`
              );
              return { siteId: site.site_id, data: reckonerResponse.data.data || [] };
            } catch (err) {
              console.error(`Failed to fetch reckoner data for site ${site.site_id}:`, err);
              return { siteId: site.site_id, data: [] };
            }
          });

          const reckonerResults = await Promise.all(siteReckonerPromises);
          const reckonerDataMap = reckonerResults.reduce((acc, { siteId, data }) => {
            acc[siteId] = data;
            return acc;
          }, {});
          setSiteReckonerData(reckonerDataMap);
        } catch (err) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Failed to load sites",
            text: err.response?.data?.message || "Please try again later",
            showConfirmButton: false,
            timer: 3000,
            toast: true,
            background: "#fef2f2",
            iconColor: "#ef4444",
          });
        } finally {
          setLoading((prev) => ({ ...prev, sites: false }));
        }
      };
      fetchSites();
    } else {
      setSites([]);
      setSiteReckonerData({});
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, categories: true }));
        const categoriesRes = await axios.get("http://103.118.158.127/api/reckoner/categories");
        setCategories(categoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, subcategories: true }));
        const subcategoriesRes = await axios.get("http://103.118.158.127/api/reckoner/subcategories");
        setSubcategories(subcategoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, workItems: true }));
        const workItemsRes = await axios.get("http://103.118.158.127/api/reckoner/work-items");
        setWorkItems(workItemsRes.data.data || []);
      } catch (err) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Failed to load data",
          text: err.response?.data?.message || "Please try again later",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          background: "#fef2f2",
          iconColor: "#ef4444",
        });
      } finally {
        setLoading((prev) => ({
          ...prev,
          categories: false,
          subcategories: false,
          workItems: false,
        }));
      }
    };
    fetchData();
  }, []);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleEditSiteChange = (e) => {
    const { name, value } = e.target;
    setEditSiteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (fieldName, fieldId, value, id) => {
    setEditSiteData((prev) => ({
      ...prev,
      [fieldName]: value,
      [fieldId]: id,
    }));
  };

  const handleEditSite = (siteId) => {
    const site = sites.find((s) => s.site_id === siteId);
    if (site) {
      setEditSiteData({
        site_name: site.site_name || "",
        po_number: site.po_number || "",
        start_date: site.start_date || "",
        end_date: site.end_date || "",
        incharge_id: site.incharge_id || "",
        location_id: site.location_id || "",
        reckoner_type_id: site.reckoner_type_id || "",
        incharge_type: site.incharge_type || "",
        location_name: site.location_name || "",
        type_name: site.type_name || "",
      });
      setEditingSiteId(siteId);
    }
  };

  const handleUpdateSite = async (siteId) => {
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      const updateData = {
        site_name: editSiteData.site_name,
        po_number: editSiteData.po_number,
        start_date: editSiteData.start_date,
        end_date: editSiteData.end_date,
        incharge_id: editSiteData.incharge_id,
        location_id: editSiteData.location_id,
        reckoner_type_id: editSiteData.reckoner_type_id,
      };

      await axios.put(`http://103.118.158.127/api/reckoner/sites/${siteId}`, updateData);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Site updated successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      const response = await axios.get(
        `http://103.118.158.127/api/reckoner/sites-by-company/${selectedCompanyId}`
      );
      setSites(response.data.data || []);
      setEditingSiteId(null);
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to update site",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

 const handleCompanyChange = (value) => {
  // Reset all related states when company changes
  setSelectedCompanyId(value);
  setFormData({ ...initialFormData });
  setSites([]);
  setSiteReckonerData({});
  setExpandedSite(null);
  setEditingSiteId(null);
  setCreatingReckonerSiteId(null);
  setOpenCategories({ 0: true });

  // Save to localStorage
  if (value) {
    localStorage.setItem("selectedCompanyId", value);
  } else {
    localStorage.removeItem("selectedCompanyId");
  }

  // Call parent callback if provided
  if (onCompanySelect) {
    onCompanySelect(value);
  }
};

  const handleToggleSite = (siteId) => {
    const isExpanding = expandedSite !== siteId;
    setExpandedSite(isExpanding ? siteId : null);
    if (!isExpanding) {
      setEditingSiteId(null);
      setCreatingReckonerSiteId(null);
    }
  };

  const handleCreateReckoner = (siteId) => {
    const site = sites.find((s) => s.site_id === siteId);
    if (site) {
      setFormData({ ...initialFormData, poNumber: site.po_number, siteId: site.site_id });
      setCreatingReckonerSiteId(siteId);
      setOpenCategories({ 0: true });
    }
  };

  const handleCategoryChange = (categoryIndex, value) => {
    const selectedCategory = categories.find((cat) => cat.category_name === value);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        categoryName: value,
        categoryId: selectedCategory?.category_id || "",
        items: [
          {
            itemNo: "",
            descId: "",
            descName: "",
            subcategories: [],
            poQuantity: "",
            unitOfMeasure: "",
            rate: "",
            value: "",
          },
        ],
      };
      return { ...prev, categories: newCategories };
    });
  };

  const handleCreateCategory = async (categoryName) => {
    try {
      const response = await axios.post("http://103.118.158.127/api/reckoner/categories", {
        category_name: categoryName,
      });
      const newCategory = response.data.data;
      setCategories((prev) => [...prev, newCategory]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Category created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
      return newCategory;
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to create category",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
      throw err;
    }
  };

  const handleItemDescriptionChange = (categoryIndex, itemIndex, value) => {
    const selectedItem = workItems.find((item) => item.desc_name === value);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];

      const defaultSubcategories = subcategories
        .slice(0, 2)
        .map((subcat) => ({
          subcategoryId: subcat.subcategory_id,
          subcategoryName: subcat.subcategory_name,
          poQuantity: item.poQuantity || "0",
          rate: Math.floor(
            (parseInt(item.rate) || 0) / (subcategories.length >= 2 ? 2 : subcategories.length)
          ).toString(),
          value: (
            (parseFloat(item.poQuantity) || 0) *
            Math.floor(
              (parseInt(item.rate) || 0) / (subcategories.length >= 2 ? 2 : subcategories.length)
            )
          ).toFixed(2),
        }));

      newItems[itemIndex] = {
        ...item,
        descName: value,
        descId: selectedItem?.desc_id || "",
        unitOfMeasure: selectedItem?.unit_of_measure || "",
        subcategories: defaultSubcategories,
      };
      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

  const handleCreateWorkItem = async (descName) => {
    try {
      const response = await axios.post("http://103.118.158.127/api/reckoner/work-items", {
        desc_name: descName,
      });
      const newWorkItem = response.data.data;
      setWorkItems((prev) => [...prev, newWorkItem]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Work item created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
      return newWorkItem;
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to create work item",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
      throw err;
    }
  };

  const handleSubcategorySelection = (categoryIndex, itemIndex, subcategoryId, checked) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];

      let updatedSubcategories;
      if (checked) {
        const subcat = subcategories.find((sc) => sc.subcategory_id === subcategoryId);
        if (!subcat) return prev;

        updatedSubcategories = [
          ...item.subcategories,
          {
            subcategoryId: subcat.subcategory_id,
            subcategoryName: subcat.subcategory_name,
            poQuantity: item.poQuantity || "0",
            rate: Math.floor((parseInt(item.rate) || 0) / (item.subcategories.length + 1)).toString(),
            value: (
              (parseFloat(item.poQuantity) || 0) *
              Math.floor((parseInt(item.rate) || 0) / (item.subcategories.length + 1))
            ).toFixed(2),
          },
        ];
      } else {
        updatedSubcategories = item.subcategories.filter(
          (sc) => sc.subcategoryId !== subcategoryId
        );
      }

      const splitRate =
        updatedSubcategories.length > 0
          ? Math.floor((parseInt(item.rate) || 0) / updatedSubcategories.length)
          : 0;
      updatedSubcategories = updatedSubcategories.map((subcat) => ({
        ...subcat,
        rate: splitRate.toString(),
        value: ((parseFloat(item.poQuantity) || 0) * splitRate).toFixed(2),
      }));

      newItems[itemIndex] = {
        ...item,
        subcategories: updatedSubcategories,
      };

      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

  const handleCreateSubcategory = async (categoryIndex, itemIndex) => {
    if (!newSubcategory) return;
    try {
      const response = await axios.post("http://103.118.158.127/api/reckoner/subcategories", {
        subcategory_name: newSubcategory,
      });
      const newSubcat = response.data.data;
      setSubcategories((prev) => [...prev, newSubcat]);
      setNewSubcategory("");
      handleSubcategorySelection(categoryIndex, itemIndex, newSubcat.subcategory_id, true);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Subcategory created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to create subcategory",
        text: err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
    }
  };

  const handleItemChange = (categoryIndex, itemIndex, e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];

      newItems[itemIndex] = {
        ...item,
        [name]: value,
      };

      if (name === "poQuantity" || name === "rate") {
        const quantity = name === "poQuantity" ? parseFloat(value) || 0 : parseFloat(item.poQuantity) || 0;
        const rate = name === "rate" ? Math.floor(parseFloat(value) || 0) : parseInt(item.rate) || 0;

        const updatedSubcategories = item.subcategories.map((subcat) => {
          const splitRate = item.subcategories.length > 0 ? Math.floor(rate / item.subcategories.length) : 0;
          return {
            ...subcat,
            poQuantity: quantity.toString(),
            rate: splitRate.toString(),
            value: (quantity * splitRate).toFixed(2),
          };
        });

        newItems[itemIndex] = {
          ...newItems[itemIndex],
          rate: rate.toString(),
          subcategories: updatedSubcategories,
          value: (quantity * rate).toFixed(2),
        };
      }

      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

  const handleSubcategoryRateChange = (categoryIndex, itemIndex, subcategoryIndex, e) => {
    const { value } = e.target;
    const newRate = Math.floor(parseFloat(value) || 0);

    setFormData((prev) => {
      const newCategories = [...prev.categories];
      const newItems = [...newCategories[categoryIndex].items];
      const item = newItems[itemIndex];
      const updatedSubcategories = [...item.subcategories];

      updatedSubcategories[subcategoryIndex] = {
        ...updatedSubcategories[subcategoryIndex],
        rate: newRate.toString(),
        value: ((parseFloat(item.poQuantity) || 0) * newRate).toFixed(2),
        edited: true,
      };

      const itemRate = parseInt(item.rate) || 0;
      const currentTotal = updatedSubcategories.reduce(
        (sum, subcat) => sum + (parseInt(subcat.rate) || 0),
        0
      );

      let diff = itemRate - currentTotal;

      if (diff !== 0) {
        for (let i = subcategoryIndex + 1; i < updatedSubcategories.length; i++) {
          if (!updatedSubcategories[i].edited) {
            const newAdjustedRate = (parseInt(updatedSubcategories[i].rate) || 0) + diff;
            updatedSubcategories[i] = {
              ...updatedSubcategories[i],
              rate: newAdjustedRate.toString(),
              value: ((parseFloat(item.poQuantity) || 0) * newAdjustedRate).toFixed(2),
            };
            diff = 0;
            break;
          }
        }

        if (diff !== 0 && updatedSubcategories.length > 0) {
          const firstRate = (parseInt(updatedSubcategories[0].rate) || 0) + diff;
          updatedSubcategories[0] = {
            ...updatedSubcategories[0],
            rate: firstRate.toString(),
            value: ((parseFloat(item.poQuantity) || 0) * firstRate).toFixed(2),
          };
        }
      }

      newItems[itemIndex] = {
        ...item,
        subcategories: updatedSubcategories,
        value: ((parseFloat(item.poQuantity) || 0) * itemRate).toFixed(2),
      };

      newCategories[categoryIndex].items = newItems;
      return { ...prev, categories: newCategories };
    });
  };

  const isSubmitDisabled = () => {
    if (!formData.siteId || loading.submitting || loading.processing) {
      return true;
    }
    for (const category of formData.categories) {
      if (!category.categoryId) {
        return true;
      }
      for (const item of category.items) {
        if (
          !item.itemNo ||
          !item.descId ||
          !item.descName ||
          item.subcategories.length === 0 ||
          !item.poQuantity ||
          !item.unitOfMeasure ||
          !item.rate
        ) {
          return true;
        }
        const itemRate = parseInt(item.rate) || 0;
        const totalSubcategoryRate = item.subcategories.reduce(
          (sum, subcat) => sum + (parseInt(subcat.rate) || 0),
          0
        );
        if (totalSubcategoryRate !== itemRate) {
          return true;
        }
      }
    }
    return false;
  };

  const addCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newCategoryIndex = formData.categories.length;
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          categoryName: "",
          categoryId: "",
          items: [
            {
              itemNo: "",
              descId: "",
              descName: "",
              subcategories: [],
              poQuantity: "",
              unitOfMeasure: "",
              rate: "",
              value: "",
            },
          ],
        },
      ],
    }));
    setOpenCategories((prev) => ({ ...prev, [newCategoryIndex]: true }));
  };

  const removeCategory = (index) => {
    if (formData.categories.length > 1) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
      setOpenCategories((prev) => {
        const newOpenCategories = { ...prev };
        delete newOpenCategories[index];
        const updatedOpenCategories = {};
        Object.keys(newOpenCategories).forEach((key) => {
          const numKey = parseInt(key);
          if (numKey > index) {
            updatedOpenCategories[numKey - 1] = newOpenCategories[key];
          } else {
            updatedOpenCategories[numKey] = newOpenCategories[key];
          }
        });
        return updatedOpenCategories;
      });
    }
  };

  const addItemRow = (categoryIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].items = [
        ...newCategories[categoryIndex].items,
        {
          itemNo: "",
          descId: "",
          descName: "",
          subcategories: [],
          poQuantity: "",
          unitOfMeasure: "",
          rate: "",
          value: "",
        },
      ];
      return { ...prev, categories: newCategories };
    });
  };

  const removeItemRow = (categoryIndex, itemIndex) => {
    if (formData.categories[categoryIndex].items.length > 1) {
      setFormData((prev) => {
        const newCategories = [...prev.categories];
        newCategories[categoryIndex].items = newCategories[categoryIndex].items.filter(
          (_, i) => i !== itemIndex
        );
        return { ...prev, categories: newCategories };
      });
    }
  };

  const toggleCategory = (index) => {
    setOpenCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const processSite = async (poNumber) => {
    try {
      setLoading((prev) => ({ ...prev, processing: true }));
      await axios.get(`http://103.118.158.127/api/sheet/process/${encodeURIComponent(poNumber)}`);
      return true;
    } catch (error) {
      console.error("Error processing site:", error);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, processing: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      if (!formData.siteId) {
        throw new Error("Please select a site.");
      }
      for (const category of formData.categories) {
        if (!category.categoryId) {
          throw new Error("All categories must be selected.");
        }
        for (const item of category.items) {
          if (
            !item.itemNo ||
            !item.descId ||
            !item.descName ||
            item.subcategories.length === 0 ||
            !item.poQuantity ||
            !item.unitOfMeasure ||
            !item.rate
          ) {
            throw new Error("All item fields must be filled and at least one subcategory selected.");
          }
        }
      }

      const submissionData = {
        poNumber: formData.poNumber,
        siteId: formData.siteId,
        categories: formData.categories.map((category) => {
          const subcategoryMap = {};

          category.items.forEach((item) => {
            item.subcategories.forEach((subcat) => {
              if (!subcategoryMap[subcat.subcategoryId]) {
                subcategoryMap[subcat.subcategoryId] = {
                  subcategoryId: subcat.subcategoryId,
                  items: [],
                };
              }
              subcategoryMap[subcat.subcategoryId].items.push({
                itemId: item.itemNo,
                descId: item.descId,
                poQuantity: subcat.poQuantity,
                uom: item.unitOfMeasure,
                rate: subcat.rate,
                value: subcat.value,
              });
            });
          });

          return {
            categoryId: category.categoryId,
            subcategories: Object.values(subcategoryMap),
          };
        }),
      };

      await axios.post("http://103.118.158.127/api/reckoner/reckoner", submissionData);
      await processSite(formData.poNumber);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reckoner created successfully!",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setFormData(initialFormData);
      setCreatingReckonerSiteId(null);
      setOpenCategories({ 0: true });

      const response = await axios.get(
        `http://103.118.158.127/api/reckoner/sites-by-company/${selectedCompanyId}`
      );
      const sitesData = response.data.data || [];
      setSites(sitesData);

      const siteReckonerPromises = sitesData.map(async (site) => {
        try {
          const reckonerResponse = await axios.get(
            `http://103.118.158.127/api/reckoner/site-reckoner/${site.site_id}`
          );
          return { siteId: site.site_id, data: reckonerResponse.data.data || [] };
        } catch (err) {
          console.error(`Failed to fetch reckoner data for site ${site.site_id}:`, err);
          return { siteId: site.site_id, data: [] };
        }
      });

      const reckonerResults = await Promise.all(siteReckonerPromises);
      const reckonerDataMap = reckonerResults.reduce((acc, { siteId, data }) => {
        acc[siteId] = data;
        return acc;
      }, {});
      setSiteReckonerData(reckonerDataMap);
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Submission failed",
        text: err.message || err.response?.data?.message || "Please try again",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fef2f2",
        iconColor: "#ef4444",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
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

        {/* Sites Section */}
        {selectedCompanyId && sites.length > 0 && (
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
                <div
                  key={site.site_id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
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
                      {expandedSite === site.site_id ? (
                        <ChevronUp className="w-6 h-6 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                  </div>

                  {expandedSite === site.site_id && (
                    <div className="p-6 space-y-6">
                      {/* Site Details Section */}
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Site Details</h3>
                          </div>
                          {editingSiteId !== site.site_id && (
                            <button
                              onClick={() => handleEditSite(site.site_id)}
                              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <Edit className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                              Edit Site Details
                            </button>
                          )}
                        </div>

                        {editingSiteId === site.site_id ? (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Site Name
                                </label>
                                <input
                                  type="text"
                                  name="site_name"
                                  value={editSiteData.site_name}
                                  onChange={handleEditSiteChange}
                                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-3 border text-sm bg-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  PO Number
                                </label>
                                <input
                                  type="text"
                                  name="po_number"
                                  value={editSiteData.po_number}
                                  onChange={handleEditSiteChange}
                                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-3 border text-sm bg-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  name="start_date"
                                  value={formatDateForInput(editSiteData.start_date)}
                                  onChange={handleEditSiteChange}
                                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-3 border text-sm bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  name="end_date"
                                  value={formatDateForInput(editSiteData.end_date)}
                                  onChange={handleEditSiteChange}
                                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-3 border text-sm bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Incharge Type
                                </label>
                                <SearchableDropdown
                                  options={inchargeTypes}
                                  value={editSiteData.incharge_type}
                                  onChange={(value, id) =>
                                    handleDropdownChange("incharge_type", "incharge_id", value, id)
                                  }
                                  placeholder="Select incharge type"
                                  disabled={loading.inchargeTypes}
                                  isLoading={loading.inchargeTypes}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  Location
                                </label>
                                <SearchableDropdown
                                  options={locations}
                                  value={editSiteData.location_name}
                                  onChange={(value, id) =>
                                    handleDropdownChange("location_name", "location_id", value, id)
                                  }
                                  placeholder="Select location"
                                  disabled={loading.locations}
                                  isLoading={loading.locations}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                  PO Type
                                </label>
                                <SearchableDropdown
                                  options={reckonerTypes}
                                  value={editSiteData.type_name}
                                  onChange={(value, id) =>
                                    handleDropdownChange("type_name", "reckoner_type_id", value, id)
                                  }
                                  placeholder="Select PO type"
                                  disabled={loading.reckonerTypes}
                                  isLoading={loading.reckonerTypes}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                              <button
                                onClick={() => setEditingSiteId(null)}
                                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-xl transition-colors duration-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateSite(site.site_id)}
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 shadow-lg"
                                disabled={loading.submitting}
                              >
                                {loading.submitting ? "Updating..." : "Update Site"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              { label: "Site Name", value: site.site_name, icon: Building2 },
                              { label: "PO Number", value: site.po_number, icon: FileText },
                              { label: "Start Date", value: site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A", icon: Calendar },
                              { label: "End Date", value: site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A", icon: Calendar },
                              { label: "Incharge Type", value: site.incharge_type || "N/A", icon: User },
                              { label: "Location", value: site.location_name || "N/A", icon: MapPin },
                              { label: "PO Type", value: site.type_name || "N/A", icon: Settings },
                            ].map((item, idx) => (
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
                        )}
                      </div>

                      {/* Work Descriptions Section */}
                      <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800">Work Descriptions</h3>
                        </div>

                        {siteReckonerData[site.site_id]?.length > 0 ? (
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
                        ) : creatingReckonerSiteId === site.site_id ? (
                          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <Plus className="w-5 h-5 text-indigo-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-slate-700">
                                Create Reckoner for {site.site_name}
                              </h4>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-8">
                              <input type="hidden" name="poNumber" value={formData.poNumber} />
                              <input type="hidden" name="siteId" value={formData.siteId} />

                              <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-800">Categories</h2>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={addCategory}
                                    className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                  >
                                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                    Add Category
                                  </button>
                                </div>

                                {formData.categories.map((category, categoryIndex) => (
                                  <div
                                    key={categoryIndex}
                                    className={`border-2 rounded-2xl p-6 space-y-6 ${getRandomColor(categoryIndex)} shadow-lg hover:shadow-xl transition-all duration-300`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div>
                                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Category Name
                                          </label>
                                          <SearchableDropdown
                                            options={categories.map((cat) => ({
                                              id: cat.category_id,
                                              name: cat.category_name,
                                            }))}
                                            value={category.categoryName}
                                            onChange={(value, id) => handleCategoryChange(categoryIndex, value)}
                                            onCreate={async (name) => {
                                              const newCategory = await handleCreateCategory(name);
                                              if (newCategory) {
                                                handleCategoryChange(categoryIndex, newCategory.category_name);
                                              }
                                            }}
                                            placeholder="Search or add category"
                                            disabled={loading.categories}
                                            isLoading={loading.categories}
                                          />
                                        </div>
                                        <div className="flex items-end justify-end">
                                          {formData.categories.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => removeCategory(categoryIndex)}
                                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                              <Trash2 className="w-4 h-4 mr-2" />
                                              Remove Category
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => toggleCategory(categoryIndex)}
                                        className="ml-4 p-3 rounded-xl hover:bg-white/50 transition-colors duration-200 shadow-md"
                                        aria-label={
                                          openCategories[categoryIndex]
                                            ? "Collapse Category"
                                            : "Expand Category"
                                        }
                                      >
                                        {openCategories[categoryIndex] ? (
                                          <ChevronUp className="w-5 h-5 text-slate-600" />
                                        ) : (
                                          <ChevronDown className="w-5 h-5 text-slate-600" />
                                        )}
                                      </button>
                                    </div>

                                    {openCategories[categoryIndex] && category.categoryName && (
                                      <div className="space-y-6 mt-6 transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                          <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Settings className="w-4 h-4 text-indigo-600" />
                                          </div>
                                          <h3 className="text-lg font-semibold text-slate-700">Items</h3>
                                        </div>
                                        
                                        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                                          <table className="min-w-full divide-y divide-slate-200">
                                            <thead className={`${getRandomColor(categoryIndex + 1)} border-b border-slate-200`}>
                                              <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  Item No
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  Description
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  Qty
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  UOM
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  Rate
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  Value
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  Actions
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100">
                                              {category.items.map((item, itemIndex) => (
                                                <React.Fragment key={itemIndex}>
                                                  <tr className={itemIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                      <input
                                                        type="text"
                                                        name="itemNo"
                                                        value={item.itemNo}
                                                        onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-2 border text-sm bg-white"
                                                        required
                                                        placeholder="Item No"
                                                      />
                                                    </td>
                                                    <td className="px-4 py-3 w-[250px] whitespace-nowrap">
                                                      <SearchableDropdown
                                                        options={workItems.map((item) => ({
                                                          id: item.desc_id,
                                                          name: item.desc_name,
                                                        }))}
                                                        value={item.descName}
                                                        onChange={(value) => handleItemDescriptionChange(categoryIndex, itemIndex, value)}
                                                        onCreate={async (name) => {
                                                          const newWorkItem = await handleCreateWorkItem(name);
                                                          if (newWorkItem) {
                                                            handleItemDescriptionChange(categoryIndex, itemIndex, newWorkItem.desc_name);
                                                          }
                                                        }}
                                                        placeholder="Search or add description"
                                                        disabled={loading.workItems}
                                                        isLoading={loading.workItems}
                                                      />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                      <input
                                                        type="number"
                                                        name="poQuantity"
                                                        value={item.poQuantity}
                                                        onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-2 border text-sm bg-white"
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="Qty"
                                                      />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                      <input
                                                        type="text"
                                                        name="unitOfMeasure"
                                                        value={item.unitOfMeasure}
                                                        onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-2 border text-sm bg-white"
                                                        required
                                                        placeholder="UOM"
                                                      />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                      <input
                                                        type="number"
                                                        name="rate"
                                                        value={item.rate}
                                                        onChange={(e) => handleItemChange(categoryIndex, itemIndex, e)}
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-2 border text-sm bg-white"
                                                        required
                                                        min="0"
                                                        step="1"
                                                        placeholder="Rate"
                                                      />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                      <input
                                                        type="text"
                                                        name="value"
                                                        value={item.value}
                                                        readOnly
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm p-2 border bg-slate-100 text-sm"
                                                      />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                      <button
                                                        type="button"
                                                        onClick={() => removeItemRow(categoryIndex, itemIndex)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                                        disabled={category.items.length <= 1}
                                                      >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Remove
                                                      </button>
                                                    </td>
                                                  </tr>
                                                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                                                    <td colSpan="7" className="px-4 py-4">
                                                      <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                          <label className="block text-sm font-semibold text-slate-700">
                                                            Select Subcategories
                                                          </label>
                                                          <div className="flex items-center gap-2">
                                                            <input
                                                              type="text"
                                                              value={newSubcategory}
                                                              onChange={(e) => setNewSubcategory(e.target.value)}
                                                              placeholder="Add subcategory"
                                                              className="rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-2 border text-sm bg-white"
                                                            />
                                                            {newSubcategory && (
                                                              <button
                                                                type="button"
                                                                onClick={() => handleCreateSubcategory(categoryIndex, itemIndex)}
                                                                className="inline-flex items-center p-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                                                              >
                                                                <Save className="w-4 h-4" />
                                                              </button>
                                                            )}
                                                          </div>
                                                        </div>
                                                        <div className="max-h-32 overflow-y-auto border border-slate-300 rounded-xl p-3 bg-white shadow-inner">
                                                          {subcategories
                                                            .reduce((acc, subcat, index) => {
                                                              const chunkIndex = Math.floor(index / 7);
                                                              if (!acc[chunkIndex]) {
                                                                acc[chunkIndex] = [];
                                                              }
                                                              acc[chunkIndex].push(subcat);
                                                              return acc;
                                                            }, [])
                                                            .map((chunk, chunkIndex) => (
                                                              <div
                                                                key={`chunk-${chunkIndex}`}
                                                                className="flex flex-wrap mb-2"
                                                              >
                                                                {chunk.map((subcat) => (
                                                                  <div
                                                                    key={subcat.subcategory_id}
                                                                    className="flex items-center mb-2 w-1/4 pr-4"
                                                                  >
                                                                    <input
                                                                      type="checkbox"
                                                                      id={`subcat-${categoryIndex}-${itemIndex}-${subcat.subcategory_id}`}
                                                                      checked={item.subcategories.some(
                                                                        (sc) => sc.subcategoryId === subcat.subcategory_id
                                                                      )}
                                                                      onChange={(e) =>
                                                                        handleSubcategorySelection(
                                                                          categoryIndex,
                                                                          itemIndex,
                                                                          subcat.subcategory_id,
                                                                          e.target.checked
                                                                        )
                                                                      }
                                                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                                                      disabled={loading.subcategories || !item.descName}
                                                                    />
                                                                    <label
                                                                      htmlFor={`subcat-${categoryIndex}-${itemIndex}-${subcat.subcategory_id}`}
                                                                      className="ml-2 text-sm text-slate-700 truncate"
                                                                    >
                                                                      {subcat.subcategory_name}
                                                                    </label>
                                                                  </div>
                                                                ))}
                                                              </div>
                                                            ))}
                                                        </div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                  {item.subcategories.length > 0 && (
                                                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                                      <td colSpan="7" className="px-4 py-4">
                                                        <div className="mb-2">
                                                          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                            <Settings className="w-4 h-4" />
                                                            Subcategory Details
                                                          </h4>
                                                          <table className="min-w-full divide-y divide-slate-200 bg-white rounded-lg shadow-sm border border-slate-200">
                                                            <thead className="bg-gradient-to-r from-slate-200 to-slate-100">
                                                              <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                                  Subcategory
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                                  Qty
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                                  Rate
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                                  Value
                                                                </th>
                                                              </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                              {item.subcategories.map((subcat, subcatIndex) => (
                                                                <tr
                                                                  key={subcatIndex}
                                                                  className={subcatIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                                                                >
                                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 font-medium">
                                                                    {subcat.subcategoryName}
                                                                  </td>
                                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                                                    {subcat.poQuantity}
                                                                  </td>
                                                                  <td className="px-4 py-3 whitespace-nowrap">
                                                                    <input
                                                                      type="number"
                                                                      value={subcat.rate}
                                                                      onChange={(e) =>
                                                                        handleSubcategoryRateChange(
                                                                          categoryIndex,
                                                                          itemIndex,
                                                                          subcatIndex,
                                                                          e
                                                                        )
                                                                      }
                                                                      className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 p-2 border text-sm bg-white"
                                                                      min="0"
                                                                      step="1"
                                                                    />
                                                                  </td>
                                                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 font-mono">
                                                                    {subcat.value}
                                                                  </td>
                                                                </tr>
                                                              ))}
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  )}
                                                </React.Fragment>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>

                                        <div className="mt-6">
                                          <button
                                            type="button"
                                            onClick={(e) => addItemRow(categoryIndex, e)}
                                            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                          >
                                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                            Add Item
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="pt-8 flex justify-end space-x-4 border-t border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => setCreatingReckonerSiteId(null)}
                                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-xl transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-lg text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                  disabled={isSubmitDisabled()}
                                >
                                  {loading.submitting ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                      Submitting...
                                    </>
                                  ) : loading.processing ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-2" />
                                      Submit
                                    </>
                                  )}
                                </button>
                              </div>
                            </form>
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading.sites && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 animate-pulse"></div>
              </div>
              <p className="text-slate-600 font-medium">Loading sites...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedCompanyId && !loading.sites && sites.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-slate-100 rounded-2xl">
                <Building2 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-slate-800 font-semibold text-lg">No sites found</h3>
              <p className="text-slate-600 text-center">
                No sites available for the selected client. Create a new site to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POMasterCreation;
