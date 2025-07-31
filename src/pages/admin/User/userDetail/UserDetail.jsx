import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useUserDetail from "./useUserDetail";
import UserProfileCard from "./UserProfileCard";
import TabContent from "./TabContent";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import Modals from "./Modals";
import { Key, X } from "lucide-react";

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
    totalPages,
    totalItems,
    itemsPerPage,
    pagination,
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

  // Handle notifications with react-hot-toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        id: "error-user-detail", // Fixed ID to prevent duplicate toasts
        position: "top-right",
        duration: 3000,
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          border: "1px solid #FECACA",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
        },
        iconTheme: {
          primary: "#991B1B",
          secondary: "#FEF2F2",
        },
      });
      handlers.clearError();
    }
    if (success) {
      toast.success(success, {
        id: "success-user-detail", // Fixed ID to prevent duplicate toasts
        position: "top-right",
        duration: 3000,
        style: {
          background: "#ECFDF5",
          color: "#065F46",
          border: "1px solid #6EE7B7",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
        },
        iconTheme: {
          primary: "#065F46",
          secondary: "#ECFDF5",
        },
      });
      handlers.clearSuccess();
    }
  }, [error, success, handlers]);

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
          </div>
        </div>

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
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              pagination={pagination}
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
      {/* Toast container for react-hot-toast */}
      <Toaster />
    </div>
  );
}