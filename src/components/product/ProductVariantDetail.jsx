import { useState, useEffect } from "react";
import { Card, List, Image, Typography, Row, Col, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProductDetail } from "../../redux/slices/productSlice";
import { loadColors } from "../../redux/slices/colorSlice";
import { loadSizes } from "../../redux/slices/sizeSlice";
import {
  editProductVariant,
  removeProductVariant,
  addProductVariant,
} from "../../redux/slices/productVariantSlice";
import VariantFormPanel from "./VariantFormPanel";

const { Title, Text } = Typography;

export default function ProductDetailPage() {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantForm, setVariantForm] = useState({
    colorId: null,
    sizeId: null,
    price: 0,
    stock: 0,
    customAttributes: [],
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
      dispatch(loadProductDetail(productId));
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

  const handleAddVariant = () => {
    setIsAddingNew(true);
    setSelectedVariant(null);
    setVariantForm({
      colorId: null,
      sizeId: null,
      price: 0,
      stock: 0,
    });
  };

  const handleCreate = async () => {
    const payload = {
      productId: parseInt(productId),
      colorId: variantForm.colorId,
      sizeId: variantForm.sizeId,
      stockQuantity: variantForm.stock,
      priceOverride: variantForm.price,
    };

    try {
      await dispatch(addProductVariant(payload)).unwrap();
      message.success("Thêm biến thể mới thành công!");
      setIsAddingNew(false);
      dispatch(loadProductDetail(productId));
    } catch (err) {
      console.error(err);
      message.error("Thêm biến thể thất bại");
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
                onSave={() => {
                  if (isAddingNew) {
                    handleCreate();
                  } else {
                    handleSave();
                  }
                }}
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
