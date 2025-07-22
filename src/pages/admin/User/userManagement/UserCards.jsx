/* eslint-disable react/prop-types */
import { User, Mail, Shield, Calendar, Eye, Edit, Trash2 } from "lucide-react";


export default function UserCards({ customers, handlers, isLoading }) {

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

  // Skeleton loader for mobile cards
  const renderSkeletonCards = (count = 5) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="ml-4">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
            </div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
          <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ));

  return (
    <div className="space-y-4">
      {isLoading ? renderSkeletonCards() : customers.map((customer) => (
        <div
          key={customer.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-800">
                  {customer.username || "N/A"}
                </h3>
                <p className="text-sm text-gray-500">ID: #{customer.id}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1 ${
                  customer.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {customer.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>Email:</span>
              </div>
              <span className="text-sm">{customer.email || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                <span>Vai trò:</span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  customer.roles || []
                )}`}
              >
                {(customer.roles || []).join(", ") || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                <span>Rank:</span>
              </div>
              <span
                className={`inline-flex items-center px-2Of py-1 rounded-full text-xs font-medium ${getRankColor(
                  customer.userRank || ""
                )}`}
              >
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Ngày tạo:</span>
              </div>
              <span className="text-sm">{formatDate(customer.createTime)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => handlers.handleEdit(customer.id)}
              className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Xem chi tiết
            </button>
            <button
              onClick={() => handlers.handleUpdateStatus(customer.id, customer.status)}
              className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlers.handleDelete(customer.id)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}