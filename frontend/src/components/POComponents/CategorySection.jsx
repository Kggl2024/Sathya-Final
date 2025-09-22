// src/components/POComponents/CategorySection.jsx
import React from "react";
import { ChevronDown, ChevronUp, Settings, Trash2, Plus } from "lucide-react";
import SearchableDropdown from "./SearchableDropdown";
import ItemsTable from "./ItemsTable";

const CategorySection = ({
  category,
  categoryIndex,
  categories,
  handleCategoryChange,
  handleCreateCategory,
  removeCategory,
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
  formDataCategoriesLength
}) => {
  return (
    <div
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
            {formDataCategoriesLength > 1 && (
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
          
          <ItemsTable
            category={category}
            categoryIndex={categoryIndex}
            workItems={workItems}
            handleItemChange={handleItemChange}
            handleItemDescriptionChange={handleItemDescriptionChange}
            handleCreateWorkItem={handleCreateWorkItem}
            removeItemRow={removeItemRow}
            subcategories={subcategories}
            handleSubcategorySelection={handleSubcategorySelection}
            newSubcategory={newSubcategory}
            setNewSubcategory={setNewSubcategory}
            handleCreateSubcategory={handleCreateSubcategory}
            handleSubcategoryRateChange={handleSubcategoryRateChange}
            loading={loading}
            getRandomColor={getRandomColor}
          />

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
  );
};

export default CategorySection;