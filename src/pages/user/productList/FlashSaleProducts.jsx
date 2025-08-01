import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadProductsPaginate } from "../../../redux/slices/productSlice";
import { loadFlatCategoryList } from "../../../redux/slices/categorySlice";
import ProductCardList from "./ProductCardList";

function FlashSaleTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
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
        <div className="bg-white bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs">Giờ</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="bg-white bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs">Phút</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="bg-white bg-opacity-20 px-3 py-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-xl">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs">Giây</div>
        </div>
      </div>
    </div>
  );
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const validCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <i className="fas fa-list text-red-500"></i>
          Danh mục Flash Sale
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-2 text-sm rounded-lg transition-all ${
              selectedCategory === null
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            Tất cả
          </button>
          {validCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-3 py-2 text-sm rounded-lg transition-all text-left ${
                selectedCategory === category.id
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlashSaleProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux selectors
  const paginatedProducts = useSelector((state) => state.products.paginated);
  const productsLoading = useSelector((state) => state.products.loading);
  const productsError = useSelector((state) => state.products.error);
  const flatCategoryList = useSelector(
    (state) => state.category.flatCategoryList || []
  );
  const categoryLoading = useSelector((state) => state.category.loading);

  // State management
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("discount-high");
  const [page, setPage] = useState(0);

  // Flash sale end time (example: 24 hours from now)
  const flashSaleEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
    { id: "10-30", label: "10% - 30%", min: 10, max: 30 },
    { id: "30-50", label: "30% - 50%", min: 30, max: 50 },
    { id: "50-70", label: "50% - 70%", min: 50, max: 70 },
    { id: "above-70", label: "Trên 70%", min: 70, max: null },
  ];

  // Load categories on component mount
  useEffect(() => {
    dispatch(loadFlatCategoryList());
  }, [dispatch]);

  // Helper functions
  const mapSortBy = (sortBy) => {
    switch (sortBy) {
      case "discount-high":
        return { sortBy: "discountValue", orderBy: "desc" };
      case "discount-low":
        return { sortBy: "discountValue", orderBy: "asc" };
      case "price-low":
        return { sortBy: "price", orderBy: "asc" };
      case "price-high":
        return { sortBy: "price", orderBy: "desc" };
      case "newest":
        return { sortBy: "createdAt", orderBy: "desc" };
      case "popular":
        return { sortBy: "soldCount", orderBy: "desc" };
      default:
        return { sortBy: "discountValue", orderBy: "desc" };
    }
  };

  const getPriceRange = () => {
    const range =
      priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
    return { priceMin: range.min, priceMax: range.max };
  };

  // Load flash sale products effect
  useEffect(() => {
    const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
    const { priceMin, priceMax } = getPriceRange();

    const params = {
      page,
      limit: 12,
      sortBy: apiSortBy,
      orderBy,
      categoryId: selectedCategory,
      status: "ACTIVE",
      brandName: selectedBrand === "all" ? null : selectedBrand,
      priceMin: priceMin || null,
      priceMax: priceMax || null,
      isFlashSale: true, // Only get flash sale products
      hasDiscount: true, // Only products with discount
    };

    dispatch(loadProductsPaginate(params));
  }, [
    dispatch,
    page,
    selectedCategory,
    selectedPriceRange,
    selectedDiscount,
    selectedBrand,
    sortBy,
  ]);

  // Event handlers
  const handleLoadMore = () => {
    if (page < paginatedProducts?.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handleResetFilters = () => {
    setSelectedPriceRange("all");
    setSelectedDiscount("all");
    setSelectedBrand("all");
    setSelectedCategory(null);
    setSortBy("discount-high");
    setPage(0);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(0);
  };

  // Get main categories (level 1) for filter
  const mainCategories = flatCategoryList.filter((cat) => cat.level === 1);
  const productsContent = paginatedProducts?.data?.content || [];
  const totalProducts = paginatedProducts?.data?.totalElements || 0;

  if (productsLoading && page === 0)
    return <div className="text-center py-10">Đang tải Flash Sale...</div>;
  
  if (productsError)
    return (
      <div className="text-center py-10 text-red-500">
        Lỗi: {productsError}
      </div>
    );

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

        {/* Category Filter */}
        <CategoryFilter
          categories={mainCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

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
              <span><span className="font-bold text-red-600">{totalProducts}</span> sản phẩm Flash Sale</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="discount-high">Giảm giá cao nhất</option>
              <option value="discount-low">Giảm giá thấp nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="newest">Mới nhất</option>
              <option value="popular">Bán chạy nhất</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedBrand === brand.id
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
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange === range.id
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
                        onClick={() => setSelectedDiscount(discount.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedDiscount === discount.id
                            ? "bg-red-50 text-red-600 font-medium border border-red-200"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        {discount.label}
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
                  onClick={() => setShowFilters(false)}
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
          {productsContent.length > 0 ? (
            productsContent.map((productData) => (
              <div key={productData.id} className="relative">
                {/* Flash Sale Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <i className="fas fa-bolt text-yellow-300"></i>
                    <span>FLASH SALE</span>
                  </div>
                </div>
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
            <div className="col-span-full text-center py-12">
              <div className="text-red-400 mb-4">
                <i className="fas fa-fire text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy sản phẩm Flash Sale
              </h3>
              <p className="text-gray-500 mb-4">
                Hãy thử thay đổi bộ lọc hoặc quay lại sau
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
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
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {productsLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <i className="fas fa-fire mr-2"></i>
                    Xem thêm Flash Sale
                  </>
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-500">
                Hiển thị {productsContent.length} / {totalProducts} sản phẩm Flash Sale
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