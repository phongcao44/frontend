import React, { useEffect } from "react";
import { Table, Typography, Button, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewSummaryByProduct } from "../../redux/slices/reviewSlice";

const { Title } = Typography;

const ReviewSummaryByProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviewSummary, loading } = useSelector((state) => state.review);

useEffect(() => {
  dispatch(fetchReviewSummaryByProduct());
}, [dispatch]);


  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 500 }}>{text}</span>
          <span style={{ color: "#888", fontSize: 12 }}>{record.productId}</span>
        </div>
      ),
    },
    {
      title: "Số sao trung bình",
        dataIndex: "rating",
      render: (value) => <Rate disabled allowHalf value={parseFloat(value) || 0} />,
    },
    {
      title: "Tổng đánh giá",
      dataIndex: "totalReviews",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/reviews/${record.productId}`)}
        >
          Xem đánh giá
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
        Danh Sách Sản Phẩm Có Đánh Giá
      </Title>

      <Table
        dataSource={reviewSummary}
        columns={columns}
        rowKey="productId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ReviewSummaryByProduct;