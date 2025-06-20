import { Divider } from "antd";
import "swiper/css";
import "swiper/css/pagination";

import {
  categories,
  bestSellingProducts,
  allProducts,
} from "../components/home/data";

import BestSelling from "../components/home/BestSelling";
import Promo from "../components/home/Promo";
import ExploreProducts from "../components/home/ExploreProducts";
import NewArrival from "../components/home/NewArrival";
import CategoryBanner from "../components/home/CategoryBanner";
import FlashSale from "../components/home/FlashSale";
import CategorySection from "../components/home/CategorySection";

const Home = () => {
  const divider = (
    <Divider style={{ borderColor: "#d9d9d9", margin: "32px 0" }} />
  );

  return (
    <section style={{ maxWidth: 1200, margin: "auto", padding: 0 }}>
      <CategoryBanner />
      <FlashSale />

      {divider}
      <CategorySection categories={categories} />

      {divider}
      <BestSelling products={bestSellingProducts} />

      <Promo />
      <ExploreProducts allProducts={allProducts} />

      {divider}
      <NewArrival />
    </section>
  );
};

export default Home;
