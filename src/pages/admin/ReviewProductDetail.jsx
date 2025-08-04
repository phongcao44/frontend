import React, { useEffect, useState } from "react";
import { Table, Typography, Rate, Avatar, Input, Select, Space, Tag, Button, message, Popconfirm } from "antd";
import { SearchOutlined, EyeOutlined, EyeInvisibleOutlined, FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAdminReviews, toggleReviewVisibility } from "../../redux/slices/reviewSlice";

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
    const [statusFilter, setStatusFilter] = useState("");

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
        
        const matchesStatus = !statusFilter || statusFilter === "" ||
                             (statusFilter === "visible" && !review.isHidden) ||
                             (statusFilter === "hidden" && review.isHidden);
        
        // Debug: Log khi có filter được áp dụng
        if ((ratingFilter && ratingFilter !== "") || (statusFilter && statusFilter !== "") || searchTerm) {
          console.log(`Filtering review: ${review.userName}`, {
            rating: review.rating,
            isHidden: review.isHidden,
            ratingFilter,
            statusFilter,
            searchTerm,
            matchesSearch,
            matchesRating,
            matchesStatus
          });
        }
        
        return matchesSearch && matchesRating && matchesStatus;
    });

    // Xử lý ẩn/hiện đánh giá
    const handleToggleVisibility = async (reviewId, isHidden) => {
        try {
            await dispatch(toggleReviewVisibility({ reviewId, isHidden })).unwrap();
            message.success(isHidden ? "Đã ẩn đánh giá" : "Đã hiện đánh giá");
        } catch (error) {
            message.error("Có lỗi xảy ra khi thay đổi trạng thái đánh giá");
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
            render: (comment, record) => (
                <div>
                    <div style={{ 
                        color: record.isHidden ? '#999' : '#000',
                        textDecoration: record.isHidden ? 'line-through' : 'none'
                    }}>
                        {comment}
                    </div>
                    {record.isHidden && (
                        <Tag color="red" style={{ marginTop: 4 }}>
                            Có thể chứa từ ngữ vi phạm
                        </Tag>
                    )}
                </div>
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
        {
            title: "Trạng thái",
            dataIndex: "isHidden",
            render: (isHidden) => (
                <Tag color={isHidden ? "red" : "green"}>
                    {isHidden ? "Đã ẩn" : "Hiển thị"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title={record.isHidden ? "Hiện đánh giá này?" : "Ẩn đánh giá này?"}
                        description={record.isHidden 
                            ? "Đánh giá sẽ được hiển thị lại cho người dùng" 
                            : "Đánh giá sẽ bị ẩn khỏi người dùng"
                        }
                        onConfirm={() => handleToggleVisibility(record.id, !record.isHidden)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Button
                            type="link"
                            icon={record.isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            size="small"
                        >
                            {record.isHidden ? "Hiện" : "Ẩn"}
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
                        <Select
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Option value="visible">Đang hiển thị</Option>
                            <Option value="hidden">Đã ẩn</Option>
                        </Select>
                    </div>
                    <div>
                        <Tag color="blue">
                            Tổng: {filteredReviews.length} đánh giá
                        </Tag>
                        <Tag color="red">
                            Đã ẩn: {reviews.filter(r => r.isHidden).length}
                        </Tag>
                        {reviews.filter(r => r.isHidden).length > 0 && (
                            <Button
                                type="link"
                                size="small"
                                onClick={() => setStatusFilter(statusFilter === "hidden" ? "" : "hidden")}
                                style={{ padding: 0, marginLeft: 8 }}
                            >
                                {statusFilter === "hidden" ? "Xem tất cả" : "Chỉ xem đã ẩn"}
                            </Button>
                        )}
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
