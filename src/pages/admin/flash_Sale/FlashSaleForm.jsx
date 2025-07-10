/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  createFlashSale,
  updateFlashSale,
} from "../../../redux/slices/flashSaleSlice";

export default function FlashSaleFormModal({ flashSale, onClose, isOpen }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (flashSale) {
      setFormData({
        name: flashSale.name || "",
        description: flashSale.description || "",
        startTime: flashSale.startTime?.slice(0, 16) || "",
        endTime: flashSale.endTime?.slice(0, 16) || "",
        status: flashSale.status || "ACTIVE",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        status: "ACTIVE",
      });
    }
  }, [flashSale, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flashSale) {
      dispatch(updateFlashSale({ id: flashSale.id, data: formData }))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch(console.error);
    } else {
      dispatch(createFlashSale(formData))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch(console.error);
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả chi tiết..."
            />
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {flashSale ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
