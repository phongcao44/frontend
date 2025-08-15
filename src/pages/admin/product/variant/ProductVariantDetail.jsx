import { useState, useEffect } from "react";
import { Card, List, Image, Typography, Row, Col, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProductById } from "../../../../redux/slices/productSlice";
import { loadColors } from "../../../../redux/slices/colorSlice";
import { loadSizes } from "../../../../redux/slices/sizeSlice";
import {
  editProductVariant,
  removeProductVariant,
  addProductVariant,
} from "../../../../redux/slices/productVariantSlice";
import VariantFormPanel from "../variant/VariantFormPanel";

const { Title, Text } = Typography;

export default function ProductDetailPage() {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantForm, setVariantForm] = useState({
    id: null,
    colorId: null,
    sizeId: null,
    price: 0,
    stock: 0,
    sku: null,
    barcode: null,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) => state.products.productDetail);
  const variants = product?.variants || [];

  const colors = useSelector((state) => state.colors.list);
  const sizes = useSelector((state) => state.size.sizes);

  useEffect(() => {
    if (productId) {
      dispatch(loadProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(loadColors());
    dispatch(loadSizes());
  }, [dispatch]);

  useEffect(() => {
    if (variants.length > 0 && !isAddingNew) {
      setSelectedVariant(variants[0]);
    } else if (!isAddingNew) {
      setSelectedVariant(null);
    }
  }, [variants, isAddingNew]);

  useEffect(() => {
    if (selectedVariant) {
      setVariantForm({
        id: selectedVariant.id,
        colorId: selectedVariant.colorId || null,
        sizeId: selectedVariant.sizeId || null,
        price: selectedVariant.priceOverride || 0,
        stock: selectedVariant.stockQuantity || 0,
        sku: selectedVariant.sku || null,
        barcode: selectedVariant.barcode || null,
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
    if (!selectedVariant && !isAddingNew) return;

    const payload = {
      id: variantForm.id,
      variantData: {
        productId: parseInt(productId),
        colorId: variantForm.colorId,
        sizeId: variantForm.sizeId,
        stockQuantity: variantForm.stock,
        priceOverride: variantForm.price,
      },
    };

    try {
      if (isAddingNew) {
        await dispatch(addProductVariant(payload.variantData)).unwrap();
        message.success("Thêm biến thể mới thành công!");
      } else {
        await dispatch(editProductVariant(payload)).unwrap();
        message.success("Cập nhật biến thể thành công!");
      }
      setIsAddingNew(false);
      dispatch(loadProductById(productId));
    } catch (err) {
      message.error(`Lỗi: ${err.message || "Không xác định"}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedVariant) return;

    // Check if this is the last variant
    if (variants.length <= 1) {
      message.warning("Sản phẩm phải có ít nhất một biến thể!");
      return;
    }

    try {
      await dispatch(removeProductVariant(selectedVariant.id)).unwrap();
      message.success("Xóa biến thể thành công!");
      setSelectedVariant(null);
      dispatch(loadProductById(productId));
    } catch (err) {
      message.error(`Xóa biến thể thất bại: ${err.message || "Không xác định"}`);
    }
  };

  const handleAddVariant = () => {
    setIsAddingNew(true);
    setSelectedVariant(null);
    setVariantForm({
      id: null,
      colorId: null,
      sizeId: null,
      price: 0,
      stock: 0,
      sku: null,
      barcode: null,
    });
  };

  const renderVariantName = (item) => {
    const colorName = item.colorName || null;
    const sizeName = item.sizeName || null;

    if (colorName && sizeName) {
      return `${colorName} - ${sizeName}`;
    } else if (colorName) {
      return colorName;
    } else if (sizeName) {
      return sizeName;
    } else {
      return "Không xác định";
    }
  };

  console.log(product)

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
                  src={
                    product?.imageUrl ||
                    "https://via.placeholder.com/60"
                  }
                  style={{ borderRadius: 8 }}
                />
              </Col>
              <Col span={20}>
                <Title level={4} style={{ margin: 0 }}>
                  {product?.name || "Tên sản phẩm"}
                </Title>
                <Text type="secondary">
                  {product?.description || "Chưa có mô tả"}
                </Text>
                <br />
                <Button
                  type="link"
                  onClick={() => navigate(`/admin/products/${productId}`)}
                >
                  Quay về chi tiết sản phẩm
                </Button>
              </Col>
            </Row>
          </Card>

          <Card
            title="Danh sách biến thể"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddVariant}
              >
                Thêm biến thể
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
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
                    setIsAddingNew(false);
                    setSelectedVariant(item);
                  }}
                >
                  <Row gutter={16} align="middle" style={{ width: "100%" }}>
                    <Col span={20}>
                      <Text strong>{renderVariantName(item)}</Text>
                      <br />
                      <Text type="secondary">
                        ID: {item.id} | SKU: {item.sku || "Không có SKU"}
                      </Text>
                      <br />
                      <Text type="secondary">
                        Tồn: {item.stockQuantity || 0} | Giá: {item.priceOverride?.toLocaleString() || 0} ₫
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
            {selectedVariant || isAddingNew ? (
              <VariantFormPanel
                variantForm={variantForm}
                colors={colors}
                sizes={sizes}
                isEditMode={!isAddingNew}
                onChange={handleChange}
                onCancel={() => {
                  if (isAddingNew) {
                    setIsAddingNew(false);
                  } else {
                    setSelectedVariant(null);
                  }
                }}
                onSave={handleSave}
                onDelete={handleDelete}
                variants={variants}
              />
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