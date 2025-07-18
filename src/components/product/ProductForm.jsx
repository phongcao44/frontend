import { useState, useEffect, useCallback } from "react";
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
  Spin,
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
import {
  addProductSpecification,
  getProductSpecificationById,
  removeProductSpecification,
} from "../../redux/slices/productSpecificationSlice";

import { getReturnPolicyById } from "../../redux/slices/returnPolicySlice";
import VariantSection from "./VariantSection";
import CategorySelector from "./CategorySelector";
import VariantEditor from "./VariantEditor";
import ReturnPolicyEditor from "./ReturnPolicyEditor";
import ReturnPolicySection from "./ReturnPolicySection";
import ProductSpecificationSection from "./ProductSpecificationSection";
import ProductSpecificationEditor from "./ProductSpecificationEditor";


const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const ProductForm = () => {
  const [fileList, setFileList] = useState([]);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    variants: [],
    returnPolicy: null,
    specifications: [],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const product = useSelector((state) => state.products.productDetail);
  const returnPolicy = useSelector((state) => state.returnPolicy.policy);
  const loadingProduct = useSelector((state) => state.products.loading);
  const loadingPolicy = useSelector((state) => state.returnPolicy.loading);
  const errorProduct = useSelector((state) => state.products.error);
  const errorPolicy = useSelector((state) => state.returnPolicy.error);
  const { current: specificationData } = useSelector((state) => state.productSpecification);

  console.log(fileList);

  useEffect(() => {
    if (productId) {
      dispatch(loadProductDetail(productId));
      dispatch(getProductSpecificationById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    console.log(product);
    if (productId && product?.returnPolicy?.id) {
      dispatch(getReturnPolicyById(product.returnPolicy.id));
    }
  }, [dispatch, productId, product]);

  useEffect(() => {
    if (specificationData && Array.isArray(specificationData)) {
      setFormData((prev) => ({
        ...prev,
        specifications: specificationData.map((spec) => ({
          id: spec.id,
          key: spec.specKey,
          value: spec.specValue,
        })),
      }));
    }
  }, [specificationData]);

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
      setFormData((prev) => {
        if (
          prev.variants !== product.variants ||
          prev.returnPolicy?.id !== product.returnPolicy?.id
        ) {
          return {
            ...prev,
            variants: Array.isArray(product.variants) ? product.variants : [],
            returnPolicy: product.returnPolicy || null,
          };
        }
        return prev;
      });
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

  const handleVariantsChange = useCallback((variantsData) => {
    setFormData((prev) => ({
      ...prev,
      variants: Array.isArray(variantsData) ? variantsData : [],
    }));
  }, []);

  const handleReturnPolicyChange = useCallback((policy) => {
    setFormData((prev) => {
      console.log("handleReturnPolicyChange", policy);
      const newReturnPolicy = policy || null;
      if (prev.returnPolicy?.id !== newReturnPolicy?.id) {
        return {
          ...prev,
          returnPolicy: newReturnPolicy,
        };
      }
      return prev;
    });
  }, []);

  const handleSpecificationChange = (newSpecs) => {
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (values) => {
    if (!formData.variants || formData.variants.length === 0) {
      message.error("Vui lòng thêm ít nhất một biến thể sản phẩm");
      return;
    }
    if (!formData.returnPolicy?.id) {
      message.error("Vui lòng chọn một chính sách đổi trả");
      return;
    }
    if (!formData.specifications || formData.specifications.length === 0) {
      message.error("Vui lòng chọn một thông số kỹ thuật");
      return
    }

    const productData = {
      name: values.productName,
      description: values.description || "",
      price: values.sellingPrice || 0,
      brand: values.brand || "",
      status: shippingEnabled ? "IN_STOCK" : "OUT_OF_STOCK",
      categoryId: values.category_id,
      return_policy_id: formData.returnPolicy.id,
    };

    try {
      console.log("Submitting product:", productData);
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

      // 2. Chuẩn hoá specifications
      const normalizedSpecs = formData.specifications
        .map((spec) => ({
          productId: newProductId,
          specKey: spec.key || spec.name,
          specValue: spec.value,
        }))
        .filter((spec) => spec.specKey && spec.specValue); // bỏ thông số rỗng

      // 3. Gửi từng specification lên backend
      for (const spec of normalizedSpecs) {
        await dispatch(addProductSpecification(spec)).unwrap();
      }

      message.success("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      message.error("Thêm sản phẩm thất bại!");
    }
  };

  const handleUpdate = async () => {
    const values = await form.validateFields();
    if (!formData.variants || formData.variants.length === 0) {
      message.error("Vui lòng thêm ít nhất một biến thể sản phẩm");
      return;
    }
    if (!formData.returnPolicy?.id) {
      message.error("Vui lòng chọn một chính sách đổi trả");
      return;
    }
    // if (!formData.specifications || formData.specifications.length == 0) {
    //   message.error("Vui lòng thêm ít nhất một thông số kỹ thuật");
    //   return;
    // }

    const updatedProduct = {
      name: values.productName,
      description: values.description || "",
      price: values.sellingPrice || 0,
      brand: values.brand || "",
      status: shippingEnabled ? "IN_STOCK" : "OUT_OF_STOCK",
      categoryId: values.category_id,
      return_policy_id: formData.returnPolicy.id,
    };

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
    const variants = Array.isArray(product?.variants) ? product.variants : [];

    // Xoá tất cả biến thể sản phẩm
    if (variants.length > 0) {
      for (const variant of variants) {
        await dispatch(removeProductVariant(variant.id)).unwrap();
      }
    }

    // Xoá tất cả thông số kỹ thuật (ProductSpecification)
    if (Array.isArray(specificationData) && specificationData.length > 0) {
      for (const spec of specificationData) {
        await dispatch(removeProductSpecification(spec.id)).unwrap();
      }
    }

    // Xoá sản phẩm
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

      {(errorProduct || errorPolicy) && (
        <div style={{ marginBottom: 16 }}>
          <Typography.Text type="danger">
            {errorProduct
              ? `Lỗi khi tải sản phẩm: ${errorProduct}`
              : `Lỗi khi tải chính sách: ${errorPolicy}`}
          </Typography.Text>
        </div>
      )}

      {(loadingProduct || loadingPolicy) && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      )}

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
          <ReturnPolicySection
            onChange={handleReturnPolicyChange}
            defaultPolicyId={formData.returnPolicy?.id}
          />
        )}

        {productId && product && !loadingProduct && !loadingPolicy && (
          <ReturnPolicyEditor
            returnPolicy={formData.returnPolicy}
            productId={productId}
            onChange={handleReturnPolicyChange}
          />
        )}

        {!productId && (
          <VariantSection
            onChange={handleVariantsChange}
            defaultVariants={formData.variants}
          />
        )}

        {productId && product && !loadingProduct && (
          <VariantEditor
            variants={Array.isArray(product.variants) ? product.variants : []}
            productId={productId}
          />
        )}

        {!productId && (
          <ProductSpecificationSection
            onChange={handleSpecificationChange}
            defaultSpecs={formData.specifications}
          />
        )}

        {productId && product && !loadingProduct && (
          <ProductSpecificationEditor
            specifications={formData.specifications}
            onChange={(updated) =>
              setFormData((prev) => ({ ...prev, specifications: updated }))
            }
          />
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
