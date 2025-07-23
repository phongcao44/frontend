import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProductsPaginate, removeProduct } from "../../../redux/slices/productSlice";
import { Search, Plus, Edit2, Trash2, RefreshCw, Download, Image } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../../../components/Pagination";
import { handleDownloadExcel } from "../../../services/handleDownloadExcel";

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Mock helper functions (replace with actual implementations)
const mapSortBy = (sortBy) => ({
  sortBy: sortBy || "price",
  orderBy: "asc"
});

const getPriceRange = (selectedPriceRange) => {
  const ranges = {
    "0-50": { priceMin: 0, priceMax: 50 },
    "50-100": { priceMin: 50, priceMax: 100 },
    "100-200": { priceMin: 100, priceMax: 200 }
  };
  return ranges[selectedPriceRange] || { priceMin: null, priceMax: null };
};

const ratingOptions = [
  { id: "0", value: 0 },
  { id: "3", value: 3 },
  { id: "4", value: 4 },
  { id: "5", value: 5 }
];

export default function ProductManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paginated, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const id = null; // Category ID, replace with actual value or prop

  console.log("ProductManagement rendered", paginated?.data?.content);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
      setIsLoading(false);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    setIsLoading(true);
    const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
    const { priceMin, priceMax } = getPriceRange(selectedPriceRange);
    const minRating = ratingOptions.find((r) => r.id === selectedRating)?.value || 0;

    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: apiSortBy,
      orderBy,
      categoryId: selectedSubcategoryId || id,
      status: statusFilter === "true" ? "IN_STOCK" : statusFilter === "false" ? "OUT_OF_STOCK" : null,
      brandName: selectedBrand === "all" ? null : selectedBrand,
      priceMin: priceMin || null,
      priceMax: priceMax || null,
      minRating: minRating === 0 ? null : minRating,
      keyword: debouncedSearchTerm || null
    };

    dispatch(loadProductsPaginate(params)).finally(() => setTimeout(() => setIsLoading(false), 500));
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    id,
    selectedSubcategoryId,
    selectedPriceRange,
    selectedRating,
    selectedBrand,
    sortBy,
    debouncedSearchTerm,
    statusFilter
  ]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await dispatch(removeProduct(id)).unwrap();
        await Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
        // Refresh the product list
        const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
        const { priceMin, priceMax } = getPriceRange(selectedPriceRange);
        const minRating = ratingOptions.find((r) => r.id === selectedRating)?.value || 0;

        dispatch(loadProductsPaginate({
          page: currentPage,
          limit: itemsPerPage,
          sortBy: apiSortBy,
          orderBy,
          categoryId: selectedSubcategoryId || id,
          status: statusFilter === "true" ? "IN_STOCK" : statusFilter === "false" ? "OUT_OF_STOCK" : null,
          brandName: selectedBrand === "all" ? null : selectedBrand,
          priceMin: priceMin || null,
          priceMax: priceMax || null,
          minRating: minRating === 0 ? null : minRating,
          keyword: debouncedSearchTerm || null
        }));
      } catch (err) {
        await Swal.fire(
          "Thất bại!",
          `Xóa sản phẩm thất bại: ${err.message || err}`,
          "error"
        );
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire("Đã hủy", "Sản phẩm vẫn còn nguyên.", "info");
    }
  };

  const handleAdd = () => {
    navigate("/admin/products/add");
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/${id}`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(paginated?.data?.content?.map((product) => product.id) || []);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
    const { priceMin, priceMax } = getPriceRange(selectedPriceRange);
    const minRating = ratingOptions.find((r) => r.id === selectedRating)?.value || 0;

    dispatch(loadProductsPaginate({
      page: currentPage,
      limit: itemsPerPage,
      sortBy: apiSortBy,
      orderBy,
      categoryId: selectedSubcategoryId || id,
      status: statusFilter === "true" ? "IN_STOCK" : statusFilter === "false" ? "OUT_OF_STOCK" : null,
      brandName: selectedBrand === "all" ? null : selectedBrand,
      priceMin: priceMin || null,
      priceMax: priceMax || null,
      minRating: minRating === 0 ? null : minRating,
      keyword: debouncedSearchTerm || null
    })).finally(() => setTimeout(() => setIsLoading(false), 500));
  };

  const totalProducts = paginated?.data?.totalElements || 0;
  const inStockProducts = paginated?.data?.content?.filter((product) => product.status === "IN_STOCK").length || 0;
  const outOfStockProducts = paginated?.data?.content?.filter((product) => product.status === "OUT_OF_STOCK").length || 0;

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
              <p className="text-sm text-gray-600 mt-1">Theo dõi và quản lý tất cả sản phẩm</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                disabled={loading || isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${loading || isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Thêm sản phẩm</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Image className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Image className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Còn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{inStockProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Image className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isLoading}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Còn hàng</option>
                <option value="false">Hết hàng</option>
              </select>
              <select
                value={selectedPriceRange}
                onChange={(e) => {
                  setSelectedPriceRange(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isLoading}
              >
                <option value="">Tất cả giá</option>
                <option value="0-50">0 - 50</option>
                <option value="50-100">50 - 100</option>
                <option value="100-200">100 - 200</option>
              </select>
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isLoading}
              >
                <option value="0">Tất cả đánh giá</option>
                <option value="3">3 sao trở lên</option>
                <option value="4">4 sao trở lên</option>
                <option value="5">5 sao</option>
              </select>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isLoading}
              >
                <option value="all">Tất cả thương hiệu</option>
                <option value="BrandA">Brand A</option>
                <option value="BrandB">Brand B</option>
              </select>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                disabled={loading || isLoading}
              />
            </div>
          </div>
        </div>

        {(loading || isLoading) && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-6 rounded-xl shadow-sm border border-red-200 text-center">
            <p className="text-sm text-red-600">
              Lỗi: {error.message || "Không thể tải sản phẩm"}
            </p>
          </div>
        )}

        {!loading && !isLoading && !error && (!paginated?.data?.content || paginated.data.content.length === 0) && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không tìm thấy sản phẩm nào.
            </p>
          </div>
        )}

        {!loading && !isLoading && !error && paginated?.data?.content?.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedItems.length === paginated?.data?.content?.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ảnh
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tên sản phẩm
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nhà cung cấp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginated.data.content.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedItems.includes(product.id)}
                            onChange={() => handleSelectItem(product.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.name} ({product.variantCount} biến thể)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stockQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.categoryName || "Không rõ"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.brand || "Không rõ"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.status === "IN_STOCK" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-1 ${
                                product.status === "IN_STOCK" ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            {product.status === "IN_STOCK" ? "Còn hàng" : "Hết hàng"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                              onClick={() => handleEdit(product.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-4">
              {paginated.data.content.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 mr-3"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                      />
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{product.id}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "IN_STOCK" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          product.status === "IN_STOCK" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      {product.status === "IN_STOCK" ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Image className="h-4 w-4 mr-2" />
                        <span>Số lượng:</span>
                      </div>
                      <span className="text-sm text-gray-500">{product.stockQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Image className="h-4 w-4 mr-2" />
                        <span>Loại:</span>
                      </div>
                      <span className="text-sm text-gray-500">{product.categoryName || "Không rõ"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Image className="h-4 w-4 mr-2" />
                        <span>Nhà cung cấp:</span>
                      </div>
                      <span className="text-sm text-gray-500">{product.brand || "Không rõ"}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit2 className="h-4 w-4 inline mr-2" />
                      Sửa
                    </button>
                    <button
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={paginated?.data?.totalElements || 0}
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