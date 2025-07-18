import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Spin,
  Image,
  message,
  Card,
  Row,
  Col,
} from "antd";
import { getReturnRequestsByUser } from "../../services/returnProduct";

const { Title } = Typography;

const MyReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReturnRequestsByUser()
      .then((data) => setRequests(data))
      .catch((err) => {
        message.error("Failed to load return requests");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "Product",
      key: "product",
      align: "left",
      render: (_, record) => (
        <div style={{ lineHeight: 1.8 }}>
          <div><b>Name:</b> {record.productName}</div>
          <div><b>Quantity:</b> {record.quantity}</div>
          <div>
            <b>Price:</b>{" "}
            {record.price?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      align: "center",
      render: (text) => <span style={{ fontStyle: "italic" }}>{text}</span>,
    },
    {
      title: "Proof Image",
      dataIndex: "mediaUrl",
      key: "mediaUrl",
      align: "center",
      render: (url) =>
        url ? (
          <Image
            width={60}
            src={url}
            alt="Proof"
            style={{ borderRadius: 8 }}
            fallback="https://via.placeholder.com/60x60?text=No+Image"
          />
        ) : (
          <Tag color="default">None</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "default";
        let label = status;

        switch (status) {
          case "PENDING":
            color = "orange";
            label = "Pending";
            break;
          case "APPROVED":
            color = "green";
            label = "Approved";
            break;
          case "REJECTED":
            color = "red";
            label = "Rejected";
            break;
          default:
            break;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Submitted At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) =>
        new Date(date).toLocaleString("vi-VN", {
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        }),
    },
  ];

  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} md={22} lg={20}>
        <Card
          style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            My Return Requests
          </Title>
          {loading ? (
            <Spin style={{ display: "block", margin: "0 auto" }} />
          ) : (
            <Table
              rowKey="id"
              dataSource={requests}
              columns={columns}
              pagination={{ pageSize: 5 }}
              bordered
              size="middle"
            />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default MyReturnRequests;
