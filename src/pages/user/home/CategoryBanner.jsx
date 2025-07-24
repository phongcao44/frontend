import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCategoryTree,
} from "../../../redux/slices/categorySlice";
import { getBanners } from "../../../redux/slices/bannerSlice";

const CategoryBanner = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banner);
  const { categoryTree } = useSelector((state) => state.category);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [megaMenuPosition, setMegaMenuPosition] = useState({ top: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadCategoryTree());
  }, [dispatch]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const now = new Date();
  const activeBanners = banners.filter(
    (b) => b.status && new Date(b.startAt) <= now && new Date(b.endAt) >= now
  );

  const showNav = activeBanners.length > 1;

  // Handle hover on category item
  const handleCategoryHover = (category, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMegaMenuPosition({
      top: rect.top - event.currentTarget.offsetParent.getBoundingClientRect().top
    });
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Category Sidebar with Mega Menu */}
      <div className="w-full md:w-1/5 relative">
        {/* Vertical Category List */}
        <div className="border-r border-gray-300 min-h-[300px] bg-white relative z-10">
          <ul className="m-0 p-0 list-none">
            {categoryTree && categoryTree.length > 0 ? (
              categoryTree.map((cat) => (
                <li
                  key={cat.id}
                  className="flex justify-between items-center px-3 py-3 text-sm text-gray-800 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 border-l-4 border-transparent hover:border-blue-500"
                  onMouseEnter={(e) => handleCategoryHover(cat, e)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <span className="font-medium">{cat.name}</span>
                  <FaChevronRight className="text-xs text-gray-400" />
                </li>
              ))
            ) : (
              <li className="px-3 py-3 text-sm text-gray-500">
                Đang tải danh mục...
              </li>
            )}
          </ul>
        </div>

        {/* Mega Menu Dropdown - Appears on hover */}
        {hoveredCategory && (
          <div
            className="absolute left-full top-0 w-[800px] bg-white shadow-2xl border border-gray-200 rounded-r-lg z-50 ml-0"
            style={{ top: megaMenuPosition.top }}
            onMouseEnter={() => setHoveredCategory(hoveredCategory)}
            onMouseLeave={handleCategoryLeave}
          >
            {/* Mega Menu Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="w-1 h-6 bg-blue-500 mr-3 rounded"></span>
                {hoveredCategory.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {hoveredCategory.children?.length || 0} danh mục con
              </p>
            </div>

            {/* Mega Menu Content */}
            <div className="p-6">
              {hoveredCategory.children && hoveredCategory.children.length > 0 ? (
                <div className="grid grid-cols-3 gap-8">
                  {hoveredCategory.children.map((subCategory) => (
                    <div key={subCategory.id} className="space-y-3">
                      {/* Sub Category Header */}
                      <div className="border-b border-gray-100 pb-2">
                        <a
                          href="#"
                          className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 text-base"
                        >
                          {subCategory.name}
                        </a>
                      </div>

                      {/* Grand Children */}
                      {subCategory.children && subCategory.children.length > 0 ? (
                        <div className="space-y-2">
                          {subCategory.children.slice(0, 6).map((grandChild) => (
                            <a
                              key={grandChild.id}
                              href="#"
                              className="block text-gray-600 hover:text-blue-600 hover:pl-2 transition-all duration-200 text-sm py-1"
                            >
                              {grandChild.name}
                            </a>
                          ))}
                          {subCategory.children.length > 6 && (
                            <a
                              href="#"
                              className="block text-blue-500 hover:text-blue-600 font-medium text-sm py-1 hover:pl-2 transition-all duration-200"
                            >
                              + Xem thêm {subCategory.children.length - 6} mục
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          Chưa có sản phẩm
                        </p>
                      )}

                      {/* View All Link for Sub Category */}
                      <div className="pt-2 mt-3 border-t border-gray-50">
                        <a
                          href="#"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:gap-2 gap-1"
                        >
                          Xem tất cả
                          <FaChevronRight className="text-xs" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Danh mục này chưa có sản phẩm</p>
                </div>
              )}
            </div>

            {/* Mega Menu Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-br-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Danh mục: {hoveredCategory.name}
                </span>
                <a
                  href="#"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
                >
                  Xem tất cả sản phẩm
                </a>
              </div>
            </div>

            {/* Arrow pointer */}
            <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white -ml-2"></div>
          </div>
        )}
      </div>

      {/* Banner Section */}
      <div className="w-full md:w-4/5">
        {/* Banner Swiper */}
        <div className="relative">
          {activeBanners && activeBanners.length > 0 ? (
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              loop={activeBanners.length > 1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 5,
              }}
              navigation={
                showNav
                  ? {
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }
                  : false
              }
              onInit={(swiper) => {
                if (showNav) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }}
              style={{ overflow: "hidden", borderRadius: "12px" }}
            >
              {activeBanners.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
                    <img
                      src={item.bannerUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-start px-10">
                      <h2 className="text-white text-4xl font-bold mb-4 drop-shadow-lg max-w-md">
                        {item.title}
                      </h2>
                      <button
                        onClick={() => {
                          if (item.targetUrl) {
                            navigate(`/product/${item.targetUrl}`);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Đang tải banner...</p>
              </div>
            </div>
          )}

          {/* Custom Navigation Buttons */}
          {showNav && (
            <>
              <div
                ref={prevRef}
                className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <FaChevronLeft className="text-gray-700 text-lg" />
              </div>
              <div
                ref={nextRef}
                className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <FaChevronRight className="text-gray-700 text-lg" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;