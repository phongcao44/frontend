/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editReturnPolicy } from "../../../redux/slices/returnPolicySlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("Vui lòng nhập tiêu đề chính sách");
      return;
    }
    if (!editedPolicy.content?.trim()) {
      toast.error("Vui lòng nhập nội dung chính sách");
      return;
    }
    if (editedPolicy.returnDays < 1) {
      toast.error("Số ngày đổi trả phải lớn hơn 0");
      return;
    }

    try {
      const updatedPolicy = await dispatch(
        editReturnPolicy({
          id: editedPolicy.id,
          requestDTO: editedPolicy,
        })
      ).unwrap();
      toast.success("Cập nhật chính sách thành công");
      setIsEditing(false);
      onChange?.(updatedPolicy);
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật chính sách thất bại");
    }
  }, [dispatch, editedPolicy, onChange]);

  return (
    <div className="my-6 p-4 border border-gray-200 rounded-md bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-medium flex items-center justify-center mr-2">
            {returnPolicy ? 1 : 0}
          </div>
          <span
            onClick={() => navigate(`/admin/products/${productId}/return-policy`)}
            className="text-base font-medium text-gray-900 cursor-pointer hover:text-blue-500"
          >
            Chính sách đổi trả
          </span>
        </div>
        {returnPolicy && (
          <button
            onClick={handleEditToggle}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium focus:outline-none"
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        )}
      </div>

      {returnPolicy ? (
        isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề chính sách
              </label>
              <input
                type="text"
                value={editedPolicy.title}
                onChange={(e) => handlePolicyChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Nhập tiêu đề chính sách"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung chính sách
              </label>
              <textarea
                value={editedPolicy.content}
                onChange={(e) => handlePolicyChange("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Nhập nội dung chính sách"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số ngày đổi trả
              </label>
              <input
                type="number"
                min={1}
                value={editedPolicy.returnDays}
                onChange={(e) =>
                  handlePolicyChange("returnDays", parseInt(e.target.value) || 7)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={editedPolicy.status}
                onChange={(e) => handlePolicyChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedPolicy.allowReturnWithoutReason}
                  onChange={(e) =>
                    handlePolicyChange("allowReturnWithoutReason", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Cho phép đổi trả không cần lý do
                </span>
              </label>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Lưu chính sách
            </button>
          </div>
        ) : (
          <div
            onClick={() => navigate(`/admin/products/${productId}/return-policy`)}
            className="flex justify-between items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Tiêu đề: {returnPolicy.title}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                Số ngày: {returnPolicy.returnDays}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  returnPolicy.status === "ACTIVE"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                } border`}
              >
                {returnPolicy.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                {returnPolicy.allowReturnWithoutReason
                  ? "Cho phép đổi trả không lý do"
                  : "Yêu cầu lý do đổi trả"}
              </span>
            </div>
          </div>
        )
      ) : (
        <div className="p-2 text-gray-500 text-sm">
          Chưa có chính sách đổi trả được chọn
        </div>
      )}
    </div>
  );
};

export default ReturnPolicyEditor;