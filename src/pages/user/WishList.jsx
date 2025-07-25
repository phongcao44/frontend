import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Heart, Trash2 } from "lucide-react";
import { getUserWishlist, removeProductFromWishlist } from "../../redux/slices/wishlistSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";
import Swal from 'sweetalert2';


const WishList = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
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
          await dispatch(removeProductFromWishlist(wishlistId)).unwrap();
          Swal.fire(
            'Đã xóa!',
            'Sản phẩm đã được xóa khỏi danh sách yêu thích.',
            'success'
          );
        }
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      Swal.fire(
        'Lỗi!',
        'Không thể xóa sản phẩm khỏi danh sách yêu thích.',
        'error'
      );
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await dispatch(addItemToCart({
        productId: item.productId,
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
        text: 'Không thể thêm sản phẩm vào giỏ hàng',
        icon: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Đang tải danh sách yêu thích...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => dispatch(getUserWishlist())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Wishlist Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Sản phẩm yêu thích ({wishlistItems.length})
        </h2>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Bạn chưa có sản phẩm yêu thích nào.
          </p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => window.location.href = '/products'}
          >
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.productId} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={item.imageUrl || '/placeholder.png'}
                  alt={item.productName || 'Sản phẩm'}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.productName || 'Không có tên'}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="mr-1">⭐ {item.averageRating?.toFixed(1) || '0.0'}</span>
                  <span>({item.totalReviews || 0} đánh giá)</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  {item.variants && item.variants.length > 0 ? (
                    item.variants[0].discountType ? (
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-through">
                          {item.variants[0].priceOverride.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          {item.variants[0].finalPriceAfterDiscount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {item.variants[0].priceOverride.toLocaleString('vi-VN')}đ
                      </span>
                    )
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {item.price ? item.price.toLocaleString('vi-VN') + 'đ' : '---'}
                    </span>
                  )}

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
