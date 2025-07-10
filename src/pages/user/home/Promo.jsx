import { Row, Col, Typography, Button } from "antd";
const { Title, Text } = Typography;

const Promo = () => {
  return (
    <div
      style={{
        background: "#000000",
        borderRadius: 8,
        padding: "60px 48px",
        marginBottom: 48,
        color: "white",
        position: "relative",
        overflow: "hidden",
        minHeight: 300,
      }}
    >
      <Row align="middle" gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ color: "#00ff88", fontSize: 16, fontWeight: 600 }}>
              Categories
            </Text>
          </div>

          <Title
            level={1}
            style={{
              color: "white",
              marginBottom: 32,
              fontSize: 48,
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            Enhance Your
            <br />
            Music Experience
          </Title>

          <div
            style={{
              display: "flex",
              gap: 24,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: 23, label: "Days" },
              { value: 5, label: "Hours" },
              { value: 59, label: "Minutes" },
              { value: 35, label: "Seconds" },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  color: "black",
                  borderRadius: "50%",
                  width: 62,
                  height: 62,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 11 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#00ff88",
              borderColor: "#00ff88",
              color: "black",
              fontWeight: 600,
              height: 56,
              padding: "0 48px",
              fontSize: 16,
              borderRadius: 4,
            }}
          >
            Buy Now!
          </Button>
        </Col>

        <Col xs={24} md={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src="/assets/images/JBL.png"
              alt="JBL Product"
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Promo;
