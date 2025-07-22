// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// Requires react-router-dom for useParams and useNavigate in a real app.
import React, { useState } from 'react';

// Mock useParams for slug (replace with actual react-router-dom in real app)
const mockUseParams = () => ({ slug: 'thoi-trang' }); // Default to 'thoi-trang' for demo

// Mock useNavigate for navigation (replace with actual react-router-dom in real app)
const mockUseNavigate = () => (slug) => console.log(`Navigate to /category/${slug}`);

// SubcategoryNav Component
function SubcategoryNav({ currentCategory, subcategories, onSubcategoryClick }) {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hidden">
      <div className="flex space-x-3 whitespace-nowrap">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => onSubcategoryClick(subcategory.slug)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
              currentCategory === subcategory.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {subcategory.name} ({subcategory.count})
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductListing() {
  const { slug } = mockUseParams(); // Replace with useParams() from react-router-dom
  const navigate = mockUseNavigate(); // Replace with useNavigate() from react-router-dom
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample category and subcategory data (replace with API data)
  const categories = [
    {
      id: 'all',
      name: 'Tất cả',
      slug: 'tat-ca',
      count: 245,
      subcategories: []
    },
    {
      id: 'fashion',
      name: 'Thời trang',
      slug: 'thoi-trang',
      count: 89,
      subcategories: [
        { id: 'men-shirts', name: 'Áo Nam', slug: 'ao-nam', count: 50 },
        { id: 'men-pants', name: 'Quần Nam', slug: 'quan-nam', count: 39 }
      ]
    },
    {
      id: 'electronics',
      name: 'Điện tử',
      slug: 'dien-tu',
      count: 67,
      subcategories: []
    },
    {
      id: 'beauty',
      name: 'Làm đẹp',
      slug: 'lam-dep',
      count: 45,
      subcategories: []
    },
    {
      id: 'home',
      name: 'Nhà cửa',
      slug: 'nha-cua',
      count: 34,
      subcategories: []
    },
    {
      id: 'sports',
      name: 'Thể thao',
      slug: 'the-thao',
      count: 28,
      subcategories: []
    }
  ];

  // Sample brand data (placeholder, replace with API data)
  const brands = [
    { id: 'all', name: 'Tất cả thương hiệu' },
    { id: 'brand-a', name: 'Brand A' },
    { id: 'brand-b', name: 'Brand B' },
    { id: 'brand-c', name: 'Brand C' }
  ];

  const priceRanges = [
    { id: 'all', label: 'Tất cả giá', min: 0, max: Infinity },
    { id: 'under-500', label: 'Dưới 500K', min: 0, max: 500000 },
    { id: '500-1000', label: '500K - 1 triệu', min: 500000, max: 1000000 },
    { id: 'above-1000', label: 'Trên 1 triệu', min: 1000000, max: Infinity }
  ];

  const ratingOptions = [
    { id: 'all', label: 'Tất cả đánh giá', value: 0 },
    { id: '4plus', label: '4 sao trở lên', value: 4 },
    { id: '3plus', label: '3 sao trở lên', value: 3 }
  ];

  const products = [
    {
      id: 1,
      name: 'Áo thun nam basic cotton premium',
      price: 299000,
      originalPrice: 399000,
      rating: 4.8,
      sold: 1200,
      category: 'men-shirts',
      brand: 'brand-a',
      image: 'https://readdy.ai/api/search-image?query=modern%20minimalist%20white%20cotton%20t-shirt%20for%20men%20on%20clean%20white%20background%20with%20soft%20lighting%20and%20professional%20product%20photography%20style&width=300&height=300&seq=1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Túi xách nữ da thật cao cấp',
      price: 1299000,
      originalPrice: 1599000,
      rating: 4.9,
      sold: 856,
      category: 'fashion',
      brand: 'brand-b',
      image: 'https://readdy.ai/api/search-image?query=elegant%20leather%20handbag%20for%20women%20in%20brown%20color%20on%20minimalist%20white%20background%20with%20professional%20studio%20lighting%20and%20modern%20aesthetic&width=300&height=300&seq=2&orientation=squarish'
    },
    {
      id: 3,
      name: 'Quần jeans nam slim fit',
      price: 899000,
      originalPrice: 1199000,
      rating: 4.7,
      sold: 2341,
      category: 'men-pants',
      brand: 'brand-a',
      image: 'https://readdy.ai/api/search-image?query=modern%20slim%20fit%20jeans%20for%20men%20on%20clean%20minimalist%20background%20with%20soft%20shadows%20and%20contemporary%20product%20photography%20style&width=300&height=300&seq=3&orientation=squarish'
    },
    {
      id: 4,
      name: 'Kem dưỡng da mặt vitamin C',
      price: 459000,
      originalPrice: 599000,
      rating: 4.6,
      sold: 678,
      category: 'beauty',
      brand: 'brand-c',
      image: 'https://readdy.ai/api/search-image?query=premium%20skincare%20cream%20jar%20with%20vitamin%20C%20on%20clean%20white%20background%20with%20soft%20lighting%20and%20minimalist%20product%20photography%20aesthetic&width=300&height=300&seq=4&orientation=squarish'
    },
    {
      id: 5,
      name: 'Tai nghe bluetooth không dây',
      price: 1899000,
      originalPrice: 2299000,
      rating: 4.8,
      sold: 1567,
      category: 'electronics',
      brand: 'brand-b',
      image: 'https://readdy.ai/api/search-image?query=modern%20wireless%20bluetooth%20earbuds%20in%20white%20color%20on%20minimalist%20background%20with%20professional%20product%20photography%20and%20clean%20aesthetic&width=300&height=300&seq=5&orientation=squarish'
    },
    {
      id: 6,
      name: 'Đầm midi nữ thanh lịch',
      price: 699000,
      originalPrice: 899000,
      rating: 4.5,
      sold: 432,
      category: 'fashion',
      brand: 'brand-a',
      image: 'https://readdy.ai/api/search-image?query=elegant%20midi%20dress%20for%20women%20in%20soft%20pastel%20color%20on%20clean%20white%20background%20with%20professional%20fashion%20photography%20and%20minimalist%20styling&width=300&height=300&seq=6&orientation=squarish'
    }
  ];

  // Find current category based on slug
  const currentCategory = categories.find(cat => cat.slug === slug) || categories[0];
  const currentCategoryId = currentCategory.id;
  const subcategories = currentCategory.subcategories || [];

  // Handle subcategory click
  const handleSubcategoryClick = (subcategorySlug) => {
    navigate(`category/${subcategorySlug}`);
    // Reset filters, keep sort
    setSelectedPriceRange('all');
    setSelectedRating('all');
    setSelectedBrand('all');
  };

  // Build breadcrumb
  const breadcrumbItems = [];
  if (currentCategoryId !== 'all') {
    const parentCategory = categories.find(cat => 
      cat.subcategories && cat.subcategories.some(sub => sub.id === currentCategoryId)
    );
    if (parentCategory) {
      breadcrumbItems.push({ name: parentCategory.name, slug: parentCategory.slug });
      breadcrumbItems.push({ name: currentCategory.name, slug: currentCategory.slug });
    } else {
      breadcrumbItems.push({ name: currentCategory.name, slug: currentCategory.slug });
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => currentCategoryId === 'all' || product.category === currentCategoryId)
    .filter(product => {
      const range = priceRanges.find(r => r.id === selectedPriceRange);
      return product.price >= range.min && product.price <= range.max;
    })
    .filter(product => {
      const rating = ratingOptions.find(r => r.id === selectedRating);
      return product.rating >= rating.value;
    })
    .filter(product => selectedBrand === 'all' || product.brand === selectedBrand)
    .sort((a, b) => {
      if (sortBy === 'popular') return b.sold - a.sold;
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('')}>Trang chủ</span>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.slug}>
              <i className="fas fa-chevron-right text-xs"></i>
              <span
                className={index === breadcrumbItems.length - 1 ? 'text-gray-900' : 'hover:text-blue-600 cursor-pointer'}
                onClick={() => index < breadcrumbItems.length - 1 && navigate(`category/${item.slug}`)}
              >
                {item.name}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {currentCategory.name}
          </h1>
          <p className="text-gray-600">Tìm kiếm những sản phẩm yêu thích của bạn</p>
        </div>

        {/* Subcategory Nav */}
        {subcategories.length > 0 && (
          <SubcategoryNav
            currentCategory={currentCategoryId}
            subcategories={subcategories}
            onSubcategoryClick={handleSubcategoryClick}
          />
        )}

        {/* Filter and Sort Bar */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
            >
              <i className="fas fa-filter text-sm"></i>
              <span>Bộ lọc</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="popular">Phổ biến</option>
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Filter Sidebar */}
        {showFilters && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Brand Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-copyright text-blue-500"></i>
                    Thương hiệu
                  </h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedBrand === brand.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-tag text-blue-500"></i>
                    Khoảng giá
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange === range.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-star text-blue-500"></i>
                    Đánh giá
                  </h3>
                  <div className="space-y-2">
                    {ratingOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedRating(option.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedRating === option.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setSelectedPriceRange('all');
                    setSelectedRating('all');
                    setSelectedBrand('all');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer">
                    <i className="far fa-heart text-gray-400 hover:text-red-500 text-sm"></i>
                  </button>
                </div>
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star text-xs ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.rating})</span>
                  <span className="text-xs text-gray-400">• Đã bán {product.sold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                </div>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer whitespace-nowrap !rounded-button">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium cursor-pointer whitespace-nowrap !rounded-button">
            Xem thêm sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductListing;