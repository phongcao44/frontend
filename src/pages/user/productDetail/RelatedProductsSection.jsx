import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../home/ProductCard";
import { loadRelatedProducts } from "../../../redux/slices/productSlice"; 

const RelatedProductsSection = ({ productId }) => {
  const dispatch = useDispatch();
  const { relatedProducts, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(loadRelatedProducts(productId));
    }
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center mb-7">
          <div className="w-5 h-10 bg-red-500 rounded mr-4" />
          <p className="text-red-500 text-base font-semibold">
            Sản phẩm liên quan
          </p>
        </div>
        <div>Loading related products...</div>
      </div>
    );
  }

  if (error || !relatedProducts?.length) {
    return (
      <div className="mt-12">
        <div className="flex items-center mb-7">
          <div className="w-5 h-10 bg-red-500 rounded mr-4" />
          <p className="text-red-500 text-base font-semibold">
            Sản phẩm liên quan
          </p>
        </div>
        <p className="text-gray-500 text-base">
          Không có sản phẩm liên quan nào được tìm thấy.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center mb-7">
        <div className="w-5 h-10 bg-red-500 rounded mr-4" />
        <p className="text-red-500 text-base font-semibold">
          Sản phẩm liên quan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

RelatedProductsSection.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RelatedProductsSection;