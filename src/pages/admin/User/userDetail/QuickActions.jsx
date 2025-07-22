/* eslint-disable react/prop-types */
import { Shield, Clock } from "lucide-react";

// Quick actions component
export default function QuickActions({ handlers, isLoading, currentStatus }) {
  const safeStatus = currentStatus || "INACTIVE";
  const nextStatus = safeStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thao tác nhanh
      </h3>
      <div className="space-y-3">
        <button
          onClick={handlers.toggleRoleModal}
          className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
          disabled={isLoading}
        >
          <Shield className="h-4 w-4 text-gray-600" />
          <span className="text-sm">Quản lý quyền</span>
        </button>
        <button
          onClick={() => handlers.handleStatusChange(nextStatus)}
          className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3"
          disabled={isLoading}
        >
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm">Đặt trạng thái {nextStatus}</span>
        </button>
      </div>
    </div>
  );
}
