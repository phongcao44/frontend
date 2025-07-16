/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { Tag, Input, InputNumber, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editReturnPolicy } from "../../redux/slices/returnPolicySlice";

const { Option } = Select;

const ReturnPolicyEditor = ({ returnPolicy, productId, onChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState(
    returnPolicy || {
      title: "",
      content: "",
      returnDays: 7,
      allowReturnWithoutReason: false,
      status: "ACTIVE",
    }
  );

  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (!isEditing && returnPolicy) {
      setEditedPolicy(returnPolicy);
    }
  }, [isEditing, returnPolicy]);

  const handlePolicyChange = useCallback((field, value) => {
    setEditedPolicy((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editedPolicy.title?.trim()) {
      message.error("Vui lòng nhập tiêu đề chính sách");
      return;
    }
    if (!editedPolicy.content?.trim()) {
      message.error("Vui lòng nhập nội dung chính sách");
      return;
    }
    if (editedPolicy.returnDays < 1) {
      message.error("Số ngày đổi trả phải lớn hơn 0");
      return;
    }

    try {
      const updatedPolicy = await dispatch(
        editReturnPolicy({
          id: editedPolicy.id,
          requestDTO: editedPolicy,
        })
      ).unwrap();
      message.success("Cập nhật chính sách thành công");
      setIsEditing(false);
      onChange?.(updatedPolicy);
    } catch (err) {
      console.error(err);
      message.error("Cập nhật chính sách thất bại");
    }
  }, [dispatch, editedPolicy, onChange]);

  return (
    <div
      style={{
        marginTop: 24,
        marginBottom: 24,
        padding: 16,
        borderRadius: 6,
        border: "1px solid #e8e8e8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#722ed1",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            {returnPolicy ? 1 : 0}
          </div>
          <span
            // onClick={() =>
            //   navigate(`/admin/products/${productId}/return-policy`)
            // }
            style={{ fontWeight: 500, cursor: "pointer" }}
          >
            Chính sách đổi trả
          </span>
        </div>
        {returnPolicy && (
          <Button type="link" onClick={handleEditToggle}>
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </Button>
        )}
      </div>

      {returnPolicy ? (
        isEditing ? (
          <div style={{ padding: "8px 0" }}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
              >
                Tiêu đề chính sách
              </label>
              <Input
                value={editedPolicy.title}
                onChange={(e) => handlePolicyChange("title", e.target.value)}
                placeholder="Nhập tiêu đề chính sách"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
              >
                Nội dung chính sách
              </label>
              <Input.TextArea
                value={editedPolicy.content}
                onChange={(e) => handlePolicyChange("content", e.target.value)}
                placeholder="Nhập nội dung chính sách"
                rows={4}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
              >
                Số ngày đổi trả
              </label>
              <InputNumber
                value={editedPolicy.returnDays}
                onChange={(value) => handlePolicyChange("returnDays", value)}
                min={1}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
              >
                Trạng thái
              </label>
              <Select
                value={editedPolicy.status}
                onChange={(value) => handlePolicyChange("status", value)}
                style={{ width: "100%" }}
              >
                <Option value="ACTIVE">Hoạt động</Option>
                <Option value="INACTIVE">Không hoạt động</Option>
              </Select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={editedPolicy.allowReturnWithoutReason}
                  onChange={(e) =>
                    handlePolicyChange(
                      "allowReturnWithoutReason",
                      e.target.checked
                    )
                  }
                  style={{ marginRight: 8 }}
                />
                Cho phép đổi trả không cần lý do
              </label>
            </div>
            <Button type="primary" onClick={handleSave}>
              Lưu chính sách
            </Button>
          </div>
        ) : (
          <div
            onClick={() =>
              navigate(`/admin/products/${productId}/return-policy`)
            }
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <Tag color="blue">Tiêu đề: {returnPolicy.title}</Tag>
              <Tag color="purple">Số ngày: {returnPolicy.returnDays}</Tag>
              <Tag color={returnPolicy.status === "ACTIVE" ? "green" : "red"}>
                {returnPolicy.status === "ACTIVE"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </Tag>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <Tag color="orange">
                {returnPolicy.allowReturnWithoutReason
                  ? "Cho phép đổi trả không lý do"
                  : "Yêu cầu lý do đổi trả"}
              </Tag>
            </div>
          </div>
        )
      ) : (
        <div style={{ padding: "8px 0", color: "#888" }}>
          Chưa có chính sách đổi trả được chọn
        </div>
      )}
    </div>
  );
};

export default ReturnPolicyEditor;
