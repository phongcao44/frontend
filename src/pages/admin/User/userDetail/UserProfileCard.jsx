/* eslint-disable react/prop-types */
import { memo } from "react";
import { Shield, Lock, Unlock, ShoppingBag, DollarSign, Award } from "lucide-react";

const UserProfileCard = ({ userInfo, isLoading, handlers, formatDate, formatCurrency, getStatusColor, getStatusIcon }) => {
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(3)
          .fill()
          .map((_, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
      </div>
    </div>
  );

  if (isLoading) return <div className="bg-white rounded-lg border border-gray-200 p-6">{renderSkeleton()}</div>;

  const StatusIcon = getStatusIcon(userInfo?.status || "INACTIVE");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {userInfo?.name?.charAt(0) || "?"}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{userInfo?.name || "Unknown"}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                  userInfo?.status || "INACTIVE"
                )}`}
              >
                <StatusIcon className="h-4 w-4" />
                {userInfo?.status || "INACTIVE"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">ID: {userInfo?.id ?? "Unknown"}</p>
            <p className="text-sm text-gray-600 mt-1">Email: {userInfo?.email ?? "Unknown"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Tạo: {formatDate(userInfo?.createdAt) || "Unknown"}</span>
              <span>Cập nhật: {formatDate(userInfo?.updatedAt) || "Unknown"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlers.toggleRoleModal}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            disabled={isLoading}
          >
            <Shield className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => {
            handlers.handleStatusChange(userInfo?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
          }}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
            userInfo?.status === "ACTIVE"
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
          disabled={isLoading}
        >
          {userInfo?.status === "ACTIVE" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          {userInfo?.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingBag className="h-4 w-4" />
            Tổng đơn hàng
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{userInfo?.totalOrders ?? "Unknown"}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            Tổng chi tiêu
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {userInfo?.totalSpent != null ? formatCurrency(userInfo.totalSpent) : "Unknown"}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            Điểm thưởng
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{userInfo?.loyaltyPoints ?? "Unknown"}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(UserProfileCard);