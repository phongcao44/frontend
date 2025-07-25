/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X, Upload as UploadIcon, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBanners,
  createBanner,
  editBanner,
} from "../../../redux/slices/bannerSlice";
import { loadProducts, loadProductsPaginate } from "../../../redux/slices/productSlice";

export default function BannerFormModal({ open, onClose, id }) {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banner);
  const { paginated } = useSelector((state) => state.products);
  const products = paginated?.data?.content || [];

  const editingBanner = id ? (banners || []).find((b) => b.id === id) : null;

  const [formData, setFormData] = useState({
    title: "",
    targetUrl: "",
    position: "HOME_TOP",
    status: true,
    timeStart: "",
    timeEnd: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(loadProductsPaginate({ page: 0, limit: 100 }));
  }, [dispatch]);



  useEffect(() => {
    if (id && (!banners || banners.length === 0) && !loading && !error) {
      dispatch(getBanners()).catch((err) => {
        setLocalError(err.message || "Không load được dữ liệu");
      });
    }
  }, [dispatch, id, banners, loading, error]);

  useEffect(() => {
    if (editingBanner) {
      setFormData({
        title: editingBanner.title || "Unknown",
        targetUrl: editingBanner.targetUrl || "",
        position: editingBanner.position || "HOME_TOP",
        status: editingBanner.status ?? true,
        timeStart: editingBanner.startAt
          ? editingBanner.startAt.slice(0, 16)
          : "",
        timeEnd: editingBanner.endAt ? editingBanner.endAt.slice(0, 16) : "",
      });
      setImagePreview(editingBanner.bannerUrl || null);
    } else {
      handleReset();
    }
  }, [editingBanner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };
console.log("➡️ Submitting banner with:", formData);

  const handleSubmit = () => {
    try {
      const form = new FormData();
      form.append("title", formData.title || "Unknown");
      form.append("targetUrl", formData.targetUrl);
      console.log("📦 form.targetUrl:", form.get("targetUrl"));

      form.append("position", formData.position || "HOME_TOP");
      form.append("status", formData.status ? "true" : "false");

      const isoStart = formData.timeStart
        ? new Date(formData.timeStart).toISOString()
        : new Date().toISOString();
      const isoEnd = formData.timeEnd
        ? new Date(formData.timeEnd).toISOString()
        : new Date().toISOString();
      form.append("startAt", isoStart);
      form.append("endAt", isoEnd);

      if (selectedFile) {
        form.append("image", selectedFile);
      }

      if (id) {
        dispatch(
          editBanner({
            id,
            payload: {
              title: formData.title || "Unknown",
              targetUrl: formData.targetUrl,
              position: formData.position || "HOME_TOP",
              status: formData.status,
              image: selectedFile,
              timeStart: formData.timeStart,
              timeEnd: formData.timeEnd,
            },
          })
        );
      } else {
        console.log("📦 Creating new banner with form:", form);
        dispatch(createBanner(form));
      }

      handleClose();
    } catch (err) {
      setLocalError(err.message || "Không thể lưu banner");
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      targetUrl: "",
      position: "HOME_TOP",
      status: true,
      timeStart: "",
      timeEnd: "",
    });
    setImagePreview(null);
    setSelectedFile(null);
    setLocalError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (error || localError) {
    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-sm mb-4">
              {error?.message || localError || "Không load được dữ liệu"}
            </p>
            <button
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {id ? "Chỉnh sửa banner" : "Thêm mới banner"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Sản phẩm liên kết</label>
          <select
            name="targetUrl"
            value={formData.targetUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((product) => (
              <option key={product.id} value={`${product.id}`}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Vị trí</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="HOME_TOP">HOME_TOP</option>
            <option value="HOME_MIDDLE">HOME_MIDDLE</option>
            <option value="HOME_BOTTOM">HOME_BOTTOM</option>
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <label className="mr-2 font-medium text-gray-700">Trạng thái</label>
          <input
            type="checkbox"
            checked={formData.status}
            onChange={handleStatusChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">Kích hoạt</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Bắt đầu
            </label>
            <input
              type="datetime-local"
              name="timeStart"
              value={formData.timeStart}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Kết thúc
            </label>
            <input
              type="datetime-local"
              name="timeEnd"
              value={formData.timeEnd}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Ảnh</label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="w-64 rounded" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
              <UploadIcon size={20} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {id ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
