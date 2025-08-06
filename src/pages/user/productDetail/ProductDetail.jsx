import { Row, Col, Breadcrumb } from "antd";
import useProductDetail from "./useProductDetail";
import ProductImageGallery from "./ProductImageGallery";
import VariantSelector from "./VariantSelector";
import AddToCart from "./AddToCart";
import DeliveryInfo from "./DeliveryInfo";
import ProductTabs from "./ProductTabs";
import WishlistButton from "../../../components/WishlistButton";
import RelatedProductsSection from "./RelatedProductsSection"; // Import the RelatedProductsSection component

const ProductDetail = () => {
  const {
    product,
    productId,
    variantData,
    handleVariantChange,
    colors,
    sizes,
    availableColors,
    availableSizes,
    relatedProducts,
    isInWishlist,
    loading,
    error,
  } = useProductDetail();

  if (loading) {
    return <div className="text-center text-gray-600">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!product || !productId) {
    return <div className="text-center text-gray-600">Product not found</div>;
  }

  return (
    <div className="min-h-screen py-5">
      <div className="container mx-auto">
        <Breadcrumb
          className="mb-6"
          items={[
            { title: "Account" },
            { title: product.categoryName || "Category" },
            { title: product.name || "Product" },
          ]}
        />

        <Row gutter={[32, 32]} className="bg-white p-10 rounded-lg">
          <Col lg={15} md={12} sm={24}>
            <ProductImageGallery productId={productId} />
          </Col>

          <Col lg={9} md={12} sm={24}>
            <div>
              <VariantSelector
                variantData={variantData}
                handleColorClick={handleVariantChange.handleColorClick}
                handleSizeClick={handleVariantChange.handleSizeClick}
                colors={colors}
                sizes={sizes}
                availableColors={availableColors}
                availableSizes={availableSizes}
              />
              <AddToCart
                productId={productId}
                matchedVariant={variantData.matchedVariant}
                maxQuantity={variantData.maxQuantity}
                selectedColorId={variantData.selectedColorId}
                selectedSizeId={variantData.selectedSizeId}
              />
              <DeliveryInfo />
            </div>
          </Col>
        </Row>

        {/* Product Tabs */}
        <ProductTabs productId={productId} product={product} />

        {/* Related Products Section */}
        <RelatedProductsSection productId={productId} />
      </div>
    </div>
  );
};

export default ProductDetail;