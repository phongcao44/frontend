import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { handleDownloadPDF } from "../../services/handleDownloadPDF";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
  Avatar,
  Badge,
  Spin,
  Alert,
  message,
  Select,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import {
  loadOrderDetail,
  clearCurrentOrder,
  editOrderStatus,
} from "../../redux/slices/orderSlice";

const { Text } = Typography;
const { Option } = Select;

export default function OrderDetail() {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    dispatch(loadOrderDetail(Number(orderId)));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    // Set default status to current order status
    if (currentOrder?.status) {
      setSelectedStatus(currentOrder.status);
    }
  }, [currentOrder]);

  const handleStatusChange = async () => {
    if (!selectedStatus) {
      message.warning("Vui lòng chọn trạng thái");
      return;
    }
    try {
      await dispatch(
        editOrderStatus({
          id: currentOrder.orderId,
          status: selectedStatus,
        })
      ).unwrap();
      message.success(`Đã cập nhật trạng thái đơn hàng thành ${translateStatus(selectedStatus)}`);
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Lỗi"
          description={
            typeof error === "string"
              ? error
              : error.message || "Không thể tải dữ liệu đơn hàng."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Không tìm thấy đơn hàng"
          description={`Không tìm thấy đơn hàng với ID ${orderId}.`}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "processing";
      case "SHIPPED":
        return "cyan";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPED":
        return "Đã gửi hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không rõ";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  const translatePaymentStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ thanh toán";
      case "COMPLETED":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return "Không rõ";
    }
  };

  const getFulfillmentColor = (status) => {
    switch (status) {
      case "SHIPPED":
      case "DELIVERED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const translateFulfillmentStatus = (status) => {
    switch (status) {
      case "SHIPPED":
        return "Đã gửi hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "PENDING":
        return "Chờ giao hàng";
      case "CANCELLED":
        return "Đã hủy giao hàng";
      default:
        return "Không rõ";
    }
  };

  const translatePaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "CARD":
        return "Thẻ tín dụng/Thẻ ghi nợ";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      case "MOBILE_PAYMENT":
        return "Thanh toán qua ứng dụng di động";
      default:
        return "Không xác định";
    }
  };

  const subTotal = (currentOrder.items || []).reduce(
    (sum, item) => sum + Number(item.totalPrice),
    0
  );
  const discountAmount = currentOrder.voucher
    ? Number(currentOrder.voucher.discountAmount) || 0
    : 0;
  const shippingFee = 30000;
  const totalAmount = subTotal - discountAmount + shippingFee;

  const productData = (currentOrder.items || []).map((item, index) => ({
    key: String(index + 1),
    product: {
      image:
        (item.images || []).find((img) => img.is_main)?.image_url ||
        item.images?.[0]?.image_url ||
        "/api/placeholder/40/40",
      name: item.productName,
      sku: `SKU-${item.productId}-${item.variantId}`,
      variant: `Size ${item.size?.name || ""} - Màu ${item.color?.name || ""}`,
    },
    quantity: item.quantity,
    price: Number(item.price),
    total: Number(item.totalPrice),
  }));

  const productColumns = [
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Thành tiền (VNĐ)",
      dataIndex: "total",
      key: "total",
      width: 150,
      align: "right",
      render: (total) => `${total.toLocaleString()} VND`,
    },
  ];

  const expandedRowRender = (record) => (
    <Row gutter={16} style={{ padding: "8px 24px" }}>
      <Col>
        <Avatar
          src={record.product.image}
          size={40}
          shape="square"
          style={{ backgroundColor: "#f0f0f0" }}
        />
      </Col>
      <Col>
        <Text strong style={{ color: "#1890ff", cursor: "pointer" }}>
          {record.product.name} {record.product.variant}
        </Text>
        <br />
        <Text type="secondary">SKU: {record.product.sku}</Text>
        <br />
      </Col>
    </Row>
  );

  const totalProductQuantity = (currentOrder.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const summaryData = [
    { label: "Số lượng sản phẩm", value: `${totalProductQuantity}` },
    { label: "Tổng tiền hàng", value: `${subTotal.toLocaleString()} VND` },
    { label: "Giảm giá", value: `${discountAmount.toLocaleString()} VND` },
    { label: "Vận chuyển", value: `${shippingFee.toLocaleString()} VND` },
    {
      label: "Tổng giá trị đơn hàng",
      value: `${totalAmount.toLocaleString()} VND`,
      highlight: true,
    },
  ];

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      {/* Header section */}
      <Card style={{ marginBottom: 16 }}>
        <Row
          style={{
            backgroundColor: "#f8f9fa",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          <Col span={3}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              MÃ
            </Text>
          </Col>
          <Col span={4}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              NGÀY TẠO
            </Text>
          </Col>
          <Col span={3}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              KÊNH BÁN HÀNG
            </Text>
          </Col>
          <Col span={5}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              TRẠNG THÁI ĐƠN HÀNG
            </Text>
          </Col>
          <Col span={4}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              TRẠNG THÁI GIAO HÀNG
            </Text>
          </Col>
          <Col span={5}>
            <Text strong style={{ fontSize: "12px", color: "#666" }}>
              TRẠNG THÁI THANH TOÁN
            </Text>
          </Col>
        </Row>

        <Row style={{ padding: "12px 16px", alignItems: "center" }}>
          <Col span={3}>
            <Text strong style={{ fontSize: "14px" }}>
              {currentOrder.orderId || "unknown"}
            </Text>
          </Col>
          <Col span={4}>
            <Text style={{ fontSize: "14px" }}>
              {currentOrder.createdAt
                ? new Date(currentOrder.createdAt)
                  .toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", "") + " SA"
                : "unknown"}
            </Text>
          </Col>
          <Col span={3}>
            <Text style={{ fontSize: "14px" }}>Website</Text>
          </Col>
          <Col span={5}>
            <Tag color={getStatusColor(currentOrder.status)}>
              {translateStatus(currentOrder.status)}
            </Tag>
          </Col>
          <Col span={4}>
            <Tag color={getFulfillmentColor(currentOrder.fulfillmentStatus)}>
              {translateFulfillmentStatus(currentOrder.fulfillmentStatus)}
            </Tag>
          </Col>
          <Col span={5}>
            <Tag color={getPaymentColor(currentOrder.paymentStatus)}>
              {translatePaymentStatus(currentOrder.paymentStatus)}
            </Tag>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={24}>
          {/* LEFT */}
          <Col span={16}>
            <Card style={{ marginBottom: 16 }}>
              <Table
                columns={productColumns}
                dataSource={productData}
                pagination={false}
                expandable={{
                  expandedRowRender,
                  defaultExpandedRowKeys: productData.map((item) => item.key),
                  showExpandColumn: false,
                }}
                size="small"
              />
            </Card>

            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Kho lấy hàng</Text>
                <br />
                <Button type="link" style={{ padding: 0 }}>
                  Kho Mặc Định
                </Button>
              </Col>
              <Col span={8}>
                <Text strong>Trạng thái vận chuyển</Text>
                <br />
                <Tag color="orange">
                  {currentOrder.fulfillmentStatus || "Chưa xác định"}
                </Tag>
              </Col>
              <Col span={8}>
                <Text strong>Mã vận chuyển</Text>
                <br />
                <Button type="link" style={{ padding: 0 }}>
                  1009979427
                </Button>
              </Col>
            </Row>

            <Divider />
                
            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Button
                  type="default"
                  onClick={() => handleDownloadPDF(currentOrder.orderId)}
                  style={{ marginBottom: 16 }}
                >
                  Tải PDF đơn hàng
                </Button>
              </Col>
              <Col span={12}>
                <Card>
                  {summaryData.map((item, index) => (
                    <Row
                      key={index}
                      justify="space-between"
                      style={{
                        marginBottom: 8,
                        fontWeight: item.highlight ? "bold" : "normal",
                      }}
                    >
                      <Col>
                        <Text type={item.subtext ? "secondary" : "default"}>
                          {item.label}
                        </Text>
                        {item.subtext && (
                          <div style={{ fontSize: 12 }}>Tiền mặt</div>
                        )}
                      </Col>
                      <Col>
                        <Text strong={item.highlight}>{item.value}</Text>
                      </Col>
                    </Row>
                  ))}
                </Card>
              </Col>
            </Row>
          </Col>

          {/* RIGHT */}
          <Col span={8}>
            <Card style={{ marginBottom: 16 }}>
              <Text strong>Cập nhật trạng thái đơn hàng</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Chọn trạng thái đơn hàng</Text>
                <br />
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder="Chọn trạng thái"
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                >
                  <Option value="PENDING">Chờ xử lý</Option>
                  <Option value="CONFIRMED">Đã xác nhận</Option>
                  <Option value="SHIPPED">Đã gửi hàng</Option>
                  <Option value="DELIVERED">Đã giao hàng</Option>
                  <Option value="CANCELLED">Đã hủy</Option>
                </Select>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 8 }}
                  onClick={handleStatusChange}
                >
                  Cập nhật trạng thái
                </Button>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Text strong>Phương thức thanh toán</Text>
              <div style={{ marginTop: 8 }}>
                <Text>
                  {translatePaymentMethod(currentOrder.paymentMethod)}
                </Text>
                {currentOrder.paymentMethod === "CARD" && (
                  <>
                    <br />
                    <Text type="secondary">
                      Ngày thanh toán: {currentOrder.paymentDetails?.paymentDate 
                        ? new Date(currentOrder.paymentDetails.paymentDate).toLocaleDateString("vi-VN") 
                        : "Không xác định"}
                    </Text>
                  </>
                )}
              </div>
            </Card>

            <Card>
              <Text strong>Thông tin người mua</Text>
              <div style={{ marginTop: 8 }}>
                <Button type="link" style={{ padding: 0 }}>
                  {currentOrder.customer?.username || ""}
                </Button>
                <br />
                <Text type="secondary">
                  {currentOrder.customer?.email || ""}
                </Text>
              </div>
              <Divider style={{ borderColor: "#d9d9d9", margin: "32px 0" }} />

              <Space>
                <Text strong>Người liên hệ</Text>
                <Button type="text" icon={<MoreOutlined />} />
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text>
                  {currentOrder.shippingAddress?.recipient_name || ""}
                </Text>
                <br />
                <Text type="secondary">
                  {currentOrder.shippingAddress?.phone || ""}
                </Text>
              </div>
              <Space>
                <Text strong>Địa chỉ giao hàng</Text>
                <Button type="text" icon={<MoreOutlined />} />
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text>{currentOrder.shippingAddress?.fulladdress || ""}</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}