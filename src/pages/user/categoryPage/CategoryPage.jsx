import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, ChevronDown, Star, ShoppingCart, Heart, X, Menu } from 'lucide-react';

const CategoryPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('best-selling');
  
  // Filter states
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 5000000],
    customPriceMin: '',
    customPriceMax: '',
    rating: 0,
    sizes: [],
    colors: [],
    inStock: false,
    subcategories: []
  });

  // Mock data
  const categoryData = {
    name: "Áo Thun Nam",
    slug: "ao-thun-nam",
    subcategories: [
      { id: 1, name: "Áo thun basic", slug: "ao-thun-basic", count: 45 },
      { id: 2, name: "Áo thun polo", slug: "ao-thun-polo", count: 23 },
      { id: 3, name: "Áo thun thể thao", slug: "ao-thun-the-thao", count: 67 },
      { id: 4, name: "Áo thun oversized", slug: "ao-thun-oversized", count: 34 },
      { id: 5, name: "Áo thun vintage", slug: "ao-thun-vintage", count: 18 }
    ]
  };

  const brands = ["Nike", "Adidas", "Uniqlo", "H&M", "Zara"];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Đen", hex: "#000000" },
    { name: "Trắng", hex: "#FFFFFF" },
    { name: "Xanh Navy", hex: "#1e3a8a" },
    { name: "Xám", hex: "#6b7280" },
    { name: "Đỏ", hex: "#dc2626" }
  ];

  const products = [
    {
      id: 1,
      name: "Áo thun basic cotton",
      price: 299000,
      originalPrice: 399000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      rating: 4.5,
      reviews: 128,
      brand: "Uniqlo",
      colors: ["#000000", "#FFFFFF", "#1e3a8a"],
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
      isNew: true
    },
    {
      id: 2,
      name: "Áo thun premium oversized",
      price: 450000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop",
      rating: 4.8,
      reviews: 89,
      brand: "Nike",
      colors: ["#000000", "#6b7280"],
      sizes: ["M", "L", "XL"],
      inStock: true,
      isNew: false
    },
    {
      id: 3,
      name: "Áo thun thể thao",
      price: 550000,
      originalPrice: 650000,
      image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=300&h=300&fit=crop",
      rating: 4.2,
      reviews: 256,
      brand: "Adidas",
      colors: ["#dc2626", "#000000", "#FFFFFF"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      inStock: false,
      isNew: false
    },
    {
      id: 4,
      name: "Áo thun vintage wash",
      price: 320000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop",
      rating: 4.6,
      reviews: 67,
      brand: "H&M",
      colors: ["#6b7280", "#1e3a8a"],
      sizes: ["M", "L", "XL"],
      inStock: true,
      isNew: false
    },
    {
      id: 5,
      name: "Áo thun polo classic",
      price: 480000,
      originalPrice: 580000,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
      rating: 4.4,
      reviews: 142,
      brand: "Zara",
      colors: ["#FFFFFF", "#1e3a8a", "#dc2626"],
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
      isNew: true
    },
    {
      id: 6,
      name: "Áo thun graphic print",
      price: 380000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=300&fit=crop",
      rating: 4.3,
      reviews: 98,
      brand: "Nike",
      colors: ["#000000", "#FFFFFF"],
      sizes: ["M", "L", "XL", "XXL"],
      inStock: true,
      isNew: false
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };


  const FilterSection = () => (
    <div className="space-y-6">
      {/* Subcategories Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-900">Danh mục con</h3>
        <div className="space-y-2">
          {categoryData.subcategories.map(subcat => (
            <label key={subcat.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.subcategories.includes(subcat.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({...filters, subcategories: [...filters.subcategories, subcat.id]});
                    } else {
                      setFilters({...filters, subcategories: filters.subcategories.filter(s => s !== subcat.id)});
                    }
                  }}
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600">{subcat.name}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{subcat.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-900">Thương hiệu</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.brands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({...filters, brands: [...filters.brands, brand]});
                  } else {
                    setFilters({...filters, brands: filters.brands.filter(b => b !== brand)});
                  }
                }}
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-900">Khoảng giá</h3>
        
        {/* Preset Price Ranges */}
        <div className="space-y-2 mb-4">
          {[
            { label: "< 300K", min: 0, max: 300000 },
            { label: "300K - 500K", min: 300000, max: 500000 },
            { label: "500K - 1M", min: 500000, max: 1000000 },
            { label: "> 1M", min: 1000000, max: 5000000 }
          ].map(range => (
            <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="priceRange"
                className="text-blue-600 focus:ring-blue-500"
                onChange={() => {
                  setFilters({
                    ...filters, 
                    priceRange: [range.min, range.max],
                    customPriceMin: '',
                    customPriceMax: ''
                  });
                }}
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>

        {/* Custom Price Range */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-3">Hoặc nhập khoảng giá:</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Từ (đ)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.customPriceMin}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    customPriceMin: e.target.value,
                    priceRange: [
                      parseInt(e.target.value) || 0,
                      parseInt(filters.customPriceMax) || 5000000
                    ]
                  });
                }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Đến (đ)</label>
              <input
                type="number"
                placeholder="5000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.customPriceMax}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    customPriceMax: e.target.value,
                    priceRange: [
                      parseInt(filters.customPriceMin) || 0,
                      parseInt(e.target.value) || 5000000
                    ]
                  });
                }}
              />
            </div>
          </div>
          {(filters.customPriceMin || filters.customPriceMax) && (
            <button 
              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
              onClick={() => {
                setFilters({
                  ...filters,
                  customPriceMin: '',
                  customPriceMax: '',
                  priceRange: [0, 5000000]
                });
              }}
            >
              Xóa khoảng giá tùy chỉnh
            </button>
          )}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-900">Đánh giá</h3>
        <div className="space-y-2">
          {[4, 3].map(rating => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="rating"
                className="text-blue-600 focus:ring-blue-500"
                onChange={() => setFilters({...filters, rating})}
              />
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-700">Từ {rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-700">trở lên</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-900">Kích thước</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              className={`px-3 py-1 text-sm border rounded-md ${
                filters.sizes.includes(size)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
              }`}
              onClick={() => {
                if (filters.sizes.includes(size)) {
                  setFilters({...filters, sizes: filters.sizes.filter(s => s !== size)});
                } else {
                  setFilters({...filters, sizes: [...filters.sizes, size]});
                }
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-900">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color.name}
              className={`w-8 h-8 rounded-full border-2 ${
                filters.colors.includes(color.hex)
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              onClick={() => {
                if (filters.colors.includes(color.hex)) {
                  setFilters({...filters, colors: filters.colors.filter(c => c !== color.hex)});
                } else {
                  setFilters({...filters, colors: [...filters.colors, color.hex]});
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={filters.inStock}
            onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
          />
          <span className="text-sm text-gray-700">Chỉ hiển thị còn hàng</span>
        </label>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Mới
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Sale
            </span>
          )}
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
              Hết hàng
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
          <div className="flex items-center space-x-1">
            {renderStars(Math.floor(product.rating))}
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
            )}
          </div>
          
          <button 
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{categoryData.name}</h1>
              <p className="text-gray-600 mt-1">Khám phá bộ sưu tập {categoryData.name.toLowerCase()}</p>
            </div>
            
            {/* Mobile Filter Button */}
            <button 
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => setFilters({
                    brands: [],
                    priceRange: [0, 5000000],
                    customPriceMin: '',
                    customPriceMax: '',
                    rating: 0,
                    sizes: [],
                    colors: [],
                    inStock: false,
                    subcategories: []
                  })}
                >
                  Xóa tất cả
                </button>
              </div>
              <FilterSection />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Hiển thị {products.length} sản phẩm
                  </span>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button 
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="best-selling">Bán chạy nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  Trang trước
                </button>
                <div className="flex space-x-2">
                  {[1, 2, 3].map(page => (
                    <button 
                      key={page}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FilterSection />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <button 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                onClick={() => setIsFilterOpen(false)}
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;