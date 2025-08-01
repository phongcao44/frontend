import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllVariants, updateVariantStockQuantity } from "../../redux/slices/productVariantSlice";

function StockManagement() {
  const dispatch = useDispatch();
  const { list: variants, loading } = useSelector((state) => state.productVariants);
  const [editingStock, setEditingStock] = useState({});
  const [stockValues, setStockValues] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, inStock, lowStock, outOfStock
  const [colorFilter, setColorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  useEffect(() => {
    dispatch(loadAllVariants());
  }, [dispatch]);

  useEffect(() => {
    // Initialize stock values from variants
    const initialStockValues = {};
    variants.forEach(variant => {
      initialStockValues[variant.id] = variant.stockQuantity || 0;
    });
    setStockValues(initialStockValues);
  }, [variants]);

  // Filter and pagination logic
  const filteredVariants = useMemo(() => {
    let filtered = variants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(variant =>
        variant.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.colorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variant.sizeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stock filter
    if (stockFilter !== "all") {
      filtered = filtered.filter(variant => {
        const stock = variant.stockQuantity || 0;
        switch (stockFilter) {
          case "inStock":
            return stock > 10;
          case "lowStock":
            return stock > 0 && stock <= 10;
          case "outOfStock":
            return stock === 0;
          default:
            return true;
        }
      });
    }

    // Color filter
    if (colorFilter !== "all") {
      filtered = filtered.filter(variant =>
        variant.colorName === colorFilter
      );
    }

    // Size filter
    if (sizeFilter !== "all") {
      filtered = filtered.filter(variant =>
        variant.sizeName === sizeFilter
      );
    }

    return filtered;
  }, [variants, searchTerm, stockFilter, colorFilter, sizeFilter]);

  // Get unique colors and sizes for filter options
  const uniqueColors = useMemo(() => {
    const colors = [...new Set(variants.map(v => v.colorName).filter(Boolean))];
    return colors.sort();
  }, [variants]);

  const uniqueSizes = useMemo(() => {
    const sizes = [...new Set(variants.map(v => v.sizeName).filter(Boolean))];
    return sizes.sort();
  }, [variants]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVariants = filteredVariants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stockFilter, colorFilter, sizeFilter]);

  const handleStockChange = (variantId, value) => {
    setStockValues(prev => ({
      ...prev,
      [variantId]: parseInt(value) || 0
    }));
  };

  const handleUpdateStock = async (variantId) => {
    try {
      const newStockQuantity = stockValues[variantId];
      console.log('Updating stock for variant ID:', variantId, 'New quantity:', newStockQuantity);

      await dispatch(updateVariantStockQuantity({
        id: variantId,
        stockQuantity: newStockQuantity
      })).unwrap();
      
      setEditingStock(prev => ({
        ...prev,
        [variantId]: false
      }));
      
      alert("Cập nhật số lượng tồn kho thành công!");
    } catch (error) {
      console.error('Update stock error:', error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  const startEditing = (variantId) => {
    setEditingStock(prev => ({
      ...prev,
      [variantId]: true
    }));
  };

  const cancelEditing = (variantId) => {
    setEditingStock(prev => ({
      ...prev,
      [variantId]: false
    }));
    // Reset to original value
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      setStockValues(prev => ({
        ...prev,
        [variantId]: variant.stockQuantity || 0
      }));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          Trước
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            currentPage === i
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Sau
        </button>
      );
    }

    return pages;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStockFilter("all");
    setColorFilter("all");
    setSizeFilter("all");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Kho hàng</h1>
        </div>
        <p className="text-gray-600 ml-11">Theo dõi và cập nhật số lượng tồn kho sản phẩm</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{variants.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Còn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {variants.filter(v => (v.stockQuantity || 0) > 10).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ít hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {variants.filter(v => (v.stockQuantity || 0) > 0 && (v.stockQuantity || 0) <= 10).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {variants.filter(v => (v.stockQuantity || 0) === 0).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên sản phẩm, SKU, màu, size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tình trạng kho
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="inStock">Còn hàng (&gt;10)</option>
              <option value="lowStock">Ít hàng (1-10)</option>
              <option value="outOfStock">Hết hàng (0)</option>
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc
            </label>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả màu</option>
              {uniqueColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kích thước
            </label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả size</option>
              {uniqueSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Hiển thị {filteredVariants.length} trong tổng số {variants.length} sản phẩm
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Sản Phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Màu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kích Thước
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số Lượng Tồn Kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVariants.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {variant.productName || "N/A"}
                    </div>
                    {variant.sku && (
                      <div className="text-sm text-gray-500">
                        SKU: {variant.sku}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {variant.colorHex && (
                        <div 
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: variant.colorHex }}
                        ></div>
                      )}
                      <span className="text-sm text-gray-900">
                        {variant.colorName || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.sizeName || variant.sizeDescription || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingStock[variant.id] ? (
                      <input
                        type="number"
                        min="0"
                        value={stockValues[variant.id] || 0}
                        onChange={(e) => handleStockChange(variant.id, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className={`text-sm font-medium ${
                        (variant.stockQuantity || 0) === 0 
                          ? 'text-red-600' 
                          : (variant.stockQuantity || 0) < 10 
                            ? 'text-yellow-600' 
                            : 'text-green-600'
                      }`}>
                        {variant.stockQuantity || 0}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingStock[variant.id] ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStock(variant.id)}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs transition-colors"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => cancelEditing(variant.id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(variant.id)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-xs transition-colors"
                      >
                        Sửa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredVariants.length)}
                  </span>{' '}
                  trong tổng số <span className="font-medium">{filteredVariants.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {renderPagination()}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockManagement;
