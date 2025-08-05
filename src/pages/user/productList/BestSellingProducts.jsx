import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadProductsPaginate } from "../../../redux/slices/productSlice";
import ProductCardList from "./ProductCardList";

function BestSellersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const paginatedProducts = useSelector((state) => state.products.paginated);
  const productsLoading = useSelector((state) => state.products.loading);
  const productsError = useSelector((state) => state.products.error);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("best-selling");
  const [page, setPage] = useState(0);

  const brands = [
    { id: "all", name: "Tất cả thương hiệu" },
    { id: "brand-a", name: "Samsung" },
    { id: "brand-b", name: "Apple" },
    { id: "brand-c", name: "Xiaomi" },
    { id: "brand-d", name: "Nike" },
    { id: "brand-e", name: "Adidas" },
  ];

  const categories = [
    { id: "all", name: "Tất cả danh mục" },
    { id: "electronics", name: "Điện tử" },
    { id: "fashion", name: "Thời trang" },
    { id: "beauty", name: "Làm đẹp" },
    { id: "home", name: "Gia dụng" },
    { id: "sports", name: "Thể thao" },
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
    { value: "best-selling", label: "Bán chạy nhất" },
    { value: "revenue", label: "Doanh thu cao nhất" },
    { value: "quantity", label: "Số lượng bán nhiều nhất" },
    { value: "newest", label: "Mới nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
  ];

  useEffect(() => {
    const params = {
      page,
      limit: 12,
      sortBy: mapSortBy(sortBy).sortBy,
      orderBy: mapSortBy(sortBy).orderBy,
      brandName: selectedBrand === "all" ? null : selectedBrand,
categoryId: selectedCategory === "all" ? null : selectedCategory,
      priceMin: getPriceRange().priceMin,
      priceMax: getPriceRange().priceMax,
      minRating: getRatingValue(),
    };

    dispatch(loadProductsPaginate(params));
  }, [
    dispatch,
    page,
    selectedPriceRange,
    selectedRating,
    selectedBrand,
    selectedCategory,
    sortBy,
  ]);

  const mapSortBy = (sortBy) => {
    switch (sortBy) {
      case "best-selling":
        return { sortBy: "totalSold", orderBy: "desc" };
      case "revenue":
        return { sortBy: "totalRevenue", orderBy: "desc" };
      case "quantity":
        return { sortBy: "totalQuantity", orderBy: "desc" };
      case "newest":
        return { sortBy: "createdAt", orderBy: "desc" };
      case "price-low":
        return { sortBy: "price", orderBy: "asc" };
      case "price-high":
        return { sortBy: "price", orderBy: "desc" };
      case "rating":
        return { sortBy: "averageRating", orderBy: "desc" };
      default:
        return { sortBy: "totalSold", orderBy: "desc" };
    }
  };

  const getPriceRange = () => {
    const range =
      priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
    return { priceMin: range.min, priceMax: range.max };
  };

  const getRatingValue = () => {
    const rating =
      ratingOptions.find((r) => r.id === selectedRating)?.value || 0;
    return rating === 0 ? null : rating;
  };

  const handleLoadMore = () => {
    if (page < paginatedProducts?.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handleResetFilters = () => {
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSortBy("best-selling");
    setPage(0);
  };

  const breadcrumbItems = [
    { name: "Trang chủ", slug: "/" },
    { name: "Sản phẩm bán chạy", slug: "/best-sellers" },
  ];

  const productsContent = paginatedProducts?.data?.content || [];
  const totalProducts = paginatedProducts?.data?.totalElements || 0;

  if (productsLoading && page === 0)
    return <div className="text-center py-10">Đang tải...</div>;
  if (productsError)
    return (
      <div className="text-center py-10 text-red-500">Lỗi: {productsError}</div>
    );

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
                    : "hover:text-blue-600 cursor-pointer"
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
          <p className="text-sm text-orange-600 font-medium">
            <i className="fas fa-chart-line mr-2"></i>
            {totalProducts.toLocaleString()} sản phẩm bán chạy
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg">
                <i className="fas fa-trophy text-orange-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Top Seller</p>
                <p className="font-semibold text-gray-900">Tuần này</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <i className="fas fa-trending-up text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Tăng trưởng</p>
                <p className="font-semibold text-gray-900">+15% so với tuần trước</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <i className="fas fa-star text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Đánh giá TB</p>
                <p className="font-semibold text-gray-900">4.7/5 sao</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg">
                <i className="fas fa-users text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Khách hàng</p>
                <p className="font-semibold text-gray-900">10K+ đã mua</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
              {(selectedPriceRange !== "all" || 
                selectedRating !== "all" || 
                selectedBrand !== "all" || 
                selectedCategory !== "all") && (
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                  Đã lọc
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-th-large text-orange-500"></i>
                    Danh mục
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category.id
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-copyright text-orange-500"></i>
                    Thương hiệu
                  </h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedBrand === brand.id
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
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
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange === range.id
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
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
                        onClick={() => setSelectedRating(option.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedRating === option.id
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {productsContent.length > 0 ? (
            productsContent.map((productData, index) => (
              <div key={productData.id} className="relative">
                {/* Best Seller Badge */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <i className="fas fa-crown mr-1"></i>
                      #{index + 1}
                    </div>
                  </div>
                )}
                <ProductCardList
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
            <div className="col-span-full text-center text-gray-500 py-12">
              <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
              <p>Không tìm thấy sản phẩm bán chạy nào.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {productsContent.length > 0 &&
          page < paginatedProducts?.totalPages - 1 && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={productsLoading}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-orange-300 hover:text-orange-600 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {productsLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang tải...
                  </>
                ) : (
                  "Xem thêm sản phẩm"
                )}
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default BestSellersPage;