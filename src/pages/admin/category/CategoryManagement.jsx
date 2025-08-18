import { useState } from "react";
import Swal from "sweetalert2";
import { Folder, Download, Plus, RefreshCw } from "lucide-react";
import CategoryHeader from "./CategoryHeader";
import CategoryStats from "./CategoryStats";
import CategoryFilter from "./CategoryFilter";
import CategoryTable from "./CategoryTable";
import CategoryMobileView from "./CategoryMobileView";
import CategoryModal from "./CategoryModal";
import Pagination from "../../../components/Pagination";
import { useCategoryManagement } from "./useCategoryManagement";

const CategoryManagement = () => {
  const {
    flatCategoryList,
    loadingFlatList,
    errorFlatList,
    loading,
    filteredCategories,
    paginatedCategories,
    currentPage,
    itemsPerPage,
    totalCategories,
    level1Count,
    level2Count,
    level3Count,
    // Global stats independent of filters
    statsTotalCategories,
    statsLevel1Count,
    statsLevel2Count,
    statsLevel3Count,
    isModalVisible,
    modalMode,
    formData,
    editingCategory,
    dispatch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleRefresh,
    handlePageChange,
    setIsModalVisible,
    setFormData,
    setEditingCategory,
    setSearchValue,
    setTypeFilter,
    typeFilter,
    setCurrentPage,
  } = useCategoryManagement();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CategoryHeader
        onRefresh={handleRefresh}
        onAdd={handleAdd}
        loadingFlatList={loadingFlatList}
        loading={loading}
      />
      
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <CategoryStats
          totalCategories={statsTotalCategories}
          level1Count={statsLevel1Count}
          level2Count={statsLevel2Count}
          level3Count={statsLevel3Count}
        />

        <CategoryFilter
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          setSearchValue={setSearchValue}
          loading={loading}
          setCurrentPage={setCurrentPage}
        />

        {loadingFlatList && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {errorFlatList && (
          <div className="bg-red-100 p-6 rounded-xl shadow-sm border border-red-200 text-center">
            <p className="text-sm text-red-600">
              Lỗi: {errorFlatList.message || "Không thể tải danh mục"}
            </p>
          </div>
        )}

        {!loadingFlatList &&
          !errorFlatList &&
          paginatedCategories.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Không tìm thấy danh mục nào.
              </p>
            </div>
          )}

        {!loadingFlatList &&
          !errorFlatList &&
          paginatedCategories.length > 0 && (
            <>
              <CategoryTable
                categories={paginatedCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <CategoryMobileView
                categories={paginatedCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={totalCategories}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}

        <CategoryModal
          isVisible={isModalVisible}
          modalMode={modalMode}
          formData={formData}
          editingCategory={editingCategory}
          categories={flatCategoryList}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            setFormData({
              name: "",
              description: "",
              level: 1,
              image: null,
              parentId: undefined,
            });
            setEditingCategory(null);
          }}
          onInputChange={(e) => {
            const { name, value } = e.target;
            console.log(`onInputChange: Updating ${name} to ${value}`);
            setFormData((prev) => ({ ...prev, [name]: value }));
          }}
          onLevelChange={(e) => {
            const level = parseInt(e.target.value);
            console.log("onLevelChange: Setting level to", level);
            setFormData((prev) => ({
              ...prev,
              level,
              image: null,
              parentId: undefined,
            }));
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CategoryManagement;