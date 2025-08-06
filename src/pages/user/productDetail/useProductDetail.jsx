import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadProductBySlug, trackView } from "../../../redux/slices/productSlice";
import { loadVariantsByProduct } from "../../../redux/slices/productVariantSlice";
import { getCart } from "../../../redux/slices/cartSlice";
import { getUserWishlist } from "../../../redux/slices/wishlistSlice";

const useProductDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const product = useSelector((state) => state.products.productDetail);
  const { list: variants, loading: variantLoading, error: variantError } = useSelector((state) => state.productVariants);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  // Fetch product by slug
  useEffect(() => {
    if (slug) {
      dispatch(loadProductBySlug(slug));
    }
  }, [dispatch, slug]);

  // Fetch other data using productId
  useEffect(() => {
    if (product?.id) {
      dispatch(getCart());
      dispatch(getUserWishlist());
      dispatch(loadVariantsByProduct(product.id));
    }
  }, [dispatch, product?.id]);

  // Track product view
  useEffect(() => {
    if (product?.id) {
      const timer = setTimeout(() => {
        dispatch(trackView(product.id));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, product?.id]);

  // Memoize valid variants
  const validVariants = useMemo(
    () => variants?.filter((v) => (v.colorId || v.sizeId) && v.stockQuantity > 0) || [],
    [variants]
  );

  // Memoize colors
  const colors = useMemo(
    () => [
      ...new Map(
        validVariants
          .filter((v) => v.colorId && v.colorName)
          .map((v) => [
            v.colorId,
            {
              id: v.colorId,
              name: v.colorName,
              hex_code: v.colorHex || "#000000",
            },
          ])
      ).values(),
    ],
    [validVariants]
  );

  // Memoize sizes
  const sizes = useMemo(
    () => [
      ...new Map(
        validVariants
          .filter((v) => v.sizeId && v.sizeName)
          .map((v) => [
            v.sizeId,
            {
              id: v.sizeId,
              name: v.sizeName,
            },
          ])
      ).values(),
    ],
    [validVariants]
  );

  // Memoize available options
  const getAvailableOptions = (type, selectedValue) => {
    if (type === "size") {
      return sizes.filter((size) =>
        validVariants.some(
          (v) =>
            v.sizeId === size.id &&
            (!selectedValue || v.colorId === selectedValue || !v.colorId) &&
            v.stockQuantity > 0
        )
      ).map((s) => s.id);
    } else {
      return colors.filter((color) =>
        validVariants.some(
          (v) =>
            v.colorId === color.id &&
            (!selectedValue || v.sizeId === selectedValue || !v.sizeId) &&
            v.stockQuantity > 0
        )
      ).map((c) => c.id);
    }
  };

  const availableSizes = useMemo(
    () => getAvailableOptions("size", selectedColorId),
    [sizes, selectedColorId, validVariants]
  );
  const availableColors = useMemo(
    () => getAvailableOptions("color", selectedSizeId),
    [colors, selectedSizeId, validVariants]
  );

  // Memoize matched variant
  const matchedVariant = useMemo(
    () =>
      validVariants.find(
        (v) =>
          (selectedColorId ? v.colorId === selectedColorId : !v.colorId || v.colorId === null) &&
          (selectedSizeId ? v.sizeId === selectedSizeId : !v.sizeId || v.sizeId === null)
      ) || validVariants[0], // Fallback to first valid variant
    [validVariants, selectedColorId, selectedSizeId]
  );

  // Handle color and size selection
  const handleColorClick = (id) => {
    setSelectedColorId((prev) => (prev === id ? null : id));
    if (
      !validVariants.some(
        (v) =>
          v.colorId === id &&
          (selectedSizeId ? v.sizeId === selectedSizeId : !v.sizeId || v.sizeId === null) &&
          v.stockQuantity > 0
      )
    ) {
      setSelectedSizeId(null);
    }
  };

  const handleSizeClick = (id) => {
    setSelectedSizeId((prev) => (prev === id ? null : id));
    if (
      !validVariants.some(
        (v) =>
          v.sizeId === id &&
          (selectedColorId ? v.colorId === selectedColorId : !v.colorId || v.colorId === null) &&
          v.stockQuantity > 0
      )
    ) {
      setSelectedColorId(null);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(
    (item) => {
      const itemProductId = item.productId || item.product?.id;
      return itemProductId == product?.id;
    }
  );

  return {
    product,
    productId: product?.id,
    variantData: {
      matchedVariant,
      maxQuantity: matchedVariant?.stockQuantity ?? 10,
      selectedColorId,
      selectedSizeId,
    },
    handleVariantChange: { handleColorClick, handleSizeClick },
    colors,
    sizes,
    availableColors,
    availableSizes,
    relatedProducts,
    isInWishlist,
    loading: variantLoading,
    error: variantError,
    cart,
  };
};

export default useProductDetail;