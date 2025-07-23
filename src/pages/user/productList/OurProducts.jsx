import ProductCard from "../home/ProductCard";

const OurProducts = ({
  sortBy,
  toggleFavorite,
  formatPrice,
  getBadgeColor,
}) => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.mergedProducts);

  useEffect(() => {
    dispatch(loadMergedProducts({ page: 0, limit: 8 }));
  }, [dispatch]);

  const products = [
    {
      id: 9,
      name: "Google Pixel 8",
      price: 15000000,
      images: [
        {
          image_url: "https://picsum.photos/seed/pixel/400/400",
          is_main: true,
        },
      ],
      averageRating: 4.5,
      totalReviews: 234,
      sold: 234,
      badge: "New",
      stock: 80,
    },
    {
      id: 10,
      name: "Surface Laptop 5",
      price: 24000000,
      images: [
        {
          image_url: "https://picsum.photos/seed/surface/400/400",
          is_main: true,
        },
      ],
      averageRating: 4.4,
      totalReviews: 156,
      sold: 156,
      badge: "Popular",
      stock: 35,
    },
    {
      id: 11,
      name: "Dell XPS 13",
      price: 26000000,
      images: [
        {
          image_url: "https://picsum.photos/seed/dell/400/400",
          is_main: true,
        },
      ],
      averageRating: 4.6,
      totalReviews: 189,
      sold: 189,
      badge: "Hot",
      stock: 20,
    },
    {
      id: 12,
      name: "Razer Blade 15",
      price: 35000000,
      images: [
        {
          image_url: "https://picsum.photos/seed/razer/400/400",
          is_main: true,
        },
      ],
      averageRating: 4.7,
      totalReviews: 98,
      sold: 98,
      badge: "Gaming",
      stock: 15,
    },
  ];

  const getSortedProducts = () => {
    let sortedProducts = [...products];

    switch (sortBy) {
      case "newest":
        break;
      case "bestselling":
        sortedProducts.sort((a, b) => b.sold - a.sold);
        break;
      case "price-low":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return sortedProducts;
  };

  const currentProducts = getSortedProducts();

  return currentProducts.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      showDiscountLabel={false}
      toggleFavorite={toggleFavorite}
      formatPrice={formatPrice}
      getBadgeColor={getBadgeColor}
    />
  ));
};

export default OurProducts;
