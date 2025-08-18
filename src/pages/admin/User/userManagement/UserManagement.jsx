import { Search, Plus, RefreshCw } from "lucide-react";
import UserTable from "./UserTable";
import UserCards from "./UserCards";
import Pagination from "../../../../components/Pagination";
import useUserManagement from "./useUserManagement";

export default function UserManagement() {
  const {
    activeTab,
    searchTerm,
    isLoading,
    customers,
    statusFilter,
    rankFilter,
    tabs,
    error,
    statistics, // Keep statistics for tab counts
    handlers,
    pagination,
    filters,
  } = useUserManagement();

  console.log(pagination, statistics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
              <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi thông tin khách hàng của bạn</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlers.handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handlers.handleCreateUser}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Tạo khách hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Sticky with Fixed Counts */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => handlers.handleTabChange("Tất cả khách hàng")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === "Tất cả khách hàng"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span>Tất cả khách hàng</span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === "Tất cả khách hàng"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {statistics.totalAccounts}
              </span>
            </button>
            <button
              onClick={() => handlers.handleTabChange("Khách hàng VIP")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === "Khách hàng VIP"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span>Khách hàng VIP</span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === "Khách hàng VIP"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {statistics.totalKimCuongUsers}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter ?? ""}
                onChange={filters.handleStatusFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {filters.statusOptions.map((option) => (
                  <option key={option.value ?? "null"} value={option.value ?? ""}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={activeTab === "Khách hàng VIP" ? "" : rankFilter ?? ""}
                onChange={filters.handleRankFilterChange}
                disabled={activeTab === "Khách hàng VIP"}
                className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  activeTab === "Khách hàng VIP" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {filters.rankOptions.map((option) => (
                  <option key={option.value ?? "null"} value={option.value ?? ""}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                onChange={filters.handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="createdAt:asc">Cũ nhất</option>
                <option value="username:asc">Tên: A-Z</option>
                <option value="username:desc">Tên: Z-A</option>
                <option value="email:asc">Email: A-Z</option>
                <option value="email:desc">Email: Z-A</option>
              </select>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={handlers.handleSearchChange}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 p-6 rounded-xl shadow-sm border border-red-200 text-center">
            <p className="text-sm text-red-600">
              Lỗi: {typeof error === "string" ? error : error.message || "Không thể tải dữ liệu khách hàng"}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && customers.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              {activeTab === "Khách hàng VIP"
                ? `Không tìm thấy khách hàng Kim Cương${
                    statusFilter
                      ? ` với trạng thái ${filters.statusOptions.find((o) => o.value === statusFilter)?.label}`
                      : ""
                  }${searchTerm ? ` khớp với "${searchTerm}"` : ""}.`
                : `Không tìm thấy khách hàng nào${
                    statusFilter
                      ? ` với trạng thái ${filters.statusOptions.find((o) => o.value === statusFilter)?.label}`
                      : ""
                  }${
                    rankFilter && activeTab !== "Khách hàng VIP"
                      ? ` và rank ${filters.rankOptions.find((o) => o.value === rankFilter)?.label}`
                      : ""
                  }${searchTerm ? ` khớp với "${searchTerm}"` : ""}.`}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="hidden lg:block">
          <UserTable customers={customers} handlers={handlers} isLoading={isLoading} />
          {!isLoading && customers.length > 0 && <Pagination {...pagination} />}
        </div>
        <div className="lg:hidden space-y-4">
          <UserCards customers={customers} handlers={handlers} isLoading={isLoading} />
          {!isLoading && customers.length > 0 && <Pagination {...pagination} />}
        </div>
      </div>
    </div>
  );
}