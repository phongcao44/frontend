import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Heart, Trash2, Star, Eye, Package, Search, Filter } from "lucide-react";
import { getUserWishlist, removeProductFromWishlist } from "../../redux/slices/wishlistSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";
import Swal from 'sweetalert2';


const WishList = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    discount: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (wishlistIdOrItem) => {
    try {
      // Nếu truyền vào là object, log ra để kiểm tra
      if (typeof wishlistIdOrItem === 'object') {
        console.log('Item khi xóa khỏi wishlist:', wishlistIdOrItem);
      } else {
        console.log('Xóa wishlistId:', wishlistIdOrItem);
      }
      await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Sửa lại: lấy wishListId đúng trường
            const wishListId = typeof wishlistIdOrItem === 'object' ? wishlistIdOrItem.wishListId : wishlistIdOrItem;
            await dispatch(removeProductFromWishlist(wishListId)).unwrap();
            Swal.fire(
              'Đã xóa!',
              'Sản phẩm đã được xóa khỏi danh sách yêu thích.',
              'success'
            );
          } catch (err) {
            console.error('Error removing from wishlist:', err);
            Swal.fire(
              'Lỗi!',
              err?.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích.',
              'error'
            );
          }
        }
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      Swal.fire(
        'Lỗi!',
        err?.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích.',
        'error'
      );
    }
  };

  const handleAddToCart = async (item) => {
    try {
      console.log('Item khi thêm vào giỏ hàng:', item); // Log kiểm tra
      const variantId = item.variants?.[0]?.id;
      console.log('variantId lấy được:', variantId); // Log kiểm tra id lấy ra
      if (!variantId) {
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không tìm thấy biến thể sản phẩm để thêm vào giỏ hàng',
          icon: 'error'
        });
        return;
      }
      await dispatch(addItemToCart({
        variantId,
        quantity: 1
      })).unwrap();
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã thêm sản phẩm vào giỏ hàng',
        icon: 'success',
        timer: 1500
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      Swal.fire({
        title: 'Lỗi!',
        text: err?.message || 'Không thể thêm sản phẩm vào giỏ hàng',
        icon: 'error'
      });
    }
  };

  // Filter functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: 'all',
      rating: 'all',
      discount: 'all',
      searchTerm: ''
    });
  };

  // Get product price for filtering
  const getProductPrice = (item) => {
    if (item.variants && item.variants.length > 0) {
      return item.variants[0].discountType 
        ? item.variants[0].finalPriceAfterDiscount 
        : item.variants[0].priceOverride;
    }
    return item.price || 0;
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return wishlistItems.filter(item => {
      // Search filter
      if (filters.searchTerm && !item.productName?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      const price = getProductPrice(item);
      const rating = item.averageRating || 0;
      const hasDiscount = item.variants?.[0]?.discountType;

      // Price range filter
      if (filters.priceRange !== 'all') {
        switch (filters.priceRange) {
          case 'under100k':
            if (price >= 100000) return false;
            break;
          case '100k-500k':
            if (price < 100000 || price >= 500000) return false;
            break;
          case '500k-1m':
            if (price < 500000 || price >= 1000000) return false;
            break;
          case 'over1m':
            if (price < 1000000) return false;
            break;
        }
      }

      // Rating filter
      if (filters.rating !== 'all') {
        const minRating = parseInt(filters.rating);
        if (rating < minRating) return false;
      }

      // Discount filter
      if (filters.discount !== 'all') {
        if (filters.discount === 'discounted' && !hasDiscount) return false;
        if (filters.discount === 'notDiscounted' && hasDiscount) return false;
      }

      return true;
    });
  }, [wishlistItems, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải danh sách yêu thích...</h3>
          <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => dispatch(getUserWishlist())}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
        >
            <Eye className="w-4 h-4" />
          Thử lại
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Sản phẩm yêu thích
              </h1>
              <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm bạn yêu thích</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{wishlistItems.length}</h3>
                  <p className="text-gray-600">Sản phẩm yêu thích</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    showFilters 
                      ? 'bg-pink-100 text-pink-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">Tất cả giá</option>
                  <option value="under100k">Dưới 100.000₫</option>
                  <option value="100k-500k">100.000₫ - 500.000₫</option>
                  <option value="500k-1m">500.000₫ - 1.000.000₫</option>
                  <option value="over1m">Trên 1.000.000₫</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">Tất cả đánh giá</option>
                  <option value="4">4 sao trở lên</option>
                  <option value="3">3 sao trở lên</option>
                  <option value="2">2 sao trở lên</option>
                </select>
              </div>

              {/* Discount Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá</label>
                <select
                  value={filters.discount}
                  onChange={(e) => handleFilterChange('discount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">Tất cả sản phẩm</option>
                  <option value="discounted">Có giảm giá</option>
                  <option value="notDiscounted">Không giảm giá</option>
                </select>
              </div>

              {/* Active Filters Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bộ lọc đang áp dụng</label>
                <div className="text-sm text-gray-600">
                  {filters.priceRange !== 'all' && (
                    <div className="mb-1">
                      Giá: {filters.priceRange === 'under100k' ? 'Dưới 100k' : 
                           filters.priceRange === '100k-500k' ? '100k-500k' :
                           filters.priceRange === '500k-1m' ? '500k-1m' : 'Trên 1m'}
                    </div>
                  )}
                  {filters.rating !== 'all' && (
                    <div className="mb-1">Đánh giá: {filters.rating}+ sao</div>
                  )}
                  {filters.discount !== 'all' && (
                    <div className="mb-1">
                      Giảm giá: {filters.discount === 'discounted' ? 'Có' : 'Không'}
                    </div>
                  )}
                  {filters.searchTerm && (
                    <div className="mb-1">Tìm kiếm: "{filters.searchTerm}"</div>
                  )}
                  {filters.priceRange === 'all' && filters.rating === 'all' && 
                   filters.discount === 'all' && !filters.searchTerm && (
                    <div className="text-gray-400">Không có bộ lọc nào</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hiển thị {filteredProducts.length} trong tổng số {wishlistItems.length} sản phẩm yêu thích
          </p>
        </div>

        {/* Wishlist Items */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {wishlistItems.length === 0 ? (
                <Heart className="w-12 h-12 text-gray-400" />
              ) : (
                <Search className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {wishlistItems.length === 0 
                ? 'Bạn chưa có sản phẩm yêu thích nào' 
                : 'Không tìm thấy sản phẩm phù hợp'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {wishlistItems.length === 0 
                ? 'Hãy khám phá và thêm sản phẩm vào danh sách yêu thích!' 
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            {wishlistItems.length === 0 ? (
          <button
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            onClick={() => window.location.href = '/products'}
          >
                <Eye className="w-4 h-4" />
            Khám phá sản phẩm
          </button>
            ) : (
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <Filter className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Product Image */}
              <div className="relative">
                <img
                  src={item.imageUrl || '/placeholder.png'}
                  alt={item.productName || 'Sản phẩm'}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                  
                  {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-all duration-200 hover:scale-110"
                    title="Xóa khỏi yêu thích"
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button>

                  {/* Discount Badge */}
                  {item.variants && item.variants.length > 0 && item.variants[0].discountType && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                      -{item.variants[0].discountPercent || 0}%
                    </div>
                  )}
              </div>

                {/* Product Info */}
                <div className="p-5">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {item.productName || 'Không có tên'}
                </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.averageRating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({item.totalReviews || 0} đánh giá)
                    </span>
                </div>

                  {/* Price */}
                  <div className="mb-4">
                  {item.variants && item.variants.length > 0 ? (
                    item.variants[0].discountType ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">
                            {item.variants[0].finalPriceAfterDiscount.toLocaleString('vi-VN')}₫
                          </span>
                        <span className="text-sm text-gray-500 line-through">
                            {item.variants[0].priceOverride.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                          {item.variants[0].priceOverride.toLocaleString('vi-VN')}₫
                      </span>
                    )
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                        {item.price ? item.price.toLocaleString('vi-VN') + '₫' : '---'}
                    </span>
                  )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium"
                  >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ
                  </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default WishList;

// Inline Styles
const styles = {
  container: {
    padding: "40px 10%",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#fff",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 16 },
  outlineBtn: {
    padding: "8px 16px",
    border: "1px solid #000",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  redLine: {
    width: 6,
    height: 20,
    background: "#DB4444",
    borderRadius: 2,
  },
  subTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 500,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 30,
    marginBottom: 40,
  },
  card: {
    position: "relative",
    background: "#f4f4f4",
    padding: "10px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  cardHover: {
    transform: "translateY(0)",
  },
  discount: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#DB4444",
    color: "#fff",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 4,
  },
  newTag: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#00FF66",
    color: "#fff",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 4,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#000",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: 10,
  },
  cartBtn: {
    width: "100%",
    background: "#000",
    color: "#fff",
    padding: "8px",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    marginBottom: 10,
    transition: "background 0.3s ease",
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    margin: "8px 0 4px",
  },
  price: {
    fontSize: 14,
    color: "#DB4444",
  },
  oldPrice: {
    marginLeft: 8,
    textDecoration: "line-through",
    color: "#888",
    fontSize: 13,
  },
  rating: {
    marginTop: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  review: {
    marginLeft: 6,
    fontSize: 12,
    color: "#333",
  },
};
