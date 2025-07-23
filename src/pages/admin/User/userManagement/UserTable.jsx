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

  // Get role color based on roles
  const getRoleColor = (roles) => {
    if (roles.includes("ROLE_VIP")) return "bg-purple-100 text-purple-800";
    if (roles.includes("ROLE_PREMIUM")) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  // Get rank color based on rank
  const getRankColor = (rank) => {
    switch (rank) {
      case "SILVER":
        return "bg-gray-100 text-gray-800";
      case "BRONZE":
        return "bg-amber-100 text-amber-800";
      case "PLATINUM":
        return "bg-blue-100 text-blue-800";
      case "DIAMOND":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      customer.roles || []
                    )}`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {(customer.roles || []).join(", ") || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(
                      customer.userRank || ""
                    )}`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {customer.userRank === "BAC"
                      ? "Bạc"
                      : customer.userRank === "DONG"
                      ? "Đồng"
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