import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, ChevronDown, ChevronUp, Save, Eye, Edit } from "lucide-react";

const getRandomColor = (index) => {
  const colors = [
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200",
    "bg-indigo-50 border-indigo-200",
    "bg-teal-50 border-teal-200",
    "bg-orange-50 border-orange-200",
    "bg-cyan-50 border-cyan-200",
    "bg-amber-50 border-amber-200",
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

const SearchableDropdown = ({ options, value, onChange, placeholder, disabled, isLoading }) => {
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
        disabled={disabled || isLoading}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-100"
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options found
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
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    onChange(option.company_id);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        value={
          searchTerm ||
          (value
            ? options.find((opt) => opt.company_id === value)?.company_name || ""
            : "")
        }
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
        disabled={disabled || isLoading}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.company_id}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-100"
              onClick={() => handleSelect(option)}
            >
              {option.company_name}
            </div>
          ))}
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
  }, [selectedCompany]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading((prev) => ({ ...prev, inchargeTypes: true }));
        const inchargeResponse = await axios.get("http://localhost:5000/reckoner/incharge-types");
        setInchargeTypes(
          inchargeResponse.data.data.map((item) => ({
            id: item.incharge_id,
            name: item.incharge_type,
          }))
        );

        setLoading((prev) => ({ ...prev, locations: true }));
        const locationResponse = await axios.get("http://localhost:5000/reckoner/locations");
        setLocations(
          locationResponse.data.data.map((item) => ({
            id: item.location_id,
            name: item.location_name,
          }))
        );

        setLoading((prev) => ({ ...prev, reckonerTypes: true }));
        const reckonerTypeResponse = await axios.get("http://localhost:5000/reckoner/reckoner-types");
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
            `http://localhost:5000/reckoner/sites-by-company/${selectedCompanyId}`
          );
          const sitesData = response.data.data || [];
          setSites(sitesData);

          const siteReckonerPromises = sitesData.map(async (site) => {
            try {
              const reckonerResponse = await axios.get(
                `http://localhost:5000/reckoner/site-reckoner/${site.site_id}`
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
        const categoriesRes = await axios.get("http://localhost:5000/reckoner/categories");
        setCategories(categoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, subcategories: true }));
        const subcategoriesRes = await axios.get("http://localhost:5000/reckoner/subcategories");
        setSubcategories(subcategoriesRes.data.data || []);

        setLoading((prev) => ({ ...prev, workItems: true }));
        const workItemsRes = await axios.get("http://localhost:5000/reckoner/work-items");
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

      await axios.put(`http://localhost:5000/reckoner/sites/${siteId}`, updateData);

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
        `http://localhost:5000/reckoner/sites-by-company/${selectedCompanyId}`
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
    setSelectedCompanyId(value);
    localStorage.setItem("selectedCompanyId", value);
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
      const response = await axios.post("http://localhost:5000/reckoner/categories", {
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
      const response = await axios.post("http://localhost:5000/reckoner/work-items", {
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
      const response = await axios.post("http://localhost:5000/reckoner/subcategories", {
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
      await axios.get(`http://localhost:5000/sheet/process/${encodeURIComponent(poNumber)}`);
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

      await axios.post("http://localhost:5000/reckoner/reckoner", submissionData);
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
        `http://localhost:5000/reckoner/sites-by-company/${selectedCompanyId}`
      );
      const sitesData = response.data.data || [];
      setSites(sitesData);

      const siteReckonerPromises = sitesData.map(async (site) => {
        try {
          const reckonerResponse = await axios.get(
            `http://localhost:5000/reckoner/site-reckoner/${site.site_id}`
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
    <div className="flex justify-center items-start min-h-screen bg-gray-50">
      <div className="container w-full mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Master PO Creation</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-7/12">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Client</label>
              <SearchableClientDropdown
                options={companies}
                value={selectedCompanyId}
                onChange={handleCompanyChange}
                placeholder="Search client"
                disabled={loading.companies}
                isLoading={loading.companies}
              />
            </div>
            <div className="w-full sm:w-3/12 flex items-end">
              <button
                onClick={onShowProjectModal}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                disabled={!selectedCompanyId}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Site
              </button>
            </div>
          </div>

          {selectedCompanyId && sites.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sites for Selected Client</h2>
              <div className="space-y-4">
                {sites.map((site) => (
                  <div
                    key={site.site_id}
                    className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleToggleSite(site.site_id)}
                    >
                      <div className="flex items-center space-x-6">
                        <span className="font-medium text-gray-900 text-base">{site.site_name}</span>
                        <span className="text-gray-600 text-base">PO: {site.po_number}</span>
                        <span className="text-gray-800 text-base">Cost Center: {site.project_name}</span>
                      </div>
                      {expandedSite === site.site_id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    {expandedSite === site.site_id && (
                      <div className="p-6 bg-white space-y-8">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Site Details</h3>
                            {editingSiteId !== site.site_id && (
                              <button
                                onClick={() => handleEditSite(site.site_id)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Site Details
                              </button>
                            )}
                          </div>
                          {editingSiteId === site.site_id ? (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Site Name
                                  </label>
                                  <input
                                    type="text"
                                    name="site_name"
                                    value={editSiteData.site_name}
                                    onChange={handleEditSiteChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    PO Number
                                  </label>
                                  <input
                                    type="text"
                                    name="po_number"
                                    value={editSiteData.po_number}
                                    onChange={handleEditSiteChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    name="start_date"
                                    value={formatDateForInput(editSiteData.start_date)}
                                    onChange={handleEditSiteChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    name="end_date"
                                    value={formatDateForInput(editSiteData.end_date)}
                                    onChange={handleEditSiteChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                              <div className="mt-6 flex justify-end space-x-3">
                                <button
                                  onClick={() => setEditingSiteId(null)}
                                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpdateSite(site.site_id)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                                  disabled={loading.submitting}
                                >
                                  {loading.submitting ? "Updating..." : "Update Site"}
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Site Name:</p>
                                <p className="text-sm text-gray-900">{site.site_name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">PO Number:</p>
                                <p className="text-sm text-gray-900">{site.po_number}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Start Date:</p>
                                <p className="text-sm text-gray-900">
                                  {site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">End Date:</p>
                                <p className="text-sm text-gray-900">
                                  {site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Incharge Type:</p>
                                <p className="text-sm text-gray-900">{site.incharge_type || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Location:</p>
                                <p className="text-sm text-gray-900">{site.location_name || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">PO Type:</p>
                                <p className="text-sm text-gray-900">{site.type_name || "N/A"}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Descriptions</h3>
                          {siteReckonerData[site.site_id]?.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                                <thead className="bg-indigo-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                      Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {siteReckonerData[site.site_id].map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.category_name}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.desc_name}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : creatingReckonerSiteId === site.site_id ? (
                            <div>
                              <h4 className="text-md font-semibold text-gray-700 mb-4">
                                Create Reckoner for {site.site_name}
                              </h4>
                              <form onSubmit={handleSubmit} className="space-y-6">
                                <input type="hidden" name="poNumber" value={formData.poNumber} />
                                <input type="hidden" name="siteId" value={formData.siteId} />

                                <div className="space-y-6">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
                                    <button
                                      type="button"
                                      onClick={addCategory}
                                      className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Category
                                    </button>
                                  </div>

                                  {formData.categories.map((category, categoryIndex) => (
                                    <div
                                      key={categoryIndex}
                                      className={`border rounded-lg p-4 space-y-4 ${getRandomColor(
                                        categoryIndex
                                      )} border-2 shadow-sm transition-all duration-300`}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                          <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                              Category Name
                                            </label>
                                            <SearchableDropdown
                                              options={categories.map((cat) => ({
                                                id: cat.category_id,
                                                name: cat.category_name,
                                              }))}
                                              value={category.categoryName}
                                              onChange={(value, id) =>
                                                handleCategoryChange(categoryIndex, value)
                                              }
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
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                                              >
                                                Remove Category
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => toggleCategory(categoryIndex)}
                                          className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                          aria-label={
                                            openCategories[categoryIndex]
                                              ? "Collapse Category"
                                              : "Expand Category"
                                          }
                                        >
                                          {openCategories[categoryIndex] ? (
                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                          ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                          )}
                                        </button>
                                      </div>

                                      {openCategories[categoryIndex] && category.categoryName && (
                                        <div className="space-y-6 mt-4 transition-all duration-300">
                                          <h3 className="text-md font-semibold text-gray-700">Items</h3>
                                          <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                              <thead className={`${getRandomColor(categoryIndex + 1)}`}>
                                                <tr>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Item No
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Description
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Qty
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    UOM
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Rate
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Value
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Actions
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody className="bg-white divide-y divide-gray-200">
                                                {category.items.map((item, itemIndex) => (
                                                  <React.Fragment key={itemIndex}>
                                                    <tr
                                                      className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                                    >
                                                      <td className="px-3 py-2 whitespace-nowrap">
                                                        <input
                                                          type="text"
                                                          name="itemNo"
                                                          value={item.itemNo}
                                                          onChange={(e) =>
                                                            handleItemChange(categoryIndex, itemIndex, e)
                                                          }
                                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                                          required
                                                          placeholder="Item No"
                                                        />
                                                      </td>
                                                      <td className="px-3 py-2 w-[250px] whitespace-nowrap">
                                                        <SearchableDropdown
                                                          options={workItems.map((item) => ({
                                                            id: item.desc_id,
                                                            name: item.desc_name,
                                                          }))}
                                                          value={item.descName}
                                                          onChange={(value) =>
                                                            handleItemDescriptionChange(
                                                              categoryIndex,
                                                              itemIndex,
                                                              value
                                                            )
                                                          }
                                                          onCreate={async (name) => {
                                                            const newWorkItem = await handleCreateWorkItem(name);
                                                            if (newWorkItem) {
                                                              handleItemDescriptionChange(
                                                                categoryIndex,
                                                                itemIndex,
                                                                newWorkItem.desc_name
                                                              );
                                                            }
                                                          }}
                                                          placeholder="Search or add description"
                                                          disabled={loading.workItems}
                                                          isLoading={loading.workItems}
                                                        />
                                                      </td>
                                                      <td className="px-3 py-2 whitespace-nowrap">
                                                        <input
                                                          type="number"
                                                          name="poQuantity"
                                                          value={item.poQuantity}
                                                          onChange={(e) =>
                                                            handleItemChange(categoryIndex, itemIndex, e)
                                                          }
                                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                                          required
                                                          min="0"
                                                          step="0.01"
                                                          placeholder="Qty"
                                                        />
                                                      </td>
                                                      <td className="px-3 py-2 whitespace-nowrap">
                                                        <input
                                                          type="text"
                                                          name="unitOfMeasure"
                                                          value={item.unitOfMeasure}
                                                          onChange={(e) =>
                                                            handleItemChange(categoryIndex, itemIndex, e)
                                                          }
                                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                                          required
                                                          placeholder="UOM"
                                                        />
                                                      </td>
                                                      <td className="px-3 py-2 whitespace-nowrap">
                                                        <input
                                                          type="number"
                                                          name="rate"
                                                          value={item.rate}
                                                          onChange={(e) =>
                                                            handleItemChange(categoryIndex, itemIndex, e)
                                                          }
                                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm"
                                                          required
                                                          min="0"
                                                          step="1"
                                                          placeholder="Rate"
                                                        />
                                                      </td>
                                                      <td className="px-3 py-2 whitespace-nowrap">
                                                        <input
                                                          type="text"
                                                          name="value"
                                                          value={item.value}
                                                          readOnly
                                                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-gray-100 text-sm"
                                                        />
                                                      </td>
                                                      <td className="px-3 py-2 whitespace-nowrap">
                                                        <button
                                                          type="button"
                                                          onClick={() => removeItemRow(categoryIndex, itemIndex)}
                                                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                                          disabled={category.items.length <= 1}
                                                        >
                                                          Remove
                                                        </button>
                                                      </td>
                                                    </tr>
                                                    <tr className="bg-gray-100">
                                                      <td colSpan="7" className="px-3 py-2">
                                                        <div className="mb-2">
                                                          <div className="flex items-center justify-between mb-2">
                                                            <label className="block text-sm font-semibold text-gray-700">
                                                              Select Subcategories
                                                            </label>
                                                            <div className="flex items-center">
                                                              <input
                                                                type="text"
                                                                value={newSubcategory}
                                                                onChange={(e) => setNewSubcategory(e.target.value)}
                                                                placeholder="Add subcategory"
                                                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm mr-2"
                                                              />
                                                              {newSubcategory && (
                                                                <button
                                                                  type="button"
                                                                  onClick={() =>
                                                                    handleCreateSubcategory(categoryIndex, itemIndex)
                                                                  }
                                                                  className="inline-flex items-center p-2 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                                                >
                                                                  <Save className="w-4 h-4" />
                                                                </button>
                                                              )}
                                                            </div>
                                                          </div>
                                                          <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white">
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
                                                                      className="flex items-center mb-1 w-1/4 pr-4"
                                                                    >
                                                                      <input
                                                                        type="checkbox"
                                                                        id={`subcat-${categoryIndex}-${itemIndex}-${subcat.subcategory_id}`}
                                                                        checked={item.subcategories.some(
                                                                          (sc) =>
                                                                            sc.subcategoryId === subcat.subcategory_id
                                                                        )}
                                                                        onChange={(e) =>
                                                                          handleSubcategorySelection(
                                                                            categoryIndex,
                                                                            itemIndex,
                                                                            subcat.subcategory_id,
                                                                            e.target.checked
                                                                          )
                                                                        }
                                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                        disabled={loading.subcategories || !item.descName}
                                                                      />
                                                                      <label
                                                                        htmlFor={`subcat-${categoryIndex}-${itemIndex}-${subcat.subcategory_id}`}
                                                                        className="ml-2 text-sm text-gray-700 truncate"
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
                                                      <tr className="bg-gray-50">
                                                        <td colSpan="7" className="px-3 py-2">
                                                          <div className="mb-2">
                                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                                              Subcategory Details
                                                            </h4>
                                                            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
                                                              <thead className="bg-gray-200">
                                                                <tr>
                                                                  <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Subcategory
                                                                  </th>
                                                                  <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Qty
                                                                  </th>
                                                                  <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Rate
                                                                  </th>
                                                                  <th className="px-3 py-1 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Value
                                                                  </th>
                                                                </tr>
                                                              </thead>
                                                              <tbody className="divide-y divide-gray-200">
                                                                {item.subcategories.map((subcat, subcatIndex) => (
                                                                  <tr
                                                                    key={subcatIndex}
                                                                    className={
                                                                      subcatIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                                    }
                                                                  >
                                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                                      {subcat.subcategoryName}
                                                                    </td>
                                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                                                                      {subcat.poQuantity}
                                                                    </td>
                                                                    <td className="px-3 py-2 whitespace-nowrap">
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
                                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 border text-sm"
                                                                        min="0"
                                                                        step="1"
                                                                      />
                                                                    </td>
                                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
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
                                          <div className="mt-4">
                                            <button
                                              type="button"
                                              onClick={(e) => addItemRow(categoryIndex, e)}
                                              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                                            >
                                              <Plus className="w-4 h-4 mr-2" />
                                              Add Item
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-6 flex justify-end space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => setCreatingReckonerSiteId(null)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-md transition-colors duration-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitDisabled()}
                                  >
                                    {loading.submitting ? (
                                      <>
                                        <svg
                                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                        Submitting...
                                      </>
                                    ) : loading.processing ? (
                                      <>
                                        <svg
                                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                        Processing...
                                      </>
                                    ) : (
                                      "Submit"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <div className="flex flex-col items-start space-y-4">
                              <p className="text-sm text-red-600 font-medium">Reckoner Not Created</p>
                              <button
                                onClick={() => handleCreateReckoner(site.site_id)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                              >
                                <Plus className="w-4 h-4 mr-2" />
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
        </div>
      {/* <div className="container max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/70 transform transition-all duration-500 animate-slide-in-right">
        
      </div> */}
    </div>
  );
};

export default POMasterCreation;