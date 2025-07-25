import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  loadFlatCategoryList,
  createCategory,
  removeParentCategory,
  removeSubCategory,
  editParentCategory,
  editSubCategory,
} from "../../../redux/slices/categorySlice";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useCategoryManagement = () => {
  const dispatch = useDispatch();
  const { flatCategoryList, loadingFlatList, errorFlatList, loading } =
    useSelector((state) => state.category);

  // State management
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: 1,
    parentId: undefined,
    parentIdLevel1: undefined,
    image: null,
  });

  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal-related logic
  const modalHandlers = {
    handleAdd: () => {
      setEditingCategory(null);
      setModalMode("add");
      setIsModalVisible(true);
      setFormData({
        name: "",
        description: "",
        level: 1,
        parentId: undefined,
        image: null,
      });
    },

    handleEdit: (category) => {
      let parentIdLevel1 = undefined;
      if (category.level === 3 && category.parentId) {
        const parentCat = flatCategoryList.find(
          (cat) => cat.id === category.parentId
        );
        parentIdLevel1 = parentCat?.parentId || undefined;
      }

      setEditingCategory(category);
      setModalMode("edit");
      setIsModalVisible(true);
      setFormData({
        name: category.name || "",
        description: category.description || "",
        parentId: category.parentId || undefined,
        parentIdLevel1: parentIdLevel1,
        level: category.level || 1,
        image: category.image || null,
      });
    },

    handleSubmit: async (e) => {
      e.preventDefault();
      if (!formData.name || formData.name.trim().length < 2) {
        Swal.fire("Lỗi", "Tên danh mục phải có ít nhất 2 ký tự!", "error");
        return;
      }
      if (formData.level > 1 && !formData.parentId) {
        Swal.fire("Lỗi", "Vui lòng chọn danh mục cha!", "error");
        return;
      }

      try {
        const categoryData = new FormData();
        categoryData.append("name", formData.name.trim());
        categoryData.append(
          "description",
          formData.description ? formData.description.trim() : ""
        );
        if (formData.level > 1 && formData.parentId) {
          categoryData.append("parentId", formData.parentId);
        }
        if (formData.image instanceof File) {
          categoryData.append("image", formData.image); // Send new image file
        }
        console.log(
          "handleSubmit: Sending categoryData:",
          Array.from(categoryData.entries())
        );

        if (modalMode === "add") {
          await dispatch(createCategory(categoryData)).unwrap();
          Swal.fire("Thành công!", "Thêm danh mục thành công!", "success");
          console.log("handleSubmit: Reloading data after add");
          await dispatch(loadFlatCategoryList()).unwrap();
        } else {
          const updatedData = new FormData();
          updatedData.append("name", formData.name.trim());
          updatedData.append(
            "description",
            formData.description ? formData.description.trim() : ""
          );
          if (formData.level > 1 && formData.parentId) {
            updatedData.append("parentId", formData.parentId);
          }
          if (formData.image instanceof File) {
            updatedData.append("image", formData.image); // Send new image file
          } else if (formData.image === null && editingCategory.image) {
            updatedData.append("image", ""); // Send empty string to remove image
          } // If formData.image is a string (URL) and unchanged, omit image field

          console.log(
            "handleSubmit: Sending updatedData:",
            Array.from(updatedData.entries())
          );

          if (formData.level === 1) {
            await dispatch(
              editParentCategory({ id: editingCategory.id, updatedData })
            ).unwrap();
          } else {
            await dispatch(
              editSubCategory({ id: editingCategory.id, updatedData })
            ).unwrap();
          }
          Swal.fire("Thành công!", "Cập nhật danh mục thành công!", "success");
          console.log("handleSubmit: Reloading data after edit");
          await dispatch(loadFlatCategoryList()).unwrap();
        }
        setIsModalVisible(false);
        setFormData({
          name: "",
          description: "",
          level: 1,
          parentId: undefined,
          image: null,
        });
        setEditingCategory(null);
      } catch (err) {
        console.error("handleSubmit error:", err);
        Swal.fire(
          "Thất bại!",
          `Thao tác thất bại: ${err.message || err}`,
          "error"
        );
      }
    },
  };

  // Data loading and filtering
  const dataHandlers = {
    loadData: () => dispatch(loadFlatCategoryList()),

    flattenCategories: (categories) =>
      categories.map((category) => ({
        ...category,
        level: category.level || 1,
        parentName: category.parentName || "—",
        image: category.image || null,
      })),

    handleSearch: useCallback(
      debounce((value) => {
        setSearchValue(value);
        setCurrentPage(0);
      }, 500),
      []
    ),

    filterCategories: () => {
      let filtered = dataHandlers.flattenCategories(flatCategoryList);
      if (searchValue) {
        filtered = filtered.filter(
          (cat) =>
            cat.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            (cat.description &&
              cat.description.toLowerCase().includes(searchValue.toLowerCase()))
        );
      }
      if (typeFilter !== "all") {
        filtered = filtered.filter(
          (cat) => (cat.level || 1) === parseInt(typeFilter)
        );
      }
      setFilteredCategories(filtered);
    },
  };

  // Deletion logic
  const deleteHandler = {
    handleDelete: async (category) => {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này sẽ không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          if ((category.level || 1) === 1) {
            await dispatch(removeParentCategory(category.id)).unwrap();
          } else {
            await dispatch(removeSubCategory(category.id)).unwrap();
          }
          console.log("handleDelete: Reloading data after delete");
          await dispatch(loadFlatCategoryList()).unwrap();
          Swal.fire("Đã xóa!", "Danh mục đã được xóa.", "success");
        } catch (err) {
          Swal.fire(
            "Thất bại!",
            `Xóa danh mục thất bại: ${err.message || err}`,
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Đã hủy", "Danh mục vẫn còn nguyên.", "info");
      }
    },
  };

  // Pagination logic
  const paginationHandler = {
    paginatedCategories: filteredCategories.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ),

    handlePageChange: (page, newItemsPerPage) => {
      setCurrentPage(page);
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
      }
    },
  };

  // Effect hooks
  useEffect(() => {
    dataHandlers.loadData();
  }, [dispatch]);

  useEffect(() => {
    dataHandlers.filterCategories();
  }, [flatCategoryList, searchValue, typeFilter]);

  return {
    flatCategoryList,
    loadingFlatList,
    errorFlatList,
    loading,
    filteredCategories,
    paginatedCategories: paginationHandler.paginatedCategories,
    currentPage,
    itemsPerPage,
    totalCategories: filteredCategories.length,
    level1Count: filteredCategories.filter((cat) => (cat.level || 1) === 1)
      .length,
    level2Count: filteredCategories.filter((cat) => (cat.level || 1) === 2)
      .length,
    level3Count: filteredCategories.filter((cat) => (cat.level || 1) === 3)
      .length,
    isModalVisible,
    modalMode,
    formData,
    editingCategory,
    dispatch,
    handleAdd: modalHandlers.handleAdd,
    handleEdit: modalHandlers.handleEdit,
    handleDelete: deleteHandler.handleDelete,
    handleSubmit: modalHandlers.handleSubmit,
    handleRefresh: dataHandlers.loadData,
    handlePageChange: paginationHandler.handlePageChange,
    setIsModalVisible,
    setFormData,
    setEditingCategory,
    setSearchValue: dataHandlers.handleSearch,
    setTypeFilter,
    setCurrentPage,
  };
};
