/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createAdminPost,
  updateAdminPost,
} from "../../../redux/slices/postSlice";
import { UploadIcon, X } from "lucide-react";
import { POST_CATEGORIES } from "../../../constants/postCategories";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ViewPostModal({
  show,
  onClose,
  post,
  mode,
  formatDate,
  setMode,
}) {
  const dispatch = useDispatch();

  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    content: "",
    location: "",
    image: null,
    imageUrl: "",
  });

  useEffect(() => {
    if (post && !isAdd) {
      setEditData({
        title: post.title || "",
        description: post.description || "",
        content: post.content || "",
        location: post.location || "",
        image: null,
        imageUrl: post.image || "",
      });
    } else if (isAdd) {
      setEditData({
        title: "",
        description: "",
        content: "",
        location: "",
        image: null,
        imageUrl: "",
      });
    }
  }, [post, isAdd]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    setEditData((prev) => ({
      ...prev,
      image: null,
      imageUrl: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const formData = new FormData();

    formData.append("title", editData.title);
    if (editData.image) {
      formData.append("image", editData.image);
    }
    formData.append("content", editData.content);
    formData.append("description", editData.description);
    formData.append("location", editData.location);

    console.log([...formData.entries()]);

    if (isAdd) {
      dispatch(createAdminPost(formData)).then(() => onClose());
    } else if (isEdit && post?.id) {
      dispatch(updateAdminPost({ id: post.id, formData })).then(() =>
        onClose()
      );
    }
  };

  const cancelEdit = () => {
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isAdd
              ? "Thêm bài viết mới"
              : isEdit
                ? "Chỉnh sửa bài viết"
                : "Chi tiết bài viết"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Ảnh</label>
          {isAdd || isEdit ? (
            editData.imageUrl ? (
              <div className="relative inline-block">
                <img
                  src={editData.imageUrl}
                  alt="Preview"
                  className="w-64 rounded"
                />
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
            )
          ) : (
            post?.image && (
              <img
                src={post.image}
                alt="Ảnh bài viết"
                className="w-full h-64 object-cover rounded"
              />
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Tiêu đề</p>
            {isAdd || isEdit ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <p className="text-base text-gray-900">{editData.title}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mục bài viết</p>
            {isAdd || isEdit ? (
              <select
                name="location"
                value={editData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">-- Chọn mục --</option>
                {POST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-base text-gray-900">{editData.location}</p>
            )}
          </div>

          {!isAdd && post && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                <p className="text-base text-gray-900">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Cập nhật lần cuối
                </p>
                <p className="text-base text-gray-900">
                  {formatDate(post.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tác giả</p>
                <p className="text-base text-gray-900">
                  {post.authorName || "Không có tác giả"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">Mô tả</p>
          {isAdd || isEdit ? (
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            <p className="text-base text-gray-900">{editData.description}</p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">Nội dung</p>
          {isAdd || isEdit ? (
            <ReactQuill
              value={editData.content}
              onChange={(value) =>
                setEditData((prev) => ({ ...prev, content: value }))
              }
            />
          ) : (
            <div
              className="prose max-w-none bg-gray-50 border p-4 rounded"
              dangerouslySetInnerHTML={{ __html: editData.content }}
            />

          )}
        </div>

        <div className="flex justify-end space-x-2">
          {isAdd || isEdit ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
              <button
                onClick={() => setMode("edit")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <i className="fas fa-edit mr-2"></i> Chỉnh sửa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
