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
  Spin,
  Alert,
  message,
  Select,
  Modal,
  Input,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import {
  loadOrderDetail,
  clearCurrentOrder,
  editOrderStatus,
} from "../../redux/slices/orderSlice";
import { translatePaymentMethod, getPaymentMethodColor } from "../../utils/paymentUtils";

const { Text } = Typography;
const { Option } = Select;

export default function OrderDetail() {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [customCancellationReason, setCustomCancellationReason] = useState("");

  useEffect(() => {
    dispatch(loadOrderDetail(Number(orderId)));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    if (currentOrder?.status) {
      setSelectedStatus(currentOrder.status);
      setCancellationReason("");
      setCustomCancellationReason("");
    }
  }, [currentOrder]);

  // Danh sách lý do hủy đơn hàng
  const cancelReasons = [
    "CHANGE_OF_MIND",
    "FOUND_BETTER_PRICE",
    "ORDERED_BY_MISTAKE",
    "SHIPPING_TOO_SLOW",
    "ITEM_NOT_AS_EXPECTED",
    "CUSTOMER_SERVICE_ISSUE",
    "OTHER",
    "ADMIN_CANCELED",
  ];

  // Dịch lý do hủy đơn hàng
  const translateCancelReason = (reason) => {
    switch (reason) {
      case "CHANGE_OF_MIND":
        return "Thay đổi ý định";
      case "FOUND_BETTER_PRICE":
        return "Tìm thấy giá tốt hơn";
      case "ORDERED_BY_MISTAKE":
        return "Đặt hàng nhầm";
      case "SHIPPING_TOO_SLOW":
        return "Giao hàng quá chậm";
      case "ITEM_NOT_AS_EXPECTED":
        return "Sản phẩm không như kỳ vọng";
      case "CUSTOMER_SERVICE_ISSUE":
        return "Vấn đề dịch vụ khách hàng";
      case "OTHER":
        return "Lý do khác";
      case "ADMIN_CANCELED":
        return "Quản trị viên hủy";
      default:
        return "Không rõ";
    }
  };

  // Định nghĩa các trạng thái hợp lệ
  const validTransitions = {
    PENDING: ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"],
    CONFIRMED: ["SHIPPED", "CANCELLED", "RETURNED"],
    SHIPPED: ["DELIVERED", "RETURNED"],
    DELIVERED: ["RETURNED"],
    CANCELLED: [],
    RETURNED: [],
  };

  // Kiểm tra trạng thái có thể cập nhật hay không
  const canUpdateStatus = () => {
    if (!currentOrder?.status) return false;
    return !["CANCELLED", "RETURNED"].includes(currentOrder.status);
  };

  // Lấy danh sách trạng thái hợp lệ để hiển thị trong dropdown
  const getValidStatusOptions = () => {
    if (!currentOrder?.status) return [];
    return validTransitions[currentOrder.status] || [];
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = () => {
    console.log("Selected status:", selectedStatus); // Debug: Log selected status
    if (!selectedStatus) {
      message.warning("Vui lòng chọn trạng thái");
      return;
    }
    if (!canUpdateStatus()) {
      message.error("Không thể cập nhật trạng thái đơn hàng đã hủy hoặc đã trả hàng");
      return;
    }
    if (selectedStatus === currentOrder.status) {
      message.warning("Trạng thái đã được chọn hiện tại");
      return;
    }
    if (!validTransitions[currentOrder.status].includes(selectedStatus)) {
      message.error("Chuyển trạng thái không hợp lệ");
      return;
    }

    // Xử lý trạng thái CANCELLED với lý do ADMIN_CANCELED
    if (selectedStatus === "CANCELLED") {
      Modal.confirm({
        title: "Xác nhận hủy đơn hàng",
        content: (
          <div>
            <p>Bạn có chắc chắn muốn hủy đơn hàng?</p>
            <Text type="secondary">Lý do: Quản trị viên hủy</Text>
          </div>
        ),
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => updateStatus("ADMIN_CANCELED"),
      });
    } else {
      // Không yêu cầu lý do cho RETURNED hoặc các trạng thái khác
      updateStatus();
    }
  };

  // Hàm thực hiện cập nhật trạng thái
  const updateStatus = async (reason = undefined) => {
    const payload = {
      id: currentOrder.orderId,
      status: selectedStatus,
      cancellationReason: selectedStatus === "CANCELLED" ? reason : undefined,
      customCancellationReason: undefined, // Không sử dụng cho admin
    };
    console.log("Payload for editOrderStatus:", payload); // Debug: Log payload
    try {
      await dispatch(editOrderStatus(payload)).unwrap();
      message.success(`Đã cập nhật trạng thái đơn hàng thành ${translateStatus(selectedStatus)}`);
      await dispatch(loadOrderDetail(Number(orderId))).unwrap();
      setCancellationReason("");
      setCustomCancellationReason("");
    } catch (err) {
      console.error("Update status error:", err); // Debug: Log error
      message.error(err.message || "Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  // Hàm dịch trạng thái
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
      case "RETURNED":
        return "Đã trả hàng";
      default:
        return "Không rõ";
    }
  };

  // Hàm lấy màu trạng thái
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
      case "RETURNED":
        return "error";
      default:
        return "default";
    }
  };

  // Hàm lấy màu trạng thái thanh toán
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

  // Hàm dịch trạng thái thanh toán
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

  // Hàm lấy màu trạng thái vận chuyển
  const getFulfillmentColor = (status) => {
    switch (status) {
      case "SHIPPED":
        return "cyan";
      case "DELIVERED":
        return "success";
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "processing";
      case "CANCELLED":
        return "error";
      case "RETURNED":
        return "error";
      default:
        return "default";
    }
  };

  // Hàm dịch trạng thái vận chuyển
  const translateFulfillmentStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ giao hàng";
      case "CONFIRMED":
        return "Đã xác nhận giao hàng";
      case "SHIPPED":
        return "Đã gửi hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy giao hàng";
      case "RETURNED":
        return "Đã trả hàng";
      default:
        return "Không rõ";
    }
  };

  // Tính toán tổng hợp đơn hàng
  const subTotal = currentOrder?.subTotal || 0;
  const discountAmount = currentOrder?.discountAmount || 0;
  const shippingFee = currentOrder?.shippingFee || 0;
  const totalAmount = currentOrder?.totalAmount || 0;
  const totalProductQuantity = (currentOrder?.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // Chuẩn bị dữ liệu sản phẩm cho bảng
  const productData = (currentOrder?.items || []).map((item, index) => ({
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

  // Cột cho bảng sản phẩm
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

  // Render chi tiết sản phẩm khi mở rộng
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
      </Col>
    </Row>
  );

  // Dữ liệu tóm tắt đơn hàng
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

  // Xử lý trạng thái loading
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Xử lý lỗi
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

  // Xử lý không tìm thấy đơn hàng
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

  return (
    <div style={{ padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
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
              PHƯƠNG THỨC THANH TOÁN
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
              {currentOrder.orderCode || "unknown"}
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
            {currentOrder.status === "CANCELLED" && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Lý do hủy: {translateCancelReason(currentOrder.cancellationReason)}
                </Text>
                {currentOrder.cancellationReason === "OTHER" && (
                  <div>
                    <Text type="secondary">
                      Chi tiết: {currentOrder.customCancellationReason || "Không có"}
                    </Text>
                  </div>
                )}
              </div>
            )}
            {currentOrder.status === "RETURNED" && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Đã trả hàng</Text>
              </div>
            )}
          </Col>
          <Col span={4}>
            <Tag color={getPaymentMethodColor(currentOrder.paymentMethod)}>
              {translatePaymentMethod(currentOrder.paymentMethod)}
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
                <Tag color={getFulfillmentColor(currentOrder.fulfillmentStatus)}>
                  {translateFulfillmentStatus(currentOrder.fulfillmentStatus)}
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
          <Col span={8}>
            <Card style={{ marginBottom: 16 }}>
              <Text strong>Cập nhật trạng thái đơn hàng</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Chọn trạng thái đơn hàng</Text>
                <br />
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder="Chọn trạng thái"
                  value={selectedStatus ? translateStatus(selectedStatus) : undefined}
                  onChange={(value) => {
                    console.log("Status selected:", value); // Debug: Log status change
                    setSelectedStatus(value);
                  }}
                  disabled={!canUpdateStatus()}
                >
                  {(canUpdateStatus() ? getValidStatusOptions() : [currentOrder.status]).map((status) => (
                    <Option key={status} value={status}>
                      {translateStatus(status)}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 8 }}
                  onClick={handleStatusChange}
                  disabled={!canUpdateStatus() || !selectedStatus || selectedStatus === currentOrder.status}
                >
                  Cập nhật trạng thái
                </Button>
                {!canUpdateStatus() && (
                  <Alert
                    message="Không thể cập nhật trạng thái"
                    description={`Đơn hàng đã ${translateStatus(currentOrder?.status).toLowerCase()}. Không thể thay đổi trạng thái.`}
                    type="warning"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
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