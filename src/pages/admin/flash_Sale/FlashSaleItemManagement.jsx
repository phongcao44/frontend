import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Tag,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  createFlashSaleItem,
  removeFlashSaleItem,
  fetchFlashSaleItems,
} from "../../../redux/slices/flashSaleSlice";
import Pagination from "../../../components/Pagination";

// Dữ liệu giả lập
const products = [
  { id: 1, name: "Áo thun nam" },
  { id: 2, name: "Quần jeans nữ" },
  { id: 3, name: "Giày thể thao" },
];

const variants = [
  { id: 1, product_id: 1, name: "Đen - M", price: 200000 },
  { id: 2, product_id: 1, name: "Trắng - L", price: 220000 },
  { id: 3, product_id: 2, name: "Xanh - S", price: 350000 },
  { id: 4, product_id: 3, name: "Đỏ - 39", price: 800000 },
];

const getProductName = (productId) => {
  const product = products.find((p) => p.id === parseInt(productId));
  return product ? product.name : `ID ${productId}`;
};

const getVariantName = (variantId) => {
  const variant = variants.find((v) => v.id === parseInt(variantId));
  return variant ? variant.name : `ID ${variantId}`;
};

const getVariantPrice = (variantId) => {
  const variant = variants.find((v) => v.id === parseInt(variantId));
  return variant ? variant.price : 0;
};

