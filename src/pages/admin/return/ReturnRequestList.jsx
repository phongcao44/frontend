import React, { useEffect } from "react";
import { Table, Typography, Tag, Image, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadReturnRequests } from "../../../redux/slices/returnRequestSlice";

const { Title } = Typography;

const statusColor = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
};

const ReturnRequestList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: data, loading } = useSelector((state) => state.returnRequest);

  useEffect(() => {
    dispatch(loadReturnRequests());
  }, [dispatch]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Mã đơn hàng", dataIndex: "orderId" },
    { title: "Người yêu cầu", dataIndex: "fullName" , width: 150},
    {
      title: "Ảnh/Video",
      dataIndex: "mediaUrl",
      render: (url) => {
  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
  return isVideo ? (
    <video width={100} height={60} controls>
      <source src={url} type="video/mp4" />
      Trình duyệt không hỗ trợ video.
    </video>
  ) : (
    <Image width={60} src={url} />
  );
},
    },
    { title: "Lý do", dataIndex: "reason" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={statusColor[status]}
          style={{
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: "8px",
            textTransform: "uppercase",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/return/${record.id}`)}
          style={{ fontWeight: "bold", color: "#1677ff" }}
        >
          Xem Chi Tiết
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Title
        level={3}
        style={{
          textAlign: "center",
          marginBottom: 32,
          color: "#222",
        }}
      >
        Danh Sách Yêu Cầu Đổi Trả Hàng
      </Title>
      <Card
        style={{
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          background: "#fff",
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default ReturnRequestList;
