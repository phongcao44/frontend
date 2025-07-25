/* eslint-disable react/prop-types */
import { Tag } from "antd";
import { useNavigate } from "react-router-dom";

const VariantEditor = ({ variants, productId }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        marginTop: 24,
        marginBottom: 24,
        padding: 16,
        borderRadius: 6,
        border: "1px solid #e8e8e8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#722ed1",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            {variants.length}
          </div>
          <span
            onClick={() => navigate(`/admin/products/${productId}/variant`)}
            style={{ fontWeight: 500 }}
          >
            Biến thể
          </span>
        </div>
      </div>

      {variants.map((variant, idx) => (
        <div
          key={variant.id || idx}
          onClick={() => navigate(`/admin/products/${productId}/variant`)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {variant.colorName && (
              <Tag color="blue">Màu sắc: {variant.colorName}</Tag>
            )}
            {variant.sizeName && (
              <Tag color="purple">Kích thước: {variant.sizeName}</Tag>
            )}
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Tag color="green">Số lượng: {variant.stockQuantity || 0}</Tag>
            <span style={{ fontWeight: 500 }}>
              {variant.priceOverride?.toLocaleString()} ₫
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantEditor;
