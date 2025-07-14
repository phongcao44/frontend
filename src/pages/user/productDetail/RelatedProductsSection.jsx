import PropTypes from "prop-types";
import ProductCard from "../home/ProductCard";

const RelatedProductsSection = ({ relatedProducts }) => {
  //   if (!relatedProducts?.length) return null;

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
  relatedProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RelatedProductsSection;
