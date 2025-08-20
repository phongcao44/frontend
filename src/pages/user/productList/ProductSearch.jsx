import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { loadProductsPaginate } from "../../../redux/slices/productSlice";
import { loadParentCategories } from "../../../redux/slices/categorySlice";
import ProductCard from "../home/ProductCard";

// Hàm để parse query parameters từ URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Skeleton loading component cho products
function ProductSkeleton() {
  return (
    <div className="p-2">
      <div className="bg-white rounded-md shadow-sm overflow-hidden skeleton-pulse">
        <div className="relative w-full pt-[100%]">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse"></div>
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
            <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
          </div>
        </div>
        <div className="p-4 min-h-[120px] space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loading cho categories
function CategorySkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
        ></div>
      ))}
    </div>
  );
}

function ProductSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize states from URL parameters
  const keyword = searchParams.get("keyword") || "";
  const pageFromUrl = parseInt(searchParams.get("page")) || 0;
  const categoryFromUrl = searchParams.get("category") || "all";
  const priceRangeFromUrl = searchParams.get("priceRange") || "all";
  const ratingFromUrl = searchParams.get("rating") || "all";
  const sortByFromUrl = searchParams.get("sortBy") || "popular";

  // Redux selectors
  const paginatedProducts = useSelector((state) => state.products.paginated || {});
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const { parentList, loading: categoryLoading } = useSelector((state) => state.category);

  // State management
  const [activeFilter, setActiveFilter] = useState(categoryFromUrl);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRangeFromUrl);
  const [tempPriceRange, setTempPriceRange] = useState(priceRangeFromUrl);
  const [selectedRating, setSelectedRating] = useState(ratingFromUrl);
  const [tempRating, setTempRating] = useState(ratingFromUrl);
  const [sortBy, setSortBy] = useState(sortByFromUrl);
  const [page, setPage] = useState(pageFromUrl);
  const [isProductListLoading, setIsProductListLoading] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Filter options
  const priceRanges = [
    { id: "all", label: "Tất cả giá", min: null, max: null },
    { id: "under-500", label: "Dưới 500K", min: 0, max: 500000 },
    { id: "500-1000", label: "500K - 1 triệu", min: 500000, max: 1000000 },
    { id: "above-1000", label: "Trên 1 triệu", min: 1000000, max: null },
  ];

  const ratingOptions = [
    { id: "all", label: "Tất cả đánh giá", value: 0 },
    { id: "4plus", label: "4 sao trở lên", value: 4 },
    { id: "3plus", label: "3 sao trở lên", value: 3 },
    { id: "2plus", label: "2 sao trở lên", value: 2 },
  ];

  const sortOptions = [
    { value: "popular", label: "Phổ biến" },
    { value: "newest", label: "Mới nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
  ];

  // Load parent categories on mount
  useEffect(() => {
    dispatch(
      loadParentCategories({
        page: 0,
        limit: 8,
        sortBy: "name",
        orderBy: "asc",
      })
    );
  }, [dispatch]);

  // Map sortBy to API parameters
  const mapSortBy = (sortBy) => {
    switch (sortBy) {
      case "newest":
        return { sortBy: "createdAt", orderBy: "desc" };
      case "price-low":
        return { sortBy: "price", orderBy: "asc" };
      case "price-high":
        return { sortBy: "price", orderBy: "desc" };
      default:
        return { sortBy: "createdAt", orderBy: "desc" };
    }
  };

  // Get price range parameters
  const getPriceRange = () => {
    const range = priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
    return {
      priceMin: range.min,
      priceMax: range.max,
    };
  };

  // Update URL with valid query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (page > 0) params.set("page", page.toString());
    if (activeFilter !== "all") params.set("category", activeFilter);
    if (selectedPriceRange !== "all") params.set("priceRange", selectedPriceRange);
    if (selectedRating !== "all") params.set("rating", selectedRating);
    if (sortBy !== "popular") params.set("sortBy", sortBy);

    setSearchParams(params, { replace: true });
  }, [keyword, page, activeFilter, selectedPriceRange, selectedRating, sortBy, setSearchParams]);

  // Load products when parameters change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsProductListLoading(true);
        setIsPageTransitioning(true);

        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));

        const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
        const { priceMin, priceMax } = getPriceRange();
        const minRating = ratingOptions.find((r) => r.id === selectedRating)?.value || 0;

        const params = {
          page,
          limit: 8,
          sortBy: apiSortBy,
          orderBy,
          keyword: keyword || null,
          categoryId: activeFilter === "all" ? null : activeFilter,
          status: null,
          brandName: null,
          priceMin,
          priceMax,
          minRating: minRating === 0 ? null : minRating,
        };

        await dispatch(loadProductsPaginate(params)).unwrap();
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsProductListLoading(false);
        // Add a small delay before hiding transition effect
        setTimeout(() => setIsPageTransitioning(false), 200);
      }
    };

    loadProducts();
  }, [dispatch, page, activeFilter, selectedPriceRange, selectedRating, sortBy, keyword]);

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedPriceRange(tempPriceRange);
    setSelectedRating(tempRating);
    setPage(0);
    setShowFilters(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setTempPriceRange("all");
    setTempRating("all");
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSortBy("popular");
    setActiveFilter("all");
    setPage(0);
  };

  // Pagination controls
  const handlePreviousPage = () => {
    if (page > 0) {
      setIsProductListLoading(true);
      setPage(page - 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < (paginatedProducts?.data?.totalPages || 1) - 1) {
      setIsProductListLoading(true);
      setPage(page + 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Bạn đang ở trang cuối cùng!");
    }
  };

  const handlePageChange = (newPage) => {
    setIsProductListLoading(true);
    setPage(newPage);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = paginatedProducts?.data?.totalPages || 1;
  const currentPage = page;
  const totalProducts = paginatedProducts?.data?.totalElements || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span
            className="hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-900">Tìm kiếm sản phẩm</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Tìm kiếm sản phẩm
          </h1>
          <p className="text-gray-600">
            Kết quả tìm kiếm cho "<span className="font-bold text-blue-600">{keyword || "Tất cả"}</span>"
            <span className="font-bold text-blue-600"> ({totalProducts} sản phẩm)</span>
          </p>
        </div>

        {/* Category Pills */}
        {categoryLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => {
                setActiveFilter("all");
                setPage(0);
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
              }`}
            >
              Tất cả
            </button>
            {parentList?.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveFilter(category.id);
                  setPage(0);
                }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                  activeFilter === category.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Filter and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all duration-200 cursor-pointer whitespace-nowrap transform hover:scale-105"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
              {(tempPriceRange !== "all" || tempRating !== "all") && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full animate-pulse">
                  Đã lọc
                </span>
              )}
            </button>
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <i className="fas fa-box text-blue-500"></i>
              <span>
                <span className="font-bold text-blue-600">{totalProducts}</span> sản phẩm
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 hover:border-blue-300"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filter Section */}
        {showFilters && (
          <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-filter text-blue-500"></i>
                  Bộ lọc sản phẩm
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-tag text-blue-500"></i>
                    Khoảng giá
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setTempPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempPriceRange === range.id
                            ? "bg-blue-50 text-blue-600 font-medium border border-blue-200 shadow-sm"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-star text-blue-500"></i>
                    Đánh giá
                  </h3>
                  <div className="space-y-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTempRating(option.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempRating === option.id
                            ? "bg-blue-50 text-blue-600 font-medium border border-blue-200 shadow-sm"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Filters (Placeholder - chưa tích hợp với API) */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-filter text-blue-500"></i>
                    Bộ lọc nhanh
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
                      <i className="fas fa-truck text-blue-400 mr-2"></i>
                      Miễn phí vận chuyển
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
                      <i className="fas fa-percent text-blue-400 mr-2"></i>
                      Đang giảm giá
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
                      <i className="fas fa-fire text-blue-400 mr-2"></i>
                      Bán chạy
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12 product-grid ${
          isPageTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        } transition-all duration-300`}>
          {(isProductListLoading || (loading && page === 0)) ? (
            // Show skeleton loading for products
            [...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12 text-blue-500">
              <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Lỗi khi tải sản phẩm
              </h3>
              <p className="text-gray-500 mb-4">Lỗi: {error}</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Làm mới
              </button>
            </div>
          ) : paginatedProducts?.data?.content?.length > 0 ? (
            paginatedProducts.data.content.map((productData) => (
              <div key={productData.id} className="relative product-card">
                <ProductCard product={productData} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-blue-400 mb-4">
                <i className="fas fa-box text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 mb-4">Hãy thử thay đổi bộ lọc hoặc từ khóa</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !isProductListLoading && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                currentPage === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
              aria-label="Go to previous page"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Trang trước
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
              {(() => {
                const pageRange = 5;
                const startPage = Math.max(0, currentPage - Math.floor(pageRange / 2));
                const endPage = Math.min(totalPages - 1, startPage + pageRange - 1);
                const pages = [];

                const adjustedStartPage = Math.max(0, endPage - pageRange + 1);

                if (adjustedStartPage > 0) {
                  pages.push(
                    <button
                      key={0}
                      onClick={() => handlePageChange(0)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        currentPage === 0
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                      aria-label="Go to page 1"
                    >
                      1
                    </button>
                  );
                }

                if (adjustedStartPage > 1) {
                  pages.push(
                    <span key="start-ellipsis" className="text-gray-600">
                      ...
                    </span>
                  );
                }

                for (let i = adjustedStartPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        currentPage === i
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  );
                }

                if (endPage < totalPages - 2) {
                  pages.push(
                    <span key="end-ellipsis" className="text-gray-600">
                      ...
                    </span>
                  );
                }

                if (endPage < totalPages - 1) {
                  pages.push(
                    <button
                      key={totalPages - 1}
                      onClick={() => handlePageChange(totalPages - 1)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        currentPage === totalPages - 1
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                      aria-label={`Go to page ${totalPages}`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                currentPage >= totalPages - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
              aria-label="Go to next page"
            >
              Trang sau
              <i className="fas fa-chevron-right ml-2"></i>
            </button>

            {/* Go to Page Input */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Đi đến trang:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={page + 1}
                onChange={(e) => {
                  const inputPage = parseInt(e.target.value) - 1;
                  if (!isNaN(inputPage) && inputPage >= 0 && inputPage < totalPages) {
                    handlePageChange(inputPage);
                  }
                }}
                className="w-16 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition-all duration-200"
                aria-label="Enter page number"
              />
              <span className="text-sm text-gray-600">/ {totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;