import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  getUserWishlist,
  removeProductFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";
import Swal from "sweetalert2";
import ProductCard from "./home/ProductCard";

// Custom icons for navigation
const LeftOutlined = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RightOutlined = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Loading spinner component
const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
);

const WishList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: wishlistItems,
    loading,
    error,
  } = useSelector((state) => state.wishlist);
  const wishlistPrevRef = useRef(null);
  const wishlistNextRef = useRef(null);
  const justForYouPrevRef = useRef(null);
  const justForYouNextRef = useRef(null);

  console.log("Wishlist items:", wishlistItems);

  // Fetch wishlist on mount
  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (item) => {
    try {
      await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await dispatch(removeProductFromWishlist(item.wishlistId)).unwrap();
            Swal.fire(
              "Đã xóa!",
              "Sản phẩm đã được xóa khỏi danh sách yêu thích.",
              "success"
            );
          } catch (err) {
            console.error("Error removing from wishlist:", err);
            Swal.fire(
              "Lỗi!",
              err?.message ||
                "Không thể xóa sản phẩm khỏi danh sách yêu thích.",
              "error"
            );
          }
        }
      });
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      Swal.fire(
        "Lỗi!",
        err?.message || "Không thể xóa sản phẩm khỏi danh sách yêu thích.",
        "error"
      );
    }
  };

  // Add item to cart
  const handleAddToCart = async (item) => {
    try {
      const variantId = item.product.variants?.[0]?.id;
      if (!variantId) {
        Swal.fire({
          title: "Lỗi!",
          text: "Không tìm thấy biến thể sản phẩm để thêm vào giỏ hàng",
          icon: "error",
        });
        return;
      }
      await dispatch(addItemToCart({ variantId, quantity: 1 })).unwrap();
      Swal.fire({
        title: "Thành công!",
        text: "Đã thêm sản phẩm vào giỏ hàng",
        icon: "success",
        timer: 1500,
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      Swal.fire(
        "Lỗi!",
        err?.message || "Không thể thêm sản phẩm vào giỏ hàng",
        "error"
      );
    }
  };

  // Navigate to product details
  const handleProductClick = (item) => {
    navigate(`/product/${item.product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
          <p className="text-gray-500 mt-2">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getUserWishlist())}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Wishlist Header */}
        <div className="flex items-center mb-8">
          <div className="w-5 h-10 bg-red-500 rounded mr-4"></div>
          <span className="text-red-500 text-base font-semibold">
            Your Wishlist
          </span>
        </div>

        {/* Title + Nav */}
        <div className="flex items-center mb-10 flex-wrap gap-5">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-4xl font-semibold m-0">
              Wishlist ({wishlistItems.length})
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  ref={wishlistPrevRef}
                  className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                  aria-label="Scroll left"
                >
                  <LeftOutlined />
                </button>
                <button
                  ref={wishlistNextRef}
                  className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                  aria-label="Scroll right"
                >
                  <RightOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Slider */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 px-5">
            <h4 className="text-xl font-medium mb-4">
              Your wishlist is empty!
            </h4>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded transition-colors duration-200"
              onClick={() => navigate("/products")}
              aria-label="Explore products"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <Swiper
            loop={wishlistItems.length > 4}
            spaceBetween={20}
            slidesPerView={4}
            navigation={{
              prevEl: wishlistPrevRef.current,
              nextEl: wishlistNextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = wishlistPrevRef.current;
              swiper.params.navigation.nextEl = wishlistNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {wishlistItems.map((item) => (
              <SwiperSlide key={item.wishlistId}>
                <ProductCard
                  product={item.product}
                  showRemove={true}
                  onRemove={() => handleRemoveFromWishlist(item)}
                  onAddToCart={() => handleAddToCart(item)}
                  onClick={() => handleProductClick(item)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Just For You Section */}
        <div className="mb-8 mt-12">
          <div className="flex items-center mb-8">
            <div className="w-5 h-10 bg-red-500 rounded mr-4"></div>
            <span className="text-red-500 text-base font-semibold">
              This Month
            </span>
          </div>

          <div className="flex items-center mb-10 flex-wrap gap-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-4xl font-semibold m-0">Just For You</h2>
              <div className="flex gap-2">
                <button
                  ref={justForYouPrevRef}
                  className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                  aria-label="Scroll left"
                >
                  <LeftOutlined />
                </button>
                <button
                  ref={justForYouNextRef}
                  className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                  aria-label="Scroll right"
                >
                  <RightOutlined />
                </button>
              </div>
            </div>
          </div>

          {/* Just For You Slider */}
          {loading ? (
            <div className="text-center py-20 px-5">
              <div className="flex justify-center">
                <Spinner />
              </div>
            </div>
          ) : wishlistItems.length > 0 ? (
            <Swiper
              loop={wishlistItems.length > 4}
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                prevEl: justForYouPrevRef.current,
                nextEl: justForYouNextRef.current,
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = justForYouPrevRef.current;
                swiper.params.navigation.nextEl = justForYouNextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              modules={[Navigation]}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            >
              {wishlistItems.map((item) => (
                <SwiperSlide key={item.wishlistId}>
                  <ProductCard
                    product={{
                      id: item.product.id,
                      name: item.product.name,
                      price:
                        item.product.variants?.[0]?.finalPriceAfterDiscount ||
                        item.product.variants?.[0]?.priceOverride ||
                        item.product.price,
                      originalPrice: item.product.variants?.[0]?.priceOverride,
                      image: item.product.imageUrl || "/placeholder.png",
                      rating: item.product.averageRating,
                      reviews: item.product.totalReviews,
                      discount: item.product.variants?.[0]?.discountOverrideByFlashSale
                        ? `-${item.product.variants[0].discountOverrideByFlashSale}%`
                        : null,
                      inStock: item.product.status === "IN_STOCK",
                      ...item.product,
                    }}
                    showRemove={false}
                    onAddToCart={() => handleAddToCart(item)}
                    onClick={() => handleProductClick(item)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-20 px-5">
              <h4 className="text-xl font-medium mb-4">No items available!</h4>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded transition-colors duration-200"
                onClick={() => navigate("/products")}
                aria-label="Explore products"
              >
                Explore Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;