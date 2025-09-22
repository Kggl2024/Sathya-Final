// src/components/POComponents/ReckonerForm.jsx
import React from "react";
import { FileText, Plus, Check } from "lucide-react";
import CategorySection from "./CategorySection";

const ReckonerForm = ({
  formData,
  handleSubmit,
  categories,
  handleCategoryChange,
  handleCreateCategory,
  removeCategory,
  addCategory,
  toggleCategory,
  openCategories,
  workItems,
  handleItemChange,
  handleItemDescriptionChange,
  handleCreateWorkItem,
  removeItemRow,
  addItemRow,
  subcategories,
  handleSubcategorySelection,
  newSubcategory,
  setNewSubcategory,
  handleCreateSubcategory,
  handleSubcategoryRateChange,
  loading,
  getRandomColor,
  isSubmitDisabled,
  setCreatingReckonerSiteId
}) => {
  return (
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
          <CategorySection
            key={categoryIndex}
            category={category}
            categoryIndex={categoryIndex}
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            handleCreateCategory={handleCreateCategory}
            removeCategory={removeCategory}
            toggleCategory={toggleCategory}
            openCategories={openCategories}
            workItems={workItems}
            handleItemChange={handleItemChange}
            handleItemDescriptionChange={handleItemDescriptionChange}
            handleCreateWorkItem={handleCreateWorkItem}
            removeItemRow={removeItemRow}
            addItemRow={addItemRow}
            subcategories={subcategories}
            handleSubcategorySelection={handleSubcategorySelection}
            newSubcategory={newSubcategory}
            setNewSubcategory={setNewSubcategory}
            handleCreateSubcategory={handleCreateSubcategory}
            handleSubcategoryRateChange={handleSubcategoryRateChange}
            loading={loading}
            getRandomColor={getRandomColor}
            formDataCategoriesLength={formData.categories.length}
          />
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
  );
};

export default ReckonerForm;