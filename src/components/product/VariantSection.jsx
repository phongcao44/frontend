/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  Row,
  Col,
  Select,
  Input,
  Button,
  Modal,
  message,
} from "antd";
import { DeleteOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loadColors, createColor } from "../../redux/slices/colorSlice";
import { loadSizes, createSize } from "../../redux/slices/sizeSlice";
import VariantPreview from "./VariantPreview";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const VariantSection = ({ onChange }) => {
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.colors.list);
  const sizes = useSelector((state) => state.size.sizes);

  const [hasVariants, setHasVariants] = useState(false);
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });
  const [newSize, setNewSize] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(loadColors());
    dispatch(loadSizes());
  }, [dispatch]);

  useEffect(() => {
    if (hasVariants && variantAttributes.length === 0) {
      addAttribute();
    }
  }, [hasVariants]);

  const predefinedAttributeValues = {
    color: colors.map((color) => ({
      label: `${color.name} (${color.hexCode})`,
      value: color.name,
    })),
    size: sizes.map((size) => ({
      label: `${size.sizeName} (${size.description})`,
      value: size.sizeName,
    })),
  };

  const getAttributeDisplayName = (attr) => {
    switch (attr) {
      case "color":
        return "Màu sắc";
      case "size":
        return "Kích thước";
      default:
        return attr;
    }
  };

  const getAvailableAttributes = (index) => {
    const selected = variantAttributes.map((a) => a.name);
    const current = selected[index];
    return Object.keys(predefinedAttributeValues).filter(
      (opt) => opt === current || !selected.includes(opt)
    );
  };

  const updateAttributeName = (index, name) => {
    const updated = [...variantAttributes];
    updated[index].name = name;
    updated[index].values = [];
    updated[index].newValue = "";
    setVariantAttributes(updated);
  };

  const updateNewValue = (index, value) => {
    const updated = [...variantAttributes];
    updated[index].newValue = value;
    setVariantAttributes(updated);
  };

  const addValue = (index) => {
    const updated = [...variantAttributes];
    const newValue = updated[index].newValue?.trim();
    if (newValue && !updated[index].values.includes(newValue)) {
      updated[index].values.push(newValue);
      updated[index].newValue = "";
      setVariantAttributes(updated);
    }
  };

  const removeValue = (attrIndex, valueIndex) => {
    const updated = [...variantAttributes];
    updated[attrIndex].values.splice(valueIndex, 1);
    setVariantAttributes(updated);
  };

  const removeAttribute = (index) => {
    const updated = [...variantAttributes];
    updated.splice(index, 1);
    setVariantAttributes(updated);
  };

  const addAttribute = () => {
    setVariantAttributes((prev) => [
      ...prev,
      { name: "", values: [], newValue: "" },
    ]);
  };

  const buildVariants = () => {
    if (!variantAttributes.length) return [];
    const combine = (attrs, index = 0, acc = {}) => {
      if (index === attrs.length) return [acc];
      const res = [];
      const { name, values } = attrs[index];
      for (const v of values) {
        res.push(...combine(attrs, index + 1, { ...acc, [name]: v }));
      }
      return res;
    };
    return combine(variantAttributes);
  };

  const variants = buildVariants();

  return (
    <Card title="Biến thể" style={{ marginBottom: 24 }}>
      <Checkbox
        checked={hasVariants}
        onChange={(e) => setHasVariants(e.target.checked)}
        style={{ marginBottom: 16 }}
      >
        Sản phẩm này có nhiều biến thể. Ví dụ như kích thước, màu sắc.
      </Checkbox>

      {hasVariants && (
        <>
          {variantAttributes.map((attr, index) => (
            <div key={index} style={{ marginBottom: 24 }}>
              <Row gutter={[16, 8]}>
                <Col span={6}>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>
                    Thuộc tính
                  </div>
                  <Select
                    style={{ width: "100%" }}
                    value={attr.name || undefined}
                    onChange={(value) => updateAttributeName(index, value)}
                    placeholder="Chọn thuộc tính"
                    suffixIcon={<DownOutlined />}
                  >
                    {getAvailableAttributes(index).map((option) => (
                      <Option key={option} value={option}>
                        {getAttributeDisplayName(option)}
                      </Option>
                    ))}
                  </Select>
                </Col>

                <Col span={16}>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>
                    Giá trị
                  </div>
                  <div
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: 6,
                      padding: 12,
                      backgroundColor: "#fafafa",
                      minHeight: 120,
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {attr.values.map((value, vIdx) => (
                        <div
                          key={vIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            padding: "4px 8px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <span>{value}</span>
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            size="small"
                            onClick={() => removeValue(index, vIdx)}
                          />
                        </div>
                      ))}
                    </div>

                    <Select
                      mode="multiple"
                      style={{ width: "100%", marginTop: 12 }}
                      placeholder="Chọn giá trị có sẵn"
                      value={[]}
                      onChange={(vals) => {
                        const updated = [...variantAttributes];
                        const newVals = vals.filter(
                          (v) => !updated[index].values.includes(v)
                        );
                        updated[index].values.push(...newVals);
                        setVariantAttributes(updated);
                      }}
                      options={predefinedAttributeValues[attr.name] || []}
                    />

                    {attr.name === "color" && (
                      <Button
                        type="link"
                        onClick={() => setColorModalVisible(true)}
                        style={{ marginTop: 8 }}
                      >
                        + Thêm màu mới
                      </Button>
                    )}
                    {attr.name === "size" && (
                      <Button
                        type="link"
                        onClick={() => setSizeModalVisible(true)}
                        style={{ marginTop: 8 }}
                      >
                        + Thêm kích thước mới
                      </Button>
                    )}
                  </div>
                </Col>

                <Col span={2} style={{ textAlign: "right", paddingTop: 28 }}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    type="text"
                    onClick={() => removeAttribute(index)}
                  />
                </Col>
              </Row>
            </div>
          ))}

          {variantAttributes.length <
            Object.keys(predefinedAttributeValues).length && (
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={addAttribute}
              style={{ marginBottom: 16 }}
            >
              Thêm thuộc tính khác
            </Button>
          )}

          <VariantPreview
            variants={variants}
            getAttributeDisplayName={getAttributeDisplayName}
            colors={colors}
            sizes={sizes}
            onChange={onChange}
          />

          <Modal
            title="Thêm màu mới"
            open={colorModalVisible}
            onOk={async () => {
              let name = newColor.name?.trim();
              const hexCode = newColor.hexCode;

              if (!name) {
                name = `Auto Color ${hexCode}`;
              }

              const newColorObj = { name, hexCode };

              console.log("Màu mới:", newColorObj);

              try {
                await dispatch(createColor(newColorObj)).unwrap();
                message.success("Đã thêm màu mới");

                setVariantAttributes((prev) => {
                  const updated = [...prev];
                  const colorAttr = updated.find((a) => a.name === "color");
                  if (colorAttr && !colorAttr.values.includes(name)) {
                    colorAttr.values.push(name);
                  }
                  return updated;
                });
              } catch (err) {
                message.error("Thêm màu thất bại");
                console.error(err);
              }

              setColorModalVisible(false);
              setNewColor({ name: "", hexCode: "#000000" });
            }}
            onCancel={() => setColorModalVisible(false)}
          >
            <Input
              placeholder="Tên màu"
              value={newColor.name}
              onChange={(e) =>
                setNewColor((c) => ({ ...c, name: e.target.value }))
              }
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Mã màu (ví dụ: #ff0000)"
              value={newColor.hexCode}
              onChange={(e) =>
                setNewColor((c) => ({ ...c, hexCode: e.target.value }))
              }
              style={{ marginBottom: 12 }}
            />
            <Input
              type="color"
              value={newColor.hexCode}
              onChange={(e) =>
                setNewColor((c) => ({ ...c, hexCode: e.target.value }))
              }
            />
          </Modal>

          <Modal
            title="Thêm kích thước mới"
            open={sizeModalVisible}
            onOk={async () => {
              const { name, description } = newSize;

              if (!name.trim()) {
                message.warning("Vui lòng nhập tên kích thước");
                return;
              }

              try {
                const added = await dispatch(
                  createSize({ sizeName: name, description })
                ).unwrap();

                message.success("Đã thêm kích thước mới");

                setVariantAttributes((prev) => {
                  const updated = [...prev];
                  const sizeAttr = updated.find((a) => a.name === "size");
                  if (sizeAttr && !sizeAttr.values.includes(added.sizeName)) {
                    sizeAttr.values.push(added.sizeName);
                  }
                  return updated;
                });
              } catch (err) {
                message.error("Thêm kích thước thất bại");
                console.error(err);
              }

              setSizeModalVisible(false);
              setNewSize({ name: "", description: "" });
            }}
            onCancel={() => setSizeModalVisible(false)}
          >
            <Input
              placeholder="Tên kích thước"
              value={newSize.name}
              onChange={(e) =>
                setNewSize((s) => ({ ...s, name: e.target.value }))
              }
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Mô tả"
              value={newSize.description}
              onChange={(e) =>
                setNewSize((s) => ({ ...s, description: e.target.value }))
              }
            />
          </Modal>
        </>
      )}
    </Card>
  );
};

export default VariantSection;
