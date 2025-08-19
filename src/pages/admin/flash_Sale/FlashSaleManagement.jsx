import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Tag,
  Package,
  Eye,
  RefreshCw,
  Download,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  fetchFlashSales,
  removeFlashSale,
  fetchFlashSaleVariantDetails,
} from "../../../redux/slices/flashSaleSlice";
import FlashSaleForm from "./FlashSaleForm";
import Pagination from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export default function FlashSaleManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flashSales, flashSaleVariantDetails, loading, error } = useSelector((state) => state.flashSale);
  const [currentView, setCurrentView] = useState("list");
  const [selectedFlashSale, setSelectedFlashSale] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [productCounts, setProductCounts] = useState({});

  console.log("đ d ", error);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    const loadFlashSalesWithCounts = async () => {
      try {
        const result = await dispatch(fetchFlashSales()).unwrap();
        if (result && Array.isArray(result)) {
          const counts = {};
          await Promise.all(
            result.map(async (flashSale) => {
              try {
                const itemResult = await dispatch(fetchFlashSaleVariantDetails(flashSale.id)).unwrap();
                counts[flashSale.id] = Array.isArray(itemResult) ? itemResult.length : 0;
              } catch (error) {
                console.error(`Error loading product count for flash sale ${flashSale.id}:`, error);
                counts[flashSale.id] = 0;
              }
            })
          );
          setProductCounts(counts);
        }
      } catch (error) {
        console.error("Error loading flash sales:", error);
      }
    };

    loadFlashSalesWithCounts();
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(currentPage);
    }, 60000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const filteredFlashSales = flashSales.filter(
    (sale) =>
      ((sale.name?.toLowerCase?.() || "").includes(debouncedSearchTerm.toLowerCase()) ||
        (sale.description?.toLowerCase?.() || "").includes(debouncedSearchTerm.toLowerCase())) &&
      (statusFilter === "" || getActualStatus(sale) === statusFilter)
  );

  const paginatedFlashSales = filteredFlashSales.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const openCreateForm = () => {
    setSelectedFlashSale(null);
    setIsFormModalOpen(true);
  };

  const openEditForm = (flashSale) => {
    setSelectedFlashSale(flashSale);
    setIsFormModalOpen(true);
  };

  const openItemsView = (flashSale) => {
    setSelectedFlashSale(flashSale);
    setCurrentView("items");
  };

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
        await dispatch(removeFlashSale(id)).unwrap();
        Swal.fire("Đã xóa!", "Flash Sale đã được xóa thành công.", "success");
        // Refresh the list after successful deletion
        handleRefresh();
      } catch (error) {
        console.error("Error deleting flash sale:", error);
        Swal.fire("Lỗi!", "Không xóa được Flash Sale.", "error");
        // UI remains intact, list displays normally
      }
    }
  };

  const handleRefresh = () => {
    setProductCounts({});
    const loadFlashSalesWithCounts = async () => {
      try {
        const result = await dispatch(fetchFlashSales()).unwrap();
        if (result && Array.isArray(result)) {
          const counts = {};
          await Promise.all(
            result.map(async (flashSale) => {
              try {
                const itemResult = await dispatch(fetchFlashSaleVariantDetails(flashSale.id)).unwrap();
                counts[flashSale.id] = Array.isArray(itemResult) ? itemResult.length : 0;
              } catch (error) {
                console.error(`Error loading product count for flash sale ${flashSale.id}:`, error);
                counts[flashSale.id] = 0;
              }
            })
          );
          setProductCounts(counts);
        }
      } catch (error) {
        console.error("Error loading flash sales:", error);
      }
    };

    loadFlashSalesWithCounts();
  };

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const formatDateTime = (dateTime) =>
    dateTime
      ? new Date(dateTime).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Chưa xác định";

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm";
    return status === "ACTIVE"
      ? `${base} bg-green-100 text-green-800`
      : `${base} bg-red-100 text-red-800`;
  };

  const isFlashSaleExpired = (endTime) => {
    if (!endTime) return false;
    const now = new Date();
    const endDate = new Date(endTime);
    return now > endDate;
  };

  const getActualStatus = (flashSale) => {
    if (!flashSale) return "INACTIVE";
    if (flashSale.status === "INACTIVE") return "INACTIVE";
    if (isFlashSaleExpired(flashSale.endTime)) {
      return "EXPIRED";
    }
    return flashSale.status;
  };

  const getStatusDisplayText = (flashSale) => {
    const actualStatus = getActualStatus(flashSale);
    switch (actualStatus) {
      case "ACTIVE":
        return "Kích hoạt";
      case "INACTIVE":
        return "Tạm dừng";
      case "EXPIRED":
        return "Đã hết hạn";
      default:
        return "Không rõ";
    }
  };

  const getDynamicStatusBadge = (flashSale) => {
    const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm";
    const actualStatus = getActualStatus(flashSale);
    
    switch (actualStatus) {
      case "ACTIVE":
        return `${base} bg-green-100 text-green-800`;
      case "INACTIVE":
        return `${base} bg-red-100 text-red-800`;
      case "EXPIRED":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusDotColor = (flashSale) => {
    const actualStatus = getActualStatus(flashSale);
    switch (actualStatus) {
      case "ACTIVE":
        return "bg-green-500";
      case "INACTIVE":
        return "bg-red-500";
      case "EXPIRED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalFlashSales = filteredFlashSales.length;
  const activeFlashSales = filteredFlashSales.filter(
    (sale) => getActualStatus(sale) === "ACTIVE"
  ).length;
  const inactiveFlashSales = filteredFlashSales.filter(
    (sale) => getActualStatus(sale) === "INACTIVE"
  ).length;
  const expiredFlashSales = filteredFlashSales.filter(
    (sale) => getActualStatus(sale) === "EXPIRED"
  ).length;
  const todayFlashSales = filteredFlashSales.filter((sale) => {
    if (!sale?.startTime) return false;
    const saleDate = new Date(sale.startTime);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).length;
  
  const totalProducts = Object.values(productCounts).reduce((sum, count) => sum + (count || 0), 0);

  if (currentView === "items") {
    return (
      <FlashSaleItemManagement
        selectedFlashSale={selectedFlashSale}
        onBack={() => setCurrentView("list")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Flash Sale
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Theo dõi và quản lý tất cả chương trình Flash Sale
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={loading}
                title="Làm mới danh sách"
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Tải xuống dữ liệu"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={openCreateForm}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Tạo Flash Sale</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng Flash Sale
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalFlashSales}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeFlashSales}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Tag className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tạm dừng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inactiveFlashSales}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Tag className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã hết hạn</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expiredFlashSales}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayFlashSales}
                </p>
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
                disabled={loading}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Kích hoạt</option>
                <option value="INACTIVE">Tạm dừng</option>
                <option value="EXPIRED">Đã hết hạn</option>
              </select>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-xl mb-6 text-sm text-red-800 flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && paginatedFlashSales.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không tìm thấy Flash Sale nào.
            </p>
          </div>
        )}

        {!loading && !error && paginatedFlashSales.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Tên và mô tả của Flash Sale"
                      >
                        Tên Flash Sale
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Thời gian bắt đầu và kết thúc"
                      >
                        Thời gian
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Trạng thái hiện tại"
                      >
                        Trạng thái
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Số lượng sản phẩm trong Flash Sale"
                      >
                        Sản phẩm
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Ngày tạo Flash Sale"
                      >
                        Ngày tạo
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Ngày cập nhật gần nhất"
                      >
                        Ngày cập nhật
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        title="Các thao tác khả dụng"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedFlashSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag className="h-5 w-5 text-orange-500 mr-2" />
                            <div>
                              <div
                                className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                title={sale.name || "Không có tên"}
                              >
                                {sale.name || "Không có tên"}
                              </div>
                              <div
                                className="text-sm text-gray-500 line-clamp-2"
                                title={sale.description || "Không có mô tả"}
                              >
                                {sale.description || "Không có mô tả"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div
                              className="flex items-center mb-1"
                              title="Thời gian bắt đầu"
                            >
                              <Calendar
                                size={16}
                                className="mr-1 text-blue-500"
                              />
                              <span className="font-medium bg-blue-50 px-2 py-1 rounded">
                                {formatDateTime(sale.startTime)}
                              </span>
                            </div>
                            <div
                              className="flex items-center"
                              title="Thời gian kết thúc"
                            >
                              <Clock size={16} className="mr-1 text-blue-500" />
                              <span className="font-medium bg-blue-50 px-2 py-1 rounded">
                                {formatDateTime(sale.endTime)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getDynamicStatusBadge(sale)}
                            title={`Trạng thái: ${getStatusDisplayText(sale)}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-1 ${getStatusDotColor(sale)}`}
                            ></span>
                            {getStatusDisplayText(sale)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="flex items-center"
                            title="Số lượng sản phẩm"
                          >
                            <Package
                              size={16}
                              className="mr-1 text-purple-500"
                            />
                            <span className="text-sm text-gray-900 font-medium">
                              {productCounts[sale.id] !== undefined ? productCounts[sale.id] : "..."} sản phẩm
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="flex items-center text-sm text-gray-900"
                            title="Ngày tạo Flash Sale"
                          >
                            <Calendar
                              size={16}
                              className="mr-1 text-green-500"
                            />
                            <span className="font-medium bg-green-50 px-2 py-1 rounded">
                              {formatDateTime(sale.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="flex items-center text-sm text-gray-900"
                            title="Ngày cập nhật gần nhất"
                          >
                            <Calendar
                              size={16}
                              className="mr-1 text-yellow-500"
                            />
                            <span className="font-medium bg-yellow-50 px-2 py-1 rounded">
                              {formatDateTime(sale.updatedAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/flash-sale/${sale.id}`)
                              }
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors transform hover:scale-110"
                              title="Xem chi tiết sản phẩm"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditForm(sale)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors transform hover:scale-110"
                              title="Chỉnh sửa Flash Sale"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(sale.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors transform hover:scale-110"
                              title="Xóa Flash Sale"
                            >
                              <Trash2 size={16} />
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
              {paginatedFlashSales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-orange-500 mr-2" />
                      <div>
                        <h3
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                          title={sale.name || "Không có tên"}
                        >
                          {sale.name || "Không có tên"}
                        </h3>
                        <p
                          className="text-sm text-gray-500 line-clamp-2"
                          title={sale.description || "Không có mô tả"}
                        >
                          {sale.description || "Không có mô tả"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={getDynamicStatusBadge(sale)}
                      title={`Trạng thái: ${getStatusDisplayText(sale)}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-1 ${getStatusDotColor(sale)}`}
                      ></span>
                      {getStatusDisplayText(sale)}
                    </span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div
                      className="flex items-center text-sm text-gray-900"
                      title="Thời gian bắt đầu"
                    >
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span className="font-medium bg-blue-50 px-2 py-1 rounded">
                        Bắt đầu: {formatDateTime(sale.startTime)}
                      </span>
                    </div>
                    <div
                      className="flex items-center text-sm text-gray-900"
                      title="Thời gian kết thúc"
                    >
                      <Clock size={16} className="mr-2 text-blue-500" />
                      <span className="font-medium bg-blue-50 px-2 py-1 rounded">
                        Kết thúc: {formatDateTime(sale.endTime)}
                      </span>
                    </div>
                    <div
                      className="flex items-center text-sm text-gray-900"
                      title="Số lượng sản phẩm"
                    >
                      <Package size={16} className="mr-2 text-purple-500" />
                      <span className="font-medium">
                        {productCounts[sale.id] !== undefined ? productCounts[sale.id] : "..."} sản phẩm
                      </span>
                    </div>
                    <div
                      className="flex items-center text-sm text-gray-900"
                      title="Ngày tạo Flash Sale"
                    >
                      <Calendar size={16} className="mr-2 text-green-500" />
                      <span className="font-medium bg-green-50 px-2 py-1 rounded">
                        Ngày tạo: {formatDateTime(sale.createdAt)}
                      </span>
                    </div>
                    <div
                      className="flex items-center text-sm text-gray-900"
                      title="Ngày cập nhật gần nhất"
                    >
                      <Calendar size={16} className="mr-2 text-yellow-500" />
                      <span className="font-medium bg-yellow-50 px-2 py-1 rounded">
                        Ngày cập nhật: {formatDateTime(sale.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openItemsView(sale)}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium transform hover:scale-105"
                      title="Xem chi tiết sản phẩm"
                    >
                      <Eye className="h-4 w-4 inline mr-2" />
                      Xem sản phẩm
                    </button>
                    <button
                      onClick={() => openEditForm(sale)}
                      className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors transform hover:scale-105"
                      title="Chỉnh sửa Flash Sale"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors transform hover:scale-105"
                      title="Xóa Flash Sale"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={filteredFlashSales.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page, newItemsPerPage) => {
                handlePageChange(page, newItemsPerPage || itemsPerPage);
              }}
            />
          </>
        )}

        <FlashSaleForm
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            handleRefresh();
          }}
          flashSale={selectedFlashSale}
          existingFlashSales={flashSales}
        />
      </div>
    </div>
  );
}