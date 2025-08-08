import { Card, Button, Typography } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import ServicesSection from "./ServicesSection";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadNewArrivals } from "../../../redux/slices/productSlice";
import { useNavigate } from "react-router-dom"; 

const { Title, Text } = Typography;

const NewArrival = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const newArrivals = useSelector((state) => state.products.newArrivals);
  const [productCards, setProductCards] = useState([]);

  useEffect(() => {
    dispatch(loadNewArrivals());
  }, [dispatch]);


  useEffect(() => {
    if (newArrivals?.data?.content?.length) {
      const formattedProducts = newArrivals.data.content.map((product) => ({
        id: product.id,
        slug: product.slug,
        title: product.name || "Untitled Product",
        subtitle: product.description || "New Arrival",
        image: product.imageUrl || "default-image-url.jpg",
      }));
      setProductCards(formattedProducts);
    }
  }, [newArrivals]);



  const handleShopNow = (productSlug) => {
    navigate(`/product/${productSlug}`); 
  };

  return (
    <div className="container-fluid py-5">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex align-items-center mb-3">
          <div
            style={{
              width: 20,
              height: 40,
              backgroundColor: "#ff4d4f",
              borderRadius: 4,
              marginRight: 16,
            }}
          />
          <Text
            style={{
              color: "#ff4d4f",
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            Featured
          </Text>
        </div>

        <Title level={2} style={{ marginBottom: 32 }}>
          New Arrival
        </Title>

        {/* Product Layout */}
        <div className="row mb-5" style={{ height: "600px" }}>
          {productCards[0] && (
            <div className="col-lg-6 col-md-12 mb-4 h-100">
              <Card
                className="border-0 position-relative text-white h-100"
                style={{
                  backgroundImage: `url(${productCards[0].image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              >
                <div
                  className="position-absolute bottom-0 start-0 w-100 p-4"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  }}
                >
                  <Title level={3} style={{ color: "white", marginBottom: 8 }}>
                    {productCards[0].title}
                  </Title>
                  <Text
                    style={{ color: "#ccc", display: "block", marginBottom: 16 }}
                  >
                    {productCards[0].subtitle}
                  </Text>
                  <Button
                    type="link"
                    className="p-0 text-white"
                    style={{
                      textDecoration: "underline",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                    onClick={() => handleShopNow(productCards[0].slug)} // Add onClick handler
                  >
                    Shop Now
                  </Button>
                </div>
              </Card>
            </div>
          )}

          <div className="col-lg-6 col-md-12 h-100">
            <div className="row h-100">
              {productCards[1] && (
                <div className="col-12 mb-3" style={{ height: "48%" }}>
                  <Card
                    className="border-0 position-relative text-white h-100"
                    style={{
                      backgroundImage: `url(${productCards[1].image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 12,
                      overflow: "hidden",
                      backgroundColor: "#000",
                    }}
                  >
                    <div
                      className="position-absolute bottom-0 start-0 w-100 p-4"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      }}
                    >
                      <Title
                        level={4}
                        style={{ color: "white", marginBottom: 8 }}
                      >
                        {productCards[1].title}
                      </Title>
                      <Text
                        style={{
                          color: "#ccc",
                          display: "block",
                          marginBottom: 16,
                        }}
                      >
                        {productCards[1].subtitle}
                      </Text>
                      <Button
                        type="link"
                        className="p-0 text-white"
                        style={{
                          textDecoration: "underline",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                        onClick={() => handleShopNow(productCards[1].slug)} // Add onClick handler
                      >
                        Shop Now
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              <div className="col-12" style={{ height: "48%" }}>
                <div className="row h-100">
                  {productCards[2] && (
                    <div className="col-6 pe-2 h-100">
                      <Card
                        className="border-0 position-relative text-white h-100"
                        style={{
                          backgroundImage: `url(${productCards[2].image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: 12,
                          overflow: "hidden",
                          backgroundColor: "#000",
                        }}
                      >
                        <div
                          className="position-absolute bottom-0 start-0 w-100 p-3"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                          }}
                        >
                          <Title
                            level={5}
                            style={{ color: "white", marginBottom: 4 }}
                          >
                            {productCards[2].title}
                          </Title>
                          <Text
                            style={{
                              color: "#ccc",
                              display: "block",
                              marginBottom: 12,
                              fontSize: "12px",
                            }}
                          >
                            {productCards[2].subtitle}
                          </Text>
                          <Button
                            type="link"
                            className="p-0 text-white"
                            style={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                            onClick={() => handleShopNow(productCards[2].slug)} 
                          >
                            Shop Now
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}

                  {productCards[3] && (
                    <div className="col-6 ps-2 h-100">
                      <Card
                        className="border-0 position-relative text-white h-100"
                        style={{
                          backgroundImage: `url(${productCards[3].image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: 12,
                          overflow: "hidden",
                          backgroundColor: "#000",
                        }}
                      >
                        <div
                          className="position-absolute bottom-0 start-0 w-100 p-3"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                          }}
                        >
                          <Title
                            level={5}
                            style={{ color: "white", marginBottom: 4 }}
                          >
                            {productCards[3].title}
                          </Title>
                          <Text
                            style={{
                              color: "#ccc",
                              display: "block",
                              marginBottom: 12,
                              fontSize: "12px",
                            }}
                          >
                            {productCards[3].subtitle}
                          </Text>
                          <Button
                            type="link"
                            className="p-0 text-white"
                            style={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                            onClick={() => handleShopNow(productCards[3].slug)} 
                          >
                            Shop Now
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ServicesSection />

        <div className="position-fixed bottom-0 end-0 m-4">
          <Button
            shape="circle"
            size="large"
            style={{
              backgroundColor: "#f5f5f5",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            icon={<ArrowUpOutlined />}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </div>
      </div>
    </div>
  );
};

export default NewArrival;