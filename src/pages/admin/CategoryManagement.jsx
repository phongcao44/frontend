import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  loadFlatCategoryList,
  createCategory,
  removeParentCategory,
  removeSubCategory,
  editParentCategory,
  editSubCategory,
} from "../../redux/slices/categorySlice";
import {
  Folder,
  Edit,
  Trash,
  Plus,
  Search,
  RefreshCw,
  Download,
  FolderOpen,
  FileText,
  ChevronDown,
} from "lucide-react";
import Pagination from "../../components/Pagination";
import { handleDownloadExcel } from "../../services/handleDownloadExcel";

// Hàm debounce tự viết
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { flatCategoryList, loadingFlatList, errorFlatList, loading } =
    useSelector((state) => state.category);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: 1,
    icon: "📁",
    parentId: undefined,
  });
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchValue(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  useEffect(() => {
    dispatch(loadFlatCategoryList());
  }, [dispatch]);

  useEffect(() => {
    let filtered = flattenCategories(flatCategoryList);

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
  }, [flatCategoryList, searchValue, typeFilter]);

  const paginatedCategories = filteredCategories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const getDefaultIcon = (level) => {
    const icons = {
      1: <Folder className="h-5 w-5" />,
      2: <FolderOpen className="h-5 w-5" />,
      3: <FileText className="h-5 w-5" />,
    };
    return icons[level] || <Folder className="h-5 w-5" />;
  };

  const flattenCategories = (categories) => {
    return categories.map((category) => ({
      ...category,
      level: category.level || 1,
      icon: getDefaultIcon(category.level || 1),
      parentName: category.parentId
        ? categories.find((c) => c.id === category.parentId)?.name || "—"
        : "—",
    }));
  };

  const getParentOptions = (level, editingCategoryId) => {
    const parentLevel = level - 1;
    return flatCategoryList
      .filter(
        (category) =>
          (category.level || 1) === parentLevel &&
          category.id !== editingCategoryId
      )
      .map((category) => ({
        id: category.id,
        name: category.name,
        level: category.level || 1,
      }));
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setModalMode("add");
    setIsModalVisible(true);
    setFormData({
      level: 1,
      icon: getDefaultIcon(1),
      name: "",
      description: "",
      parentId: undefined,
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalMode("edit");
    setIsModalVisible(true);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      parentId: category.parentId || undefined,
      level: category.level || 1,
      icon: getDefaultIcon(category.level || 1),
    });
  };

  const handleDelete = async (category) => {
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
  };

  const handleSubmit = async (e) => {
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
      const apiData = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : "",
        parentId: formData.level > 1 ? formData.parentId || null : null,
      };

      if (modalMode === "add") {
        await dispatch(createCategory(apiData)).unwrap();
        Swal.fire("Thành công!", "Thêm danh mục thành công!", "success");
      } else {
        const updatedData = {
          name: formData.name.trim(),
          description: formData.description ? formData.description.trim() : "",
          parentId: formData.level > 1 ? formData.parentId || null : null,
        };

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
      }
      setIsModalVisible(false);
      setFormData({
        name: "",
        description: "",
        level: 1,
        icon: getDefaultIcon(1),
        parentId: undefined,
      });
      setEditingCategory(null);
    } catch (err) {
      Swal.fire(
        "Thất bại!",
        `Thao tác thất bại: ${err.message || err}`,
        "error"
      );
    }
  };

  const handleLevelChange = (e) => {
    const level = parseInt(e.target.value);
    setFormData({
      ...formData,
      level,
      icon: getDefaultIcon(level),
      parentId: undefined,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRefresh = () => {
    dispatch(loadFlatCategoryList());
  };

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const totalCategories = filteredCategories.length;
  const level1Count = filteredCategories.filter(
    (cat) => (cat.level || 1) === 1
  ).length;
  const level2Count = filteredCategories.filter(
    (cat) => (cat.level || 1) === 2
  ).length;
  const level3Count = filteredCategories.filter(
    (cat) => (cat.level || 1) === 3
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý danh mục
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Theo dõi và quản lý tất cả danh mục sản phẩm
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={loadingFlatList}
              >
                <RefreshCw
                  className={`h-5 w-5 ${loadingFlatList ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Thêm danh mục</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng danh mục
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCategories}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Folder className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Danh mục cấp 1
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {level1Count}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Danh mục cấp 2
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {level2Count}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Danh mục cấp 3
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {level3Count}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="1">Cấp 1</option>
                <option value="2">Cấp 2</option>
                <option value="3">Cấp 3</option>
              </select>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả danh mục..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Icon</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tên danh mục
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Danh mục cha
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                                {category.icon}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {"—".repeat((category.level || 1) - 1)}{" "}
                                  {category.name || "Unknown"}
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                  Cấp {category.level || 1}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs">
                            {category.description || (
                              <span className="text-gray-400">
                                Chưa có mô tả
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.parentName || (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                onClick={() => handleDelete(category)}
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:hidden space-y-4">
                {paginatedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                          {category.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {"—".repeat((category.level || 1) - 1)}{" "}
                            {category.name || "Unknown"}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Cấp {category.level || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Folder className="h-4 w-4 mr-2" />
                          <span>Mô tả:</span>
                        </div>
                        <span className="text-sm text-gray-500 max-w-xs">
                          {category.description || (
                            <span className="text-gray-400">Chưa có mô tả</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          <span>Danh mục cha:</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category.parentName || (
                            <span className="text-gray-400">—</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                      <button
                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4 inline mr-2" />
                        Sửa
                      </button>
                      <button
                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash className="h-4 w-4 inline mr-2" />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={totalCategories}
                itemsPerPage={itemsPerPage}
                onPageChange={(page, newItemsPerPage) => {
                  handlePageChange(page, newItemsPerPage || itemsPerPage);
                }}
              />
            </>
          )}

        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {modalMode === "add" ? "Thêm danh mục mới" : "Sửa danh mục"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Icon
                    </label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2 text-center text-lg bg-gray-100 text-gray-600">
                      {formData.icon}
                    </div>
                  </div>
                  <div className="w-3/4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên danh mục"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả cho danh mục"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Cấp độ
                  </label>
                  <select
                    value={formData.level}
                    onChange={handleLevelChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={1}>Cấp 1 - Danh mục chính</option>
                    <option value={2}>Cấp 2 - Danh mục phụ</option>
                    <option value={3}>Cấp 3 - Danh mục con</option>
                  </select>
                </div>

                {formData.level > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Danh mục cha
                    </label>
                    <select
                      name="parentId"
                      value={formData.parentId || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn danh mục cha</option>
                      {getParentOptions(
                        formData.level,
                        editingCategory?.id
                      ).map((option) => (
                        <option key={option.id} value={option.id}>
                          {"—".repeat((option.level || 1) - 1)} {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
                    onClick={() => {
                      setIsModalVisible(false);
                      setFormData({
                        name: "",
                        description: "",
                        level: 1,
                        icon: getDefaultIcon(1),
                        parentId: undefined,
                      });
                      setEditingCategory(null);
                    }}
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-blue-300"
                    disabled={loading}
                  >
                    {modalMode === "add" ? "Thêm mới" : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
