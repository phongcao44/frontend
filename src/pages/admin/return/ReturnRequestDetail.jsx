import React, { useEffect, useState } from "react";
import { Modal, Typography, Card, Tag, Image, List, Button, message, Row, Col } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchReturnRequestById,
  updateReturnRequestStatus,
} from "../../../services/returnRequestService";

const { Title, Text } = Typography;

const statusColor = {
  PENDING: "orange",
  APPROVED: "green",
  REJECTED: "red",
};

const isVideo = (url) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => url?.toLowerCase().endsWith(ext));
};

const ReturnRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchReturnRequestById(id);
        setRequest(res);
      } catch (error) {
        console.error(error);
        message.error("Không tìm thấy yêu cầu");
      }
    };
    fetchData();
  }, [id]);

  const confirmUpdate = (status) => {
    Modal.confirm({
      title: `Xác nhận cập nhật trạng thái sang ${status}?`,
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => handleUpdateStatus(status),
    });
  };

  const handleUpdateStatus = async (status) => {
    try {
      await updateReturnRequestStatus(id, status);
      message.success("Cập nhật trạng thái thành công");
      navigate("/admin/return");
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi hệ thống");
    }
  };

  if (!request) return null;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        Chi Tiết Yêu Cầu Đổi Trả #{request.id}
      </Title>

      <Card style={{ borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Row gutter={[32, 16]}>
          {/* Cột trái: Thông tin */}
          <Col xs={24} md={14}>
            <Text strong>Người yêu cầu:</Text> {request.fullName} <br />
            <Text strong>Mã đơn hàng:</Text> {request.orderId} <br />
            <Text strong>Lý do:</Text> {request.reason} <br />
            <Text strong>Ngày tạo:</Text>{" "}
            {new Date(request.createdAt).toLocaleString()} <br />
            <Text strong>Trạng thái:</Text>{" "}
            <Tag color={statusColor[request.status]}>{request.status}</Tag>
            <br />
            {request.status === "PENDING" && (
              <div style={{ marginTop: 20 }}>
                <Button
                  type="primary"
                  onClick={() => confirmUpdate("APPROVED")}
                  style={{ marginRight: 12 }}
                >
                Duyệt Yêu Cầu
                </Button>
                <Button danger onClick={() => confirmUpdate("REJECTED")}>
                Từ Chối Yêu Cầu
                </Button>
              </div>
            )}
          </Col>

          {/* Cột phải: Minh chứng */}
          <Col xs={24} md={10}>
            <Text strong>Clip Chứng Minh:</Text>
            <div style={{ marginTop: 8 }}>
              {request.mediaUrl ? (
                isVideo(request.mediaUrl) ? (
                  <video width="100%" controls style={{ borderRadius: 8 }}>
                    <source src={request.mediaUrl} type="video/mp4" />
                    Trình Duyệt Không Hỗ Trợ Video.
                  </video>
                ) : (
                  <Image
                    width="100%"
                    src={request.mediaUrl}
                    style={{ borderRadius: 8 }}
                  />
                )
              ) : (
                <Text type="secondary">Không Có Minh Chứng</Text>
              )}
            </div>
          </Col>
        </Row>

        {/* Danh sách sản phẩm */}
        <div style={{ marginTop: 32 }}>
          <Title level={4}>Sản Phẩm Trong Đơn Hàng</Title>
          <List
            dataSource={request.items ?? []}
            bordered
            renderItem={(item) => (
              <List.Item style={{ padding: "12px 16px" }}>
                <div>
                  <strong>{item?.productName ?? "Không rõ tên sản phẩm"}</strong> — SL:{" "}
                  {item?.quantity ?? 0} — Giá:{" "}
                  {item?.priceAtTime != null
                    ? item.priceAtTime.toLocaleString() + " VND"
                    : "Không có"}
                </div>
              </List.Item>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default ReturnRequestDetail;



// import React, { useEffect, useState } from "react";
// import {
//   Typography,
//   Card,
//   Tag,
//   Image,
//   List,
//   Button,
//   message,
//   Row,
//   Col,
//   Modal,
//   Divider,
//   Descriptions,
// } from "antd";
// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   fetchReturnRequestById,
//   updateReturnRequestStatus,
// } from "../../../services/returnRequestService";

// const { Title, Text } = Typography;

// const statusInfo = {
//   PENDING: { color: "orange", icon: <ClockCircleOutlined />, label: "Chờ duyệt" },
//   APPROVED: { color: "green", icon: <CheckCircleOutlined />, label: "Đã duyệt" },
//   REJECTED: { color: "red", icon: <CloseCircleOutlined />, label: "Từ chối" },
// };

// const isVideo = (url) => {
//   const videoExtensions = [".mp4", ".webm", ".ogg"];
//   return videoExtensions.some((ext) => url?.toLowerCase().endsWith(ext));
// };

// const ReturnRequestDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [request, setRequest] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetchReturnRequestById(id);
//         setRequest(res);
//       } catch (error) {
//         console.error(error);
//         message.error("Không tìm thấy yêu cầu");
//       }
//     };
//     fetchData();
//   }, [id]);

//   const confirmUpdate = (status) => {
//     Modal.confirm({
//       title: `Xác nhận cập nhật trạng thái sang ${statusInfo[status].label}?`,
//       okText: "Xác nhận",
//       cancelText: "Huỷ",
//       onOk: () => handleUpdateStatus(status),
//     });
//   };

//   const handleUpdateStatus = async (status) => {
//     try {
//       await updateReturnRequestStatus(id, status);
//       message.success("Cập nhật trạng thái thành công");
//       navigate("/admin/return");
//     } catch (error) {
//       message.error(error.response?.data?.message || "Lỗi hệ thống");
//     }
//   };

//   if (!request) return null;

//   const status = statusInfo[request.status];

//   return (
//     <div style={{ padding: "24px" }}>
//       <Title level={3} style={{ marginBottom: 16 }}>
//         📄 Chi tiết yêu cầu đổi trả #{request.id}
//       </Title>

//       <Card
//         style={{
//           borderRadius: 12,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//           backgroundColor: "#fafafa",
//         }}
//         bodyStyle={{ padding: 24 }}
//       >
//         <Row gutter={[32, 24]}>
//           <Col xs={24} md={14}>
//             <Descriptions
//               title="🧾 Thông tin yêu cầu"
//               bordered
//               column={1}
//               size="middle"
//               style={{ background: "#fff", padding: 16, borderRadius: 8 }}
//             >
//               <Descriptions.Item label="Người yêu cầu">
//                 {request.fullName}
//               </Descriptions.Item>
//               <Descriptions.Item label="Mã đơn hàng">
//                 #{request.orderId}
//               </Descriptions.Item>
//               <Descriptions.Item label="Lý do">{request.reason}</Descriptions.Item>
//               <Descriptions.Item label="Trạng thái">
//                 <Tag color={status.color} icon={status.icon}>
//                   {request.status}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="Ngày tạo">
//                 {new Date(request.createdAt).toLocaleString()}
//               </Descriptions.Item>
//             </Descriptions>

//             {request.status === "PENDING" && (
//               <div style={{ marginTop: 24 }}>
//                 <Button
//                   type="primary"
//                   onClick={() => confirmUpdate("APPROVED")}
//                   style={{ marginRight: 12 }}
//                   icon={<CheckCircleOutlined />}
//                 >
//                   Duyệt yêu cầu
//                 </Button>
//                 <Button
//                   danger
//                   onClick={() => confirmUpdate("REJECTED")}
//                   icon={<CloseCircleOutlined />}
//                 >
//                   Từ chối yêu cầu
//                 </Button>
//               </div>
//             )}
//           </Col>

//           <Col xs={24} md={10}>
//             <Text strong style={{ display: "block", marginBottom: 8 }}>
//               📷 Minh chứng:
//             </Text>
//             {request.mediaUrl ? (
//               isVideo(request.mediaUrl) ? (
//                 <video
//                   controls
//                   width="100%"
//                   style={{ borderRadius: 8, background: "#000" }}
//                 >
//                   <source src={request.mediaUrl} type="video/mp4" />
//                 </video>
//               ) : (
//                 <Image
//                   width="100%"
//                   src={request.mediaUrl}
//                   style={{ borderRadius: 8 }}
//                   alt="Minh chứng"
//                 />
//               )
//             ) : (
//               <Text type="secondary">Không có minh chứng</Text>
//             )}
//           </Col>
//         </Row>

//         <Divider style={{ margin: "32px 0" }}>Sản phẩm trong đơn hàng</Divider>

//         <List
//           dataSource={request.items ?? []}
//           bordered
//           itemLayout="horizontal"
//           renderItem={(item) => (
//             <List.Item style={{ background: "#fff", borderRadius: 6 }}>
//               <List.Item.Meta
//                 title={<strong>{item.productName}</strong>}
//                 description={
//                   <>
//                     Số lượng: {item.quantity} — Giá:{" "}
//                     {item.priceAtTime?.toLocaleString()}₫
//                   </>
//                 }
//               />
//             </List.Item>
//           )}
//         />
//       </Card>
//     </div>
//   );
// };

// export default ReturnRequestDetail;
