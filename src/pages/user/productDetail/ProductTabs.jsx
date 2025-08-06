/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductReviews from "./ProductReviews";
import { getProductSpecificationByIdForUser } from "../../../redux/slices/productSpecificationSlice";

const ProductTabs = ({ productId, product }) => {
  const dispatch = useDispatch();
  const { current: specifications, loading: specLoading, error: specError } = useSelector((state) => state.productSpecification);
  const [activeTab, setActiveTab] = useState("description");

  // Fetch specifications when component mounts
  useEffect(() => {
    if (productId) {
      dispatch(getProductSpecificationByIdForUser(productId));
    }
  }, [dispatch, productId]);

  // Ensure specifications is an array
  const productSpecs = Array.isArray(specifications) ? specifications : [];

  // Memoize tab change handler to prevent unnecessary re-renders
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const tabs = [
    { id: "description", label: "Mô tả sản phẩm", icon: "ri-file-text-line" },
    {
      id: "specifications",
      label: "Thông số kỹ thuật",
      icon: "ri-settings-line",
    },
    {
      id: "reviews",
      label: `Đánh giá (${product.totalReviews || 0})`,
      icon: "ri-star-line",
    },
    {
      id: "return-policy",
      label: "Chính sách đổi trả",
      icon: "ri-refresh-line",
    },
  ];

  // Render tab content with optimized structure
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="max-w-none">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {product.description || "Product description will be added here."}
              </p>
            </div>
          </div>
        );

      case "specifications":
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Thông số kỹ thuật chi tiết
            </h3>
            {specLoading ? (
              <div className="text-center text-gray-600">
                Loading specifications...
              </div>
            ) : specError ? (
              <div className="text-center text-red-500">
                Error: {specError}
              </div>
            ) : productSpecs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {productSpecs
                    .slice(0, Math.ceil(productSpecs.length / 2))
                    .map((spec) => (
                      <div
                        key={spec.id}
                        className="flex justify-between items-center py-3 border-b border-gray-100"
                      >
                        <span className="text-gray-600 font-medium">
                          {spec.specKey}
                        </span>
                        <span className="text-gray-900 font-semibold text-right">
                          {spec.specValue}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="space-y-4">
                  {productSpecs
                    .slice(Math.ceil(productSpecs.length / 2))
                    .map((spec) => (
                      <div
                        key={spec.id}
                        className="flex justify-between items-center py-3 border-b border-gray-100"
                      >
                        <span className="text-gray-600 font-medium">
                          {spec.specKey}
                        </span>
                        <span className="text-gray-900 font-semibold text-right">
                          {spec.specValue}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                No specifications available for this product.
              </div>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="min-h-[400px]">
            <ProductReviews productId={productId} />
          </div>
        );

      case "return-policy":
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Chính sách đổi trả
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="ri-truck-line mr-2 text-blue-600"></i>
                  Chính sách vận chuyển
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Miễn phí vận chuyển cho đơn hàng trên 500,000đ</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Giao hàng nhanh trong 1-2 ngày làm việc</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Hỗ trợ giao hàng toàn quốc</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="ri-refresh-line mr-2 text-green-600"></i>
                  Chính sách đổi trả
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Đổi trả miễn phí trong 30 ngày</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Hoàn tiền 100% nếu có lỗi từ nhà sản xuất</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Quy trình đổi trả đơn giản và nhanh chóng</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">
                Liên hệ hỗ trợ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <i className="ri-phone-line text-blue-600"></i>
                  <div>
                    <p className="font-medium text-gray-900">Hotline</p>
                    <p className="text-sm text-gray-600">1900-xxxx</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-line text-blue-600"></i>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@company.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-time-line text-blue-600"></i>
                  <div>
                    <p className="font-medium text-gray-900">Giờ làm việc</p>
                    <p className="text-sm text-gray-600">8:00 - 22:00 hàng ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white mt-12">
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className={`${tab.icon} text-lg`}></i>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;