import { Row, Col, Typography, Button } from "antd";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadParentCategories } from "../../../redux/slices/categorySlice";
import { getBanners } from "../../../redux/slices/bannerSlice";

const { Title } = Typography;

const CategoryBanner = () => {
  const dispatch = useDispatch();
  const parentCategories = useSelector((state) => state.category.parentList);
  const { banners } = useSelector((state) => state.banner);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  useEffect(() => {
    if (parentCategories.length === 0) {
      dispatch(loadParentCategories());
    }
  }, [dispatch, parentCategories.length]);

  const now = new Date();
  const activeBanners = banners.filter(
    (b) => b.status && new Date(b.startAt) <= now && new Date(b.endAt) >= now
  );

  const showNav = activeBanners.length > 1;

  return (
    <Row gutter={[24, 24]}>
      {/* Category List */}
      <Col
        xs={24}
        md={5}
        style={{
          borderRight: "1px solid #d9d9d9",
          minHeight: "300px",
        }}
      >
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {parentCategories.map((cat) => (
            <li
              key={cat.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 12px",
                fontSize: "14px",
                color: "#333",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span>{cat.name}</span>
              <FaChevronRight style={{ fontSize: "12px", color: "#999" }} />
            </li>
          ))}
        </ul>
      </Col>

      {/* Banner */}
      <Col xs={24} md={19}>
        <div style={{ position: "relative" }}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            loop={activeBanners.length > 1}
            pagination={{
              clickable: true,
              dynamicBullets: true, // tự động thu gọn
              dynamicMainBullets: 5, // hiển thị tối đa 5 chấm
            }}
            navigation={
              showNav
                ? {
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }
                : false
            }
            onInit={(swiper) => {
              if (showNav) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }}
            style={{ overflow: "hidden", padding: "16px 0px 16px 16px" }}
          >
            {activeBanners.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 300,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.75,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      padding: "0 40px",
                    }}
                  >
                    <Title
                      level={2}
                      style={{
                        color: "#fff",
                        fontSize: "32px",
                        fontWeight: "bold",
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </Title>
                    <Button
                      type="primary"
                      size="middle"
                      style={{
                        backgroundColor: "#ff4d4f",
                        border: "none",
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Nav Buttons */}
          {showNav && (
            <>
              <div
                ref={prevRef}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "32px",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "all 0.3s ease",
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                  e.currentTarget.style.opacity = "0.7";
                }}
              >
                <FaChevronLeft style={{ color: "#fff", fontSize: "16px" }} />
              </div>

              <div
                ref={nextRef}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "32px",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "all 0.3s ease",
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                  e.currentTarget.style.opacity = "0.7";
                }}
              >
                <FaChevronRight style={{ color: "#fff", fontSize: "16px" }} />
              </div>
            </>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default CategoryBanner;
