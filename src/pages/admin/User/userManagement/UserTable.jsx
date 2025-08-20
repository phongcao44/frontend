/* eslint-disable react/prop-types */
import { ChevronDown, User, Shield, Eye, Edit, Trash2 } from "lucide-react";

export default function UserTable({ customers, handlers, isLoading }) {
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

  // Define role priority and color mapping
  const roleConfig = {
    ROLE_ADMIN: { label: "Quản trị viên", color: "bg-red-100 text-red-800" },
    ROLE_MODERATOR: { label: "Điều phối", color: "bg-blue-100 text-blue-800" },
    ROLE_SHIPPER: { label: "Giao hàng", color: "bg-green-100 text-green-800" },
    ROLE_USER: { label: "Người dùng", color: "bg-gray-100 text-gray-800" },
  };

  // Get role color based on highest priority role
  const getRoleColor = (roles) => {
    if (!roles || roles.length === 0) return "bg-gray-100 text-gray-600";
    // Priority: ADMIN > MODERATOR > SHIPPER > USER
    if (roles.includes("ROLE_ADMIN")) return roleConfig.ROLE_ADMIN.color;
    if (roles.includes("ROLE_MODERATOR")) return roleConfig.ROLE_MODERATOR.color;
    if (roles.includes("ROLE_SHIPPER")) return roleConfig.ROLE_SHIPPER.color;
    if (roles.includes("ROLE_USER")) return roleConfig.ROLE_USER.color;
    return "bg-gray-100 text-gray-600";
  };

  // Get rank color based on rank
  const getRankColor = (rank) => {
    switch (rank) {
      case "DONG":
        return "bg-amber-100 text-amber-800";
      case "BAC":
        return "bg-gray-100 text-gray-800";
      case "VANG":
        return "bg-yellow-100 text-yellow-800";
      case "KIMCUONG":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Render roles as separate badges
  const renderRoles = (roles) => {
    if (!roles || roles.length === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <Shield className="h-3 w-3 mr-1" />
          N/A
        </span>
      );
    }
    return roles.map((role) => (
      <span
        key={role}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 ${
          roleConfig[role]?.color || "bg-gray-100 text-gray-600"
        }`}
      >
        <Shield className="h-3 w-3 mr-1" />
        {roleConfig[role]?.label || role}
      </span>
    ));
  };

  // Skeleton loader for table rows
  const renderSkeletonRows = (count = 5) =>
    Array.from({ length: count }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="ml-4">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex space-x-2">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </td>
      </tr>
    ));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                Rank
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
            {isLoading ? renderSkeletonRows() : customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {customer.username || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex flex-wrap gap-1">
                  {renderRoles(customer.roles || [])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(
                      customer.userRank || ""
                    )}`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {customer.userRank === "DONG"
                      ? "Đồng"
                      : customer.userRank === "BAC"
                      ? "Bạc"
                      : customer.userRank === "VANG"
                      ? "Vàng"
                      : customer.userRank === "KIMCUONG"
                      ? "Kim Cương"
                      : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.userStatus === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        customer.userStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {customer.userStatus === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(customer.createTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlers.handleEdit(customer.id)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlers.handleEdit(customer.id)}
                      className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlers.handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
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
  );
}