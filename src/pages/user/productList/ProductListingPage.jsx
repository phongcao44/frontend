import { useState, useEffect } from "react";
import {
  ArrowUp,
  Filter,
  Clock,
  Flame,
  TrendingUp,
  Package,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "../home/ProductCard";
import FlashSaleProducts from "./FlashSaleProducts";
import BestSellingProducts from "./BestSellingProducts";
import OurProducts from "./OurProducts";

const ProductListingPage = () => {
  const [activeTab, setActiveTab] = useState("flash-sale");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [flashSaleTime, setFlashSaleTime] = useState({
    hours: 2,
    minutes: 30,
    seconds: 45,
  });
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Flash sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleTabChange = (tab) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
    }, 300);
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case "flash-sale":
        return <Flame className="w-4 h-4" />;
      case "best-selling":
        return <TrendingUp className="w-4 h-4" />;
      case "our-products":
        return <Package className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Flash Sale":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "Best Seller":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      case "New":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "Hot":
        return "bg-gradient-to-r from-pink-500 to-purple-500 text-white";
      case "Gaming":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Render products based on active tab
  const renderProducts = () => {
    switch (activeTab) {
      case "flash-sale":
        return (
          <FlashSaleProducts
            sortBy={sortBy}
            toggleFavorite={toggleFavorite}
            formatPrice={formatPrice}
            getBadgeColor={getBadgeColor}
          />
        );
      case "best-selling":
        return (
          <BestSellingProducts
            sortBy={sortBy}
            toggleFavorite={toggleFavorite}
            formatPrice={formatPrice}
            getBadgeColor={getBadgeColor}
          />
        );
      case "our-products":
        return (
          <OurProducts
            sortBy={sortBy}
            toggleFavorite={toggleFavorite}
            formatPrice={formatPrice}
            getBadgeColor={getBadgeColor}
          />
        );
      default:
        return null;
    }
  };

  const getProductCount = () => {
    switch (activeTab) {
      case "flash-sale":
        return 4; // Number of products in FlashSaleProducts
      case "best-selling":
        return 4; // Number of products in BestSellingProducts
      case "our-products":
        return 4; // Number of products in OurProducts
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4">
            <div className="flex justify-center">
              <div className="flex space-x-8">
                {[
                  {
                    id: "flash-sale",
                    label: "Flash Sale",
                    color: "text-red-600",
                  },
                  {
                    id: "best-selling",
                    label: "Best Selling",
                    color: "text-orange-600",
                  },
                  {
                    id: "our-products",
                    label: "Our Products",
                    color: "text-blue-600",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all font-medium ${
                      activeTab === tab.id
                        ? `border-current ${tab.color}`
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {getTabIcon(tab.id)}
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Timer */}
        {activeTab === "flash-sale" && (
          <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white py-6">
            <div className="flex items-center justify-center space-x-4">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">
                Flash Sale kết thúc trong:
              </span>
              <div className="flex space-x-2">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-lg font-bold">
                    {String(flashSaleTime.hours).padStart(2, "0")}
                  </span>
                  <div className="text-xs">Giờ</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-lg font-bold">
                    {String(flashSaleTime.minutes).padStart(2, "0")}
                  </span>
                  <div className="text-xs">Phút</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-lg font-bold">
                    {String(flashSaleTime.seconds).padStart(2, "0")}
                  </span>
                  <div className="text-xs">Giây</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{getProductCount()}</span> sản phẩm
              </span>

              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="bestselling">Bán chạy nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm transition-all ${
                  showFilters
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Bộ lọc</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tất cả danh mục</option>
                    <option>Điện thoại</option>
                    <option>Laptop</option>
                    <option>Phụ kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tất cả mức giá</option>
                    <option>Dưới 10 triệu</option>
                    <option>10 - 20 triệu</option>
                    <option>20 - 30 triệu</option>
                    <option>Trên 30 triệu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tất cả đánh giá</option>
                    <option>5 sao</option>
                    <option>4 sao trở lên</option>
                    <option>3 sao trở lên</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {renderProducts()}
            </div>
          )}

          {!loading && getProductCount() === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm nào
              </p>
              <p className="text-gray-400">Thử thay đổi bộ lọc</p>
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-105 z-50"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;