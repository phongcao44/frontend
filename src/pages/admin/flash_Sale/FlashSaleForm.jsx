/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFlashSale,
  updateFlashSale,
} from "../../../redux/slices/flashSaleSlice";

export default function FlashSaleForm({ flashSale, onClose, isOpen, existingFlashSales }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.flashSale);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (flashSale) {
      setFormData({
        name: flashSale.name || "",
        description: flashSale.description || "",
        startTime: flashSale.startTime?.slice(0, 16) || "",
        endTime: flashSale.endTime?.slice(0, 16) || "",
        status: flashSale.status || "ACTIVE",
      });
      setErrors({});
    } else {
      setFormData({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        status: "ACTIVE",
      });
      setErrors({});
    }
  }, [flashSale, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Tên Flash Sale là bắt buộc";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên Flash Sale không được vượt quá 100 ký tự";
    } else if (
      existingFlashSales.some(
        (sale) => 
          sale.name.trim().toLowerCase() === formData.name.trim().toLowerCase() && 
          (!flashSale || sale.id !== flashSale.id)
      )
    ) {
      newErrors.name = "Tên Flash Sale đã tồn tại";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự";
    }

    // Date validation
    if (!formData.startTime) {
      newErrors.startTime = "Thời gian bắt đầu là bắt buộc";
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "Thời gian kết thúc là bắt buộc";
    }

    // Validate date range
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const now = new Date();

      if (start >= end) {
        newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }

      if (start < now && !flashSale) {
        newErrors.startTime = "Thời gian bắt đầu phải từ hiện tại trở đi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (flashSale) {
        await dispatch(updateFlashSale({ id: flashSale.id, data: formData })).unwrap();
      } else {
        await dispatch(createFlashSale(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || "Có lỗi xảy ra khi xử lý" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {flashSale ? "Chỉnh sửa Flash Sale" : "Tạo Flash Sale mới"}
        </h1>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên Flash Sale
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Kích hoạt</option>
                <option value="INACTIVE">Tạm dừng</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-500`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Thời gian kết thúc
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-500`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-blue-500`}
              placeholder="Mô tả chi tiết..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md flex items-center space-x-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>{flashSale ? "Cập nhật" : "Tạo mới"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}