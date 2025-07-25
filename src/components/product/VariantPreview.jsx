/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tag, Button, Divider, Checkbox, Modal, InputNumber } from "antd";
import { EditOutlined } from "@ant-design/icons";

const VariantPreview = ({
  variants,
  getAttributeDisplayName,
  colors = [],
  sizes = [],
  onChange,
}) => {
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [checkAll, setCheckAll] = useState(true);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [priceInput, setPriceInput] = useState(null);
  const [quantityInput, setQuantityInput] = useState(null);
  const [variantsData, setVariantsData] = useState([]);
  const [draftVariantsData, setDraftVariantsData] = useState([]);

  const colorMap = Object.fromEntries(colors.map((c) => [c.name, c.id]));
  const sizeMap = Object.fromEntries(sizes.map((s) => [s.sizeName, s.id]));

  useEffect(() => {
    setSelectedVariants(variants.map((_, idx) => idx));
    setCheckAll(true);

    setVariantsData((prev) =>
      variants.map((v) => {
        const exist = prev.find(
          (item) => item.color === v.color && item.size === v.size
        );
        return exist || { ...v, price: 0, quantity: 0 };
      })
    );
  }, [variants]);

  const handleSelectVariant = (index) => {
    const newSelected = selectedVariants.includes(index)
      ? selectedVariants.filter((i) => i !== index)
      : [...selectedVariants, index];

    setSelectedVariants(newSelected);
    setCheckAll(newSelected.length === variants.length);
  };

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setCheckAll(checked);
    setSelectedVariants(checked ? variants.map((_, idx) => idx) : []);
  };

  const openPriceModal = () => {
    setDraftVariantsData([...variantsData]);
    setPriceModalVisible(true);
  };

  const applyPriceToAll = () => {
    if (priceInput === null) return;
    const updated = draftVariantsData.map((v, idx) =>
      selectedVariants.includes(idx) ? { ...v, price: priceInput } : v
    );
    setDraftVariantsData(updated);
  };

  const applyQuantityToAll = () => {
    if (quantityInput === null) return;
    const updated = draftVariantsData.map((v, idx) =>
      selectedVariants.includes(idx) ? { ...v, quantity: quantityInput } : v
    );
    setDraftVariantsData(updated);
  };

  const handleConfirm = () => {
    setVariantsData(draftVariantsData);

    const output = selectedVariants.map((index) => {
      const v = draftVariantsData[index];
      return {
        productId: 0,
        colorId: colorMap[v.color] || 0,
        sizeId: sizeMap[v.size] || 0,
        stockQuantity: v.quantity,
        priceOverride: v.price,
      };
    });

    if (typeof onChange === "function") {
      onChange(output);
    }
    setPriceModalVisible(false);
  };

  return (
    <div
      style={{
        marginTop: 24,
        padding: 16,
        backgroundColor: "#f5f5f5",
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
            {selectedVariants.length}
          </div>
          <span style={{ fontWeight: 500 }}>Biến thể đã chọn</span>
          <Divider type="vertical" />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={openPriceModal}
          >
            Chỉnh sửa biến thể
          </Button>
        </div>

        <Checkbox checked={checkAll} onChange={handleCheckAll}>
          Chọn tất cả
        </Checkbox>
      </div>

      {variants.map((variant, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <Checkbox
              checked={selectedVariants.includes(idx)}
              onChange={() => handleSelectVariant(idx)}
            />
            {Object.entries(variant).map(([key, val]) => (
              <Tag key={key} color="blue">
                {getAttributeDisplayName(key)}: {val}
              </Tag>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Tag color="green">Không chịu thuế</Tag>
            <span style={{ fontWeight: 500 }}>
              {variantsData[idx]
                ? Number(variantsData[idx].price || 0).toLocaleString()
                : 0}{" "}
              VNĐ
            </span>
          </div>
        </div>
      ))}

      <Modal
        title="Chỉnh giá và số lượng"
        open={priceModalVisible}
        onCancel={() => setPriceModalVisible(false)}
        onOk={handleConfirm}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <InputNumber
            placeholder="Áp dụng giá cho toàn bộ biến thể được chọn"
            value={priceInput}
            onChange={setPriceInput}
            style={{ width: "100%" }}
          />
          <Button onClick={applyPriceToAll}>Áp dụng</Button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <InputNumber
            placeholder="Áp dụng số lượng cho toàn bộ biến thể được chọn"
            value={quantityInput}
            onChange={setQuantityInput}
            style={{ width: "100%" }}
          />
          <Button onClick={applyQuantityToAll}>Áp dụng</Button>
        </div>

        {selectedVariants.map((index) => (
          <div
            key={index}
            style={{ marginBottom: 12, borderBottom: "1px solid #eee" }}
          >
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              {Object.entries(draftVariantsData[index] || {})
                .filter(([k]) => k !== "price" && k !== "quantity")
                .map(([, val]) => val)
                .join(" - ")}
            </div>
            <InputNumber
              addonAfter="VND"
              value={draftVariantsData[index]?.price}
              onChange={(val) => {
                const copy = [...draftVariantsData];
                copy[index].price = val;
                setDraftVariantsData(copy);
              }}
              style={{ width: "100%", marginBottom: 4 }}
            />
            <InputNumber
              placeholder="Số lượng"
              value={draftVariantsData[index]?.quantity}
              onChange={(val) => {
                const copy = [...draftVariantsData];
                copy[index].quantity = val;
                setDraftVariantsData(copy);
              }}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default VariantPreview;
