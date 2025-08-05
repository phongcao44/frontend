import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchActiveFlashSale,
  fetchFlashSaleItemsPaginated,
} from "../../../redux/slices/flashSaleSlice";
import { loadParentCategories } from "../../../redux/slices/categorySlice";
import ProductCard from "../home/ProductCard";

function FlashSaleTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    console.log("endTime received:", endTime, typeof endTime);

    const parsedEndTime = new Date(endTime);
    if (isNaN(parsedEndTime.getTime())) {
      console.error("Invalid endTime, using fallback:", endTime);
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = parsedEndTime.getTime();
      const difference = end - now;

      console.log("Timer tick - now:", now, "end:", end, "difference:", difference);

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
            {isNaN(timeLeft.hours) ? "00" : String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="text-xs">Giờ</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="bg-gray-200 bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">
            {isNaN(timeLeft.minutes) ? "00" : String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="text-xs">Phút</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="bg-gray-200 bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">
            {isNaN(timeLeft.seconds) ? "00" : String(timeLeft.seconds).padStart(2, "0")}
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

  // Redux selectors
  const { activeFlashSale, flashSaleItemsPaginated, loading, error } = useSelector(
    (state) => state.flashSale
  );
  const { parentList } = useSelector((state) => state.category);

  // State management for filters and pagination
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState("discount-high");
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [isProductListLoading, setIsProductListLoading] = useState(false);

  // Temporary filter states
  const [tempPriceRange, setTempPriceRange] = useState("all");
  const [tempDiscount, setTempDiscount] = useState("all");
  const [tempBrand, setTempBrand] = useState("all");
  const [tempRating, setTempRating] = useState("all");

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
        return { sortBy: "createdAt", orderBy: "asc" };
    }
  };

  // Load flash sale data with pagination
  useEffect(() => {
    const loadActiveFlashSale = async () => {
      try {
        setIsProductListLoading(true);
        const res = await dispatch(fetchActiveFlashSale()).unwrap();
        if (res?.id) {
          const { sortBy: apiSortBy, orderBy } = getSortParams(sortBy);
          const selectedPrice = priceRanges.find((range) => range.id === selectedPriceRange);
          const selectedDiscountRange = discountRanges.find((range) => range.id === selectedDiscount);
          const selectedRatingOption = ratingOptions.find((option) => option.id === selectedRating);

          const params = {
            categoryId: activeFilter,
            brand: selectedBrand !== "all" ? selectedBrand : null,
            minPrice: selectedPrice?.min || null,
            maxPrice: selectedPrice?.max || null,
            discountRange: selectedDiscountRange?.id !== "all" ? selectedDiscountRange.id : null,
            minRating: selectedRatingOption?.value === 0 ? null : selectedRatingOption?.value,
            page,
            limit,
            sortBy: apiSortBy,
            orderBy,
          };

          await dispatch(fetchFlashSaleItemsPaginated({ flashSaleId: res.id, params })).unwrap();
        }
      } catch (err) {
        console.error("Failed to load flash sale:", err);
      } finally {
        setIsProductListLoading(false);
      }
    };

    loadActiveFlashSale();
  }, [dispatch, activeFilter, selectedBrand, selectedPriceRange, selectedDiscount, selectedRating, sortBy, page, limit]);

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedPriceRange(tempPriceRange);
    setSelectedDiscount(tempDiscount);
    setSelectedBrand(tempBrand);
    setSelectedRating(tempRating);
    setPage(0);
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

  // Filter options
  const brands = [
    { id: "all", name: "Tất cả thương hiệu" },
    { id: "brand-a", name: "Brand A" },
    { id: "brand-b", name: "Brand B" },
    { id: "brand-c", name: "Brand C" },
    { id: "brand-d", name: "Brand D" },
    { id: "brand-e", name: "Brand E" },
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

  // Pagination controls
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (flashSaleItemsPaginated?.hasNext) {
      setPage(page + 1);
    }
  };

  // Prepare products for display
  const productsContent = Array.isArray(flashSaleItemsPaginated?.content)
    ? flashSaleItemsPaginated.content
    : [];
  const totalProducts = flashSaleItemsPaginated?.totalElements || 0;
  const totalPages = flashSaleItemsPaginated?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => {
              setActiveFilter(null);
              setPage(0);
            }}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer !rounded-button ${
              activeFilter === null
                ? "bg-red-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600"
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
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer !rounded-button ${
                activeFilter === category.id
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
            </button>
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <i className="fas fa-fire text-red-500"></i>
              <span>
                <span className="font-bold text-red-600">{totalProducts}</span>{" "}
                sản phẩm Flash Sale
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
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-filter text-red-500"></i>
                  Bộ lọc sản phẩm
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-red-600 transition-colors"
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
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          setTempBrand(brand.id);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          tempBrand === brand.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
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
                        onClick={() => {
                          setTempPriceRange(range.id);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          tempPriceRange === range.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200"
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
                        onClick={() => {
                          setTempDiscount(discount.id);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          tempDiscount === discount.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200"
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
                        onClick={() => {
                          setTempRating(option.id);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          tempRating === option.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200"
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
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {isProductListLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-8 w-8 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600 mt-4">Đang tải sản phẩm...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="text-red-400 mb-4">
                <i className="fas fa-exclamation-circle text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Lỗi khi tải sản phẩm
              </h3>
              <p className="text-gray-500 mb-4">Lỗi: {error}</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Làm mới
              </button>
            </div>
          ) : productsContent.length > 0 ? (
            productsContent.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={item} />
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Làm mới
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !isProductListLoading && (
          <div className="flex justify-center items-center space-x-4 mb-12">
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!flashSaleItemsPaginated?.hasNext}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !flashSaleItemsPaginated?.hasNext
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              Trang sau
            </button>
          </div>
        )}

        {/* Flash Sale Benefits */}
        <div className="mt-12 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">
              Ưu đãi đặc biệt Flash Sale
            </h3>
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