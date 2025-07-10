import { useEffect } from "react";
import {
  Layout,
  Button,
  Table,
  Input,
  Space,
  Typography,
  Tabs,
  Tag,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loadOrders } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  console.log(orders);

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

  const translatePaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      case "PAYPAL":
        return "Thanh toán qua PayPal";
      case "CREDIT_CARD":
        return "Thẻ tín dụng";
      default:
        return "Không rõ";
    }
  };

  const getFulfillmentColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "success";
      case "Chờ lấy hàng":
      case "Chưa giao hàng":
        return "warning";
      case "Chưa nhận":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "",
      key: "checkbox",
      width: 50,
      render: () => <Checkbox />,
    },
    {
      title: "Mã",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => (
        <Space
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/admin/orders/${text}`)}
        >
          <span style={{ color: "#1890ff", fontWeight: 500 }}>{text}</span>
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        </Space>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Khách hàng",
      dataIndex: "userId",
      key: "userId.username",
      render: (userId) => userId || "",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{translateStatus(status)}</Tag>
      ),
    },
    {
      title: "Phương Thức Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => translatePaymentMethod(method),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={getPaymentColor(status)}>
          {translatePaymentStatus(status)}
        </Tag>
      ),
    },
    {
      title: "Giao hàng",
      dataIndex: "fulfillmentStatus",
      key: "fulfillmentStatus",
      render: (status) => (
        <Tag color={getFulfillmentColor(status)}>{status || "Không Rõ"}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>
          {Number(text).toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      title: "Kênh",
      dataIndex: "channel",
      key: "channel",
      render: () => "Website",
    },
  ];

  const tabItems = [
    { key: "1", label: "Tất cả đơn hàng" },
    { key: "2", label: "Chưa thanh toán" },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "#333" }}>
          Danh sách đơn hàng
        </Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo đơn hàng
          </Button>
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      </Header>

      <Content>
        <div style={{ backgroundColor: "#fff" }}>
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            style={{ paddingLeft: 24, paddingRight: 24 }}
          />
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            margin: "2px",
            marginTop: 0,
          }}
        >
          <div
            style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}
          >
            <Space style={{ marginBottom: "16px" }}>
              <Button icon={<FilterOutlined />}>Thêm điều kiện lọc</Button>
              <Input
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Space>
          </div>

          <Table
            rowKey="orderId"
            loading={loading}
            columns={columns}
            dataSource={orders}
            pagination={{
              total: orders.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default OrderManagement;
