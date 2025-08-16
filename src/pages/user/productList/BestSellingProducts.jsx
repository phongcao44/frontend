import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loadTopSellingProductsPaginate, loadBrandsPaginate } from "../../../redux/slices/productSlice";
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

function BestSellingProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  // Redux selectors
  const paginatedProducts = useSelector((state) => state.products.topSellingPaginated);
  const productsLoading = useSelector((state) => state.products.loading);
  const productsError = useSelector((state) => state.products.error);
  const { parentList, loading: categoryLoading } = useSelector((state) => state.category);
  const { brandsPaginated, loading: brandsLoading, error: brandsError } = useSelector(
    (state) => state.products
  );

  // State management for filters, pagination, and transitions
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(query.get("priceRange") || "all");
  const [selectedRating, setSelectedRating] = useState(query.get("rating") || "all");
  const [selectedBrand, setSelectedBrand] = useState(query.get("brand") || "all");
  const [activeFilter, setActiveFilter] = useState(query.get("categoryId") || "all");
  const [sortBy, setSortBy] = useState(query.get("sortBy") || "soldQuantity");
  const [page, setPage] = useState(parseInt(query.get("page") || 0));
  const [limit] = useState(12);
  const [tempPriceRange, setTempPriceRange] = useState(query.get("priceRange") || "all");
  const [tempRating, setTempRating] = useState(query.get("rating") || "all");
  const [tempBrand, setTempBrand] = useState(query.get("brand") || "all");
  const [tempCategory, setTempCategory] = useState(query.get("categoryId") || "all");
  const [isProductListLoading, setIsProductListLoading] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Filter options
  const brands = [
    { id: "all", name: "Tất cả thương hiệu" },
    ...(brandsPaginated?.data?.content || []).map((brandName) => ({
      id: brandName,
      name: brandName,
    })),
  ];

  const priceRanges = [
    { id: "all", label: "Tất cả giá", min: null, max: null },
    { id: "under-500", label: "Dưới 500K", min: 0, max: 500000 },
    { id: "500-1000", label: "500K - 1 triệu", min: 500000, max: 1000000 },
    { id: "1000-2000", label: "1 - 2 triệu", min: 1000000, max: 2000000 },
    { id: "above-2000", label: "Trên 2 triệu", min: 2000000, max: null },
  ];

  const ratingOptions = [
    { id: "all", label: "Tất cả đánh giá", value: 0 },
    { id: "5star", label: "5 sao", value: 5 },
    { id: "4plus", label: "4 sao trở lên", value: 4 },
    { id: "3plus", label: "3 sao trở lên", value: 3 },
  ];

  const sortOptions = [
    { value: "soldQuantity", label: "Bán chạy nhất" },
    { value: "createdAt", label: "Mới nhất" },
    { value: "price-asc", label: "Giá thấp đến cao" },
    { value: "price-desc", label: "Giá cao đến thấp" },
    { value: "averageRating", label: "Đánh giá cao nhất" },
  ];

  // Cập nhật URL khi trạng thái thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedPriceRange !== "all") params.set("priceRange", selectedPriceRange);
    if (selectedRating !== "all") params.set("rating", selectedRating);
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (activeFilter !== "all") params.set("categoryId", activeFilter);
    if (sortBy !== "soldQuantity") params.set("sortBy", sortBy);
    if (page !== 0) params.set("page", page);

    navigate(`?${params.toString()}`, { replace: true });
  }, [selectedPriceRange, selectedRating, selectedBrand, activeFilter, sortBy, page, navigate]);

  // Fetch parent categories
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

  // Fetch brands based on active category filter
  useEffect(() => {
    dispatch(
      loadBrandsPaginate({
        page: 0,
        limit: 10,
        sortBy: "brand",
        orderBy: "asc",
        categoryId: activeFilter !== "all" ? activeFilter : null,
      })
    );
  }, [dispatch, activeFilter]);

  // Fetch top-selling products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsProductListLoading(true);
        setIsPageTransitioning(true);

        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));

        const selectedPrice = priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
        const selectedRatingOption = ratingOptions.find((r) => r.id === selectedRating) || ratingOptions[0];

        const params = {
          page,
          limit,
          sortBy: mapSortBy(sortBy).sortBy,
          orderBy: mapSortBy(sortBy).orderBy,
          brandName: selectedBrand === "all" ? null : selectedBrand,
          categoryId: activeFilter === "all" ? null : activeFilter,
          priceMin: selectedPrice.min,
          priceMax: selectedPrice.max,
          minRating: selectedRatingOption.value === 0 ? null : selectedRatingOption.value,
        };

        await dispatch(loadTopSellingProductsPaginate(params)).unwrap();
      } catch (err) {
        console.error("Failed to load top-selling products:", err);
      } finally {
        setIsProductListLoading(false);
        // Add a small delay before hiding transition effect
        setTimeout(() => setIsPageTransitioning(false), 200);
      }
    };

    loadProducts();
  }, [dispatch, page, selectedPriceRange, selectedRating, selectedBrand, activeFilter, sortBy, limit]);

  const mapSortBy = (sortBy) => {
    switch (sortBy) {
      case "soldQuantity":
        return { sortBy: "soldQuantity", orderBy: "desc" };
      case "createdAt":
        return { sortBy: "createdAt", orderBy: "desc" };
      case "price-asc":
        return { sortBy: "price", orderBy: "asc" };
      case "price-desc":
        return { sortBy: "price", orderBy: "desc" };
      case "averageRating":
        return { sortBy: "averageRating", orderBy: "desc" };
      default:
        return { sortBy: "soldQuantity", orderBy: "desc" };
    }
  };

  const handleApplyFilters = () => {
    setSelectedPriceRange(tempPriceRange);
    setSelectedRating(tempRating);
    setSelectedBrand(tempBrand);
    setActiveFilter(tempCategory);
    setPage(0);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setTempPriceRange("all");
    setTempRating("all");
    setTempBrand("all");
    setTempCategory("all");
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSelectedBrand("all");
    setActiveFilter("all");
    setSortBy("soldQuantity");
    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setIsProductListLoading(true);
      setPage(page - 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (!paginatedProducts?.last) {
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

  const breadcrumbItems = [
    { name: "Trang chủ", slug: "/" },
    { name: "Sản phẩm bán chạy", slug: "/best-sellers" },
  ];

  const productsContent = Array.isArray(paginatedProducts?.content) ? paginatedProducts.content : [];
  const totalProducts = paginatedProducts?.totalElements || 0;
  const totalPages = paginatedProducts?.totalPages || 1;
  const currentPage = paginatedProducts?.number || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.slug}>
              {index > 0 && <i className="fas fa-chevron-right text-xs"></i>}
              <span
                className={
                  index === breadcrumbItems.length - 1
                    ? "text-gray-900"
                    : "hover:text-orange-600 cursor-pointer transition-colors"
                }
                onClick={() => navigate(item.slug)}
              >
                {item.name}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-full">
              <i className="fas fa-fire text-white text-2xl"></i>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Sản Phẩm Bán Chạy
          </h1>
          <p className="text-gray-600 mb-2">
            Khám phá những sản phẩm được yêu thích nhất
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
                setTempCategory("all");
                setPage(0);
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                activeFilter === "all"
                  ? "bg-orange-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
              }`}
            >
              Tất cả
            </button>
            {parentList?.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveFilter(category.id);
                  setTempCategory(category.id);
                  setPage(0);
                }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                  activeFilter === category.id
                    ? "bg-orange-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Filter and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all duration-200 cursor-pointer whitespace-nowrap transform hover:scale-105"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
              {(tempPriceRange !== "all" ||
                tempRating !== "all" ||
                tempBrand !== "all" ||
                tempCategory !== "all") && (
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full animate-pulse">
                  Đã lọc
                </span>
              )}
            </button>
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <i className="fas fa-fire text-orange-500"></i>
              <span>
                <span className="font-bold text-orange-600">{totalProducts}</span>{" "}
                sản phẩm bán chạy
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-all duration-200 hover:border-orange-300"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-filter text-orange-500"></i>
                  Bộ lọc sản phẩm
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 transform hover:scale-110"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-th-large text-orange-500"></i>
                    Danh mục
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    <button
                      onClick={() => setTempCategory("all")}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                        tempCategory === "all"
                          ? "bg-orange-50 text-orange-600 font-medium border border-orange-200 shadow-sm"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      Tất cả danh mục
                    </button>
                    {parentList?.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setTempCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempCategory === category.id
                            ? "bg-orange-50 text-orange-600 font-medium border border-orange-200 shadow-sm"
                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap- two">
                    <i className="fas fa-copyright text-orange-500"></i>
                    Thương hiệu
                  </h3>
                  {brandsLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    </div>
                  ) : brandsError ? (
                    <div className="text-orange-500 text-sm py-2">
                      Lỗi khi tải danh sách thương hiệu: {brandsError}
                    </div>
                  ) : brands.length === 1 ? (
                    <div className="text-gray-500 text-sm py-2">
                      Không có thương hiệu nào trong danh mục này
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => setTempBrand(brand.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                            tempBrand === brand.id
                              ? "bg-orange-50 text-orange-600 font-medium border border-orange-200 shadow-sm"
                              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-tag text-orange-500"></i>
                    Khoảng giá
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setTempPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempPriceRange === range.id
                            ? "bg-orange-50 text-orange-600 font-medium border border-orange-200 shadow-sm"
                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
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
                    <i className="fas fa-star text-orange-500"></i>
                    Đánh giá
                  </h3>
                  <div className="space-y-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTempRating(option.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempRating === option.id
                            ? "bg-orange-50 text-orange-600 font-medium border border-orange-200 shadow-sm"
                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleResetFilters}
                  className="px_az-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-orange-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid with Loading States */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12 product-grid ${
          isPageTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        } transition-all duration-300`}>
          {isProductListLoading ? (
            // Show skeleton loading for products
            [...Array(12)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : productsError ? (
            <div className="col-span-full text-center py-12 text-orange-500">
              <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
              <p>Lỗi: {productsError}</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105"
              >
                Làm mới
              </button>
            </div>
          ) : productsContent.length > 0 ? (
            productsContent.map((productData, index) => (
              <div key={productData.id} className="relative product-card product-fade-in">
                {/* Best Seller Badge */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <i className="fas fa-crown mr-1"></i>
                      #{index + 1}
                    </div>
                  </div>
                )}
                <ProductCard
                  product={{
                    ...productData,
                    discountType:
                      productData.discountType === "AMOUNT"
                        ? "FIXED_AMOUNT"
                        : productData.discountType,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-orange-400 mb-4">
                <i className="fas fa-fire text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm bán chạy
              </h3>
              <p className="text-gray-500 mb-4">Hãy thử thay đổi bộ lọc</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105"
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
                  : "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg"
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
                          ? "bg-orange-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
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
                          ? "bg-orange-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
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
                          ? "bg-orange-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
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
                  : "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg"
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
                className="w-16 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center transition-all duration-200"
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

export default BestSellingProducts;