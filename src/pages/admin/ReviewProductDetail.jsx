import React, { useEffect, useState } from "react";
import { Table, Typography, Rate, Avatar, Input, Select, Space, Tag, Button, message, Popconfirm } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAdminReviews, deleteReviewThunk } from "../../redux/slices/reviewSlice";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const AdminProductReviewDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { reviews, loading } = useSelector((state) => state.review);
    
    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    // Đã bỏ trạng thái ẩn/hiện -> không cần statusFilter

    useEffect(() => {
        dispatch(fetchAdminReviews(productId));
    }, [dispatch, productId]);

    // Lọc dữ liệu
    const filteredReviews = reviews.filter((review) => {
        const matchesSearch = review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRating = !ratingFilter || ratingFilter === "" || 
                             (ratingFilter === "5" && review.rating >= 4.5) ||
                             (ratingFilter === "4" && review.rating >= 3.5 && review.rating < 4.5) ||
                             (ratingFilter === "3" && review.rating >= 2.5 && review.rating < 3.5) ||
                             (ratingFilter === "2" && review.rating >= 1.5 && review.rating < 2.5) ||
                             (ratingFilter === "1" && review.rating >= 0.5 && review.rating < 1.5);
        
        // Debug: Log khi có filter được áp dụng
        if ((ratingFilter && ratingFilter !== "") || searchTerm) {
          console.log(`Filtering review: ${review.userName}`, {
            rating: review.rating,
            ratingFilter,
            searchTerm,
            matchesSearch,
            matchesRating,
            // no status filter
          });
        }
        
        return matchesSearch && matchesRating;
    });

    // Xử lý xóa đánh giá
    const handleDeleteReview = async (reviewId) => {
        try {
            await dispatch(deleteReviewThunk(reviewId)).unwrap();
            message.success("Đã xóa đánh giá");
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa đánh giá");
        }
    };

    const columns = [
        {
            title: "Người dùng",
            render: (record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(record.userName || "Người dùng")}&background=random`}
                        alt={record.userName}
                    />
                    <span>{record.userName}</span>
                </div>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "comment",
            render: (comment) => (
                <div>{comment}</div>
            ),
        },
        {
            title: "Số sao",
            dataIndex: "rating",
            render: (value) => <Rate disabled value={value} allowHalf />,
        },
        {
            title: "Ngày đánh giá",
            dataIndex: "createdAt",
            render: (value) => new Date(value).toLocaleDateString("vi-VN"),
        },
        // Đã bỏ cột Trạng thái
        {
            title: "Thao tác",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title={"Xóa đánh giá này?"}
                        description={"Đánh giá sẽ bị xóa vĩnh viễn và không thể khôi phục."}
                        onConfirm={() => handleDeleteReview(record.id)}
                        okText="Xóa"
                        okButtonProps={{ danger: true }}
                        cancelText="Hủy"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
                Tất Cả Đánh Giá Của Sản Phẩm {reviews[0]?.productName ? `${reviews[0].productName}` : `#${productId}`}
            </Title>

            {/* Bộ lọc */}
            <div style={{ marginBottom: 24, background: "#f8f9fa", padding: 16, borderRadius: 8 }}>
                <Space size="large" wrap>
                    <div>
                        <Search
                            placeholder="Tìm kiếm theo tên người dùng hoặc nội dung"
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
                        <Tag color="blue">
                            Tổng: {filteredReviews.length} đánh giá
                        </Tag>
                    </div>
                </Space>
            </div>

            <Table
                dataSource={filteredReviews}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default AdminProductReviewDetail;
