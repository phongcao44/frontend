import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import { loadTopSellingProductsPaginate } from "../../../redux/slices/productSlice";

// Helper function to sync products with wishlist
const syncProductsWithWishlist = (products, wishlistItems) => {
  if (!products || !wishlistItems) return products;
  
  return products.map(product => ({
    ...product,
    isFavorite: wishlistItems.some(item => item.product?.id === product.id)
  }));
};

// Custom icons component to replace Ant Design icons
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

const BestSelling = () => {
  const dispatch = useDispatch();
  const { topSellingPaginated, loading } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    dispatch(loadTopSellingProductsPaginate({ page: 0, limit: 10 }));
  }, [dispatch]);

  // Extract products from paginated response and sync with wishlist
  const rawProducts = topSellingPaginated?.content || [];
  const products = syncProductsWithWishlist(rawProducts, wishlistItems);

  return (
    <div className="py-10 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center mb-8">
          <div className="w-5 h-10 bg-red-500 rounded mr-4"></div>
          <span className="text-red-500 text-base font-semibold">
            This Month
          </span>
        </div>

        {/* Title + Nav */}
        <div className="flex items-center mb-10 flex-wrap gap-5">
          <div className="flex items-center flex-grow flex-wrap gap-10">
            <h2 className="text-4xl font-semibold m-0">
              Best Selling Products
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
              aria-label="Scroll left"
            >
              <LeftOutlined />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
              aria-label="Scroll right"
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        {/* Slider */}
        {loading ? (
          <div className="text-center py-20 px-5">
            <div className="flex justify-center">
              <Spinner />
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <Swiper
              loop={products.length > 4}
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
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
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* View All */}
            <div className="text-center mt-10">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-12 rounded transition-colors duration-200"
                onClick={() => {
                  window.location.href = "/bestselling";
                }}
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-5">
            <h4 className="text-xl font-medium mb-4">
              No best selling products available!
            </h4>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded transition-colors duration-200"
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Explore other products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSelling;