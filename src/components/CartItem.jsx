import { ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);

  const totalQuantity = (cart?.items || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        right: 110,
        zIndex: 9999,
        cursor: "pointer",
      }}
      onClick={() => navigate("/cart")}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <ShoppingCartOutlined style={{ fontSize: 36, color: "#1677ff" }} />
        {totalQuantity > 0 && (
          <span style={badgeStyle}>{totalQuantity}</span>
        )}
      </div>
    </div>
  );
};

const badgeStyle = {
  position: "absolute",
  top: -6,
  right: -10,
  backgroundColor: "#ff4d4f",
  color: "white",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: 12,
  fontWeight: "bold",
  lineHeight: "1",
  minWidth: 20,
  textAlign: "center",
  boxShadow: "0 0 0 2px white",
  animation: "badge-pop 0.3s ease-in-out",
};

export default CartIcon;
