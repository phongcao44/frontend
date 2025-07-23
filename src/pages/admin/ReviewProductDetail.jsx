import React, { useEffect } from "react";
import { Table, Typography, Rate, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAdminReviews } from "../../redux/slices/reviewSlice";

const { Title } = Typography;

const AdminProductReviewDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { reviews, loading } = useSelector((state) => state.review);

    useEffect(() => {
        dispatch(fetchAdminReviews(productId));
    }, [dispatch, productId]);

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
    ];

    return (
        <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
                Tất Cả Đánh Giá Của Sản Phẩm {reviews[0]?.productName ? `${reviews[0].productName}` : `#${productId}`}
            </Title>


            <Table
                dataSource={reviews}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default AdminProductReviewDetail;
