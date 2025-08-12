import React, { useEffect } from "react";
import { Layout, Typography, Spin, Card, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../../redux/slices/dashboardSlice";
import { RevenueChart } from "./Dashboard"; // import chart từ cùng thư mục
import RevenueChartCombined from "./RevenueChartCombined";
import { loadTopBestSellingProducts } from "../../../redux/slices/productSlice";



const { Header, Content } = Layout;
const { Title } = Typography;

const Revenue = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { topBestSelling } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    // Fetch top best-selling products for admin section
    dispatch(loadTopBestSellingProducts());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <Layout>
        <Content style={{ padding: 24 }}>
          <Spin tip="Đang tải dữ liệu..." />
        </Content>
      </Layout>
    );

  }

  const cards = [
    { title: "Tổng Doanh Thu", value: stats.totalRevenue.toLocaleString() + " đ" },
    { title: "Tổng Đơn Hàng", value: stats.totalOrders },
    { title: "Đơn Hàng Đã Giao", value: stats.totalDelivered },
    { title: "Người Dùng", value: stats.totalCustomers },
    { title: "Sản Phẩm", value: stats.totalProducts },
  ];

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #eee",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Thống Kê Doanh Thu
        </Title>
      </Header>
      <Content style={{ padding: 24 }}>

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: 24 }}>
          {cards.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
              <Card
                bordered={false}
                style={{
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "24px 12px",
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 14, marginTop: 8 }}>
                  {item.title}
                </div>
              </Card>
            </Col>
          ))}
        </Row>


        {/* Biểu đồ doanh thu theo ngày/tháng */}
        <div style={{ marginTop: 32 }}>
          <RevenueChartCombined />
        </div>

        {/* Biểu đồ dashboard tổng (nếu có) */}
        {stats.revenueByDay?.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <RevenueChart data={stats.revenueByDay} />
          </div>
        )}


        {/* Top 5 sản phẩm bán chạy */}
        {topBestSelling?.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <Title level={4} style={{ marginBottom: 24 }}>Top 5 Sản Phẩm Bán Chạy</Title>
            <Row gutter={[24, 24]} justify="center" align="stretch">
              {topBestSelling.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
                  <Card
  hoverable
  style={{
    height: "100%", // giúp các card bằng chiều cao nhau
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
  cover={
  <div
    style={{
      height: 180,
      backgroundColor: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderBottom: "1px solid #f0f0f0",
    }}
  >
    <img
      src={product.imageUrl}
      alt={product.name}
      style={{
        maxHeight: "100%",
        maxWidth: "200%",
        objectFit: "contain",
      }}
    />
  </div>
}
>
  <div
  style={{
    padding: "12px 8px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center", 
  }}
>

    <div>
      <Title level={5} style={{ marginBottom: 6 }}>{product.name}</Title>
      <div style={{ color: "#fa8c16", fontWeight: 600, marginBottom: 4 }}>
        Giá: {product.price?.toLocaleString()} VND
      </div>
    </div>
    <div style={{ color: "#52c41a", fontWeight: 500, marginTop: "auto" }}>
      Đã Bán: {product.soldQuantity} Sản Phẩm
    </div>
  </div>
</Card>

                </Col>
              ))}
            </Row>
          </div>
        )}


      </Content>
    </Layout>
  );
};

export default Revenue;
