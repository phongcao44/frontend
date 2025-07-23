import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
const PolicyModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    returnDays: 7,
    allowReturnWithoutReason: false,
    status: "ACTIVE",
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề chính sách");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung chính sách");
      return;
    }
    if (formData.returnDays < 1) {
      toast.error("Số ngày đổi trả phải lớn hơn 0");
      return;
    }
    onSubmit(formData);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Thêm chính sách đổi trả mới
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề chính sách
            </label>
            <input
              type="text"
              placeholder="Tiêu đề chính sách"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              placeholder="Mô tả chi tiết chính sách"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số ngày đổi trả
            </label>
            <input
              type="number"
              min={1}
              placeholder="Số ngày đổi trả"
              value={formData.returnDays}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  returnDays: parseInt(e.target.value) || 7,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowReturnWithoutReason}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  allowReturnWithoutReason: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              disabled={loading}
            />
            <span className="ml-2 text-sm">
              Cho phép đổi trả không cần lý do
            </span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PolicyModal;
