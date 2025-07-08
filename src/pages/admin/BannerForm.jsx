/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Input, Switch } from "antd";
import { X, Upload as UploadIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBanners,
  createBanner,
  editBanner,
} from "../../redux/slices/bannerSlice";

export default function BannerFormModal({ open, onClose, id }) {
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banner);

  const editingBanner = id ? banners.find((b) => b.id === id) : null;

  const [formData, setFormData] = useState({
    title: "",
    position: "HOME_TOP",
    status: true,
    timeStart: "",
    timeEnd: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (id && banners.length === 0) {
      dispatch(getBanners());
    }
  }, [dispatch, id, banners.length]);

  useEffect(() => {
    if (editingBanner) {
      setFormData({
        title: editingBanner.title || "",
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

  const handleStatusChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      status: checked,
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

  const handleSubmit = () => {
    const form = new FormData();

    form.append("title", formData.title);
    form.append("position", formData.position);
    form.append("status", formData.status ? "true" : "false");

    const isoStart = new Date(formData.timeStart).toISOString();
    const isoEnd = new Date(formData.timeEnd).toISOString();
    form.append("startAt", isoStart);
    form.append("endAt", isoEnd);

    if (selectedFile) {
      form.append("image", selectedFile);
    }

    console.log([...form.entries()]);

    if (id) {
      dispatch(
        editBanner({
          id,
          payload: {
            title: formData.title,
            position: formData.position,
            status: formData.status,
            timeStart: isoStart,
            timeEnd: isoEnd,
            image: selectedFile,
          },
        })
      );
    } else {
      dispatch(createBanner(form));
    }

    handleClose();
  };

  const handleReset = () => {
    setFormData({
      title: "",
      position: "HOME_TOP",
      status: true,
      timeStart: "",
      timeEnd: "",
    });
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      title={id ? "Chỉnh sửa banner" : "Thêm mới banner"}
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={id ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      width={600}
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tiêu đề</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Vị trí</label>
        <Input
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Trạng thái</label>
        <Switch checked={formData.status} onChange={handleStatusChange} /> Kích
        hoạt
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Bắt đầu</label>
          <Input
            type="datetime-local"
            name="timeStart"
            value={formData.timeStart}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kết thúc</label>
          <Input
            type="datetime-local"
            name="timeEnd"
            value={formData.timeEnd}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Ảnh</label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="w-64 rounded" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded">
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
    </Modal>
  );
}