const availableVariants = (productId) =>
  variants.filter((v) => v.product_id === parseInt(productId));

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export default function FlashSaleItemManagement({ onBack }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { flashSaleItems, flashSales, loading, error } = useSelector((state) => ({
    flashSaleItems: state.flashSale.flashSaleItems,
    flashSales: state.flashSale.flashSales,
    loading: state.flashSale.loading,
    error: state.flashSale.error,
  }));

  const [form, setForm] = useState({
    product_id: "",
    variant_id: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    quantity_limit: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchFlashSaleItems(id));
    }
  }, [id, dispatch]);

  const selectedFlashSale = flashSales.find((fs) => fs.id === parseInt(id)) || {
    name: "Không rõ",
    description: "",
  };

  const safe = (v, fallback = "") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

  const calculateDiscountedPrice = (variantId, discountType, discountValue) => {
    const originalPrice = getVariantPrice(variantId);
    if (!discountValue || !variantId) return originalPrice;
    const value = parseFloat(discountValue);
    if (discountType === "PERCENTAGE") {
      return originalPrice * (1 - value / 100);
    } else {
      return originalPrice - value;
    }
  };

  const getCurrentItems = () =>
    flashSaleItems
      .filter((i) => i.flash_sale_id === parseInt(id))
      .filter(
        (i) =>
          getProductName(i.product_id)
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          getVariantName(i.variant_id)
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );

  const paginatedItems = getCurrentItems().slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product_id || !form.variant_id || !form.discount_value) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const discounted_price = calculateDiscountedPrice(
      form.variant_id,
      form.discount_type,
      form.discount_value
    );

    dispatch(
      createFlashSaleItem({
        ...form,
        flash_sale_id: parseInt(id),
        discounted_price,
        discount_value: parseFloat(form.discount_value),
        quantity_limit: parseInt(form.quantity_limit),
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        Swal.fire("Thành công", "Thêm sản phẩm thành công", "success");
        setForm({
          product_id: "",
          variant_id: "",
          discount_type: "PERCENTAGE",
          discount_value: "",
          quantity_limit: "",
        });
      } else {
        Swal.fire("Lỗi", "Thêm sản phẩm thất bại", "error");
      }
    });
  };

  const handleDelete = (itemId) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFlashSaleItem(itemId)).then(() => {
          Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Đã hủy", "Sản phẩm vẫn còn nguyên.", "info");
      }
    });
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setCurrentPage(0);
    dispatch(fetchFlashSaleItems(id));
  };

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Sản phẩm Flash Sale: {safe(selectedFlashSale.name)}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {safe(selectedFlashSale.description, "Quản lý sản phẩm trong chương trình Flash Sale")}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onBack}
                className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center space-x-2"
              >
                <X size={20} />
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm sản phẩm Flash Sale</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sản phẩm
              </label>
              <select
                value={form.product_id}
                onChange={(e) =>
                  setForm({ ...form, product_id: e.target.value, variant_id: "", discount_value: "" })
                }
                required
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {safe(p.name, `ID ${p.id}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Biến thể
              </label>
              <select
                value={form.variant_id}
                onChange={(e) => setForm({ ...form, variant_id: e.target.value, discount_value: "" })}
                required
                disabled={!form.product_id}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn biến thể</option>
                {availableVariants(form.product_id).map((v) => (
                  <option key={v.id} value={v.id}>
                    {safe(v.name, `ID ${v.id}`)} - {formatVND(v.price)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Loại giảm
              </label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value, discount_value: "" })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">Phần trăm</option>
                <option value="AMOUNT">Số tiền</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {form.discount_type === "PERCENTAGE" ? "Phần trăm giảm giá" : "Tổng tiền giảm giá"}
              </label>
              <input
                type="number"
                value={safe(form.discount_value)}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                required
                min={form.discount_type === "PERCENTAGE" ? "0" : "1000"}
                max={form.discount_type === "PERCENTAGE" ? "100" : undefined}
                step={form.discount_type === "PERCENTAGE" ? "1" : "1000"}
                placeholder={form.discount_type === "PERCENTAGE" ? "Nhập phần trăm (0-100)" : "Nhập số tiền"}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.variant_id && form.discount_value && (
                <p className="text-sm text-gray-500 mt-1">
                  Giá sau giảm: {formatVND(calculateDiscountedPrice(form.variant_id, form.discount_type, form.discount_value))}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giới hạn số lượng
              </label>
              <input
                type="number"
                value={safe(form.quantity_limit)}
                onChange={(e) => setForm({ ...form, quantity_limit: e.target.value })}
                required
                min="1"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800"
              >
                Thêm sản phẩm
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm hoặc biến thể..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-xl mb-6 text-sm text-red-800 flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error.message || "Có lỗi xảy ra"}
          </div>
        )}

        {!loading && !error && paginatedItems.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không tìm thấy sản phẩm nào.
            </p>
          </div>
        )}

        {!loading && !error && paginatedItems.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Biến thể
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Giá gốc
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Giá Flash Sale
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Giảm giá
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Đã bán
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedItems.map((item) => {
                      const variant = variants.find(
                        (v) => v.id === parseInt(item.variant_id)
                      );
                      const original = safe(variant?.price, 0);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Tag className="h-5 w-5 text-orange-500 mr-2" />
                              <div className="text-sm font-medium text-gray-900">
                                {getProductName(item.product_id)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getVariantName(item.variant_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatVND(original)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {formatVND(item.discounted_price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.discount_type === "PERCENTAGE"
                              ? `${item.discount_value}%`
                              : formatVND(item.discount_value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity_limit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.sold_quantity || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-4">
              {paginatedItems.map((item) => {
                const variant = variants.find(
                  (v) => v.id === parseInt(item.variant_id)
                );
                const original = safe(variant?.price, 0);
                return (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-orange-500 mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getProductName(item.product_id)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getVariantName(item.variant_id)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag size={16} className="mr-2" />
                        Giá gốc: {formatVND(original)}
                      </div>
                      <div className="flex items-center text-sm text-red-600">
                        <Tag size={16} className="mr-2" />
                        Giá Flash Sale: {formatVND(item.discounted_price)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag size={16} className="mr-2" />
                        Giảm giá: {item.discount_type === "PERCENTAGE"
                          ? `${item.discount_value}%`
                          : formatVND(item.discount_value)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag size={16} className="mr-2" />
                        Số lượng: {item.quantity_limit}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag size={16} className="mr-2" />
                        Đã bán: {item.sold_quantity || 0}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={getCurrentItems().length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page, newItemsPerPage) => {
                handlePageChange(page, newItemsPerPage || itemsPerPage);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}