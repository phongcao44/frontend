/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  createFlashSaleItem,
  removeFlashSaleItem,
  fetchFlashSaleVariantDetails,
  updateFlashSaleItem,
} from "../../../../redux/slices/flashSaleSlice";
import {
  loadProductsPaginate,
  loadProductById,
} from "../../../../redux/slices/productSlice";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export default function useFlashSaleItem(id) {
  const dispatch = useDispatch();
  const { 
    flashSaleVariantDetails = [],
    flashSales, 
    loading: flashSaleLoading, 
    error: flashSaleError 
  } = useSelector((state) => state.flashSale);

  const {
    loading: productsLoading,
    error: productsError,
    productDetail,
  } = useSelector((state) => state.products);

  const variants = Array.isArray(productDetail?.variants) ? productDetail.variants : [];
  const flashSale = flashSales.find((fs) => fs.id === parseInt(id)) || {
    name: "Không rõ",
    description: "",
  };

  const [form, setForm] = useState({
    flashSaleId: parseInt(id) || 0,
    productId: 0,
    variantId: 0,
    discountType: "PERCENTAGE",
    discountValue: "",
    quantity: "",
    soldQuantity: 0,
  });

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

  const initialLoadDone = useRef(false);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  const debouncedProductSearch = useCallback(
    debounce((value) => {
      console.log("Debounced search triggered with value:", value);
      setProductSearchTerm(value);
      setProductPage(0);
      if (value.trim()) {
        setAllProducts([]);
      }
    }, 300),
    []
  );

  const handleSearchChange = (value) => {
    console.log("Search term changed:", value);
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleProductSearchChange = (inputValue) => {
    debouncedProductSearch(inputValue);
  };

  // Load products when page/search changes
  useEffect(() => {
    const params = {
      page: productPage,
      limit: itemsPerPage,
      keyword: productSearchTerm.trim() || undefined,
    };

    dispatch(loadProductsPaginate(params))
      .unwrap()
      .then((result) => {
        const newProducts = Array.isArray(result?.data?.content) ? result.data.content : [];
        setAllProducts((prev) => {
          const uniqueProducts = [
            ...prev,
            ...newProducts.filter((np) => !prev.some((p) => p.id === np.id)),
          ];
          return uniqueProducts;
        });
        setTotalProducts(result?.data?.totalElements || 0);
        setLocalError(null);
      })
      .catch((err) => {
        setLocalError(err.message || "Không thể tải danh sách sản phẩm");
      });
  }, [dispatch, productPage, itemsPerPage, productSearchTerm]);

  // Load product details
  useEffect(() => {
    if (!form.productId) return;
    dispatch(loadProductById(form.productId))
      .unwrap()
      .then(() => setLocalError(null))
      .catch((err) => setLocalError(err.message || "Không thể tải chi tiết sản phẩm"));
  }, [dispatch, form.productId]);

  // Load flash sale items
  useEffect(() => {
    if (!id) return;
    dispatch(fetchFlashSaleVariantDetails(id))
      .unwrap()
      .then(() => setLocalError(null))
      .catch((err) => setLocalError(err.message || "Không thể tải danh sách Flash Sale Items"));
  }, [dispatch, id]);

  // Initial load products (once)
  useEffect(() => {
    if (initialLoadDone.current) return;
    if (!productSearchTerm) {
      initialLoadDone.current = true;
      dispatch(loadProductsPaginate({ page: 0, limit: itemsPerPage }))
        .unwrap()
        .then((result) => {
          const newProducts = Array.isArray(result?.data?.content) ? result.data.content : [];
          setAllProducts(newProducts);
          setTotalProducts(result?.data?.totalElements || 0);
          setLocalError(null);
        })
        .catch((err) => {
          setLocalError(err.message || "Không thể tải danh sách sản phẩm ban đầu");
        });
    }
  }, [dispatch, itemsPerPage, productSearchTerm]);

  // Filter + paginate items
  const getCurrentItems = () => {
    return Array.isArray(flashSaleVariantDetails)
      ? flashSaleVariantDetails.filter(
          (item) =>
            (item.productName || "").toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            (item.color || "").toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            (item.size || "").toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      : [];
  };

  const paginatedItems = getCurrentItems().slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalItems = getCurrentItems().length;

  const productOptions = allProducts.map((p) => ({
    value: p.id,
    label: p.name || `ID ${p.id}`,
  }));

 const handleMenuScrollToBottom = () => {
  console.log("Scroll to bottom triggered", { productsLoading, allProductsLength: allProducts.length, totalProducts });
  if (productsLoading || allProducts.length >= totalProducts) {
    console.log("Scroll blocked due to loading or max products reached");
    return;
  }
  setProductPage((prev) => {
    console.log("Increasing productPage to", prev + 1);
    return prev + 1;
  });
};

  const validateAddForm = () => {
    if (!form.productId || !form.variantId || !form.discountValue || !form.quantity) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return false;
    }
    if (
      Array.isArray(flashSaleVariantDetails) &&
      flashSaleVariantDetails.some(
        (item) =>
          item.productId === parseInt(form.productId) &&
          item.variantId === parseInt(form.variantId)
      )
    ) {
      Swal.fire("Lỗi", "Sản phẩm này đã tồn tại trong Flash Sale!", "error");
      return false;
    }
    const quantity = parseInt(form.quantity);
    if (quantity <= 0) {
      Swal.fire("Lỗi", "Số lượng phải lớn hơn 0", "error");
      return false;
    }
    const discountValue = parseFloat(form.discountValue);
    if (discountValue < 0) {
      Swal.fire("Lỗi", "Giá trị giảm giá không được âm", "error");
      return false;
    }
    if (form.discountType === "PERCENTAGE") {
      if (discountValue > 100 || discountValue === 0) {
        Swal.fire("Lỗi", "Phần trăm giảm giá phải > 0% và <= 100%", "error");
        return false;
      }
    }
    if (form.discountType === "AMOUNT" && discountValue === 0) {
      Swal.fire("Lỗi", "Số tiền giảm giá phải lớn hơn 0", "error");
      return false;
    }
    return true;
  };

  const validateEditForm = () => {
    if (!editForm?.discountValue || !editForm?.quantity) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return false;
    }
    const quantity = parseInt(editForm.quantity);
    if (quantity <= 0) {
      Swal.fire("Lỗi", "Số lượng phải lớn hơn 0", "error");
      return false;
    }
    const soldQuantity = parseInt(editForm.soldQuantity);
    if (soldQuantity < 0) {
      Swal.fire("Lỗi", "Số lượng đã bán không được âm", "error");
      return false;
    }
    if (quantity < soldQuantity) {
      Swal.fire("Lỗi", "Số lượng tổng không được nhỏ hơn số lượng đã bán", "error");
      return false;
    }
    const discountValue = parseFloat(editForm.discountValue);
    if (discountValue < 0) {
      Swal.fire("Lỗi", "Giá trị giảm giá không được âm", "error");
      return false;
    }
    if (editForm.discountType === "PERCENTAGE") {
      if (discountValue > 100 || discountValue === 0) {
        Swal.fire("Lỗi", "Phần trăm giảm giá phải > 0% và <= 100%", "error");
        return false;
      }
    }
    if (editForm.discountType === "AMOUNT" && discountValue === 0) {
      Swal.fire("Lỗi", "Số tiền giảm giá phải lớn hơn 0", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    const payload = {
      flashSaleId: parseInt(id),
      productId: parseInt(form.productId),
      variantId: parseInt(form.variantId),
      quantity: parseInt(form.quantity),
      soldQuantity: parseInt(form.soldQuantity),
      price: parseFloat(form.discountValue),
      discountType: form.discountType,
    };
    dispatch(createFlashSaleItem(payload))
      .then((result) => {
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
      .catch(() => {
        Swal.fire("Lỗi", "Có lỗi xảy ra khi thêm sản phẩm", "error");
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    const payload = {
      flashSaleId: parseInt(id),
      productId: parseInt(editForm.productId),
      variantId: parseInt(editForm.variantId),
      quantity: parseInt(editForm.quantity),
      soldQuantity: parseInt(editForm.soldQuantity),
      price: parseFloat(editForm.discountValue),
      discountType: editForm.discountType,
    };
    dispatch(updateFlashSaleItem({ id: editingItemId, payload }))
      .then(() => {
        Swal.fire("Thành công", "Cập nhật sản phẩm thành công!", "success");
        setIsModalOpen(false);
        setEditForm(null);
        setEditingItemId(null);
        dispatch(fetchFlashSaleVariantDetails(id));
      })
      .catch((error) => {
        Swal.fire("Lỗi", error.message || "Không thể cập nhật sản phẩm", "error");
      });
  };

  const handleDelete = (itemId) => {
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
          .then(() => {
            Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
            dispatch(fetchFlashSaleVariantDetails(id));
          })
          .catch((error) => {
            Swal.fire("Lỗi", error.message || "Không thể xóa sản phẩm", "error");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Đã hủy", "Sản phẩm vẫn còn nguyên.", "info");
      }
    });
  };

  const handleRefresh = () => {
    handleSearchChange("");
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
    setIsModalOpen(false);
    setEditForm(null);
    setEditingItemId(null);
    dispatch(fetchFlashSaleVariantDetails(id));
    dispatch(loadProductsPaginate({ page: 0, limit: itemsPerPage }));
  };

  return {
    flashSale,
    flashSaleLoading,
    flashSaleError,
    productsLoading,
    productsError,
    localError,
    form,
    setForm,
    editForm,
    setEditForm,
    isModalOpen,
    setIsModalOpen,
    editingItemId,
    setEditingItemId,
    searchTerm,
    setSearchTerm: handleSearchChange,
    productSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    productOptions,
    variants,
    paginatedItems,
    totalItems,
    handleSubmit,
    handleEditSubmit,
    handleDelete,
    handleRefresh,
    handleProductSearchChange,
    handleMenuScrollToBottom,
  };
}
