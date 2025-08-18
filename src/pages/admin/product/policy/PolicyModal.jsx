import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({});

  // Reset formData and errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        content: "",
        returnDays: 7,
        allowReturnWithoutReason: false,
        status: "ACTIVE",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!formData.title?.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề chính sách";
    } else if (formData.title.trim().length < 2 || formData.title.trim().length > 100) {
      newErrors.title = "Tiêu đề phải từ 2 đến 100 ký tự";
    } else {
      const validTitlePattern = /^[a-zA-Z0-9\s\-\&\/\(\)\.\u00C0-\u1EF9]*$/;
      if (!validTitlePattern.test(formData.title.trim())) {
        newErrors.title = "Tiêu đề chỉ được chứa chữ, số, khoảng trắng, hoặc các ký tự -, &, /, (, ), .";
      } else {
        const hasHTML = /<[a-z][\s\S]*>/i.test(formData.title);
        if (hasHTML) {
          newErrors.title = "Tiêu đề không được chứa thẻ HTML";
        }
      }
    }

    // Validate content
    if (!formData.content?.trim()) {
      newErrors.content = "Vui lòng nhập nội dung chính sách";
    } else if (formData.content.trim().length < 10 || formData.content.trim().length > 5000) {
      newErrors.content = "Nội dung phải từ 10 đến 5000 ký tự";
    } else {
      const validContentPattern = /^[a-zA-Z0-9\s\-\&\/\(\)\.\%\:\,\u00C0-\u1EF9]*$/;
      if (!validContentPattern.test(formData.content.trim())) {
        newErrors.content = "Nội dung chỉ được chứa chữ, số, khoảng trắng, hoặc các ký tự -, &, /, (, ), ., %, :, ,";
      } else {
        const hasHTML = /<[a-z][\s\S]*>/i.test(formData.content);
        if (hasHTML) {
          newErrors.content = "Nội dung không được chứa thẻ HTML";
        }
      }
    }

    // Validate returnDays
    if (formData.returnDays === null || formData.returnDays === undefined || isNaN(formData.returnDays)) {
      newErrors.returnDays = "Số ngày đổi trả phải là số!";
    } else if (formData.returnDays < 1) {
      newErrors.returnDays = "Số ngày đổi trả phải lớn hơn 0";
    } else if (formData.returnDays > 365) {
      newErrors.returnDays = "Số ngày đổi trả không được vượt quá 365 ngày";
    } else if (!Number.isInteger(formData.returnDays)) {
      newErrors.returnDays = "Số ngày đổi trả phải là số nguyên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu!");
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
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
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              placeholder="Mô tả chi tiết chính sách"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={4}
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content}</p>
            )}
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
                handleInputChange("returnDays", parseInt(e.target.value) || "")
              }
              className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.returnDays ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.returnDays && (
              <p className="text-red-500 text-xs mt-1">{errors.returnDays}</p>
            )}
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowReturnWithoutReason}
              onChange={(e) =>
                handleInputChange("allowReturnWithoutReason", e.target.checked)
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
              onChange={(e) => handleInputChange("status", e.target.value)}
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
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
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