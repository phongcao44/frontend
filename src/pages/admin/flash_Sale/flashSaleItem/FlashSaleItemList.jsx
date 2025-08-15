import { Search, Tag, Edit2, Trash2 } from "lucide-react";
import Pagination from "../../../../components/Pagination";

export default function FlashSaleItemList({
  flashSaleLoading,
  flashSaleError,
  localError,
  searchTerm,
  setSearchTerm,
  paginatedItems,
  totalItems,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  handleEdit,
  handleDelete,
  isModalOpen,
  editForm,
  setEditForm,
  editingItemId,
  handleEditSubmit,
  closeModal,
}) {
  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  return (
    <>
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm, màu sắc hoặc kích thước..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={flashSaleLoading}
          />
        </div>
      </div>

      {/* Loading State */}
      {flashSaleLoading && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <svg
            className="h-6 w-6 animate-spin mx-auto text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h5m-5 0v10a2 2 0 002 2h12a2 2 0 002-2V9m-6-5l3 3m0 0l-3 3"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {(flashSaleError || localError) && (
        <div className="bg-red-50 p-4 rounded-xl mb-6 text-sm text-red-800 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {flashSaleError || localError}
        </div>
      )}

      {/* Empty State */}
      {!flashSaleLoading && !flashSaleError && paginatedItems.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-600">Không tìm thấy sản phẩm nào.</p>
        </div>
      )}

      {/* Desktop Table */}
      {!flashSaleLoading && !flashSaleError && paginatedItems.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Biến thể
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá gốc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá Flash Sale
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảm giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã bán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((item) => (
                    <tr key={item.flashSaleItemId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.imageUrl || ""}
                            alt={item.productName}
                            className="h-8 w-8 object-cover rounded mr-2"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {item.productName || "Không rõ"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.color || ""} {item.color && item.size ? "-" : ""} {item.size || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatVND(item.originalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {formatVND(item.finalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.discountType === "PERCENTAGE"
                          ? `${item.discountedPrice}%`
                          : formatVND(item.discountedPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.quantityLimit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.soldQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 rounded hover:text-blue-900 hover:bg-blue-50 transition-colors"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.flashSaleItemId)}
                          className="p-1 text-red-600 rounded hover:text-red-900 hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {paginatedItems.map((item) => (
              <div
                key={item.flashSaleItemId}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl || ""}
                      alt={item.productName}
                      className="h-12 w-12 object-cover rounded mr-2"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.productName || "Không rõ"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.color || ""} {item.color && item.size ? "-" : ""} {item.size || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag size={16} className="mr-2" />
                    Giá gốc: {formatVND(item.originalPrice)}
                  </div>
                  <div className="flex items-center text-sm text-red-600">
                    <Tag size={16} className="mr-2" />
                    Giá Flash Sale: {formatVND(item.finalPrice)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag size={16} className="mr-2" />
                    Giảm giá:{" "}
                    {item.discountType === "PERCENTAGE"
                      ? `${item.discountedPrice}%`
                      : formatVND(item.discountedPrice)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag size={16} className="mr-2" />
                    Số lượng: {item.quantityLimit}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag size={16} className="mr-2" />
                    Đã bán: {item.soldQuantity}
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.flashSaleItemId)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page, newItemsPerPage) => {
              setCurrentPage(page);
              if (newItemsPerPage !== itemsPerPage) {
                setItemsPerPage(newItemsPerPage);
              }
            }}
          />
        </>
      )}

      {/* Edit Modal */}
      {isModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa sản phẩm Flash Sale
              </h3>
              <button
                onClick={closeModal}
                className="p-1 text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sản phẩm
                </label>
                <input
                  type="text"
                  value={editForm.productName || ""}
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biến thể
                </label>
                <input
                  type="text"
                  value={
                    (editForm.color || "") +
                    (editForm.color && editForm.size ? " - " : "") +
                    (editForm.size || "")
                  }
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giảm giá
                </label>
                <select
                  value={editForm.discountType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, discountType: e.target.value, discountValue: "" })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PERCENTAGE">Phần trăm</option>
                  <option value="AMOUNT">Số tiền</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editForm.discountType === "PERCENTAGE" ? "Phần trăm giảm giá" : "Số tiền giảm giá"}
                </label>
                <input
                  type="number"
                  value={editForm.discountValue || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm({ ...editForm, discountValue: value });
                    if (value && editForm.discountType === "PERCENTAGE") {
                      const numValue = parseFloat(value);
                      if (numValue > 100) {
                        e.target.setCustomValidity("Phần trăm không được vượt quá 100%");
                      } else if (numValue < 0) {
                        e.target.setCustomValidity("Phần trăm không được âm");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    } else if (value && editForm.discountType === "AMOUNT") {
                      const numValue = parseFloat(value);
                      if (numValue < 0) {
                        e.target.setCustomValidity("Số tiền không được âm");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }
                  }}
                  required
                  min={editForm.discountType === "PERCENTAGE" ? "0" : "1000"}
                  max={editForm.discountType === "PERCENTAGE" ? "100" : undefined}
                  step={editForm.discountType === "PERCENTAGE" ? "1" : "1000"}
                  placeholder={
                    editForm.discountType === "PERCENTAGE"
                      ? "Nhập phần trăm (0-100)"
                      : "Nhập số tiền"
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn số lượng
                </label>
                <input
                  type="number"
                  value={editForm.quantity || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm({ ...editForm, quantity: value });
                    if (value) {
                      const numValue = parseInt(value);
                      if (numValue <= 0) {
                        e.target.setCustomValidity("Số lượng phải lớn hơn 0");
                      } else if (numValue < parseInt(editForm.soldQuantity)) {
                        e.target.setCustomValidity(
                          "Số lượng tổng không được nhỏ hơn số lượng đã bán"
                        );
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }
                  }}
                  required
                  min="1"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng đã bán
                </label>
                <input
                  type="number"
                  value={editForm.soldQuantity || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm({ ...editForm, soldQuantity: value });
                    if (value) {
                      const numValue = parseInt(value);
                      if (numValue < 0) {
                        e.target.setCustomValidity("Số lượng đã bán không được âm");
                      } else if (numValue > parseInt(editForm.quantity)) {
                        e.target.setCustomValidity(
                          "Số lượng đã bán không được vượt quá số lượng tổng"
                        );
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }
                  }}
                  required
                  min="0"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
