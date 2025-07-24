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
