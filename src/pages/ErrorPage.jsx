import { Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headingSize =
    screenWidth > 1024 ? "120px" : screenWidth > 768 ? "90px" : "60px";

  const paragraphSize = screenWidth > 768 ? "18px" : "16px";

  const buttonPadding = screenWidth > 768 ? "16px 32px" : "12px 24px";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: 1200,
        margin: "auto",
        padding: "0 20px",
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ margin: "24px 0" }}
        items={[
          {
            title: <Link to="/">Home</Link>,
          },
          {
            title: "404 Error",
          },
        ]}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: headingSize,
              fontWeight: "700",
              color: "#000",
              margin: "0 0 32px 0",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
            }}
          >
            404 Not Found
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: paragraphSize,
              marginBottom: "48px",
              lineHeight: "1.6",
            }}
          >
            The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: buttonPadding,
              backgroundColor: "#dc4446",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(220, 68, 70, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c13e40";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(220, 68, 70, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#dc4446";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(220, 68, 70, 0.3)";
            }}
          >
            Back to home page
          </button>
        </div>
      </div>

      <div style={{ height: "64px" }}></div>
    </div>
  );
};

export default ErrorPage;
