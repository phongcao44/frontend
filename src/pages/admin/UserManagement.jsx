import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Shield,
  Calendar,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/slices/userSlice";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("Tất cả khách hàng");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.users.users) || [];
  const error = useSelector((state) => state.users.error) || null;

  useEffect(() => {
    setIsLoading(true);
    dispatch(getUsers()).finally(() => setIsLoading(false));
  }, [dispatch]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "Khách hàng VIP") {
      return matchesSearch && customer.roles.includes("ROLE_ADMIN");
    }
    return matchesSearch;
  });

  const tabs = [
    { name: "Tất cả khách hàng", count: customers.length },
    {
      name: "Khách hàng VIP",
      count: customers.filter((c) => c.roles.includes("ROLE_ADMIN")).length || 0,
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(getUsers()).finally(() => setTimeout(() => setIsLoading(false), 1000));
  };

  const getRoleColor = (roles) => {
    if (roles.includes("ROLE_ADMIN")) return "bg-purple-100 text-purple-800";
    if (roles.includes("ROLE_PREMIUM")) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý khách hàng
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý và theo dõi thông tin khách hàng của bạn
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
              <button className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100">
                <Download className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Tạo khách hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
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

      {/* STATS CARDS */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng khách hàng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                0
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Khách hàng VIP
                </p>
                <p className="text-2xl font-bold text-gray-900">
               0
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
                <p className="text-sm font-medium text-gray-600">
                  Mới tháng này
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(
                    (c) =>
                      new Date(c.createTime).getMonth() ===
                      new Date().getMonth()
                  ).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER + SEARCH */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5" />
                <span>Bộ lọc</span>
              </button>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Tất cả trạng thái</option>
                <option>Hoạt động</option>
                <option>Không hoạt động</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* ERROR OR LOADING STATE */}
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

        {isLoading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {!isLoading && !error && filteredCustomers.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không tìm thấy khách hàng nào.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!isLoading && !error && filteredCustomers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Khách hàng</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {customer.username.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: #{customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            customer.roles
                          )}`}
                        >
                          {customer.roles.join(", ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (customer.status || "ACTIVE") === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-1 ${
                              (customer.status || "ACTIVE") === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {(customer.status || "ACTIVE") === "ACTIVE"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.createTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors">
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
        )}

        {/* MOBILE CARDS */}
        {!isLoading && !error && filteredCustomers.length > 0 && (
          <div className="lg:hidden space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                      {customer.username.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customer.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: #{customer.id}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (customer.status || "ACTIVE") === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        (customer.status || "ACTIVE") === "ACTIVE"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {(customer.status || "ACTIVE") === "ACTIVE"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2" />
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        customer.roles
                      )}`}
                    >
                      {customer.roles.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(customer.createTime)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    <Eye className="h-4 w-4 inline mr-2" />
                    Xem chi tiết
                  </button>
                  <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}