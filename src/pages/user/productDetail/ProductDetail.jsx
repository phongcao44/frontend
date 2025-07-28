import { useEffect, useState } from "react";
import { Row, Col, Breadcrumb } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { trackView } from "../../../redux/slices/productSlice";
import ProductImageGallery from "./ProductImageGallery";
import VariantSelector from "./VariantSelector";
import AddToCart from "./AddToCart";
import DeliveryInfo from "./DeliveryInfo";
import ProductReviews from "./ProductReviews";
import RelatedProductsSection from "./RelatedProductsSection";
import WishlistButton from '../../../components/WishlistButton';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const product = useSelector((state) => state.products.productDetail);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [variantData, setVariantData] = useState({
    matchedVariant: null,
    maxQuantity: 10,
    selectedColorId: null,
    selectedSizeId: null,
  });

  useEffect(() => {
    if (!productId) return;
    const timer = setTimeout(() => {
      dispatch(trackView(productId));
    }, 3000);

    return () => clearTimeout(timer);
  }, [productId, dispatch]);

  return (
    <div className="min-h-screen py-5">
      <div className="container mx-auto">
        <Breadcrumb
          className="mb-6"
          items={[
            { title: "Account" },
            { title: product?.categoryName || "Category" },
            { title: product?.name || "Product" },
          ]}
        />

        <Row gutter={[32, 32]} className="bg-white p-10 rounded-lg">
          <Col lg={15} md={12} sm={24}>
            <ProductImageGallery productId={productId} />
          </Col>

          <Col lg={9} md={12} sm={24}>
            <div>
              <VariantSelector
                productId={productId}
                onVariantChange={setVariantData}
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

        <ProductReviews productId={productId} />

        <RelatedProductsSection relatedProducts={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetail;
