import { Row, Col, Typography, Button } from "antd";
import { FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadParentCategories } from "../../redux/slices/categorySlice";
import { getBanners } from "../../redux/slices/bannerSlice";

const { Title, Paragraph } = Typography;

const CategoryBanner = () => {
  const dispatch = useDispatch();
  const parentCategories = useSelector((state) => state.category.parentList);
  const { banners } = useSelector((state) => state.banner);

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
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop
          pagination={{ clickable: true }}
          modules={[Pagination]}
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
                  <Paragraph
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      marginBottom: 16,
                    }}
                  >
                    {item.publicId || ""}
                  </Paragraph>
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
      </Col>
    </Row>
  );
};

export default CategoryBanner;
