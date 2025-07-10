/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Space, Button, Spin } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";
import FlashCountdown from "./FlashCountdown";
import {
  fetchFlashSales,
  fetchFlashSaleItems,
} from "../../../redux/slices/flashSaleSlice";

const { Title, Text } = Typography;

const FlashSale = () => {
  const dispatch = useDispatch();
  const { flashSales, flashSaleItems, loading } = useSelector(
    (state) => state.flashSale
  );

  const [activeCampaign, setActiveCampaign] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const loadFlashSales = async () => {
      const res = await dispatch(fetchFlashSales()).unwrap();
      const now = new Date();

      const active = res.find((c) => {
        const start = new Date(c.startTime);
        const end = new Date(c.endTime);
        return c.status === "ACTIVE" && start <= now && now <= end;
      });

      if (active) {
        setActiveCampaign(active);
        dispatch(fetchFlashSaleItems(active.id));
      } else {
        setActiveCampaign(null);
      }
    };

    loadFlashSales();
  }, [dispatch]);

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#fff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "40px",
              backgroundColor: "#ff4d4f",
              borderRadius: "4px",
              marginRight: "16px",
            }}
          />
          <Text
            style={{ color: "#ff4d4f", fontSize: "16px", fontWeight: "600" }}
          >
            {"Today's"}
          </Text>
        </div>

        {/* Title + Countdown + Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              flexWrap: "wrap",
              gap: "40px",
            }}
          >
            <Title
              level={2}
              style={{ margin: 0, fontSize: "36px", fontWeight: "600" }}
            >
              Flash Sales
            </Title>
            {activeCampaign && (
              <FlashCountdown endTime={activeCampaign.endTime} />
            )}
          </div>

          <Space>
            <Button
              type="default"
              shape="circle"
              icon={<LeftOutlined />}
              size="middle"
              ref={prevRef}
            />
            <Button
              type="default"
              shape="circle"
              icon={<RightOutlined />}
              size="middle"
              ref={nextRef}
            />
          </Space>
        </div>

        {/* Slider */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Spin size="large" />
          </div>
        ) : flashSaleItems.length > 0 ? (
          <Swiper
            loop={flashSaleItems.length > 4}
            spaceBetween={20}
            slidesPerView={4}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            modules={[Navigation]}
          >
            {flashSaleItems.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    images: product.images,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discountPercentage: product.discountPercentage,
                    discountAmount: product.discountAmount,
                    discountType: product.discountType,
                    averageRating: product.averageRating,
                    totalReviews: product.totalReviews,
                  }}
                  showDiscountLabel
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Title level={4} style={{ marginBottom: "16px" }}>
              Không có Flash Sale nào đang diễn ra!
            </Title>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                window.location.href = "/products";
              }}
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                padding: "12px 32px",
                borderRadius: "4px",
              }}
            >
              Khám phá sản phẩm khác
            </Button>
          </div>
        )}

        {/* View All */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              padding: "12px 48px",
              height: "auto",
              borderRadius: "4px",
            }}
          >
            View All Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
