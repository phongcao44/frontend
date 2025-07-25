/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

const CategoryModal = ({
  isVisible,
  modalMode,
  formData,
  editingCategory,
  categories,
  onSubmit,
  onCancel,
  onInputChange,
  onLevelChange,
  loading,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [inputKey, setInputKey] = useState(0);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (formData.image && typeof formData.image === "string") {
      setImagePreview(formData.image);
    } else if (formData.image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(formData.image);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }, [formData.image]);

  const getParentIdLevel1 = useCallback(() => {
    if (formData.level === 3 && formData.parentId) {
      const parentCategory = categories.find(
        (cat) => cat.id === Number(formData.parentId)
      );
      return parentCategory ? String(parentCategory.parentId) : "";
    }
    return formData.parentIdLevel1 !== undefined
      ? String(formData.parentIdLevel1)
      : "";
  }, [formData.level, formData.parentId, formData.parentIdLevel1, categories]);

  const parentIdLevel1 = getParentIdLevel1();

  const getParentOptions = (level, editingCategoryId, parentLevel1Id) => {
    const parentLevel = level - 1;
    const options = categories.filter((category) => {
      if (category.id === editingCategoryId) return false;
      if ((category.level || 1) !== parentLevel) return false;
      if (parentLevel === 2 && parentLevel1Id) {
        return category.parentId === Number(parentLevel1Id);
      }
      return true;
    });
    return options;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.name?.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên danh mục phải có ít nhất 2 ký tự";
    } else {
      // Check for duplicate category name
      const isDuplicate = categories.some(
        (cat) => 
          cat.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          cat.id !== (editingCategory?.id || null)
      );
      if (isDuplicate) {
        newErrors.name = "Tên danh mục đã tồn tại";
      }
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (modalMode === "add" && !formData.image) {
      newErrors.image = "Vui lòng chọn một hình ảnh";
    }

    if (formData.level > 1 && !formData.parentId) {
      newErrors.parentId = "Vui lòng chọn danh mục cha";
    }

    if (formData.level === 3 && !parentIdLevel1) {
      newErrors.parentIdLevel1 = "Vui lòng chọn danh mục cha cấp 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          onInputChange({ target: { name: "image", value: file } });
          setErrors((prev) => ({ ...prev, image: null }));
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
        onInputChange({ target: { name: "image", value: null } });
        setErrors((prev) => ({ ...prev, image: "Vui lòng chọn một hình ảnh" }));
      }
    },
    [onInputChange]
  );

  const handleRemoveImage = () => {
    setImagePreview(null);
    onInputChange({ target: { name: "image", value: null } });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setInputKey((prev) => prev + 1);
    if (modalMode === "add") {
      setErrors((prev) => ({ ...prev, image: "Vui lòng chọn một hình ảnh" }));
    }
  };

  const handleParentIdLevel1Change = (e) => {
    const newParentIdLevel1 = e.target.value || "";
    onInputChange({ target: { name: "parentIdLevel1", value: newParentIdLevel1 } });
    onInputChange({ target: { name: "parentId", value: "" } });
    setErrors((prev) => ({ ...prev, parentIdLevel1: null, parentId: null }));
  };

  const handleInputChange = (e) => {
    onInputChange(e);
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleLevelChange = (e) => {
    onLevelChange(e);
    setErrors((prev) => ({ ...prev, parentId: null, parentIdLevel1: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    } else {
      Swal.fire("Lỗi", "Vui lòng kiểm tra và điền đầy đủ các trường bắt buộc!", "error");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg relative">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {modalMode === "add" ? "Thêm danh mục mới" : "Sửa danh mục"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ảnh
              </label>
              <div className="border border-gray-300 rounded-lg p-2 text-center bg-gray-100 relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-16 w-16 object-cover mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Xóa ảnh"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400">Chọn ảnh mới</span>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  ref={fileInputRef}
                  key={`file-input-${inputKey}`}
                />
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
              </div>
            </div>
            <div className="w-3/4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên danh mục
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Nhập tên danh mục"
                className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Nhập mô tả cho danh mục"
              className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : ''}`}
              rows={3}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cấp độ
            </label>
            <select
              value={formData.level || 1}
              onChange={handleLevelChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={1}>Cấp 1 - Danh mục chính</option>
              <option value={2}>Cấp 2 - Danh mục phụ</option>
              <option value={3}>Cấp 3 - Danh mục con</option>
            </select>
          </div>

          {formData.level === 2 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Danh mục cha
              </label>
              <select
                name="parentId"
                value={formData.parentId || ""}
                onChange={(e) => {
                  handleInputChange({ target: { name: "parentId", value: e.target.value } });
                }}
                className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.parentId ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Chọn danh mục cha</option>
                {getParentOptions(2, editingCategory?.id).map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {"—".repeat((option.level || 1) - 1)} {option.name}
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>
              )}
            </div>
          )}

          {formData.level === 3 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Danh mục cha cấp 1
                </label>
                <select
                  name="parentIdLevel1"
                  value={parentIdLevel1 || ""}
                  onChange={handleParentIdLevel1Change}
                  className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${errors.parentIdLevel1 ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Chọn danh mục cha cấp 1</option>
                  {categories
                    .filter(
                      (category) => (category.level || 1) === 1 && category.id !== editingCategory?.id
                    )
                    .map((option) => (
                      <option key={option.id} value={String(option.id)}>
                        {option.name}
                      </option>
                    ))}
                </select>
                {errors.parentIdLevel1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.parentIdLevel1}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Danh mục cha cấp 2
                </label>
                <select
                  name="parentId"
                  value={formData.parentId || ""}
                  onChange={(e) => {
                    handleInputChange({ target: { name: "parentId", value: e.target.value } });
                  }}
                  className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.parentId ? 'border-red-500' : ''}`}
                  required
                  disabled={!parentIdLevel1}
                >
                  <option value="">Chọn danh mục cha cấp 2</option>
                  {getParentOptions(3, editingCategory?.id, parentIdLevel1).map(
                    (option) => (
                      <option key={option.id} value={String(option.id)}>
                        {option.name}
                      </option>
                    )
                  )}
                </select>
                {errors.parentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-blue-300"
              disabled={loading}
            >
              {modalMode === "add" ? "Thêm mới" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;