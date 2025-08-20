import { Typography, Button } from "antd";
import ProductCard from "./ProductCard";
import { useEffect, useState, useRef } from "react";
import { loadProductsPaginate } from "../../../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

// Helper function to sync products with wishlist
const syncProductsWithWishlist = (products, wishlistItems) => {
  if (!products || !wishlistItems) return products;
  
  return products.map(product => ({
    ...product,
    isFavorite: wishlistItems.some(item => item.product?.id === product.id)
  }));
};

const ExploreProducts = () => {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const paginatedProducts = useSelector((state) => state.products.paginated);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [page, setPage] = useState(0);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    const params = { page, limit: 12 };
    dispatch(loadProductsPaginate(params));
  }, [dispatch, page]);

  useEffect(() => {
    if (paginatedProducts?.data?.content) {
      const syncedProducts = syncProductsWithWishlist(paginatedProducts.data.content, wishlistItems);

      setDisplayedProducts((prev) => {
        if (page === 0) return syncedProducts;

        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = syncedProducts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      if (paginatedProducts.data.last) {
        setAllProductsLoaded(true);
      }
    }
  }, [paginatedProducts, wishlistItems]);

  const handleLoadMore = () => {
    if (!paginatedProducts?.data?.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      {/* Section Header Label */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            width: 20,
            height: 40,
            backgroundColor: "#ff4d4f",
            borderRadius: 4,
            marginRight: 16,
          }}
        />
        <Text
          style={{
            color: "#ff4d4f",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          Our Products
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Explore Our Products
        </Title>
      </div>

      <div
        ref={scrollContainerRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          paddingBottom: "16px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {displayedProducts.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        {!allProductsLoaded && (
          <Button
            type="primary"
            danger
            size="large"
            onClick={handleLoadMore}
            style={{
              backgroundColor: "#db4444",
              height: 48,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExploreProducts;
