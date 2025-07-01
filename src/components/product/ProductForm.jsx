import { useState, useEffect } from "react";
import {
  Input,
  Upload,
  InputNumber,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message,
  Checkbox,
  Form,
  Popconfirm,
  Space,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  addProduct,
  editProduct,
  removeProduct,
  loadProductDetail,
} from "../../redux/slices/productSlice";
import {
  addProductVariant,
  removeProductVariant,
} from "../../redux/slices/productVariantSlice";
import VariantSection from "./VariantSection";
import CategorySelector from "./CategorySelector";
import VariantEditor from "./VariantEditor";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const ProductForm = () => {
  const [fileList, setFileList] = useState([]);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({ variants: [] });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const product = useSelector((state) => state.products.productDetail);

  console.log(product);
  const variants = product?.variants || [];

  useEffect(() => {
    if (productId) {
      dispatch(loadProductDetail(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product && productId) {
      form.setFieldsValue({
        productName: product.name,
        description: product.description,
        sellingPrice: product.price,
        brand: product.brand,
        category_id: product.category?.id,
      });
      setShippingEnabled(product.status === "IN_STOCK");
      setFormData((prev) => ({ ...prev, variants: product.variants || [] }));
    }
  }, [product, productId, form]);

  const handleUpload = {
    name: "file",
    multiple: true,
    fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
    beforeUpload: () => false,
  };

  const handleVariantsChange = (variantsData) => {
    setFormData((prev) => ({
      ...prev,
      variants: variantsData,
    }));
  };

  const handleSubmit = async (values) => {
    const productData = {
      name: values.productName,
      description: values.description || "",
      price: values.sellingPrice || 0,
      brand: values.brand || "",
      status: shippingEnabled ? "IN_STOCK" : "OUT_OF_STOCK",
      categoryId: values.category_id,
    };

    try {
      const productResponse = await dispatch(addProduct(productData)).unwrap();
      const newProductId = productResponse.data.id;

      for (const variant of formData.variants) {
        const productVariant = {
          productId: newProductId,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          stockQuantity: variant.stockQuantity,
          priceOverride: variant.priceOverride,
        };
        await dispatch(addProductVariant(productVariant)).unwrap();
      }

      message.success("Thêm sản phẩm thành công");
      navigate(`/admin/products/${newProductId}`);
    } catch (err) {
      console.error(err);
      message.error("Thêm sản phẩm thất bại");
    }
  };

  const handleUpdate = async () => {
    const values = await form.validateFields();
    const updatedProduct = {
      name: values.productName,
      description: values.description || "",
      price: values.sellingPrice || 0,
      brand: values.brand || "",
      status: shippingEnabled ? "IN_STOCK" : "OUT_OF_STOCK",
      categoryId: values.category_id,
    };

    console.log(updatedProduct);

    try {
      await dispatch(
        editProduct({ id: productId, productData: updatedProduct })
      ).unwrap();
      message.success("Cập nhật sản phẩm thành công");
      dispatch(loadProductDetail(productId));
    } catch (err) {
      console.error(err);
      message.error("Cập nhật sản phẩm thất bại");
    }
  };

  const handleDelete = async () => {
    try {
      const variants = product.variants || [];

      if (variants.length > 0) {
        for (const variant of variants) {
          await dispatch(removeProductVariant(variant.id)).unwrap();
        }
      }
      await dispatch(removeProduct(productId)).unwrap();
      message.success("Xóa sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      message.error("Xóa sản phẩm thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Row justify="space-between" align="middle">
        <Title level={2} style={{ marginBottom: 24 }}>
          {productId ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm"}
        </Title>
      </Row>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card title="Thông tin chung" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <CategorySelector form={form} />

          <Form.Item
            label="Mô tả sản phẩm"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả sản phẩm..."
              style={{ resize: "none" }}
            />
          </Form.Item>
        </Card>

        <Card title="Hình ảnh sản phẩm" style={{ marginBottom: 24 }}>
          <Dragger {...handleUpload} style={{ minHeight: 200 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            </p>
            <p className="ant-upload-text">Thêm ảnh</p>
            <p className="ant-upload-hint">Thêm từ URL (Hình ảnh/Video)</p>
          </Dragger>
        </Card>

        <Card title="Giá sản phẩm" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá bán"
                name="sellingPrice"
                rules={[
                  { required: true, message: "Vui lòng nhập giá bán sản phẩm" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|,(?=\d)/g, "")}
                  addonAfter="VND"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Vận chuyển" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={shippingEnabled}
              onChange={(e) => setShippingEnabled(e.target.checked)}
            >
              Cho phép giao hàng với sản phẩm này
            </Checkbox>
          </div>
        </Card>

        {!productId && (
          <VariantSection
            onChange={handleVariantsChange}
            defaultVariants={formData.variants}
          />
        )}

        {productId && (
          <VariantEditor variants={variants} productId={productId} />
        )}

        {!productId && (
          <Button type="primary" size="large" htmlType="submit">
            Lưu sản phẩm
          </Button>
        )}

        {productId && (
          <Space>
            <Popconfirm
              title="Xóa sản phẩm?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={handleDelete}
            >
              <Button danger>Xóa sản phẩm</Button>
            </Popconfirm>

            <Button type="primary" onClick={handleUpdate}>
              Cập nhật sản phẩm
            </Button>
          </Space>
        )}
      </Form>
    </div>
  );
};

export default ProductForm;
