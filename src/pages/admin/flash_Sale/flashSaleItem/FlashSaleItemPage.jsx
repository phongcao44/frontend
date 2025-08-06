import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import FlashSaleItemForm from "./FlashSaleItemForm";
import FlashSaleItemList from "./FlashSaleItemList";
import useFlashSaleItem from "./useFlashSaleItem";

export default function FlashSaleItemPage({ onBack }) {
  const { id } = useParams();
  const {
    flashSale,
    flashSaleLoading,
    flashSaleError,
    productsLoading,
    productsError,
    localError,
    form,
    setForm,
    editForm,
    setEditForm,
    isModalOpen,
    setIsModalOpen,
    editingItemId,
    setEditingItemId,
    searchTerm,
    setSearchTerm,
    productSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    productOptions,
    variants,
    paginatedItems,
    totalItems,
    handleSubmit,
    handleEditSubmit,
    handleDelete,
    handleRefresh,
    handleProductSearchChange,
    handleMenuScrollToBottom,
    flashSaleVariantDetails,
  } = useFlashSaleItem(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Sản phẩm Flash Sale: {flashSale?.name || "Không rõ"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {flashSale?.description || "Quản lý sản phẩm trong chương trình Flash Sale"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors"
                disabled={flashSaleLoading || productsLoading}
              >
                <svg
                  className={`h-5 w-5 ${flashSaleLoading || productsLoading ? "animate-spin" : ""}`}
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
              </button>
              <button
                className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                    d="M4 16v4m0 0h4m-4 0l5-5m4 5v4m0 0h4m-4 0l-5-5m10-6V4m0 0h-4m4 0l-5 5"
                  />
                </svg>
              </button>
              <button
                onClick={onBack}
                className="flex items-center px-4 py-2 space-x-2 text-gray-600 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <X size={20} />
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <FlashSaleItemForm
          form={form}
          setForm={setForm}
          productOptions={productOptions}
          variants={variants}
          handleSubmit={handleSubmit}
          productsLoading={productsLoading}
          productsError={productsError}
          handleProductSearchChange={handleProductSearchChange}
          handleMenuScrollToBottom={handleMenuScrollToBottom}
          flashSaleVariantDetails={flashSaleVariantDetails}
          flashSaleLoading={flashSaleLoading}
        />

        <FlashSaleItemList
          flashSaleLoading={flashSaleLoading}
          flashSaleError={flashSaleError}
          localError={localError}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          paginatedItems={paginatedItems}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
          handleEdit={(item) => {
            setEditForm({
              productId: item.productId || 0,
              variantId: item.variantId || 0,
              discountType: item.discountType || "PERCENTAGE",
              discountValue: item.discountedPrice ? item.discountedPrice.toString() : "",
              quantity: item.quantityLimit ? item.quantityLimit.toString() : "",
              soldQuantity: item.soldQuantity || 0,
              productName: item.productName || "",
              color: item.color || "",
              size: item.size || "",
            });
            setEditingItemId(item.flashSaleItemId);
            setIsModalOpen(true);
          }}
          handleDelete={handleDelete}
          isModalOpen={isModalOpen}
          editForm={editForm}
          setEditForm={setEditForm}
          editingItemId={editingItemId}
          handleEditSubmit={handleEditSubmit}
          closeModal={() => {
            setIsModalOpen(false);
            setEditForm(null);
            setEditingItemId(null);
          }}
        />
      </div>
    </div>
  );
}