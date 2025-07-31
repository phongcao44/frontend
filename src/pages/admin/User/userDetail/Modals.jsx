/* eslint-disable react/prop-types */
import { X, AlertTriangle } from "lucide-react";

export default function Modals({
  showEmailModal,
  showRoleModal,
  showResetPasswordModal,
  userInfo,
  allRoles,
  userRoles,
  handlers,
}) {
  return (
    <>
      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gửi email</h3>
              <button
                onClick={handlers.toggleEmailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người nhận
                </label>
                <input
                  type="email"
                  value={userInfo?.email || "N/A"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Nhập nội dung email"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlers.toggleEmailModal}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handlers.sendEmailInvite}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal - FIXED LOGIC */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quản lý quyền hạn</h3>
              <button
                onClick={handlers.toggleRoleModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              
              {(allRoles || []).map((role) => {
                // FIX 1: Check if userRoles is properly structured
                const userRolesList = Array.isArray(userRoles) ? userRoles : [];
                
                // FIX 2: Handle different data structures
                // Check by both id and name to be safe
                const isGranted = userRolesList.some(userRole => {
                  // If userRole has granted property, use it
                  if (userRole.hasOwnProperty('granted')) {
                    return (userRole.id === role.id || userRole.name === role.name) && userRole.granted;
                  }
                  // Otherwise, just check if the role exists in userRoles
                  return userRole.id === role.id || userRole.name === role.name;
                });

                // FIX 3: Alternative check - convert to string for comparison
                const isGrantedAlt = userRolesList.some(userRole => 
                  String(userRole.id) === String(role.id) && 
                  (userRole.granted === undefined || userRole.granted === true)
                );



                return (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {role?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {role?.description || "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => handlers.handleRoleToggle(role.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        isGranted
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      disabled={handlers.isLoading}
                    >
                      {isGranted ? "Đã cấp" : "Chưa cấp"}
                    </button>
                  </div>
                );
              })}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handlers.toggleRoleModal}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reset mật khẩu</h3>
              <button
                onClick={handlers.toggleResetPasswordModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm font-medium">Xác nhận reset mật khẩu</p>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Hệ thống sẽ gửi email reset mật khẩu đến địa chỉ:{" "}
                  <strong>{userInfo?.email || "N/A"}</strong>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlers.toggleResetPasswordModal}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handlers.resetPassword}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}