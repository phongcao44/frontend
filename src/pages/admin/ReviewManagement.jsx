import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Rate, Input, Select, Space, Tag } from "antd";
import { SearchOutlined, FilterOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewSummaryByProduct } from "../../redux/slices/reviewSlice";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ReviewSummaryByProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviewSummary, loading } = useSelector((state) => state.review);
  
  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [reviewCountFilter, setReviewCountFilter] = useState("");

  useEffect(() => {
    dispatch(fetchReviewSummaryByProduct());
  }, [dispatch]);

  // Lọc dữ liệu
  const filteredData = reviewSummary.filter((item) => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productId?.toString().includes(searchTerm);
    
    const matchesRating = !ratingFilter || ratingFilter === "" || 
                         (ratingFilter === "5" && item.rating >= 4.5) ||
                         (ratingFilter === "4" && item.rating >= 3.5 && item.rating < 4.5) ||
                         (ratingFilter === "3" && item.rating >= 2.5 && item.rating < 3.5) ||
                         (ratingFilter === "2" && item.rating >= 1.5 && item.rating < 2.5) ||
                         (ratingFilter === "1" && item.rating >= 0.5 && item.rating < 1.5);
    
    const matchesReviewCount = !reviewCountFilter || reviewCountFilter === "" ||
                              (reviewCountFilter === "most" && item.totalReviews >= 20) ||
                              (reviewCountFilter === "many" && item.totalReviews >= 10 && item.totalReviews < 20) ||
                              (reviewCountFilter === "some" && item.totalReviews >= 5 && item.totalReviews < 10) ||
                              (reviewCountFilter === "few" && item.totalReviews >= 1 && item.totalReviews < 5) ||
                              (reviewCountFilter === "least" && item.totalReviews === 1);
    
    // Debug: Log khi có filter được áp dụng
    if ((ratingFilter && ratingFilter !== "") || (reviewCountFilter && reviewCountFilter !== "") || searchTerm) {
      console.log(`Filtering item: ${item.productName}`, {
        rating: item.rating,
        totalReviews: item.totalReviews,
        ratingFilter,
        reviewCountFilter,
        searchTerm,
        matchesSearch,
        matchesRating,
        matchesReviewCount
      });
    }
    
    return matchesSearch && matchesRating && matchesReviewCount;
  });


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

      {/* Bộ lọc */}
      <div style={{ marginBottom: 24, background: "white", padding: 16, borderRadius: 8 }}>
        <Space size="large" wrap>
          <div>
            <Search
              placeholder="Tìm kiếm theo tên sản phẩm hoặc ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
          </div>
          <div>
                         <Select
               placeholder="Lọc theo đánh giá"
               value={ratingFilter}
               onChange={setRatingFilter}
               style={{ width: 150 }}
               allowClear
             >
               <Option value="5">5 sao (4.5-5.0)</Option>
               <Option value="4">4 sao (3.5-4.4)</Option>
               <Option value="3">3 sao (2.5-3.4)</Option>
               <Option value="2">2 sao (1.5-2.4)</Option>
               <Option value="1">1 sao (0.5-1.4)</Option>
             </Select>
          </div>
          <div>
                         <Select
               placeholder="Lọc theo số lượng đánh giá"
               value={reviewCountFilter}
               onChange={setReviewCountFilter}
               style={{ width: 180 }}
               allowClear
             >
               <Option value="most">Nhiều nhất (≥ 20)</Option>
               <Option value="many">Nhiều (10-19)</Option>
               <Option value="some">Vừa (5-9)</Option>
               <Option value="few">Ít (1-4)</Option>
               <Option value="least">Ít nhất (1)</Option>
             </Select>
          </div>
          <div>
            <Tag color="blue">
              Tổng: {filteredData.length} sản phẩm
            </Tag>
          </div>
        </Space>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="productId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ReviewSummaryByProduct;