import { useState, useEffect } from "react";
import {
  Card,
  List,
  Image,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Button,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProductDetail } from "../../redux/slices/productSlice";
import { loadColors } from "../../redux/slices/colorSlice";
import { loadSizes } from "../../redux/slices/sizeSlice";
import {
  editProductVariant,
  removeProductVariant,
} from "../../redux/slices/productVariantSlice";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProductDetailPage() {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantForm, setVariantForm] = useState({
    colorId: null,
    sizeId: null,
    price: 0,
    stock: 0,
  });

  const { id: productId } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.productDetail);
  const variants = product?.variants || [];

  const colors = useSelector((state) => state.colors.list);
  const sizes = useSelector((state) => state.size.sizes);

  useEffect(() => {
    if (productId) {
      dispatch(loadProductDetail(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(loadColors());
    dispatch(loadSizes());
  }, [dispatch]);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [variants]);

  useEffect(() => {
    if (selectedVariant) {
      setVariantForm({
        colorId: selectedVariant.color?.id || null,
        sizeId: selectedVariant.size?.id || null,
        price: selectedVariant.price_override || 0,
        stock: selectedVariant.stock_quantity || 0,
      });
    }
  }, [selectedVariant]);

  const handleChange = (key, value) => {
    setVariantForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedVariant) return;

    const payload = {
      id: selectedVariant.id,
      variantData: {
        productId: parseInt(productId),
        colorId: variantForm.colorId,
        sizeId: variantForm.sizeId,
        stockQuantity: variantForm.stock,
        priceOverride: variantForm.price,
      },
    };
    console.log("👉 Save Payload:", payload);

    try {
      await dispatch(editProductVariant(payload)).unwrap();
      message.success("Cập nhật biến thể thành công!");
      dispatch(loadProductDetail(productId));
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi cập nhật biến thể");
    }
  };

  const handleDelete = async () => {
    if (!selectedVariant) return;

    try {
      await dispatch(removeProductVariant(selectedVariant.id)).unwrap();
      message.success("Xóa biến thể thành công!");
      setSelectedVariant(null);
      dispatch(loadProductDetail(productId));
    } catch (err) {
      console.error(err);
      message.error("Xóa biến thể thất bại");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Row gutter={[24, 24]}>
        {/* LEFT COLUMN */}
        <Col xs={24} lg={12}>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={4}>
                <Image
                  width={60}
                  height={60}
                  src={product?.images?.[0]?.image_url}
                  style={{ borderRadius: 8 }}
                />
              </Col>
              <Col span={20}>
                <Title level={4} style={{ margin: 0 }}>
                  {product?.name || "Tên sản phẩm"}
                </Title>
                <Text type="secondary">{product?.description}</Text>
                <br />
                <Text style={{ color: "#1890ff", cursor: "pointer" }}>
                  Xem thêm
                </Text>
              </Col>
            </Row>
          </Card>

          <Card title="Danh sách biến thể" style={{ marginBottom: 16 }}>
            <List
              dataSource={variants}
              renderItem={(item) => (
                <List.Item
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedVariant?.id === item.id ? "#e6f7ff" : "#fff",
                    borderRadius: 4,
                    marginBottom: 8,
                    padding: 12,
                  }}
                  onClick={() => {
                    setSelectedVariant(item);
                  }}
                >
                  <Row gutter={16} align="middle" style={{ width: "100%" }}>
                    <Col span={4}>
                      <PlusOutlined />
                    </Col>
                    <Col span={20}>
                      <Text strong>
                        {item.color?.name || "Chưa có màu"} -{" "}
                        {item.size?.name || "Chưa có size"}
                      </Text>
                      <br />
                      <Text type="secondary">
                        Tồn: {item.stock_quantity || 0}
                      </Text>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* RIGHT COLUMN */}
        <Col xs={24} lg={12}>
          <Card>
            {selectedVariant ? (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <Title level={5}>Thông tin biến thể</Title>
                  <Divider
                    style={{ borderColor: "#d9d9d9", margin: "12px 0" }}
                  />
                </div>

                <div>
                  <Title level={5}>Màu sắc</Title>
                  <Select
                    value={variantForm.colorId}
                    onChange={(value) => handleChange("colorId", value)}
                    style={{ width: "100%" }}
                    placeholder="Chọn màu"
                  >
                    {colors.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Title level={5}>Kích thước</Title>
                  <Select
                    value={variantForm.sizeId}
                    onChange={(value) => handleChange("sizeId", value)}
                    style={{ width: "100%" }}
                    placeholder="Chọn size"
                  >
                    {sizes.map((s) => (
                      <Option key={s.id} value={s.id}>
                        {s.sizeName}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Title level={5}>Giá bán</Title>
                  <InputNumber
                    value={variantForm.price}
                    style={{ width: "100%" }}
                    onChange={(value) => handleChange("price", value)}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    addonAfter="₫"
                  />
                </div>

                <div>
                  <Title level={5}>Số lượng tồn</Title>
                  <InputNumber
                    value={variantForm.stock}
                    style={{ width: "100%" }}
                    onChange={(value) => handleChange("stock", value)}
                  />
                </div>

                <Row gutter={16} style={{ marginTop: 24 }}>
                  <Col span={8}>
                    <Button block onClick={() => setSelectedVariant(null)}>
                      Hủy
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button type="primary" block onClick={handleSave}>
                      Lưu
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Popconfirm
                      title="Bạn có chắc chắn xóa biến thể này?"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={handleDelete}
                    >
                      <Button danger block>
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Space>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Text>Vui lòng chọn 1 biến thể để xem chi tiết</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
