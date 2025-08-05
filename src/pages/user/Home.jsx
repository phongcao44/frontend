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
import FlashSaleListener from "../../components/FlashSaleListener";

const Home = () => {
  const divider = (
    <Divider style={{ borderColor: "#d9d9d9", margin: "32px 0" }} />
  );
  return (
    <>
     <FlashSaleListener />  
    <section style={{ maxWidth: 1200, margin: "auto", padding: 0, paddingBottom: 100, }}>
      <CategoryBanner />
      <FlashSale />

      {divider}
      <CategorySection />

      {divider}
      <BestSelling />

      <Promo />
      <ExploreProducts />

      {divider}
      <NewArrival /> 
    </section>
    </>
  );
};

export default Home;
