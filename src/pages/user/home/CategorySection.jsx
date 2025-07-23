import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DribbbleOutlined,
  HeartOutlined,
  HomeOutlined,
  LeftOutlined,
  ManOutlined,
  RightOutlined,
  SmileOutlined,
  WomanOutlined,
  LaptopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { loadParentCategories } from "../../../redux/slices/categorySlice";

// Icon mapping
const iconMap = {
  "Thời trang nữ": <WomanOutlined />,
  "Thời trang nam": <ManOutlined />,
  "Điện tử": <LaptopOutlined />,
  "Nhà cửa & Đời sống": <HomeOutlined />,
  "Sức khỏe": <HeartOutlined />,
  "Thể thao & Dã ngoại": <DribbbleOutlined />,
  "Mẹ & Bé": <SmileOutlined />,
  "Thú cưng & Tạp hóa": <ShoppingOutlined />,
};

const CategorySection = () => {
  const dispatch = useDispatch();
  const { parentList, loading, error } = useSelector((state) => state.category);
  const swiperRef = useRef(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    dispatch(loadParentCategories({ page: 0, limit: 8, sortBy: "name", orderBy: "asc" }));
  }, [dispatch]);

  const categoriesWithIcons = (parentList || []).map((category) => ({
    ...category,
    icon: iconMap[category.name] || <ShoppingOutlined />,
    active: category.id === activeCategoryId,
  }));

  const handleCategoryClick = (id) => {
    setActiveCategoryId((prevId) => (prevId === id ? null : id)); // Toggle active state
  };

  if (loading) return <div className="text-center text-gray-600 py-10">Loading categories...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="bg-white py-10 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <div className="flex items-center mb-4">
          <div className="w-5 h-10 bg-red-500 rounded mr-4"></div>
          <span className="text-red-500 text-lg font-semibold">Categories</span>
        </div>

        {/* Title + Arrows */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
          <h2 className="text-3xl font-bold m-0">Browse By Category</h2>
          <div className="flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Scroll left"
            >
              <LeftOutlined className="text-gray-600" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Scroll right"
            >
              <RightOutlined className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={6}
          spaceBetween={20}
          loop
        >
          {categoriesWithIcons.map((category) => (
            <SwiperSlide key={category.id}>
              <div
                onClick={() => handleCategoryClick(category.id)}
                className={`flex flex-col items-center justify-center h-32 border-2 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
                  category.active
                    ? "bg-red-500 border-red-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-3xl mb-2 ${
                    category.active ? "text-white" : "text-gray-600"
                  }`}
                >
                  {category.icon}
                </div>
                <span
                  className={`font-medium text-sm truncate ${
                    category.active ? "text-white" : "text-black"
                  }`}
                >
                  {category.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySection;