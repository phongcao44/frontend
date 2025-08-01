import { useEffect, useState, useCallback } from "react";
import { handleDownloadExcel } from "../../../services/handleDownloadExcel";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Eye,
  Download,
  RefreshCw,
  Package,
  CreditCard,
  Clock,
  DollarSign,
  ShoppingCart,
  Calendar,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadPaginatedOrders } from "../../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { getStatusColor, translateStatus } from "../../../utils/orderUtils";
import {
  getPaymentColor,
  translatePaymentStatus,
  translatePaymentMethod,
} from "../../../utils/paymentUtils";
import OrderStatusIcon from "../../../components/OrderStatusIcon";

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("Tất cả đơn hàng");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.order.list?.content || []);
  const loading = useSelector((state) => state.order.loading || false);
  const error = useSelector((state) => state.order.error || null);
  const totalPages = useSelector((state) => state.order.list?.totalPages || 1);
  const totalElements = useSelector(
    (state) => state.order.list?.totalElements || 0
  );

  // Debounced function to handle search
  const debouncedSearch = useCallback(
    debounce((value) => {
      dispatch(
        loadPaginatedOrders({
          page: 0, // Reset to first page on search
          limit: itemsPerPage,
          sortBy,
          orderBy,
          status:
            statusFilter || (activeTab === "Chưa thanh toán" ? "PENDING" : ""),
          keyword: value,
        })
      ).finally(() => setTimeout(() => setIsLoading(false), 500));
    }, 500),
    [dispatch, itemsPerPage, sortBy, orderBy, statusFilter, activeTab]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsLoading(true);
    debouncedSearch(value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    setIsLoading(true);
    setCurrentPage(0);
    dispatch(
      loadPaginatedOrders({
        page: 0,
        limit: itemsPerPage,
        sortBy,
        orderBy,
        status:
          statusFilter || (activeTab === "Chưa thanh toán" ? "PENDING" : ""),
        keyword: searchTerm,
      })
    ).finally(() => setTimeout(() => setIsLoading(false), 500));
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      loadPaginatedOrders({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        orderBy,
        status:
          statusFilter || (activeTab === "Chưa thanh toán" ? "PENDING" : ""),
        keyword: searchTerm,
      })
    ).finally(() => setTimeout(() => setIsLoading(false), 500));
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    activeTab,
    sortBy,
    orderBy,
    statusFilter,
  ]);

  useEffect(() => {
    console.log("Orders:", orders);
    console.log("Total elements:", totalElements);
    console.log("Total pages:", totalPages);
    console.log("Error:", error);
  }, [orders, totalElements, totalPages, error]);

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setCurrentPage(0);
    if (value) {
      setActiveTab("Tất cả đơn hàng");
    }
  };

  const tabs = [
    { name: "Tất cả đơn hàng", count: totalElements },
    {
      name: "Chưa thanh toán",
      count: orders.filter((o) => o.payment?.status === "PENDING").length,
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(
      loadPaginatedOrders({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        orderBy,
        status:
          statusFilter || (activeTab === "Chưa thanh toán" ? "PENDING" : ""),
        keyword: searchTerm,
      })
    ).finally(() => setTimeout(() => setIsLoading(false), 500));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "0 ₫";
    return Number(amount).toLocaleString("vi-VN") + " ₫";
  };

  // Filter out invalid orders and log issues for debugging
  const validOrders = orders.filter((order) => {
    if (!order || !order.orderId) {
      console.warn("Invalid order detected:", order);
      return false;
    }
    return true;
  });

  const totalRevenue = validOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );
  const completedOrders = validOrders.filter(
    (o) => o.status === "DELIVERED"
  ).length;
  const pendingOrders = validOrders.filter(
    (o) => o.status === "PENDING"
  ).length;
  const todayOrders = validOrders.filter((o) => {
    if (!o.createdAt) return false;
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "SHIPPED", label: "Đã gửi hàng" },
    { value: "DELIVERED", label: "Đã giao hàng" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý đơn hàng
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Download className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Tạo đơn hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setCurrentPage(0);
                  if (tab.name === "Tất cả đơn hàng") {
                    setStatusFilter("");
                  } else if (tab.name === "Chưa thanh toán") {
                    setStatusFilter("PENDING");
                  }
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.name
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <span>{tab.name}</span>
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.name
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng đơn hàng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalElements}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng doanh thu
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingOrders}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayOrders}
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
                onChange={handleStatusFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => {
                  const [newSortBy, newOrderBy] = e.target.value.split(":");
                  setSortBy(newSortBy);
                  setOrderBy(newOrderBy);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="createdAt:asc">Cũ nhất</option>
                <option value="totalAmount:desc">
                  Tổng tiền: Cao đến thấp
                </option>
                <option value="totalAmount:asc">Tổng tiền: Thấp đến cao</option>
              </select>
            </div>

            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng hoặc khách hàng..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Search orders"
              >
                <Search className="h-5 w-5" />
              </button>
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
              Lỗi: {error.message || "Không thể tải đơn hàng"}
            </p>
          </div>
        )}

        {!loading && !isLoading && !error && validOrders.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không tìm thấy đơn hàng nào.
            </p>
          </div>
        )}

        {!loading && !isLoading && !error && validOrders.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <span>Mã đơn hàng</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Thanh toán
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phương thức thanh toán
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {validOrders.map((order) => (
                      <tr
                        key={order.orderId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                              <Package className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={() =>
                                  navigate(`/admin/shipper/${order.orderId}`)
                                }
                              >
                                {order.orderId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {order.username || "Khách vãng lai"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {OrderStatusIcon(order.status)}
                            <span className="ml-1">
                              {translateStatus(order.status)}
                            </span>
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentColor(
                              order.payment?.status
                            )}`}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            {translatePaymentStatus(order.payment?.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {translatePaymentMethod(order.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/orders/${order.orderId}`)
                              }
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
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
              {validOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        <Package className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3
                          className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() =>
                            navigate(`/admin/orders/${order.orderId}`)
                          }
                        >
                          {order.orderId}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {OrderStatusIcon(order.status)}
                      <span className="ml-1">
                        {translateStatus(order.status)}
                      </span>
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>Khách hàng:</span>
                      </div>
                      <span className="text-sm font-medium">
                        {order.username || "Khách vãng lai"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Thanh toán:</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(
                          order.payment?.status
                        )}`}
                      >
                        {translatePaymentStatus(order.payment?.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>Tổng tiền:</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Phương thức:</span>
                      </div>
                      <span className="text-sm">
                        {translatePaymentMethod(order.paymentMethod)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      <Eye className="h-4 w-4 inline mr-2" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={totalElements}
              itemsPerPage={itemsPerPage}
              onPageChange={(page, newItemsPerPage) => {
                handlePageChange(page, newItemsPerPage || itemsPerPage);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
