/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";
import FlashCountdown from "./FlashCountdown";
import {
  fetchActiveFlashSale,
  fetchFlashSaleItems,
} from "../../../redux/slices/flashSaleSlice";

// Custom icons component để thay thế Ant Design icons
const LeftOutlined = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RightOutlined = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Loading spinner component
const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
);

const FlashSale = () => {
  const dispatch = useDispatch();
  const { activeFlashSale, flashSaleItems, loading } = useSelector(
    (state) => state.flashSale
  );

  console.log("Active Flash Sale:", activeFlashSale);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const loadActiveFlashSale = async () => {
      const res = await dispatch(fetchActiveFlashSale()).unwrap();
      if (res) {
        dispatch(fetchFlashSaleItems(res.id));
      }
    };

    loadActiveFlashSale();
  }, [dispatch]);
//   useEffect(() => {
//   dispatch(fetchActiveFlashSale());
// }, [dispatch]);

// useEffect(() => {
//   if (activeFlashSale?.id) {
//     dispatch(fetchFlashSaleItems(activeFlashSale.id));
//   }
// }, [dispatch, activeFlashSale]);


  console.log(flashSaleItems)


  return (
    <div className="py-10 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center mb-8">
          <div className="w-5 h-10 bg-red-500 rounded mr-4" />
          <span className="text-red-500 text-base font-semibold">
            {"Today's"}
          </span>
        </div>

        {/* Title + Countdown + Nav */}
        <div className="flex items-center mb-10 flex-wrap gap-5">
          <div className="flex items-center flex-grow flex-wrap gap-10">
            <h2 className="text-4xl font-semibold m-0">
              Flash Sales
            </h2>
            {activeFlashSale && (
              <FlashCountdown endTime={activeFlashSale.endTime} />
            )}
          </div>

          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
            >
              <LeftOutlined />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
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
        ) : flashSaleItems.length > 0 ? (
          <>
            <Swiper
              loop={flashSaleItems.length > 4}
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
            >
              {flashSaleItems.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    showDiscountLabel
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* View All */}
            <div className="text-center mt-10">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-12 rounded transition-colors duration-200"
                onClick={() => {
                  window.location.href = "/products";
                }}
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-5">
            <h4 className="text-xl font-medium mb-4">
              Không có Flash Sale nào đang diễn ra!
            </h4>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded transition-colors duration-200"
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Khám phá sản phẩm khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSale;