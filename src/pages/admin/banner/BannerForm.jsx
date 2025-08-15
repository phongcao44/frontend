import { useState, useEffect, useCallback, useRef } from "react";
import { X, Upload as UploadIcon, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBanners,
  createBanner,
  editBanner,
} from "../../../redux/slices/bannerSlice";
import {
  loadProductsPaginate,
  loadProductBySlug,
} from "../../../redux/slices/productSlice";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export default function BannerFormModal({ open, onClose, id }) {
  const dispatch = useDispatch();
  const {
    banners,
    loading: bannerLoading,
    error: bannerError,
  } = useSelector((state) => state.banner);
  const {
    paginated,
    loading: productsLoading,
    error: productsError,
    productDetail,
  } = useSelector((state) => state.products);
  const products = paginated?.data?.content || [];

  const editingBanner = id ? (banners || []).find((b) => b.id === id) : null;
  console.log("id:", id, "banners:", banners, "editingBanner:", editingBanner);

  const [isProductDetailLoading, setIsProductDetailLoading] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      keyword: debouncedSearchTerm || null,
    };
    dispatch(loadProductsPaginate(params)).catch((err) => {
      console.error("Error loading products:", err);
      setLocalError(err.message || "Không thể tải danh sách sản phẩm");
    });
  }, [dispatch, currentPage, itemsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    if (
      id &&
      (!banners || banners.length === 0) &&
      !bannerLoading &&
      !bannerError
    ) {
      dispatch(getBanners()).catch((err) => {
        console.error("Error loading banners:", err);
        setLocalError(err.message || "Không load được dữ liệu");
      });
    }
  }, [dispatch, id, banners, bannerLoading, bannerError]);

  useEffect(() => {
    if (editingBanner && editingBanner.targetUrl) {
      console.log("Loading product for targetUrl:", editingBanner.targetUrl);
      setIsProductDetailLoading(true);
      dispatch(loadProductBySlug(editingBanner.targetUrl))
        .unwrap()
        .then((product) => {
          console.log("Loaded product:", product);
          setSearchTerm(product.name || "");
          setIsProductDetailLoading(false);
        })
        .catch((err) => {
          console.error("Error loading product:", err);
          setLocalError(err.message || "Không thể tải thông tin sản phẩm");
          setIsProductDetailLoading(false);
        });
    }
  }, [dispatch, editingBanner]);

  useEffect(() => {
    console.log("Updating formData with editingBanner:", editingBanner);
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
      setDebouncedSearchTerm("");
      setCurrentPage(0);
      setErrors({});
    } else {
      handleReset();
    }
  }, [editingBanner]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.length > 100) {
      newErrors.title = "Tiêu đề không được vượt quá 100 ký tự";
    } else if (
      banners.some(
        (banner) =>
          banner.title.trim().toLowerCase() ===
            formData.title.trim().toLowerCase() &&
          (!id || banner.id !== id)
      )
    ) {
      newErrors.title = "Tiêu đề banner đã tồn tại";
    }

    if (!formData.targetUrl) {
      newErrors.targetUrl = "Vui lòng chọn một sản phẩm";
    }

    if (!formData.position) {
      newErrors.position = "Vị trí là bắt buộc";
    }

    if (!formData.timeStart) {
      newErrors.timeStart = "Thời gian bắt đầu là bắt buộc";
    }

    if (!formData.timeEnd) {
      newErrors.timeEnd = "Thời gian kết thúc là bắt buộc";
    }

    if (formData.timeStart && formData.timeEnd) {
      const start = new Date(formData.timeStart);
      const end = new Date(formData.timeEnd);

      if (start >= end) {
        newErrors.timeEnd = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }

    if (!id && !selectedFile && !imagePreview) {
      newErrors.image = "Ảnh banner là bắt buộc khi tạo mới";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const form = new FormData();
      form.append("title", formData.title || "Unknown");
      form.append("targetUrl", formData.targetUrl);
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
        dispatch(editBanner({ id, payload: form }));
      } else {
        dispatch(createBanner(form));
      }

      handleClose();
    } catch (err) {
      setErrors({ submit: err.message || "Không thể lưu banner" });
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
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(0);
    setErrors({});
    setIsProductDetailLoading(false);
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleProductSelect = (productSlug) => {
    const selectedProduct = products.find((p) => p.slug === productSlug);
    setFormData((prev) => ({
      ...prev,
      targetUrl: productSlug,
    }));
    setSearchTerm(selectedProduct?.name || "");
    setIsDropdownOpen(false);
    setDebouncedSearchTerm("");
  };

  const handleSearchFocus = () => {
    setIsDropdownOpen(true);
  };

  const totalPages = paginated?.data?.totalPages || 1;

  const isLoading =
    bannerLoading || productsLoading || (id && isProductDetailLoading);
  console.log(
    "isLoading:",
    isLoading,
    "bannerLoading:",
    bannerLoading,
    "productsLoading:",
    productsLoading,
    "isProductDetailLoading:",
    isProductDetailLoading,
    "hasEditingBanner:",
    !!editingBanner
  );

  const hasError = bannerError || productsError || localError;

  if (!open) return null;

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-sm mb-4">
              {bannerError?.message ||
                productsError?.message ||
                localError ||
                "Không load được dữ liệu"}
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

  if (isLoading || (id && !editingBanner) || !paginated?.data?.content) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100">
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

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block mb-1 font-medium text-gray-700">
            Sản phẩm liên kết
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              ref={inputRef}
              className={`w-full px-3 py-2 border ${
                errors.targetUrl ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {productsLoading ? (
                  <div className="p-3 text-center text-gray-500">
                    Đang tải...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-3 text-center text-gray-500">
                    Không tìm thấy sản phẩm
                  </div>
                ) : (
                  <>
                    {products.map((product) => (
                      <div
                        key={product.slug}
                        onClick={() => handleProductSelect(product.slug)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {product.name}
                      </div>
                    ))}
                    <div className="p-2 border-t border-gray-200 flex justify-between">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={currentPage === 0}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        Trước
                      </button>
                      <span className="text-sm text-gray-600">
                        Trang {currentPage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages - 1)
                          )
                        }
                        disabled={currentPage >= totalPages - 1}
                        className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {errors.targetUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.targetUrl}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Vị trí</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.position ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            disabled
          >
            <option value="HOME_TOP">HOME_TOP</option>
          </select>
          {errors.position && (
            <p className="mt-1 text-sm text-red-500">{errors.position}</p>
          )}
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
              className={`w-full px-3 py-2 border ${
                errors.timeStart ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.timeStart && (
              <p className="mt-1 text-sm text-red-500">{errors.timeStart}</p>
            )}
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
              className={`w-full px-3 py-2 border ${
                errors.timeEnd ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.timeEnd && (
              <p className="mt-1 text-sm text-red-500">{errors.timeEnd}</p>
            )}
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
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
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