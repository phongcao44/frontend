import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Typography, Space, Popconfirm, message, Tag, Input, Card, Avatar } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  fetchAdminContacts,
  removeAdminContact,
} from "../../../redux/slices/contactSlice";

const { Title, Text } = Typography;

const ContactManagement = () => {
  const dispatch = useDispatch();
  const { contacts, listLoading, listError, deleteLoadingId } = useSelector(
    (s) => s.contact
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAdminContacts());
  }, [dispatch]);

  useEffect(() => {
    if (listError) message.error(listError?.message || "Tải danh sách thất bại");
  }, [listError]);

  // Reload button removed; list auto-refreshes after delete

  const onDelete = async (id) => {
    const res = await dispatch(removeAdminContact(id));
    if (removeAdminContact.fulfilled.match(res)) {
      message.success("Đã xóa liên hệ");
      // Refetch to ensure data is consistent with DB after deletion
      dispatch(fetchAdminContacts());
    } else {
      const errMsg = res?.payload?.message || "Xóa thất bại";
      message.error(errMsg);
    }
  };

  const baseData = useMemo(() => {
    return (contacts || []).map((c, idx) => ({
      key: c.id ?? idx,
      id: c.id,
      name: c.name || c.fullName || c.username || "-",
      email: c.email || "-",
      phone: c.phone || c.phoneNumber || "-",
      message: c.comment || c.message || c.content || "-",
      createdAt: c.createTime || c.createdAt || c.created_date || c.created_at || c.createAt || "-",
    }));
  }, [contacts]);

  const dataSource = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return baseData;
    return baseData.filter((row) =>
      [row.name, row.email, row.phone, row.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [baseData, searchTerm]);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => (a.id || 0) - (b.id || 0),
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (val) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1677ff" }}>
            {String(val || "?").charAt(0).toUpperCase()}
          </Avatar>
          <span>{val}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      render: (val) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {val}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (val) => {
        if (!val) return "-";
        const d = new Date(val);
        const formatted = isNaN(d.getTime()) ? String(val) : d.toLocaleString();
        return <Tag color="blue">{formatted}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xóa liên hệ"
            description={`Bạn có chắc muốn xóa liên hệ #${record.id}?`}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(record.id)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteLoadingId === record.id}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7fb" }}>
      <Card bordered style={{ borderRadius: 10 }} bodyStyle={{ padding: 16 }}>
        <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 12 }}>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý liên hệ
          </Title>
          <Space>
            <Input.Search
              allowClear
              placeholder="Tìm theo tên, email, SĐT, nội dung"
              onSearch={setSearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 360 }}
            />
          </Space>
        </Space>

        <Table
          bordered
          size="middle"
          sticky
          loading={listLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} liên hệ`,
          }}
          scroll={{ x: 1000 }}
          rowKey={(row) => row.id ?? row.key}
        />
      </Card>
    </div>
  );
};

export default ContactManagement;
