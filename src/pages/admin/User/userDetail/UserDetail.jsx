import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserDetail from "./useUserDetail";
import UserProfileCard from "./UserProfileCard";
import TabContent from "./TabContent";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import Modals from "./Modals";

export default function UserDetail() {
  const navigate = useNavigate();
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
        id: "error-user-detail", // prevent duplicate
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
        id: "success-user-detail", // prevent duplicate
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
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
      {/* Toast container */}
      <Toaster />
    </div>
  );
}
