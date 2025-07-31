/* eslint-disable react/prop-types */
import {
  User,
  ShoppingBag,
  Award,
  Gift,
  Crown,
  Star,
  Shield,
} from "lucide-react";
import { Formik, Form, Field } from "formik";
import Pagination from "../../../../components/Pagination";

export default function TabContent({
  selectedTab,
  userInfo,
  userRoles,
  orders,
  totalPages,
  totalItems, // Added
  itemsPerPage, // Added
  pagination,
  vouchers,
  isLoading,
  handlers,
  formatCurrency,
  formatDate,
}) {
  const tabs = [
    { id: "overview", label: "Tổng quan", icon: User },
    { id: "orders", label: "Đơn hàng", icon: ShoppingBag },
    { id: "loyalty", label: "Điểm thưởng", icon: Award },
    { id: "vouchers", label: "Voucher", icon: Gift },
  ];

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="animate-pulse p-6">
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <div key={tab.id} className="px-4 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading || !userInfo)
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {renderSkeleton()}
      </div>
    );


  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlers.setSelectedTab(tab.id)}
              className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                selectedTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              disabled={isLoading}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {selectedTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Thông tin cá nhân
                </h4>
                {handlers.isEditingProfile ? (
                  <Formik
                    initialValues={{ name: userInfo.name || "" }}
                    validationSchema={handlers.profileValidationSchema}
                    onSubmit={handlers.handleProfileSave}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-3">
                        <div>
                          <Field
                            name="name"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tên đầy đủ"
                          />
                          {errors.name && touched.name && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handlers.setIsEditingProfile(false)}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                            disabled={isLoading}
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={isLoading}
                          >
                            Lưu
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {userInfo.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Crown className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Hạng thành viên: {userInfo.memberTier || "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Vai trò & Quyền hạn
                </h4>
                <div className="space-y-2">
                  {(userRoles || [])
                    .filter((role) => role?.granted)
                    .map((role) => (
                      <div
                        key={role?.id}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
                      >
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {role?.name || "N/A"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Đơn hàng gần đây</h4>
              <span className="text-sm text-gray-500">
                {userInfo.totalOrders || 0} đơn hàng
              </span>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">Không có đơn hàng nào.</p>
            ) : (
              <div className="space-y-3">
                {(orders || []).map((order) => (
                  <div
                    key={order?.orderCode || order?.orderId}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order?.orderId || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order?.createdAt ? formatDate(order.createdAt) : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(order?.total)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order?.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order?.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination
              currentPage={pagination.page}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page, limit) =>
                handlers.handlePaginationChange({ page, limit })
              }
            />
          </div>
        )}
        {selectedTab === "loyalty" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span className="font-medium">Điểm hiện tại</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {userInfo.loyaltyPoints || 0}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  <span className="font-medium">Hạng thành viên</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {userInfo.memberTier || "N/A"}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <span className="font-medium">Voucher đã dùng</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {(vouchers || []).length}
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedTab === "vouchers" && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Voucher đã sử dụng</h4>
            {vouchers.length === 0 ? (
              <p className="text-sm text-gray-500">Không có voucher nào.</p>
            ) : (
              <div className="space-y-3">
                {(vouchers || []).map((voucher) => (
                  <div
                    key={voucher?.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {voucher?.code || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Sử dụng: {voucher?.usedAt ? formatDate(voucher.usedAt) : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {voucher?.discount || "N/A"}
                        </p>
                        <span className="text-xs text-gray-500">
                          {voucher?.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}