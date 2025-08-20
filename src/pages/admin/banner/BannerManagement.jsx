import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Edit2, Trash2, RefreshCw, Image, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getBanners, removeBanner } from "../../../redux/slices/bannerSlice";
import BannerFormModal from "./BannerForm";
import Swal from "sweetalert2";
import Pagination from "../../../components/Pagination";
// import { handleDownloadExcel } from "../../../services/handleDownloadExcel";

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

const BannerManagement = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banner);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("startAt-desc"); // Default sort by startAt descending
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
      setIsLoading(false);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getBanners()).finally(() => setTimeout(() => setIsLoading(false), 500));
  }, [dispatch]);

  // Handle sorting and filtering
  const filteredBanners = banners
    .filter(
      (banner) =>
        (banner.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (banner.publicId || "").toLowerCase().includes(debouncedSearchTerm.toLowerCase())) &&
        (statusFilter === "" || banner.status === (statusFilter === "true"))
    )
    .sort((a, b) => {
      const [sortField, sortDirection] = sortBy.split("-");
      const isDesc = sortDirection === "desc";

      if (sortField === "startAt") {
        const dateA = new Date(a.startAt || "0");
        const dateB = new Date(b.startAt || "0");
        return isDesc ? dateB - dateA : dateA - dateB;
      } else if (sortField === "title") {
        return isDesc
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      } else if (sortField === "status") {
        return isDesc
          ? Number(b.status) - Number(a.status)
          : Number(a.status) - Number(b.status);
      }
      return 0;
    });

  const paginatedBanners = filteredBanners.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleDelete = async (id) => {
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
        await dispatch(removeBanner(id)).unwrap();
        await Swal.fire("Đã xóa!", "Banner đã được xóa.", "success");
      } catch (err) {
        await Swal.fire(
          "Thất bại!",
          `Xóa banner thất bại: ${err.message || err}`,
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire("Đã hủy", "Banner vẫn còn nguyên.", "info");
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredBanners.map((banner) => banner.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(getBanners()).finally(() => setTimeout(() => setIsLoading(false), 500));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Global stats (fixed, independent of filters)
  const globalTotalBanners = banners.length;
  const globalActiveBanners = banners.filter((banner) => banner.status).length;
  const globalInactiveBanners = banners.filter((banner) => !banner.status).length;
  const globalTodayBanners = banners.filter((banner) => {
    if (!banner.startAt) return false;
    const bannerDate = new Date(banner.startAt);
    const today = new Date();
    return bannerDate.toDateString() === today.toDateString();
  }).length;

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý banner
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Theo dõi và quản lý tất cả banner quảng cáo
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={loading || isLoading}
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading || isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Thêm banner</span>
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
                <Image className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng banner</p>
                <p className="text-2xl font-bold text-gray-900">{globalTotalBanners}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Image className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banner hiển thị</p>
                <p className="text-2xl font-bold text-gray-900">{globalActiveBanners}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Image className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banner ẩn</p>
                <p className="text-2xl font-bold text-gray-900">{globalInactiveBanners}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Banner hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{globalTodayBanners}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isLoading}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Hiển thị</option>
                <option value="false">Ẩn</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isLoading}
              >
                <option value="startAt-desc">Mới nhất (Thời gian bắt đầu)</option>
                <option value="startAt-asc">Cũ nhất (Thời gian bắt đầu)</option>
                <option value="title-asc">Tiêu đề (A-Z)</option>
                <option value="title-desc">Tiêu đề (Z-A)</option>
                <option value="status-asc">Trạng thái (Ẩn trước)</option>
                <option value="status-desc">Trạng thái (Hiển thị trước)</option>
              </select>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hoặc tiêu đề banner..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                disabled={loading || isLoading}
              />
            </div>
          </div>
        </div>

        {(loading || isLoading) && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-6 rounded-xl shadow-sm border border-red-200 text-center">
            <p className="text-sm text-red-600">
              Lỗi: {error.message || "Không thể tải banner"}
            </p>
          </div>
        )}

        {!loading && !isLoading && !error && paginatedBanners.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không tìm thấy banner nào.
            </p>
          </div>
        )}

        {!loading && !isLoading && !error && paginatedBanners.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedItems.length === filteredBanners.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ảnh
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Vị trí
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedBanners.map((banner) => (
                      <tr
                        key={banner.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedItems.includes(banner.id)}
                            onChange={() => handleSelectItem(banner.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={banner.bannerUrl}
                            alt={banner.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {banner.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {banner.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {banner.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>Bắt đầu: {formatDate(banner.startAt)}</div>
                            <div>Kết thúc: {formatDate(banner.endAt)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              banner.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-1 ${
                                banner.status ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            {banner.status ? "Hiển thị" : "Ẩn"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                              onClick={() => handleEdit(banner.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                              onClick={() => handleDelete(banner.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
              {paginatedBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 mr-3"
                        checked={selectedItems.includes(banner.id)}
                        onChange={() => handleSelectItem(banner.id)}
                      />
                      <img
                        src={banner.bannerUrl}
                        alt={banner.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {banner.title}
                        </h3>
                        <p className="text-sm text-gray-500">{banner.id}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          banner.status ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      {banner.status ? "Hiển thị" : "Ẩn"}
                    </span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Image className="h-4 w-4 mr-2" />
                        <span>Vị trí:</span>
                      </div>
                      <span className="text-sm text-gray-500">{banner.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Thời gian:</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Bắt đầu: {formatDate(banner.startAt)}</div>
                        <div>Kết thúc: {formatDate(banner.endAt)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      onClick={() => handleEdit(banner.id)}
                    >
                      <Edit2 className="h-4 w-4 inline mr-2" />
                      Sửa
                    </button>
                    <button
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={filteredBanners.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page, newItemsPerPage) => {
                handlePageChange(page, newItemsPerPage || itemsPerPage);
              }}
            />
          </>
        )}

        <BannerFormModal
          open={open}
          onClose={() => {
            setOpen(false);
            setEditingId(null);
            dispatch(getBanners()); // Refresh banners after closing modal to include new banners
          }}
          id={editingId}
        />
      </div>
    </div>
  );
};

export default BannerManagement;