import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
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
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import {
  loadOrderDetail,
  clearCurrentOrder,
  editOrderStatus,
} from "../../../redux/slices/orderSlice";
import { Modal, Input } from "antd";
const { Text } = Typography;
const { Option } = Select;

export default function OrderDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showRedoModal, setShowRedoModal] = useState(false);
  const [redoReason, setRedoReason] = useState("");
  const deliveryFailureReason = currentOrder?.deliveryFailureReason || "Không có lý do";
  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload); // decode base64
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  };

  const handleMarkShippedAndUpdateLocation = async () => {
    handleUpdateLocation();     // Cập nhật vị trí giao hàng
    await handleMarkShipped();  // Cập nhật trạng thái đơn hàng sang 'SHIPPED'
  };


  const handleRedoSubmit = async () => {
    if (!redoReason.trim()) {
      message.warning("Vui lòng nhập lý do gửi hàng lại");
      return;
    }

    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      message.error("Vui lòng đăng nhập trước khi thực hiện");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/location/${currentOrder.orderId}/redeliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason: redoReason }),
      });

      if (!res.ok) {
        throw new Error("Giao hàng lại thất bại");
      }

      message.success("Đã gửi yêu cầu giao hàng lại thành công");
      setShowRedoModal(false);
      setRedoReason("");

      // Tải lại chi tiết đơn hàng để cập nhật trạng thái mới
      dispatch(loadOrderDetail(currentOrder.orderId));
    } catch (error) {
      message.error(error.message || "Lỗi không xác định khi gửi yêu cầu");
    }
  };


  const handleMarkShipped = async () => {
    if (!currentOrder?.orderId) {
      message.error("Không có đơn hàng để cập nhật.");
      return;
    }

    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      message.error("Vui lòng đăng nhập trước khi thực hiện.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/location/${currentOrder.orderId}/mark-shipped`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Cập nhật trạng thái thất bại");
      }

      message.success("Cập nhật trạng thái Đang giao hàng thành công");

      // Load lại chi tiết đơn hàng sau khi cập nhật
      dispatch(loadOrderDetail(currentOrder.orderId));
    } catch (error) {
      message.error(error.message || "Lỗi không xác định khi cập nhật trạng thái");
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt không hỗ trợ định vị");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const accessToken = Cookies.get("access_token"); // Lấy token từ cookie
        if (!accessToken) {
          message.error("Vui lòng đăng nhập trước khi cập nhật vị trí");
          return;
        }

        const decoded = parseJwt(accessToken);
        const userId = decoded?.userId || decoded?.id || decoded?.sub; // Thử các trường thường dùng

        if (!userId) {
          message.error("Không xác định được userId từ token");
          return;
        }

        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          orderId: currentOrder.orderId,
        };
        console.log("Payload gửi lên:", payload);
        fetch("http://localhost:8080/api/v1/location/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Lỗi khi cập nhật vị trí");
            return res.text();
          })
          .then(() => {
            message.success("Cập nhật vị trí thành công");
          })
          .catch(() => {
            message.error("Không thể cập nhật vị trí");
          });
      },
      () => {
        message.error("Không lấy được vị trí GPS");
      }
    );
  };

  useEffect(() => {
    dispatch(loadOrderDetail(Number(id)));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  const handleStatusChange = async () => {
    if (!selectedStatus) {
      message.warning("Vui lòng chọn trạng thái");
      return;
    }
    try {
      console.log(selectedStatus)
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
          description={`Không tìm thấy đơn hàng với ID ${id}.`}
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

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Button block type="primary" onClick={handleUpdateLocation}>
            Cập nhật vị trí giao hàng <br />(trong quá trình vận chuyển)
          </Button>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8}>
          <Button
            block
            type="primary"
            onClick={handleMarkShippedAndUpdateLocation}
            disabled={currentOrder.status === "SHIPPED" || currentOrder.status === "DELIVERED"}
          >
            Đang giao hàng <br />(đơn hàng sắp được giao tới khách hàng)
          </Button>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8}>
          <Button block type="default" onClick={() => setShowRedoModal(true)}>
            Giao hàng lại
          </Button>
        </Col>
      </Row>

      <Modal
        title="Lý do gửi hàng lại"
        visible={showRedoModal}
        onCancel={() => setShowRedoModal(false)}
        onOk={handleRedoSubmit}
        okText="Gửi"
      >
        <Input.TextArea
          rows={4}
          value={redoReason}
          onChange={(e) => setRedoReason(e.target.value)}
          placeholder="Nhập lý do gửi hàng lại..."
        />
      </Modal>


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
                  onChange={(value) => setSelectedStatus(value)}
                >
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