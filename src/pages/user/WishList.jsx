import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import ProductCard from "./home/ProductCard";
import { getUserWishlist, removeProductFromWishlist } from "../../redux/slices/wishlistSlice";
// import { addToCart } from "../../redux/slices/cartSlice";

const WishList = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  const removeFromWishlist = async (id) => {
    try {
      await dispatch(removeProductFromWishlist(id)).unwrap();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await dispatch(addToCart({
        productId: item.id,
        quantity: 1
      })).unwrap();
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(item.id);
    } catch (err) {
      console.error('Error adding to cart:', err);
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
          <p className="text-gray-500 text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => window.location.href = '/products'}
          >
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              showRemove={true}
              onRemove={removeFromWishlist}
              onAddToCart={() => handleAddToCart(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
