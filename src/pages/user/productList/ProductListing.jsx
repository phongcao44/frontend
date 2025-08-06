import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { loadProductsPaginate } from "../../../redux/slices/productSlice";
import {
  loadFlatCategoryList,
  loadSubCategories,
} from "../../../redux/slices/categorySlice";
import ProductCard from "../home/ProductCard";

function SubcategoryNav({
  subcategories,
  onSubcategoryClick,
  selectedSubcategorySlug,
}) {
  const validSubcategories = Array.isArray(subcategories) ? subcategories : [];

  console.log(subcategories)
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hidden">
      <div className="flex space-x-3 whitespace-nowrap">
        {validSubcategories.length > 0 ? (
          validSubcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => onSubcategoryClick(subcategory.slug)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                selectedSubcategorySlug === subcategory.slug
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {subcategory.name}
            </button>
          ))
        ) : (
          <div className="text-gray-500">Không có danh mục con</div>
        )}
      </div>
    </div>
  );
}

function ProductListing() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();
  const paginatedProducts = useSelector((state) => state.products.paginated);
  const productsLoading = useSelector((state) => state.products.loading);
  const productsError = useSelector((state) => state.products.error);
  const subCategoryMap = useSelector(
    (state) => state.category.subCategoryMap || {}
  );
  const categoryLoading = useSelector((state) => state.category.loading);
  const flatCategoryList = useSelector(
    (state) => state.category.flatCategoryList || []
  );

  const [currentCategory, setCurrentCategory] = useState({ name: "Danh mục", id: null });
  const validSubcategories = subCategoryMap[currentCategory.id] || [];

  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(0);
  const [selectedSubcategorySlug, setSelectedSubcategorySlug] = useState(null);

  const brands = [
    { id: "all", name: "Tất cả thương hiệu" },
    { id: "brand-a", name: "Brand A" },
    { id: "brand-b", name: "Brand B" },
    { id: "brand-c", name: "Brand C" },
  ];

  const priceRanges = [
    { id: "all", label: "Tất cả giá", min: null, max: null },
    { id: "under-500", label: "Dưới 500K", min: 0, max: 500000 },
    { id: "500-1000", label: "500K - 1 triệu", min: 500000, max: 1000000 },
    { id: "above-1000", label: "Trên 1 triệu", min: 1000000, max: null },
  ];

  const ratingOptions = [
    { id: "all", label: "Tất cả đánh giá", value: 0 },
    { id: "4plus", label: "4 sao trở lên", value: 4 },
    { id: "3plus", label: "3 sao trở lên", value: 3 },
  ];

  // Load flat category list once on mount
  useEffect(() => {
    dispatch(loadFlatCategoryList());
  }, [dispatch]);

  // Update currentCategory when slug or flatCategoryList changes
  useEffect(() => {
    const category = flatCategoryList.find((cat) => cat.slug === slug) || { name: "Danh mục", id: null };
    setCurrentCategory(category);
  }, [slug, flatCategoryList]);

  // Load subcategories when currentCategory.id changes
  useEffect(() => {
    if (currentCategory.id && currentCategory.level < 3) {
      dispatch(loadSubCategories(currentCategory.id));
    }
  }, [dispatch, currentCategory.id, currentCategory.level]);

  // Reset filters when slug changes
  useEffect(() => {
    setSelectedSubcategorySlug(null);
    setPage(0);
  }, [slug]);

  const handleSubcategoryClick = (subcategorySlug) => {
    setSelectedSubcategorySlug(subcategorySlug);
    setPage(0);
    navigate(`/products/category/${subcategorySlug}`);
  };

  const mapSortBy = (sortBy) => {
    switch (sortBy) {
      case "newest":
        return { sortBy: "createdAt", orderBy: "desc" };
      case "price-low":
        return { sortBy: "price", orderBy: "asc" };
      case "price-high":
        return { sortBy: "price", orderBy: "desc" };
      default:
        return { sortBy: "createdAt", orderBy: "desc" };
    }
  };

  const getPriceRange = () => {
    const range =
      priceRanges.find((r) => r.id === selectedPriceRange) || priceRanges[0];
    return { priceMin: range.min, priceMax: range.max };
  };

  // Load products when dependencies change
  useEffect(() => {
    const { sortBy: apiSortBy, orderBy } = mapSortBy(sortBy);
    const { priceMin, priceMax } = getPriceRange();
    const minRating =
      ratingOptions.find((r) => r.id === selectedRating)?.value || 0;

    // Find category ID based on selectedSubcategorySlug or current slug
    const selectedCategory = selectedSubcategorySlug
      ? flatCategoryList.find((cat) => cat.slug === selectedSubcategorySlug)
      : flatCategoryList.find((cat) => cat.slug === slug);

    const categoryId = selectedCategory ? selectedCategory.id : null;

    if (categoryId) {
      const params = {
        page,
        limit: 8,
        sortBy: apiSortBy,
        orderBy,
        categoryId,
        status: null,
        brandName: selectedBrand === "all" ? null : selectedBrand,
        priceMin: priceMin || null,
        priceMax: priceMax || null,
        minRating: minRating === 0 ? null : minRating,
      };

      dispatch(loadProductsPaginate(params));
    }
  }, [
    dispatch,
    page,
    selectedSubcategorySlug,
    selectedPriceRange,
    selectedRating,
    selectedBrand,
    sortBy,
    slug,
  ]);

  const handleLoadMore = () => {
    if (page < paginatedProducts?.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handleResetFilters = () => {
    setSelectedPriceRange("all");
    setSelectedRating("all");
    setSelectedBrand("all");
    setSortBy("popular");
    setSelectedSubcategorySlug(null);
    setPage(0);
  };

  // Build breadcrumb by tracing back through parentId
  const buildBreadcrumb = () => {
    const breadcrumbItems = [{ name: "Trang chủ", slug: "/" }];
    let currentSlug = selectedSubcategorySlug || slug;
    const categoryPath = [];

    while (currentSlug) {
      const category = flatCategoryList.find((cat) => cat.slug === currentSlug);
      if (category) {
        categoryPath.unshift({ name: category.name, slug: category.slug });
        currentSlug = flatCategoryList.find((cat) => cat.id === category.parentId)?.slug || null;
      } else {
        break;
      }
    }

    return [...breadcrumbItems, ...categoryPath];
  };

  const breadcrumbItems = buildBreadcrumb();
  const productsContent = paginatedProducts?.data?.content || [];

  if (productsLoading && page === 0)
    return <div className="text-center py-10">Đang tải...</div>;
  if (productsError)
    return (
      <div className="text-center py-10 text-red-500">Lỗi: {productsError}</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.slug}>
              {index > 0 && <i className="fas fa-chevron-right text-xs"></i>}
              <span
                className={
                  index === breadcrumbItems.length - 1
                    ? "text-gray-900"
                    : "hover:text-blue-600 cursor-pointer"
                }
                onClick={() =>
                  navigate(
                    item.slug === "/" ? "/" : `/products/category/${item.slug}`
                  )
                }
              >
                {item.name}
              </span>
            </React.Fragment>
          ))}
        </nav>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {currentCategory.name}
          </h1>
          <p className="text-gray-600">
            Tìm kiếm những sản phẩm yêu thích của bạn
          </p>
        </div>

        {categoryLoading ? (
          <div className="text-center text-gray-500">
            Đang tải danh mục con...
          </div>
        ) : (
          validSubcategories.length > 0 &&
          currentCategory.level < 3 && (
            <SubcategoryNav
              subcategories={validSubcategories}
              onSubcategoryClick={handleSubcategoryClick}
              selectedSubcategorySlug={selectedSubcategorySlug}
            />
          )
        )}

        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer whitespace-nowrap"
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

        {showFilters && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-copyright text-blue-500"></i>
                    Thương hiệu
                  </h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedBrand === brand.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-tag text-blue-500"></i>
                    Khoảng giá
                  </h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange === range.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <i className="fas fa-star text-blue-500"></i>
                    Đánh giá
                  </h3>
                  <div className="space-y-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedRating(option.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedRating === option.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
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
                  onClick={handleResetFilters}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {productsContent.length > 0 ? (
            productsContent.map((productData) => (
              <ProductCard
                key={productData.id}
                product={{
                  ...productData,
                  discountType:
                    productData.discountType === "AMOUNT"
                      ? "FIXED_AMOUNT"
                      : productData.discountType,
                }}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">
              Không tìm thấy sản phẩm.
            </div>
          )}
        </div>

        {productsContent.length > 0 &&
          page < paginatedProducts?.totalPages - 1 && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-medium cursor-pointer"
              >
                Xem thêm sản phẩm
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default ProductListing;