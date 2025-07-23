import { Divider } from "antd";
import "swiper/css";
import "swiper/css/pagination";

import BestSelling from "./home/BestSelling";
import Promo from "./home/Promo";
import ExploreProducts from "./home/ExploreProducts";
import NewArrival from "./home/NewArrival";
import CategoryBanner from "./home/CategoryBanner";
import FlashSale from "./home/FlashSale";
import CategorySection from "./home/CategorySection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadMergedProducts } from "../../redux/slices/productSlice";

const Home = () => {
  const divider = (
    <Divider style={{ borderColor: "#d9d9d9", margin: "32px 0" }} />
  );

  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.mergedProducts);

  useEffect(() => {
    dispatch(loadMergedProducts({ page: 0, limit: 8 }));
  }, [dispatch]);

  return (
    <section style={{ maxWidth: 1200, margin: "auto", padding: 0 }}>
      <CategoryBanner />
      <FlashSale />

      {divider}
      <CategorySection />

      {divider}
      <BestSelling />

      <Promo />
      <ExploreProducts allProducts={allProducts} />

      {divider}
      <NewArrival />
    </section>
  );
};

export default Home;
