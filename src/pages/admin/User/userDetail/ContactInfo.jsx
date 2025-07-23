import { Edit, Mail, Phone } from "lucide-react";
import { Formik, Form, Field } from "formik";

// Contact information with Formik and skeleton
export default function ContactInfo({ userInfo, isEditingContact, isLoading, handlers }) {
  // Skeleton loader
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
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
        <button
          onClick={() => handlers.setIsEditingContact(!isEditingContact)}
          className="text-gray-400 hover:text-gray-600 p-1"
          disabled={isLoading}
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
      {isEditingContact ? (
        <Formik
          initialValues={{
            email: userInfo.email || "",
            phone: userInfo.phone || "",
            marketingConsent: userInfo.marketingConsent ?? false,
          }}
          validationSchema={handlers.contactValidationSchema}
          onSubmit={handlers.handleContactSave}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && touched.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
              <label className="flex items-center gap-2">
                <Field
                  name="marketingConsent"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Đồng ý nhận email quảng cáo</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlers.setIsEditingContact(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Lưu
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{userInfo.email || "Chưa cung cấp email"}</p>
              <p className="text-xs text-gray-500">
                {userInfo.marketingConsent ?? false
                  ? "Đồng ý nhận email quảng cáo"
                  : "Không đồng ý nhận email quảng cáo"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-4 w-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-900">{userInfo.phone || "Chưa cung cấp số điện thoại"}</p>
          </div>
        </div>
      )}
    </div>
  );
}