/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createNewVoucher,
  updateExistingVoucher,
} from "../../../redux/slices/voucherSlice";

export default function VoucherForm({ isOpen, onClose, voucher }) {
  const dispatch = useDispatch();
  const vouchers = useSelector((s) => s?.voucher?.allVouchers || []);

  const formik = useFormik({
    initialValues: {
      voucherId: 0,
      code: "",
      discountType: "percent", // 'percent' | 'amount'
      discountPercent: 0,
      discountAmount: 0,
      maxDiscount: 0,
      startDate: "",
      endDate: "",
      quantity: 0,
      minOrderAmount: 0,
      collectible: true,
      statusMode: "auto", // 'auto' | 'manual'
      active: true,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Bắt buộc"),
      discountType: Yup.mixed().oneOf(["percent", "amount"]).required(),
      discountPercent: Yup.number().min(0).max(100),
      discountAmount: Yup.number().min(0),
      maxDiscount: Yup.number().min(0),
      startDate: Yup.string().required("Bắt buộc"),
      endDate: Yup.string().required("Bắt buộc"),
      quantity: Yup.number().min(1).required("Bắt buộc"),
      minOrderAmount: Yup.number().min(0).required("Bắt buộc"),
      collectible: Yup.boolean().required("Bắt buộc"),
    }).test(
      "valid-discount",
      "Vui lòng nhập giá trị giảm hợp lệ",
      (values) => {
        const type = values?.discountType;
        const p = Number(values?.discountPercent ?? 0);
        const a = Number(values?.discountAmount ?? 0);
        if (type === "percent") return p > 0 && p <= 100;
        if (type === "amount") return a > 0;
        return false;
      }
    ),
    onSubmit: async (values) => {
      const voucherId = voucher ? voucher.id : 0;
      // Chặn trùng mã voucher (bỏ qua voucher đã xóa và bản ghi đang sửa)
      const codeNorm = (values.code || "").trim().toLowerCase();
      const isDup = vouchers.some(
        (v) =>
          !v?.deleted &&
          (v?.code || "").trim().toLowerCase() === codeNorm &&
          (voucher ? v.id !== voucherId : true)
      );
      if (isDup) {
        formik.setFieldError("code", "Mã voucher đã tồn tại");
        return;
      }
      // Tính toán trạng thái kích hoạt
      let finalActive = false;
      if (values.statusMode === "auto") {
        const now = new Date();
        const s = new Date(values.startDate);
        const e = new Date(values.endDate);
        finalActive = isFinite(s) && isFinite(e) ? now >= s && now <= e : false;
      } else {
        finalActive = Boolean(values.active);
      }
      const payload = {
        ...values,
        voucherId,
        // Chỉ giữ giá trị của loại được chọn, loại còn lại set 0
        discountPercent:
          values.discountType === "percent"
            ? Number(values.discountPercent ?? 0)
            : 0,
        discountAmount:
          values.discountType === "amount"
            ? Number(values.discountAmount ?? 0)
            : 0,
        maxDiscount: Number(values.maxDiscount ?? 0),
        quantity: Number(values.quantity ?? 0),
        minOrderAmount: Number(values.minOrderAmount ?? 0),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        active: finalActive,
      };

      if (voucher) {
        console.log("Updating voucher:", payload);
        await dispatch(updateExistingVoucher({ voucherId, data: payload }));
      } else {
        await dispatch(createNewVoucher(payload));
      }
      onClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (voucher) {
      formik.setValues({
        voucherId: voucher.id || 0,
        code: voucher.code || "",
        discountType:
          Number(voucher.discountPercent ?? 0) > 0
            ? "percent"
            : "amount",
        discountPercent: Number(voucher.discountPercent ?? 0),
        discountAmount: Number(voucher.discountAmount ?? 0),
        maxDiscount: Number(voucher.maxDiscount ?? 0),
        startDate: voucher.startDate
          ? new Date(voucher.startDate).toISOString().slice(0, 16)
          : "",
        endDate: voucher.endDate
          ? new Date(voucher.endDate).toISOString().slice(0, 16)
          : "",
        quantity: Number(voucher.quantity ?? 0),
        minOrderAmount: Number(voucher.minOrderAmount ?? 0),
        collectible:
          voucher.collectible !== undefined ? voucher.collectible : true,
        statusMode: "manual",
        active: Boolean(voucher.active),
      });
    } else {
      formik.resetForm();
    }
  }, [voucher, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="p-6 pb-0 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900">
            {voucher ? "Chỉnh sửa Voucher" : "Tạo Voucher mới"}
          </h3>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mã Voucher
              </label>
              <input
                type="text"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {formik.touched.code && formik.errors.code && (
                <div className="text-red-500 text-sm">{formik.errors.code}</div>
              )}
            </div>

            {/* Discount Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Hình thức giảm giá
              </label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="discountType"
                    value="percent"
                    checked={formik.values.discountType === "percent"}
                    onChange={() => formik.setFieldValue("discountType", "percent")}
                  />
                  Theo phần trăm
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="discountType"
                    value="amount"
                    checked={formik.values.discountType === "amount"}
                    onChange={() => formik.setFieldValue("discountType", "amount")}
                  />
                  Theo số tiền
                </label>
              </div>
            </div>

            {/* Discount Percent */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phần trăm giảm giá
              </label>
              <input
                type="number"
                name="discountPercent"
                value={formik.values.discountPercent}
                onChange={formik.handleChange}
                disabled={formik.values.discountType !== "percent"}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full disabled:bg-gray-100 disabled:text-gray-400"
              />
              {formik.touched.discountPercent &&
                formik.errors.discountPercent && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.discountPercent}
                  </div>
                )}
              {formik.values.discountType !== "percent" ? (
                <p className="text-xs text-gray-400 mt-1">Đang chọn giảm theo số tiền.</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Nhập phần trăm (1-100%).</p>
              )}
            </div>

            {/* Discount Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số tiền giảm (VNĐ)
              </label>
              <input
                type="number"
                name="discountAmount"
                value={formik.values.discountAmount}
                onChange={formik.handleChange}
                disabled={formik.values.discountType !== "amount"}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full disabled:bg-gray-100 disabled:text-gray-400"
              />
              {formik.touched.discountAmount && formik.errors.discountAmount && (
                <div className="text-red-500 text-sm">{formik.errors.discountAmount}</div>
              )}
              {formik.values.discountType !== "amount" ? (
                <p className="text-xs text-gray-400 mt-1">Đang chọn giảm theo phần trăm.</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Nhập số tiền giảm (VNĐ).</p>
              )}
            </div>

            {/* Max Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giảm giá tối đa
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={formik.values.maxDiscount}
                onChange={formik.handleChange}
                disabled={formik.values.discountType === "amount"}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full disabled:bg-gray-100 disabled:text-gray-400"
              />
              {formik.touched.maxDiscount && formik.errors.maxDiscount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.maxDiscount}
                </div>
              )}
              {formik.values.discountType === "amount" && (
                <p className="text-xs text-gray-400 mt-1">Không cần đặt "Giảm giá tối đa" khi giảm theo số tiền.</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.startDate}
                </div>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.endDate}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số lượng
              </label>
              <input
                type="number"
                name="quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <div className="text-red-500 text-sm">
                  {formik.errors.quantity}
                </div>
              )}
            </div>

            {/* Min Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tối thiểu đơn hàng
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formik.values.minOrderAmount}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {formik.touched.minOrderAmount && formik.errors.minOrderAmount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.minOrderAmount}
                </div>
              )}
            </div>

            {/* Collectible */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  name="collectible"
                  checked={formik.values.collectible}
                  onChange={formik.handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                Có thể thu thập
              </label>
              {formik.touched.collectible && formik.errors.collectible && (
                <div className="text-red-500 text-sm">
                  {formik.errors.collectible}
                </div>
              )}
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Trạng thái
              </label>
              <div className="flex items-center gap-4 mb-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="statusMode"
                    value="auto"
                    checked={formik.values.statusMode === "auto"}
                    onChange={() => formik.setFieldValue("statusMode", "auto")}
                  />
                  Tự động theo ngày
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="statusMode"
                    value="manual"
                    checked={formik.values.statusMode === "manual"}
                    onChange={() => formik.setFieldValue("statusMode", "manual")}
                  />
                  Chọn thủ công
                </label>
              </div>
              {formik.values.statusMode === "manual" && (
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700">Kích hoạt</label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formik.values.active}
                    onChange={(e) => formik.setFieldValue("active", e.target.checked)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-500">Bật để kích hoạt, tắt để tạm dừng</span>
                </div>
              )}
              {formik.values.statusMode === "auto" && (
                <p className="text-xs text-gray-500 mt-1">
                  Trạng thái sẽ tự động là "Kích hoạt" khi thời gian hiện tại nằm giữa ngày bắt đầu và ngày kết thúc; ngoài khoảng đó sẽ là "Tạm dừng".
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 pt-0 flex-shrink-0 border-t border-gray-100">
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
              onClick={formik.handleSubmit}
            >
              {voucher ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}