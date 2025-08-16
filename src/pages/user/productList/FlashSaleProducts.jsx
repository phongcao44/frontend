import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchActiveFlashSale,
  fetchFlashSaleItemsPaginated,
} from "../../../redux/slices/flashSaleSlice";
import { loadParentCategories } from "../../../redux/slices/categorySlice";
import { loadBrandsPaginate } from "../../../redux/slices/productSlice";
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
          <div className="absolute top-2 left-2 bg-gray-200 rounded text-xs font-bold px-2 py-1 animate-pulse w-12 h-6"></div>
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

function FlashSaleTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const parsedEndTime = new Date(endTime);
    if (isNaN(parsedEndTime.getTime())) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = parsedEndTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center justify-center space-x-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-lg mb-6">
      <div className="flex items-center space-x-2">
        <i className="fas fa-fire text-yellow-300 text-xl animate-pulse"></i>
        <span className="font-bold text-lg">FLASH SALE KẾT THÚC TRONG:</span>
      </div>
      <div className="flex space-x-2">
        <div className="bg-gray-200 bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="text-xs">Giờ</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="bg-gray-200 bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="text-xs">Phút</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="bg-gray-200 bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <div className="text-xs">Giây</div>
        </div>
      </div>
    </div>
  );
}

function FlashSaleProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  // Redux selectors
  const { activeFlashSale, flashSaleItemsPaginated, loading, error } = useSelector(
    (state) => state.flashSale
  );
  const { parentList, loading: categoryLoading } = useSelector((state) => state.category);
  const { brandsPaginated, loading: brandsLoading, error: brandsError } = useSelector(
    (state) => state.products
  );

  // State management for filters, pagination, and transitions
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(query.get("priceRange") || "all");
  const [selectedDiscount, setSelectedDiscount] = useState(query.get("discount") || "all");
  const [selectedBrand, setSelectedBrand] = useState(query.get("brand") || "all");
  const [selectedRating, setSelectedRating] = useState(query.get("rating") || "all");
  const [activeFilter, setActiveFilter] = useState(query.get("categoryId") || null);
  const [sortBy, setSortBy] = useState(query.get("sortBy") || "discount-high");
  const [page, setPage] = useState(parseInt(query.get("page")) || 0);
  const [limit] = useState(10);
  const [tempPriceRange, setTempPriceRange] = useState(query.get("priceRange") || "all");
  const [tempDiscount, setTempDiscount] = useState(query.get("discount") || "all");
  const [tempBrand, setTempBrand] = useState(query.get("brand") || "all");
  const [tempRating, setTempRating] = useState(query.get("rating") || "all");
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
    { id: "under-100", label: "Dưới 100K", min: 0, max: 100000 },
    { id: "100-500", label: "100K - 500K", min: 100000, max: 500000 },
    { id: "500-1000", label: "500K - 1 triệu", min: 500000, max: 1000000 },
    { id: "1000-3000", label: "1 - 3 triệu", min: 1000000, max: 3000000 },
    { id: "above-3000", label: "Trên 3 triệu", min: 3000000, max: null },
  ];

  const discountRanges = [
    { id: "all", label: "Tất cả giảm giá", min: null, max: null },
    { id: "0-10", label: "0% - 10%", min: 0, max: 10 },
    { id: "10-25", label: "10% - 25%", min: 10, max: 25 },
    { id: "25-40", label: "25% - 40%", min: 25, max: 40 },
    { id: "40-60", label: "40% - 60%", min: 40, max: 60 },
    { id: "60+", label: "Trên 60%", min: 60, max: null },
  ];

  const ratingOptions = [
    { id: "all", label: "Tất cả đánh giá", value: 0 },
    { id: "4plus", label: "4 sao trở lên", value: 4 },
    { id: "3plus", label: "3 sao trở lên", value: 3 },
    { id: "2plus", label: "2 sao trở lên", value: 2 },
  ];

  const sortOptions = [
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "newest", label: "Mới nhất" },
    { value: "discount-high", label: "Giảm giá cao nhất" },
  ];

  // Cập nhật URL khi trạng thái thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedPriceRange !== "all") params.set("priceRange", selectedPriceRange);
    if (selectedDiscount !== "all") params.set("discount", selectedDiscount);
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (selectedRating !== "all") params.set("rating", selectedRating);
    if (activeFilter) params.set("categoryId", activeFilter);
    if (sortBy !== "discount-high") params.set("sortBy", sortBy);
    if (page !== 0) params.set("page", page);

    navigate(`?${params.toString()}`, { replace: true });
  }, [
    selectedPriceRange,
    selectedDiscount,
    selectedBrand,
    selectedRating,
    activeFilter,
    sortBy,
    page,
    navigate,
  ]);

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
        categoryId: activeFilter || null,
      })
    );
  }, [dispatch, activeFilter]);

  // Flash sale end time
  const flashSaleEndTime = activeFlashSale?.endTime
    ? new Date(activeFlashSale.endTime)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Map sortBy to API parameters
  const getSortParams = (sortValue) => {
    switch (sortValue) {
      case "price-low":
        return { sortBy: "price", orderBy: "asc" };
      case "price-high":
        return { sortBy: "price", orderBy: "desc" };
      case "newest":
        return { sortBy: "createdAt", orderBy: "desc" };
      default:
        return { sortBy: "discountedPrice", orderBy: "desc" };
    }
  };

  // Load flash sale data with pagination
  useEffect(() => {
    const loadActiveFlashSale = async () => {
      try {
        setIsProductListLoading(true);
        setIsPageTransitioning(true);

        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));

        const res = await dispatch(fetchActiveFlashSale()).unwrap();
        if (res?.id) {
          const { sortBy: apiSortBy, orderBy } = getSortParams(sortBy);
          const selectedPrice = priceRanges.find(
            (range) => range.id === selectedPriceRange
          );
          const selectedDiscountRange = discountRanges.find(
            (range) => range.id === selectedDiscount
          );
          const selectedRatingOption = ratingOptions.find(
            (option) => option.id === selectedRating
          );

          const params = {
            categoryId: activeFilter,
            brand: selectedBrand !== "all" ? selectedBrand : null,
            minPrice: selectedPrice?.min || null,
            maxPrice: selectedPrice?.max || null,
            discountRange:
              selectedDiscountRange?.id !== "all" ? selectedDiscountRange.id : null,
            minRating: selectedRatingOption?.value === 0 ? null : selectedRatingOption?.value,
            page,
            limit,
            sortBy: apiSortBy,
            orderBy,
          };

          await dispatch(
            fetchFlashSaleItemsPaginated({ flashSaleId: res.id, params })
          ).unwrap();
        }
      } catch (err) {
        console.error("Failed to load flash sale:", err);
      } finally {
        setIsProductListLoading(false);
        // Add a small delay before hiding transition effect
        setTimeout(() => setIsPageTransitioning(false), 200);
      }
    };

    loadActiveFlashSale();
  }, [
    dispatch,
    activeFilter,
    selectedBrand,
    selectedPriceRange,
    selectedDiscount,
    selectedRating,
    sortBy,
    page,
    limit,
  ]);

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedPriceRange(tempPriceRange);
    setSelectedDiscount(tempDiscount);
    setSelectedBrand(tempBrand);
    setSelectedRating(tempRating);
    setPage(0);
    setShowFilters(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setTempPriceRange("all");
    setTempDiscount("all");
    setTempBrand("all");
    setTempRating("all");
    setSelectedPriceRange("all");
    setSelectedDiscount("all");
    setSelectedBrand("all");
    setSelectedRating("all");
    setActiveFilter(null);
    setSortBy("discount-high");
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
    if (!flashSaleItemsPaginated?.last) {
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

  // Prepare products for display
  const productsContent = Array.isArray(flashSaleItemsPaginated?.content)
    ? flashSaleItemsPaginated.content
    : [];
  const totalProducts = flashSaleItemsPaginated?.totalElements || 0;
  const totalPages = flashSaleItemsPaginated?.totalPages || 1;
  const currentPage = flashSaleItemsPaginated?.number || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span
            className="hover:text-red-600 cursor-pointer transition-colors"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-900">Flash Sale</span>
        </nav>

        {/* Flash Sale Timer */}
        <FlashSaleTimer endTime={flashSaleEndTime} />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold text-lg flex items-center space-x-2">
              <i className="fas fa-bolt text-yellow-300"></i>
              <span>FLASH SALE</span>
              <i className="fas fa-fire text-yellow-300 animate-pulse"></i>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Siêu Sale - Giá Sốc Chỉ Hôm Nay!
          </h1>
          <p className="text-gray-600 mb-4">
            Cơ hội vàng để sở hữu những sản phẩm yêu thích với giá cực ưu đãi
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-red-600">
              <i className="fas fa-percentage"></i>
              <span>Giảm đến 80%</span>
            </div>
            <div className="flex items-center space-x-2 text-red-600">
              <i className="fas fa-shipping-fast"></i>
              <span>Miễn phí vận chuyển</span>
            </div>
            <div className="flex items-center space-x-2 text-red-600">
              <i className="fas fa-clock"></i>
              <span>Có giới hạn thời gian</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        {categoryLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => {
                setActiveFilter(null);
                setPage(0);
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                activeFilter === null
                  ? "bg-red-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600 hover:shadow-md"
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
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600 hover:shadow-md"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-red-300 hover:text-red-600 transition-all duration-200 cursor-pointer whitespace-nowrap transform hover:scale-105"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
              {(tempPriceRange !== "all" ||
                tempDiscount !== "all" ||
                tempBrand !== "all" ||
                tempRating !== "all") && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full animate-pulse">
                  Đã lọc
                </span>
              )}
            </button>
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <i className="fas fa-fire text-red-500"></i>
              <span>
                <span className="font-bold text-red-600">{totalProducts}</span> sản phẩm Flash Sale
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
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-all duration-200 hover:border-red-300"
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-filter text-red-500"></i>
                  Bộ lọc sản phẩm
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200 transform hover:scale-110"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Brand Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-copyright text-red-500"></i>
                    Thương hiệu
                  </h3>
                  {brandsLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                    </div>
                  ) : brandsError ? (
                    <div className="text-red-500 text-sm py-2">
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
                              ? "bg-red-50 text-red-600 font-medium border border-red-200 shadow-sm"
                              : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-tag text-red-500"></i>
                    Khoảng giá
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setTempPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempPriceRange === range.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200 shadow-sm"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-percentage text-red-500"></i>
                    Mức giảm giá
                  </h3>
                  <div className="space-y-2">
                    {discountRanges.map((discount) => (
                      <button
                        key={discount.id}
                        onClick={() => setTempDiscount(discount.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempDiscount === discount.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200 shadow-sm"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        {discount.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-star text-red-500"></i>
                    Đánh giá
                  </h3>
                  <div className="space-y-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTempRating(option.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 ${
                          tempRating === option.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200 shadow-sm"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
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
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-red-300 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer transform hover:scale-105 shadow-md hover:shadow-lg"
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
            [...Array(10)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">
              <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Lỗi khi tải sản phẩm
              </h3>
              <p className="text-gray-500 mb-4">Lỗi: {error}</p>
              <button
                onClick={() => {
                  handleResetFilters();
                  dispatch(fetchActiveFlashSale());
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
              >
                Thử lại
              </button>
            </div>
          ) : productsContent.length > 0 ? (
            productsContent.map((item, index) => (
              <div key={item.id} className="relative product-card product-fade-in">
                {/* Flash Sale Badge */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <i className="fas fa-bolt mr-1"></i>
                      #{index + 1}
                    </div>
                  </div>
                )}
                <ProductCard
                  product={{
                    ...item,
                    price: item.lowestPrice,
                    discount: item.discountedPrice,
                    originalPrice: item.originalPrice,
                    flashSale: true,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-red-400 mb-4">
                <i className="fas fa-fire text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm Flash Sale
              </h3>
              <p className="text-gray-500 mb-4">Hãy thử quay lại sau</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
              >
                Làm mới
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
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                currentPage === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
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
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
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
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
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
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
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
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                currentPage >= totalPages - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
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
                className="w-16 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center transition-all duration-200"
                aria-label="Enter page number"
              />
              <span className="text-sm text-gray-600">/ {totalPages}</span>
            </div>
          </div>
        )}

        {/* Flash Sale Benefits */}
        <div className="mt-12 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Ưu đãi đặc biệt Flash Sale</h3>
            <p className="text-red-100">Chỉ có trong thời gian giới hạn!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-shipping-fast text-2xl text-yellow-300"></i>
              </div>
              <h4 className="font-bold mb-1">Miễn phí vận chuyển</h4>
              <p className="text-sm text-red-100">Cho đơn hàng từ 99K</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-undo text-2xl text-yellow-300"></i>
              </div>
              <h4 className="font-bold mb-1">Đổi trả miễn phí</h4>
              <p className="text-sm text-red-100">Trong vòng 7 ngày</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-gift text-2xl text-yellow-300"></i>
              </div>
              <h4 className="font-bold mb-1">Quà tặng hấp dẫn</h4>
              <p className="text-sm text-red-100">Cho đơn hàng từ 500K</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashSaleProducts;