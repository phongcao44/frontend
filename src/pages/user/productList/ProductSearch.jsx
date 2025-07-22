import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProductsPaginate } from '../../../redux/slices/productSlice'; 
import { useSearchParams } from 'react-router-dom';

function ProductSearch() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const paginatedProducts = useSelector((state) => state.products.paginated);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(0); // Start page from 0

  console.warn(`Searching for: ${keyword}`);

  const priceRanges = [
    { id: 'all', label: 'Tất cả giá', min: 0, max: Infinity },
    { id: 'under-500', label: 'Dưới 500K', min: 0, max: 500000 },
    { id: '500-1000', label: '500K - 1 triệu', min: 500000, max: 1000000 },
    { id: 'above-1000', label: 'Trên 1 triệu', min: 1000000, max: Infinity },
  ];

  const ratingOptions = [
    { id: 'all', label: 'Tất cả đánh giá', value: 0 },
    { id: '4plus', label: '4 sao trở lên', value: 4 },
    { id: '3plus', label: '3 sao trở lên', value: 3 },
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', count: 245 },
    { id: 'fashion', name: 'Thời trang', count: 89 },
    { id: 'electronics', name: 'Điện tử', count: 67 },
    { id: 'beauty', name: 'Làm đẹp', count: 45 },
    { id: 'home', name: 'Nhà cửa', count: 34 },
    { id: 'sports', name: 'Thể thao', count: 28 },
  ];

  const mapSortBy = (sortBy) => {
    switch (sortBy) {
      case 'newest':
        return { sortBy: 'createdAt', orderBy: 'desc' };
      case 'price-low':
        return { sortBy: 'price', orderBy: 'asc' };
      case 'price-high':
        return { sortBy: 'price', orderBy: 'desc' };
      default:
        return { sortBy: 'createdAt', orderBy: 'desc' };
    }
  };

  // Lấy khoảng giá từ selectedPriceRange
  const getPriceRange = () => {
    const range = priceRanges.find((r) => r.id === selectedPriceRange);
    if (range.id === 'all') {
      return { priceMin: null, priceMax: null }; // Use null instead of empty string
    }
    return {
      priceMin: range.min === 0 ? null : range.min,
      priceMax: range.max === Infinity ? null : range.max,
    };
  };

  useEffect(() => {
    const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
    const { priceMin, priceMax } = getPriceRange();
    const minRating = ratingOptions.find((r) => r.id === selectedRating).value;

    const params = {
      page, // Page starts from 0
      limit: 8, // Số sản phẩm mỗi trang
      sortBy: apiSortBy,
      orderBy,
      keyword: keyword || null, // Use null if no keyword
      categoryId: activeFilter === 'all' ? null : activeFilter, // Use null if "all"
      status: null, // Use null instead of empty string
      brandName: null, // Use null instead of empty string
      priceMin, // null if not applicable
      priceMax, // null if not applicable
      minRating: minRating === 0 ? null : minRating, // Use null if 0
    };

    console.warn("Fetching products with params:", params);

    dispatch(loadProductsPaginate(params));
  }, [dispatch, page, activeFilter, selectedPriceRange, selectedRating, sortBy, keyword]);

  // Xử lý chuyển trang
  const handleLoadMore = () => {
    if (page < paginatedProducts?.totalPages - 1) { // Adjust for zero-based paging
      setPage((prev) => prev + 1);
    }
  };

  // Xử lý reset bộ lọc
  const handleResetFilters = () => {
    setSelectedPriceRange('all');
    setSelectedRating('all');
    setSortBy('popular');
    setActiveFilter('all');
    setPage(0); // Reset to page 0
  };

  if (loading && page === 0) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span>Trang chủ</span>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-900">Danh mục sản phẩm</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Khám phá sản phẩm</h1>
          <p className="text-gray-600">Tìm kiếm những sản phẩm yêu thích của bạn</p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveFilter(category.id);
                setPage(0); // Reset to page 0 when changing category
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer !rounded-button ${
                activeFilter === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(0); // Reset to page 0 when changing sort
              }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="popular">Phổ biến</option>
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Advanced Filter Section */}
        {showFilters && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
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
                        onClick={() => {
                          setSelectedPriceRange(range.id);
                          setPage(0); // Reset to page 0
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange === range.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
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
                        onClick={() => {
                          setSelectedRating(option.id);
                          setPage(0); // Reset to page 0
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedRating === option.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
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
                    <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all">
                      <i className="fas fa-truck text-gray-400 mr-2"></i>
                      Miễn phí vận chuyển
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all">
                      <i className="fas fa-percent text-gray-400 mr-2"></i>
                      Đang giảm giá
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all">
                      <i className="fas fa-fire text-gray-400 mr-2"></i>
                      Bán chạy
                    </button>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {paginatedProducts?.data?.content?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
                    <i className="far fa-heart text-gray-400 hover:text-red-500 text-sm"></i>
                  </button>
                </div>
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star text-xs ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.rating})</span>
                  <span className="text-xs text-gray-400">• Đã bán {product.sold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer whitespace-nowrap !rounded-button">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {paginatedProducts?.totalPages > page + 1 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full h
              over:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium cursor-pointer whitespace-nowrap !rounded-button disabled:opacity-50"
            >
              {loading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;