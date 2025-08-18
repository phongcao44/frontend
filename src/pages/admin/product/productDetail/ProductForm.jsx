/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Input,
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
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  addProduct,
  editProduct,
  removeProduct,
  loadProductById,
  clearProductDetail,
} from "../../../../redux/slices/productSlice";
import { addProductVariant } from "../../../../redux/slices/productVariantSlice";
import {
  addProductSpecification,
  getProductSpecificationById,
  editProductSpecification,
  removeProductSpecification,
  clearCurrentProductSpecification,
} from "../../../../redux/slices/productSpecificationSlice";
import {
  getProductImagesByProduct,
  createProductImage,
  removeProductImage,
} from "../../../../redux/slices/productImageSlice";
import ReturnPolicySection from "../policy/ReturnPolicySection";
import VariantSection from "../variant/VariantSection";
import CategorySelector from "../category/CategorySelector";
import VariantEditor from "../variant/VariantEditor";
import ProductSpecificationSection from "../productDetail/ProductSpecificationSection";
import ProductSpecificationEditor from "../productDetail/ProductSpecificationEditor";
import ImageUploadSection from "../images/ImageUploadSection";
import { DownOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

const ProductForm = () => {
  const [fileList, setFileList] = useState([]);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    variants: [],
    returnPolicy: null,
    specifications: [],
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const {
    productDetail: product,
    loading: loadingProduct,
    error: errorProduct,
  } = useSelector((state) => state.products);
  const { loading: loadingPolicy, error: errorPolicy } = useSelector(
    (state) => state.returnPolicy
  );
  const { current: specificationData } = useSelector(
    (state) => state.productSpecification
  );
  const {
    list: productImages,
    loading: loadingImages,
    error: errorImages,
  } = useSelector((state) => state.productImage);

  const stableProduct = useMemo(
    () => product,
    [
      product?.id,
      product?.name,
      product?.description,
      product?.price,
      product?.brand,
      product?.status,
      product?.categoryId,
      product?.returnPolicyId,
      product?.returnPolicyTitle,
      product?.returnPolicyContent,
      JSON.stringify(product?.variants),
    ]
  );
  const stableSpecificationData = useMemo(
    () => specificationData,
    [JSON.stringify(specificationData)]
  );
  const stableProductImages = useMemo(
    () => productImages,
    [JSON.stringify(productImages)]
  );

  useEffect(() => {
    if (productId) {
      // Clear stale detail/spec and reset local images before fetching
      dispatch(clearProductDetail());
      dispatch(clearCurrentProductSpecification());
      setFileList([]);
      // Reset form fields to avoid showing previous product's data while loading
      form.resetFields();

      // Fetch fresh data for the current product
      dispatch(loadProductById(productId));
      dispatch(getProductSpecificationById(productId));
      dispatch(getProductImagesByProduct(productId));
    } else {
      // Creating a new product: reset local state and clear redux detail/spec
      setFileList([]);
      dispatch(clearProductDetail());
      dispatch(clearCurrentProductSpecification());
    }

    return () => {
      // Cleanup on unmount to prevent leaking previous product's data
      dispatch(clearProductDetail());
      dispatch(clearCurrentProductSpecification());
      setFileList([]);
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (!productId) {
      form.resetFields();
      setFormData({
        variants: [],
        returnPolicy: null,
        specifications: [],
      });
      setShippingEnabled(true);
    }
  }, [productId, form]);

  useEffect(() => {
    if (stableProduct && productId) {
      const normalizedSpecs = Array.isArray(stableSpecificationData)
        ? stableSpecificationData.map((spec) => ({
            id: spec.id,
            key: spec.specKey,
            value: spec.specValue,
          }))
        : [];

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          variants: Array.isArray(stableProduct.variants)
            ? stableProduct.variants
            : [],
          returnPolicy: {
            id: stableProduct.returnPolicyId,
            title: stableProduct.returnPolicyTitle,
            content: stableProduct.returnPolicyContent,
          },
          specifications: normalizedSpecs,
        };
        if (JSON.stringify(prev) === JSON.stringify(newFormData)) {
          return prev;
        }
        return newFormData;
      });

      form.setFieldsValue({
        productName: stableProduct.name,
        description: stableProduct.description,
        sellingPrice: stableProduct.price,
        brand: stableProduct.brand,
        category_id: stableProduct.categoryId,
        return_policy_id: stableProduct.returnPolicyId || null,
        specs: normalizedSpecs,
      });
      setShippingEnabled(stableProduct.status === "IN_STOCK");

      // Update fileList only when productImages change
      setFileList((prev) => {
        const newFileList = stableProductImages.map((image, index) => ({
          uid: image.id.toString(),
          name: image.productName || `image-${image.id}`,
          url: image.imageUrl,
          status: "done",
          variantId: image.variantId || null,
          isMain: image.isMain || false,
        }));
        if (JSON.stringify(prev) === JSON.stringify(newFileList)) {
          return prev;
        }
        return newFileList;
      });
    } else {
      // Ensure fileList is reset when there is no productId
      setFileList([]);
    }
  }, [
    stableProduct,
    stableSpecificationData,
    stableProductImages,
    productId,
    form,
  ]);

  const handleVariantsChange = useCallback((variantsData) => {
    setFormData((prev) => {
      const newVariants = Array.isArray(variantsData) ? variantsData : [];
      if (JSON.stringify(prev.variants) === JSON.stringify(newVariants)) {
        return prev;
      }
      return { ...prev, variants: newVariants };
    });
  }, []);

  const handleReturnPolicyChange = useCallback(
    (policy) => {
      setFormData((prev) => {
        if (
          prev.returnPolicy?.id === policy?.id &&
          prev.returnPolicy?.title === policy?.title &&
          prev.returnPolicy?.content === policy?.content
        ) {
          return prev;
        }
        return { ...prev, returnPolicy: policy || null };
      });
      setTimeout(() => {
        form.setFieldsValue({ return_policy_id: policy?.id || null });
      }, 0);
    },
    [form]
  );

  const handleSpecificationChange = useCallback(
    (newSpecs) => {
      setFormData((prev) => {
        const newSpecifications = newSpecs.map((spec) => ({
          id: spec.id,
          key: spec.key || spec.name,
          value: spec.value,
        }));
        if (
          JSON.stringify(prev.specifications) ===
          JSON.stringify(newSpecifications)
        ) {
          return prev;
        }
        return { ...prev, specifications: newSpecifications };
      });
      form.setFieldsValue({ specs: newSpecs });
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (values) => {
      if (isSubmitting) return;
      if (!formData.variants.length) {
        message.error("Vui lòng thêm ít nhất một biến thể sản phẩm");
        return;
      }
      if (!formData.returnPolicy?.id) {
        message.error("Vui lòng chọn một chính sách đổi trả");
        return;
      }
      if (!fileList.length) {
        message.error("Vui lòng thêm ít nhất một hình ảnh sản phẩm");
        return;
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
        setIsSubmitting(true);
        const productResponse = await dispatch(
          addProduct(productData)
        ).unwrap();
        const newProductId = productResponse.data.id;

        console.log("New product created with ID:", newProductId);

        for (const [index, file] of fileList.entries()) {
          if (file.file instanceof File) {
            const formData = new FormData();
            formData.append("image", file.file);
            formData.append("productId", newProductId);
            if (file.variantId) {
              formData.append("variantId", file.variantId);
            }
            formData.append("isMain", index === 0 ? "true" : "false");
            await dispatch(createProductImage(formData)).unwrap();
          }
        }

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

        const normalizedSpecs = formData.specifications
          .map((spec) => ({
            productId: newProductId,
            specKey: spec.key || spec.name,
            specValue: spec.value,
          }))
          .filter((spec) => spec.specKey?.trim() && spec.specValue?.trim());

        for (const spec of normalizedSpecs) {
          await dispatch(addProductSpecification(spec)).unwrap();
        }

        message.success("Thêm sản phẩm thành công!");
        navigate("/admin/products");
      } catch (err) {
        message.error("Thêm sản phẩm thất bại!");
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, navigate, formData, shippingEnabled, fileList, isSubmitting]
  );

  const handleUpdate = useCallback(async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const values = await form.validateFields();
      const currentSpecs = form.getFieldValue("specs") || [];
      if (!formData.variants.length) {
        message.error("Vui lòng thêm ít nhất một biến thể sản phẩm");
        return;
      }
      if (!formData.returnPolicy?.id) {
        message.error("Vui lòng chọn một chính sách đổi trả");
        return;
      }
      if (!fileList.length) {
        message.error("Vui lòng thêm ít nhất một hình ảnh sản phẩm");
        return;
      }

      const updatedProduct = {
        name: values.productName,
        description: values.description || "",
        price: values.sellingPrice || 0,
        brand: values.brand || "",
        status: shippingEnabled ? "IN_STOCK" : "OUT_OF_STOCK",
        categoryId: values.category_id,
        return_policy_id: formData.returnPolicy.id,
      };

      await dispatch(
        editProduct({ id: productId, productData: updatedProduct })
      ).unwrap();

      const existingImageIds = stableProductImages.map((img) => img.id);
      const currentImageIds = fileList
        .map((file) => file.uid)
        .filter((uid) => !uid.includes("-"));

      for (const imageId of existingImageIds) {
        if (!currentImageIds.includes(imageId.toString())) {
          await dispatch(removeProductImage(imageId)).unwrap();
        }
      }

      for (const [index, file] of fileList.entries()) {
        if (file.file instanceof File) {
          const formData = new FormData();
          formData.append("image", file.file);
          formData.append("productId", productId);
          if (file.variantId) {
            formData.append("variantId", file.variantId);
          }
          formData.append("isMain", index === 0);
          await dispatch(createProductImage(formData)).unwrap();
        }
      }

      const existingSpecs = Array.isArray(stableSpecificationData)
        ? stableSpecificationData
        : [];
      const currentSpecIds = currentSpecs.map((s) => s.id).filter(Boolean);
      const existingSpecIds = existingSpecs.map((s) => s.id);

      for (const specId of existingSpecIds) {
        if (!currentSpecIds.includes(specId)) {
          await dispatch(removeProductSpecification(specId)).unwrap();
        }
      }

      for (const spec of currentSpecs) {
        const specData = {
          productId: parseInt(productId),
          specKey: (spec.key || spec.name || "").trim(),
          specValue: (spec.value || "").trim(),
        };

        if (!specData.specKey || !specData.specValue) {
          message.error("Thông số kỹ thuật không được để trống");
          return;
        }

        if (spec.id) {
          await dispatch(
            editProductSpecification({
              id: spec.id,
              requestDTO: specData,
            })
          ).unwrap();
        } else {
          await dispatch(addProductSpecification(specData)).unwrap();
        }
      }

      // Refresh detail/spec/images so UI reflects latest server state without page reload
      dispatch(loadProductById(productId));
      dispatch(getProductSpecificationById(productId));
      dispatch(getProductImagesByProduct(productId));

      message.success("Cập nhật sản phẩm thành công");
    } catch (err) {
      message.error(
        `Cập nhật sản phẩm thất bại: ${err.message || "Không xác định"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dispatch,
    form,
    formData,
    productId,
    shippingEnabled,
    stableSpecificationData,
    stableProductImages,
    fileList,
    isSubmitting,
  ]);

  const handleDelete = useCallback(async () => {
    try {
      await dispatch(removeProduct(productId)).unwrap();
      message.success("Xóa sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      message.error("Xóa sản phẩm thất bại");
    }
  }, [dispatch, navigate, productId]);

  const handleFormSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Row justify="space-between" align="middle">
        <Title level={2} className="mb-6">
          {productId ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm"}
        </Title>
      </Row>

      {(errorProduct || errorPolicy || errorImages) && (
        <Typography.Text type="danger" className="block mb-4 text-red-500">
          {errorProduct || errorPolicy || errorImages}
        </Typography.Text>
      )}

      {(loadingProduct || loadingPolicy || loadingImages) && (
        <div className="text-center mb-6">
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card
          title={
            <div className="flex items-center justify-between">
              <span>Thông tin chung</span>
              <Button
                type="text"
                icon={
                  <DownOutlined
                    style={{
                      transition: "transform 0.2s",
                      transform: `rotate(${isCollapsed ? -180 : 0}deg)`,
                    }}
                  />
                }
                onClick={() => setIsCollapsed(!isCollapsed)}
              />
            </div>
          }
          className="mb-6 shadow-sm"
        >
          {!isCollapsed && (
            <div>
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" className="rounded-md" />
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
                  className="rounded-md"
                  style={{ resize: "none" }}
                />
              </Form.Item>
            </div>
          )}
        </Card>

        <Card title="Giá sản phẩm" className="mb-6 shadow-sm">
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
                  className="w-full rounded-md"
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

        <Card title="Hình ảnh sản phẩm" className="mb-6 shadow-sm">
          <ImageUploadSection fileList={fileList} setFileList={setFileList} />
        </Card>

        <Card title="Vận chuyển" className="mb-6 shadow-sm">
          <Checkbox
            checked={shippingEnabled}
            onChange={(e) => setShippingEnabled(e.target.checked)}
          >
            Cho phép giao hàng với sản phẩm này
          </Checkbox>
        </Card>

        <ReturnPolicySection
          onChange={handleReturnPolicyChange}
          defaultPolicyId={formData.returnPolicy?.id}
          productId={productId}
        />

        {productId && stableProduct && !loadingProduct ? (
          <VariantEditor
            variants={
              Array.isArray(stableProduct.variants)
                ? stableProduct.variants
                : []
            }
            productId={productId}
            onChange={handleVariantsChange}
          />
        ) : (
          <VariantSection
            onChange={handleVariantsChange}
            defaultVariants={formData.variants}
          />
        )}

        {productId && stableProduct && !loadingProduct ? (
          <ProductSpecificationEditor
            form={form}
            specifications={formData.specifications}
            onChange={handleSpecificationChange}
          />
        ) : (
          <ProductSpecificationSection
            onChange={handleSpecificationChange}
            defaultSpecs={formData.specifications}
          />
        )}

        <Space>
          {productId && (
            <Popconfirm
              title="Bạn có chắc muốn xóa sản phẩm này?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={handleDelete}
            >
              <Button danger>Xóa sản phẩm</Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            size="large"
            onClick={productId ? handleUpdate : handleFormSubmit}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {productId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default ProductForm;