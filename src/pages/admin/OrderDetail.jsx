import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
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
  Input,
  Avatar,
  Badge,
  Spin,
  Alert,
  message,
} from "antd";
import {
  MoreOutlined,
} from "@ant-design/icons";
import {
  loadOrderDetail,
  clearCurrentOrder,
  editOrderStatus,
} from "../../redux/slices/orderSlice";

const { Text } = Typography;

export default function OrderDetail() {
  const [note, setNote] = useState("Ghi chú mặc định");
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(loadOrderDetail(Number(orderId)));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  console.log(currentOrder);

  const handleConfirm = async () => {
    try {
      await dispatch(
        editOrderStatus({
          id: currentOrder.orderId,
          status: "CONFIRMED",
        })
      ).unwrap();
      message.success("Đã xác nhận đơn hàng");
    } catch (err) {
      message.error("Xác nhận thất bại");
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
      {/* Header section - Updated to match the image */}
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
            <Card
             
              style={{ marginBottom: 16 }}
            >
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

            <Space>
              <Badge status="default" />
              <Text>Thanh toán đã nhập trả một phần</Text>
            </Space>

            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Text strong>Ghi chú đơn hàng</Text>
                <div style={{ marginTop: 8 }}>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                  <Button type="primary">Cập nhật</Button>
                </div>
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
              <Text strong>Xác nhận đơn hàng</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Vui lòng xác nhận đơn hàng</Text>
                <br />
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 8 }}
                  onClick={handleConfirm}
                >
                  Xác nhận đơn hàng
                </Button>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Text strong>Thông tin người mua</Text>
              <div style={{ marginTop: 8 }}>
                <Button type="link" style={{ padding: 0 }}>
                  {currentOrder.customer?.username || ""}
                </Button>
              </div>
              <Divider style={{ borderColor: "#d9d9d9", margin: "32px 0" }} />
              <Space>
                <Text strong>Người liên hệ</Text>
                <Button type="text" icon={<MoreOutlined />} />
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text>{currentOrder.customer?.username || ""}</Text>
                <br />
                <Text type="secondary">
                  {currentOrder.shippingAddress?.phone || ""}
                </Text>
              </div>
              <Divider style={{ borderColor: "#d9d9d9", margin: "32px 0" }} />
              <Space>
                <Text strong>Địa chỉ giao hàng</Text>
                <Button type="text" icon={<MoreOutlined />} />
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text>{currentOrder.shippingAddress?.fulladdress || ""}</Text>
              </div>
            </Card>

            <Card>
              <Row justify="space-between">
                <Col>
                  <Text strong>Kho bán</Text>
                  <br />
                  <Button type="link" style={{ padding: 0 }}>
                    Kho Chính
                  </Button>
                </Col>
                <Col>
                  <Space>
                    <Button>Nhận</Button>
                    <Button>Tất cả nhận</Button>
                  </Space>
                </Col>
              </Row>
              <Button type="primary" block style={{ marginTop: 16 }}>
                Lưu
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
