import useUserDetail from "./useUserDetail";
import UserProfileCard from "./UserProfileCard";
import TabContent from "./TabContent";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import QuickActions from "./QuickActions";
import Modals from "./Modals";
import { Key, X } from "lucide-react";

// Main component for user detail UI
export default function UserDetail() {
  const {
    showEmailModal,
    showRoleModal,
    showResetPasswordModal,
    selectedTab,
    userInfo,
    allRoles,
    address,
    userRoles,
    orders,
    vouchers,
    error,
    success,
    isLoading,
    isEditingProfile,
    handlers,
    formatDate,
    formatCurrency,
    getStatusColor,
    getStatusIcon,
  } = useUserDetail();

  // Debug log for status change
  const handleStatusChangeWithLog = (...args) => {
    console.log("UserDetail: Triggering status change", args);
    handlers.handleStatusChange(...args);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Quản lý người dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết và quản lý tài khoản người dùng
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlers.toggleResetPasswordModal}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
                disabled={isLoading}
              >
                <Key className="h-4 w-4" />
                Reset mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-sm text-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handlers.clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-sm text-green-800 flex items-center justify-between">
            <span>{success}</span>
            <button
              onClick={handlers.clearSuccess}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-3 space-y-6">
            <UserProfileCard
              userInfo={userInfo || {}}
              isLoading={isLoading}
              handlers={{ ...handlers, handleStatusChange: handleStatusChangeWithLog }}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              isEditingProfile={isEditingProfile}
            />
            <TabContent
              selectedTab={selectedTab}
              userInfo={userInfo || {}}
              userRoles={userRoles || []}
              orders={orders || []}
              vouchers={vouchers || []}
              isLoading={isLoading}
              handlers={handlers}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ContactInfo
              userInfo={userInfo || {}}
              isEditingContact={handlers.isEditingContact}
              isLoading={isLoading}
              handlers={handlers}
            />
            <AddressInfo
              address={address || {}}
              isEditingAddress={handlers.isEditingAddress}
              isLoading={isLoading}
              handlers={handlers}
            />
            {userInfo && (
              <QuickActions
                handlers={{ ...handlers, handleStatusChange: handleStatusChangeWithLog }}
                isLoading={isLoading}
                currentStatus={userInfo.status || "INACTIVE"}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        <Modals
          showEmailModal={showEmailModal}
          showRoleModal={showRoleModal}
          showResetPasswordModal={showResetPasswordModal}
          userInfo={userInfo || {}}
          allRoles={allRoles || []}
          userRoles={userRoles || []}
          handlers={handlers}
        />
      </div>
    </div>
  );
}