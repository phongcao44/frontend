/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import Select, { components } from "react-select";
import Swal from "sweetalert2";

export default function FlashSaleItemForm({
  form,
  setForm,
  productOptions,
  variants,
  handleSubmit,
  productsLoading,
  productsError,
  handleProductSearchChange,
  handleMenuScrollToBottom,
  flashSaleVariantDetails,
  flashSaleLoading,
}) {
  // Lưu và khôi phục vị trí cuộn của menu để tránh bị "nhảy về đầu" khi options thay đổi
  const menuListElRef = useRef(null);
  const savedScrollTopRef = useRef(0);

  // Custom MenuList: phát hiện kéo thanh cuộn (drag scrollbar) để load thêm
  const MenuList = (menuProps) => {
    const handleScroll = (e) => {
      const el = e.currentTarget;
      // Near bottom threshold to prefetch
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
      // Lưu lại vị trí cuộn hiện tại
      savedScrollTopRef.current = el.scrollTop;
      if (nearBottom) {
        // Gọi handler từ props của form (đã có throttle trong hook)
        handleMenuScrollToBottom && handleMenuScrollToBottom();
      }
    };

    // Kế thừa UI gốc của react-select và chỉ thêm onScroll
    return (
      <components.MenuList
        {...menuProps}
        innerRef={(el) => {
          // Lưu element để có thể khôi phục scrollTop sau mỗi lần render
          if (el) {
            menuListElRef.current = el;
            // Khôi phục vị trí cuộn nếu có giá trị đã lưu
            if (typeof savedScrollTopRef.current === "number") {
              el.scrollTop = savedScrollTopRef.current;
            }
          }
        }}
        innerProps={{
          ...menuProps.innerProps,
          onScroll: (e) => {
            menuProps.innerProps?.onScroll?.(e);
            handleScroll(e);
          },
        }}
      />
    );
  };
  const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const handleProductChange = (selected) => {
    const newProductId = selected ? parseInt(selected.value) : 0;

    // Check if flashSaleVariantDetails is defined and an array
    if (
      newProductId &&
      Array.isArray(flashSaleVariantDetails) &&
      flashSaleVariantDetails.some((item) => item.productId === newProductId)
    ) {
      Swal.fire(
        "Cảnh báo",
        "Sản phẩm này đã có trong Flash Sale. Vui lòng chọn sản phẩm khác.",
        "warning"
      );
      setForm((prev) => ({
        ...prev,
        productId: 0,
        variantId: 0,
        discountValue: "",
      }));
      // Quan trọng: reset danh sách để dropdown hiển thị lại tất cả sản phẩm sau khi bấm X
      handleProductSearchChange("", { action: "clear" });
      return;
    }

    setForm((prev) => ({
      ...prev,
      productId: newProductId,
      variantId: 0,
      discountValue: "",
    }));

    // Reset danh sách theo ngữ cảnh
    // - Nếu chọn sản phẩm hợp lệ: xoá input để tránh giữ từ khoá cũ
    // - Nếu clear (newProductId = 0): yêu cầu reset đầy đủ để hiển thị lại toàn bộ sản phẩm
    if (newProductId) {
      handleProductSearchChange("");
    } else {
      handleProductSearchChange("", { action: "clear" });
    }
  };

  const handleVariantChange = (e) => {
    const newVariantId = parseInt(e.target.value);
    if (
      newVariantId &&
      Array.isArray(flashSaleVariantDetails) &&
      flashSaleVariantDetails.some(
        (item) => item.productId === form.productId && item.variantId === newVariantId
      )
    ) {
      Swal.fire("Lỗi", "Biến thể này đã tồn tại trong Flash Sale!", "error");
      setForm({ ...form, variantId: 0, discountValue: "" });
      return;
    }
    setForm({ ...form, variantId: newVariantId, discountValue: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thêm sản phẩm Flash Sale
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sản phẩm
          </label>
          <Select
            options={productOptions}
            value={productOptions.find((option) => option.value === form.productId) || null}
            onChange={handleProductChange}
            onInputChange={handleProductSearchChange}
            components={{ MenuList }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            placeholder="Chọn hoặc tìm kiếm sản phẩm"
            isClearable
            isSearchable
            isDisabled={flashSaleLoading}
            isLoading={productsLoading}
            onMenuScrollToBottom={handleMenuScrollToBottom}
            closeMenuOnScroll={false}
            menuShouldScrollIntoView={false}
            menuShouldBlockScroll={true}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            blurInputOnSelect={false}
            className="basic-single z-50"
            classNamePrefix="select"
            noOptionsMessage={() => "Không tìm thấy sản phẩm"}
            loadingMessage={() => "Đang tải sản phẩm..."}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "200px",
              }),
              option: (provided, state) => ({
                ...provided,
                cursor: state.isDisabled ? "not-allowed" : "pointer",
                backgroundColor: state.isSelected
                  ? "#2563eb"
                  : state.isFocused
                  ? "#e5e7eb"
                  : "white",
                color: state.isSelected ? "white" : "#1f2937",
              }),
            }}
          />
          {productsError && <p className="mt-1 text-sm text-red-600">{productsError}</p>}
          {productOptions.length === 0 && !productsLoading && !productsError && (
            <p className="mt-1 text-sm text-red-600">Không có sản phẩm nào để chọn</p>
          )}
          {(productsLoading || flashSaleLoading) && (
            <p className="mt-1 text-sm text-gray-600">Đang tải dữ liệu...</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biến thể
          </label>
          <select
            value={form.variantId}
            onChange={handleVariantChange}
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
            value={form.discountValue || ""}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, discountValue: value });
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
            value={form.quantity || ""}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, quantity: value });
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
  );
}