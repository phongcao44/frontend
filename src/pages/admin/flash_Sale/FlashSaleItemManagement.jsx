import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Download,
  Tag,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import Select from "react-select";
import {
  createFlashSaleItem,
  removeFlashSaleItem,
  fetchFlashSaleVariantDetails,
  updateFlashSaleItem,
} from "../../../redux/slices/flashSaleSlice";
import {
  loadProductsPaginate,
  loadProductById,
} from "../../../redux/slices/productSlice";
import Pagination from "../../../components/Pagination";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export default function FlashSaleItemManagement({ onBack }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Lấy dữ liệu từ Redux store
  const { flashSaleVariantDetails, flashSales, loading: flashSaleLoading, error: flashSaleError } = useSelector((state) => state.flashSale);
  const {
    paginated,
    loading: productsLoading,
    error: productsError,
    productDetail,
  } = useSelector((state) => state.products);

  // Dữ liệu sản phẩm và biến thể
  const products = Array.isArray(paginated?.data?.content) ? paginated.data.content : [];
  const variants = Array.isArray(productDetail?.variants) ? productDetail.variants : [];

  // Form thêm sản phẩm
  const [form, setForm] = useState({
    flashSaleId: parseInt(id) || 0,
    productId: 0,
    variantId: 0,
    discountType: "PERCENTAGE",
    discountValue: "",
    quantity: "",
    soldQuantity: 0,
  });

  // Form chỉnh sửa trong modal
  const [editForm, setEditForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [productPage, setProductPage] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [localError, setLocalError] = useState(null);

  // Debounce tìm kiếm
  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  const debouncedProductSearch = useCallback(
    debounce((value) => {
      setProductSearchTerm(value);
      setProductPage(0);
      setAllProducts([]);
    }, 300),
    []
  );

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleProductSearchChange = (inputValue, { action } = {}) => {
    // Chỉ tìm kiếm khi người dùng thực sự gõ vào ô input của Select
    if (action === "input-change") {
      debouncedProductSearch(inputValue);
      return;
    }
    // Khi clear hoặc input rỗng: reset để hiển thị lại toàn bộ danh sách
    if (action === "clear" || inputValue === "") {
      setProductSearchTerm("");
      setProductPage(0);
      setAllProducts([]); // useEffect sẽ fetch lại trang 0
      return;
    }
  };

  // Tải danh sách sản phẩm
  useEffect(() => {
    if (productsLoading) return;
    const params = {
      page: productPage,
      limit: itemsPerPage,
      keyword: productSearchTerm.trim() || undefined,
    };
    console.log("Load products params:", params);
    dispatch(loadProductsPaginate(params))
      .unwrap()
      .then((result) => {
        console.log("Products API response:", result);
        const newProducts = Array.isArray(result?.data?.content) ? result.data.content : [];
        setAllProducts((prev) => {
          const uniqueProducts = [
            ...prev,
            ...newProducts.filter((np) => !prev.some((p) => p.id === np.id)),
          ];
          console.log("Updated allProducts:", uniqueProducts.length);
          return uniqueProducts;
        });
        setTotalProducts(result?.data?.totalElements || 0);
        setLocalError(null);
      })
      .catch((err) => {
        console.error("Products error:", err);
        setLocalError(err.message || "Không thể tải danh sách sản phẩm");
      });
  }, [dispatch, productPage, itemsPerPage, productSearchTerm]);

  // Tải chi tiết sản phẩm
  useEffect(() => {
    if (form.productId) {
      dispatch(loadProductById(form.productId)).catch((err) => {
        setLocalError(err.message || "Không thể tải chi tiết sản phẩm");
      });
    }
  }, [dispatch, form.productId]);

  // Tải danh sách Flash Sale items
  useEffect(() => {
    if (id) {
      dispatch(fetchFlashSaleVariantDetails(id)).catch((err) => {
        setLocalError(err.message || "Không thể tải danh sách Flash Sale Items");
      });
    }
  }, [id, dispatch]);

  const selectedFlashSale = flashSales.find((fs) => fs.id === parseInt(id)) || {
    name: "Không rõ",
    description: "",
  };

  const safe = (v, fallback = "") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

  const getCurrentItems = () =>
    Array.isArray(flashSaleVariantDetails)
      ? flashSaleVariantDetails.filter(
          (item) =>
            safe(item.productName).toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            safe(item.color).toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            safe(item.size).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      : [];

  const paginatedItems = getCurrentItems().slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Options cho react-select
  const productOptions = allProducts.map((p) => ({
    value: p.id,
    label: safe(p.name, `ID ${p.id}`),
  }));

  // Xử lý cuộn dropdown
  const handleMenuScrollToBottom = () => {
    console.log("Menu scroll to bottom:", { productsLoading, allProductsLength: allProducts.length, totalProducts });
    if (productsLoading || allProducts.length >= totalProducts) return;
    setProductPage((prev) => {
      const nextPage = prev + 1;
      console.log("Increment productPage to:", nextPage);
      return nextPage;
    });
  };

  // Mở modal chỉnh sửa
  const handleEdit = (item) => {
    console.log("handleEdit called with item:", item); // Debug
    try {
      setEditForm({
        productId: item.productId || 0,
        variantId: item.variantId || 0,
        discountType: item.discountType || "PERCENTAGE",
        discountValue: item.discountedPrice ? item.discountedPrice.toString() : "",
        quantity: item.quantityLimit ? item.quantityLimit.toString() : "",
        soldQuantity: item.soldQuantity || 0,
        productName: item.productName || "",
        color: item.color || "",
        size: item.size || "",
      });
      setEditingItemId(item.flashSaleItemId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      Swal.fire("Lỗi", "Không thể tải dữ liệu để chỉnh sửa", "error");
    }
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditForm(null);
    setEditingItemId(null);
  };

  // Validation cho form chỉnh sửa
  const validateEditForm = () => {
    // Kiểm tra thông tin cơ bản
    if (!editForm.discountValue || !editForm.quantity) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return false;
    }

    // Kiểm tra số lượng
    const quantity = parseInt(editForm.quantity);
    if (quantity <= 0) {
      Swal.fire("Lỗi", "Số lượng phải lớn hơn 0", "error");
      return false;
    }

    // Kiểm tra giá trị giảm giá
    const discountValue = parseFloat(editForm.discountValue);
    if (discountValue < 0) {
      Swal.fire("Lỗi", "Giá trị giảm giá không được âm", "error");
      return false;
    }

    // Kiểm tra phần trăm giảm giá
    if (editForm.discountType === "PERCENTAGE") {
      if (discountValue > 100) {
        Swal.fire("Lỗi", "Phần trăm giảm giá không được vượt quá 100%", "error");
        return false;
      }
      if (discountValue === 0) {
        Swal.fire("Lỗi", "Phần trăm giảm giá phải lớn hơn 0%", "error");
        return false;
      }
    }

    // Kiểm tra số tiền giảm giá
    if (editForm.discountType === "AMOUNT") {
      if (discountValue === 0) {
        Swal.fire("Lỗi", "Số tiền giảm giá phải lớn hơn 0", "error");
        return false;
      }
    }

    return true;
  };

  // Xử lý submit form chỉnh sửa
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateEditForm()) {
      return;
    }

    const payload = {
      flashSaleId: parseInt(id),
      productId: parseInt(editForm.productId),
      variantId: parseInt(editForm.variantId),
      quantityLimit: parseInt(editForm.quantity),
      soldQuantity: parseInt(editForm.soldQuantity),
      discountedPrice: parseFloat(editForm.discountValue),
      discountType: editForm.discountType,
    };
    console.log("Edit submit payload:", payload); // Debug

    dispatch(updateFlashSaleItem({ id: editingItemId, payload }))
      .then((response) => {
        console.log("updateFlashSaleItem response:", response); // Debug
        Swal.fire("Thành công", "Cập nhật sản phẩm thành công!", "success");
        closeModal();
        dispatch(fetchFlashSaleVariantDetails(id));
      })
      .catch((error) => {
        console.error("Error updating flash sale item:", error); // Debug
        Swal.fire("Lỗi", error.message || "Không thể cập nhật sản phẩm", "error");
      });
  };

  // Kiểm tra sản phẩm đã tồn tại trong Flash Sale
  const isProductVariantExists = (productId, variantId) => {
    return flashSaleVariantDetails.some(
      (item) => item.productId === productId && item.variantId === variantId
    );
  };

  // Validation cho form thêm sản phẩm
  const validateAddForm = () => {
    // Kiểm tra thông tin cơ bản
    if (!form.productId || !form.variantId || !form.discountValue || !form.quantity) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return false;
    }

    // Kiểm tra sản phẩm đã tồn tại
    if (isProductVariantExists(parseInt(form.productId), parseInt(form.variantId))) {
      Swal.fire("Lỗi", "Sản phẩm này đã tồn tại trong Flash Sale!", "error");
      return false;
    }

    // Kiểm tra số lượng
    const quantity = parseInt(form.quantity);
    if (quantity <= 0) {
      Swal.fire("Lỗi", "Số lượng phải lớn hơn 0", "error");
      return false;
    }

    // Kiểm tra giá trị giảm giá
    const discountValue = parseFloat(form.discountValue);
    if (discountValue < 0) {
      Swal.fire("Lỗi", "Giá trị giảm giá không được âm", "error");
      return false;
    }

    // Kiểm tra phần trăm giảm giá
    if (form.discountType === "PERCENTAGE") {
      if (discountValue > 100) {
        Swal.fire("Lỗi", "Phần trăm giảm giá không được vượt quá 100%", "error");
        return false;
      }
      if (discountValue === 0) {
        Swal.fire("Lỗi", "Phần trăm giảm giá phải lớn hơn 0%", "error");
        return false;
      }
    }

    // Kiểm tra số tiền giảm giá
    if (form.discountType === "AMOUNT") {
      if (discountValue === 0) {
        Swal.fire("Lỗi", "Số tiền giảm giá phải lớn hơn 0", "error");
        return false;
      }
    }

    return true;
  };

  // Xử lý submit form thêm sản phẩm
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateAddForm()) {
      return;
    }

    const payload = {
      flashSaleId: parseInt(id),
      productId: parseInt(form.productId),
      variantId: parseInt(form.variantId),
      quantityLimit: parseInt(form.quantity),
      soldQuantity: parseInt(form.soldQuantity),
      discountedPrice: parseFloat(form.discountValue),
      discountType: form.discountType,
    };
    console.log("Add submit payload:", payload); // Debug

    dispatch(createFlashSaleItem(payload))
      .then((result) => {
        console.log("createFlashSaleItem result:", result); // Debug
        if (result.meta.requestStatus === "fulfilled") {
          Swal.fire("Thành công", "Thêm sản phẩm thành công!", "success");
          setForm({
            flashSaleId: parseInt(id) || 0,
            productId: 0,
            variantId: 0,
            discountType: "PERCENTAGE",
            discountValue: "",
            quantity: "",
            soldQuantity: 0,
          });
          dispatch(fetchFlashSaleVariantDetails(id));
        } else {
          Swal.fire("Lỗi", result.error?.message || "Thêm sản phẩm thất bại", "error");
        }
      })
      .catch((error) => {
        console.error("Error in submit:", error); // Debug
        Swal.fire("Lỗi", "Có lỗi xảy ra khi thêm sản phẩm", "error");
      });
  };

  // Xử lý xóa
  const handleDelete = (itemId) => {
    console.log("handleDelete called with itemId:", itemId); // Debug
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFlashSaleItem(itemId))
          .then((response) => {
            console.log("removeFlashSaleItem response:", response); // Debug
            Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
            dispatch(fetchFlashSaleVariantDetails(id));
          })
          .catch((error) => {
            console.error("Error removing flash sale item:", error); // Debug
            Swal.fire("Lỗi", error.message || "Không thể xóa sản phẩm", "error");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Đã hủy", "Sản phẩm vẫn còn nguyên.", "info");
      }
    });
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setProductSearchTerm("");
    setCurrentPage(0);
    setProductPage(0);
    setAllProducts([]);
    setTotalProducts(0);
    setForm({
      flashSaleId: parseInt(id) || 0,
      productId: 0,
      variantId: 0,
      discountType: "PERCENTAGE",
      discountValue: "",
      quantity: "",
      soldQuantity: 0,
    });
    closeModal();
    dispatch(fetchFlashSaleVariantDetails(id));
    dispatch(loadProductsPaginate({ page: 0, limit: itemsPerPage }));
  };

  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Sản phẩm Flash Sale: {safe(selectedFlashSale.name)}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {safe(selectedFlashSale.description, "Quản lý sản phẩm trong chương trình Flash Sale")}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={flashSaleLoading || productsLoading}
              >
                <RefreshCw
                  className={`h-5 w-5 ${flashSaleLoading || productsLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onBack}
                className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center space-x-2"
              >
                <X size={20} />
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thêm sản phẩm Flash Sale
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sản phẩm
              </label>
              <Select
                options={productOptions}
                value={productOptions.find((option) => option.value === form.productId) || null}
                onChange={(selected) => {
                  // X bấm clear -> selected = null
                  if (!selected) {
                    setForm({
                      ...form,
                      productId: 0,
                      variantId: 0,
                      discountValue: "",
                    });
                    // Reset list để hiển thị lại tất cả sản phẩm
                    handleProductSearchChange("", { action: "clear" });
                    return;
                  }
                  const newProductId = parseInt(selected.value);
                  setForm({
                    ...form,
                    productId: newProductId,
                    variantId: 0,
                    discountValue: "",
                  });
                  
                  // Kiểm tra sản phẩm đã tồn tại
                  if (newProductId && isProductVariantExists(newProductId, 0)) {
                    Swal.fire("Cảnh báo", "Sản phẩm này đã có trong Flash Sale. Vui lòng chọn biến thể khác hoặc sản phẩm khác.", "warning");
                  }
                }}
                onInputChange={handleProductSearchChange}
                onMenuOpen={() => {
                  // Nếu danh sách đang rỗng, làm mới ngay để menu có dữ liệu
                  if (!productsLoading && allProducts.length === 0) {
                    // Cách an toàn: gọi API trực tiếp cho trang 0
                    const params = { page: 0, limit: itemsPerPage };
                    dispatch(loadProductsPaginate(params))
                      .unwrap()
                      .then((result) => {
                        const newProducts = Array.isArray(result?.data?.content)
                          ? result.data.content
                          : [];
                        setAllProducts(newProducts);
                        setTotalProducts(result?.data?.totalElements || 0);
                      })
                      .catch(() => {
                        // noop, lỗi sẽ hiển thị qua productsError nếu có
                      });
                  }
                }}
                placeholder="Chọn hoặc tìm kiếm sản phẩm"
                isClearable
                isLoading={productsLoading}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                closeMenuOnScroll={false}
                menuShouldScrollIntoView={false}
                menuShouldBlockScroll={true}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                className="basic-single"
                classNamePrefix="select"
                noOptionsMessage={() => "Không tìm thấy sản phẩm"}
                loadingMessage={() => "Đang tải sản phẩm..."}
              />
              {productsError && <p className="text-sm text-red-600 mt-1">{productsError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biến thể
              </label>
              <select
                value={form.variantId}
                onChange={(e) => {
                  const newVariantId = parseInt(e.target.value);
                  setForm({ ...form, variantId: newVariantId, discountValue: "" });
                  
                  // Kiểm tra biến thể đã tồn tại
                  if (newVariantId && isProductVariantExists(form.productId, newVariantId)) {
                    Swal.fire("Lỗi", "Biến thể này đã tồn tại trong Flash Sale!", "error");
                    setForm({ ...form, variantId: 0, discountValue: "" });
                  }
                }}
                required
                disabled={!form.productId || !variants.length}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Chọn biến thể</option>
                {variants.map((v) => {
                  const color = v.colorName || "";
                  const size = v.sizeName || "";
                  const label = color && size ? `${color} - ${size}` : color || size || "Không có biến thể";
                  return (
                    <option key={v.id} value={v.id}>
                      {label} - {formatVND(v.priceOverride || 0)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giảm giá
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value, discountValue: "" })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">Phần trăm</option>
                <option value="AMOUNT">Số tiền</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.discountType === "PERCENTAGE" ? "Phần trăm giảm giá" : "Số tiền giảm giá"}
              </label>
              <input
                type="number"
                value={safe(form.discountValue)}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, discountValue: value });
                  
                  // Validation real-time
                  if (value && form.discountType === "PERCENTAGE") {
                    const numValue = parseFloat(value);
                    if (numValue > 100) {
                      e.target.setCustomValidity("Phần trăm không được vượt quá 100%");
                    } else if (numValue < 0) {
                      e.target.setCustomValidity("Phần trăm không được âm");
                    } else {
                      e.target.setCustomValidity("");
                    }
                  } else if (value && form.discountType === "AMOUNT") {
                    const numValue = parseFloat(value);
                    if (numValue < 0) {
                      e.target.setCustomValidity("Số tiền không được âm");
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }
                }}
                required
                min={form.discountType === "PERCENTAGE" ? "0" : "1000"}
                max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                step={form.discountType === "PERCENTAGE" ? "1" : "1000"}
                placeholder={form.discountType === "PERCENTAGE" ? "Nhập phần trăm (0-100)" : "Nhập số tiền"}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới hạn số lượng
              </label>
              <input
                type="number"
                value={safe(form.quantity)}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, quantity: value });
                  
                  // Validation real-time
                  if (value) {
                    const numValue = parseInt(value);
                    if (numValue <= 0) {
                      e.target.setCustomValidity("Số lượng phải lớn hơn 0");
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }
                }}
                required
                min="1"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
              >
                Thêm sản phẩm
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, màu sắc hoặc kích thước..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={flashSaleLoading}
            />
          </div>
        </div>

        {flashSaleLoading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {(flashSaleError || localError) && (
          <div className="bg-red-50 p-4 rounded-xl mb-6 text-sm text-red-800 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {flashSaleError || localError}
          </div>
        )}

        {!flashSaleLoading && !flashSaleError && paginatedItems.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-600">Không tìm thấy sản phẩm nào.</p>
          </div>
        )}

        {!flashSaleLoading && !flashSaleError && paginatedItems.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Biến thể
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá gốc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá Flash Sale
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giảm giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đã bán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={safe(item.imageUrl)}
                              alt={item.productName}
                              className="h-8 w-8 object-cover rounded mr-2"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {safe(item.productName)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {safe(item.color)} {item.color && item.size ? "-" : ""} {safe(item.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatVND(item.originalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {formatVND(item.finalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.discountType === "PERCENTAGE"
                            ? `${item.discountedPrice}%`
                            : formatVND(item.discountedPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.quantityLimit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.soldQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Sửa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-4">
              {paginatedItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={safe(item.imageUrl)}
                        alt={item.productName}
                        className="h-12 w-12 object-cover rounded mr-2"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {safe(item.productName)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {safe(item.color)} {item.color && item.size ? "-" : ""} {safe(item.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag size={16} className="mr-2" />
                      Giá gốc: {formatVND(item.originalPrice)}
                    </div>
                    <div className="flex items-center text-sm text-red-600">
                      <Tag size={16} className="mr-2" />
                      Giá Flash Sale: {formatVND(item.finalPrice)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag size={16} className="mr-2" />
                      Giảm giá: {item.discountType === "PERCENTAGE"
                        ? `${item.discountedPrice}%`
                        : formatVND(item.discountedPrice)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag size={16} className="mr-2" />
                      Số lượng: {item.quantityLimit}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag size={16} className="mr-2" />
                      Đã bán: {item.soldQuantity}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={getCurrentItems().length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page, newItemsPerPage) => {
                handlePageChange(page, newItemsPerPage || itemsPerPage);
              }}
            />
          </>
        )}
      </div>

      {/* Modal chỉnh sửa */}
      {isModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa sản phẩm Flash Sale
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sản phẩm
                </label>
                <input
                  type="text"
                  value={safe(editForm.productName)}
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biến thể
                </label>
                <input
                  type="text"
                  value={safe(editForm.color) + (editForm.color && editForm.size ? " - " : "") + safe(editForm.size)}
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giảm giá
                </label>
                <select
                  value={editForm.discountType}
                  onChange={(e) => setEditForm({ ...editForm, discountType: e.target.value, discountValue: "" })}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PERCENTAGE">Phần trăm</option>
                  <option value="AMOUNT">Số tiền</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editForm.discountType === "PERCENTAGE" ? "Phần trăm giảm giá" : "Số tiền giảm giá"}
                </label>
                <input
                  type="number"
                  value={safe(editForm.discountValue)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm({ ...editForm, discountValue: value });
                    
                    // Validation real-time
                    if (value && editForm.discountType === "PERCENTAGE") {
                      const numValue = parseFloat(value);
                      if (numValue > 100) {
                        e.target.setCustomValidity("Phần trăm không được vượt quá 100%");
                      } else if (numValue < 0) {
                        e.target.setCustomValidity("Phần trăm không được âm");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    } else if (value && editForm.discountType === "AMOUNT") {
                      const numValue = parseFloat(value);
                      if (numValue < 0) {
                        e.target.setCustomValidity("Số tiền không được âm");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }
                  }}
                  required
                  min={editForm.discountType === "PERCENTAGE" ? "0" : "1000"}
                  max={editForm.discountType === "PERCENTAGE" ? "100" : undefined}
                  step={editForm.discountType === "PERCENTAGE" ? "1" : "1000"}
                  placeholder={editForm.discountType === "PERCENTAGE" ? "Nhập phần trăm (0-100)" : "Nhập số tiền"}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn số lượng
                </label>
                <input
                  type="number"
                  value={safe(editForm.quantity)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditForm({ ...editForm, quantity: value });
                    
                    // Validation real-time
                    if (value) {
                      const numValue = parseInt(value);
                      if (numValue <= 0) {
                        e.target.setCustomValidity("Số lượng phải lớn hơn 0");
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }
                  }}
                  required
                  min="1"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng đã bán
                </label>
                <input
                  type="number"
                  value={safe(editForm.soldQuantity)}
                  disabled
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 font-semibold text-gray-800"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
