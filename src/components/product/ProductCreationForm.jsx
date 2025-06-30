import { useState } from "react";
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
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { addProductVariant } from "../../redux/slices/productVariantSlice";
import VariantSection from "./VariantSection";
import CategorySelector from "./CategorySelector";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const ProductCreationForm = () => {
  const [fileList, setFileList] = useState([]);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    variants: [],
  });

  const dispatch = useDispatch();

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

      const productId = productResponse.data.id;
      console.log("Product created with ID:", productId);

      for (const variant of formData.variants) {
        const productVariant = {
          productId: productId,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          stockQuantity: variant.stockQuantity,
          priceOverride: variant.priceOverride,
        };

        // console.log("Product Variant gửi BE:", productVariant);
        await dispatch(addProductVariant(productVariant)).unwrap();
      }
      message.success("Thêm sản phẩm thành công");
    } catch (err) {
      message.error("Thêm sản phẩm thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Tạo sản phẩm
      </Title>

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
                  {
                    required: true,
                    message: "Vui lòng nhập giá bán sản phẩm",
                  },
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
              Chọn để cho phép giao hàng với sản phẩm này
            </Checkbox>
          </div>
        </Card>

        <VariantSection onChange={handleVariantsChange} />

        <Button type="primary" size="large" htmlType="submit">
          Lưu sản phẩm
        </Button>
      </Form>
    </div>
  );
};

export default ProductCreationForm;
