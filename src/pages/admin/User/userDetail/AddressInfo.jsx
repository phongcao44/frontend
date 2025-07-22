/* eslint-disable react/prop-types */
import { Edit } from "lucide-react";
import { Formik, Form, Field } from "formik";

// Address information with Formik and skeleton
export default function AddressInfo({ address, isEditingAddress, isLoading, handlers }) {
  // Skeleton loader
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (isLoading || !address) return <div className="bg-white rounded-lg border border-gray-200 p-6">{renderSkeleton()}</div>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Địa chỉ mặc định</h3>
        <button
          onClick={() => handlers.setIsEditingAddress(!isEditingAddress)}
          className="text-gray-400 hover:text-gray-600 p-1"
          disabled={isLoading}
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
      {isEditingAddress ? (
        <Formik
          initialValues={{
            name: address.name || "",
            street: address.street || "",
            city: address.city || "",
            country: address.country || "",
            zipCode: address.zipCode || "",
          }}
          validationSchema={handlers.addressValidationSchema}
          onSubmit={handlers.handleAddressSave}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên"
                />
                {errors.name && touched.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>
              <Field
                name="street"
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Địa chỉ"
              />
              <Field
                name="city"
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thành phố"
              />
              <div>
                <Field
                  name="country"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Quốc gia"
                />
                {errors.country && touched.country && (
                  <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                )}
              </div>
              <Field
                name="zipCode"
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mã bưu điện"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handlers.setIsEditingAddress(false)}
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{address.name || "N/A"}</p>
            <p>{address.street || "N/A"}</p>
            <p>{address.city || "N/A"}</p>
            <p>{address.country || "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );
}