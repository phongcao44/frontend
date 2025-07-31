/* eslint-disable react/prop-types */
import { Mail, Phone } from "lucide-react";

export default function ContactInfo({ userInfo, isLoading, handlers }) {
  // Skeleton loader
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading || !userInfo) {
    return <div className="bg-white rounded-lg border border-gray-200 p-6">{renderSkeleton()}</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Thông tin liên hệ</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="h-4 w-4 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">{userInfo.email || "Chưa cung cấp email"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="h-4 w-4 text-gray-600" />
          <p className="text-sm font-medium text-gray-900">{userInfo.phone || "Chưa cung cấp số điện thoại"}</p>
        </div>
      </div>
    </div>
  );
}