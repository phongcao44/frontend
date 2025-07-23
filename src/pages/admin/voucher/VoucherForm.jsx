/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createNewVoucher,
  updateExistingVoucher,
} from "../../../redux/slices/voucherSlice";

export default function VoucherForm({ isOpen, onClose, voucher }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      voucherId: 0,
      code: "",
      discountPercent: 0,
      maxDiscount: 0,
      startDate: "",
      endDate: "",
      quantity: 0,
      minOrderAmount: 0,
      collectible: true,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Bắt buộc"),
      discountPercent: Yup.number().min(0).max(100).required("Bắt buộc"),
      maxDiscount: Yup.number().min(0).required("Bắt buộc"),
      startDate: Yup.string().required("Bắt buộc"),
      endDate: Yup.string().required("Bắt buộc"),
      quantity: Yup.number().min(1).required("Bắt buộc"),
      minOrderAmount: Yup.number().min(0).required("Bắt buộc"),
      collectible: Yup.boolean().required("Bắt buộc"),
    }),
    onSubmit: async (values) => {
      const voucherId = voucher ? voucher.id : 0;
      const payload = {
        ...values,
        voucherId,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
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
        discountPercent: voucher.discountPercent || 0,
        maxDiscount: voucher.maxDiscount || 0,
        startDate: voucher.startDate
          ? new Date(voucher.startDate).toISOString().slice(0, 16)
          : "",
        endDate: voucher.endDate
          ? new Date(voucher.endDate).toISOString().slice(0, 16)
          : "",
        quantity: voucher.quantity || 0,
        minOrderAmount: voucher.minOrderAmount || 0,
        collectible:
          voucher.collectible !== undefined ? voucher.collectible : true,
      });
    } else {
      formik.resetForm();
    }
  }, [voucher, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {voucher ? "Chỉnh sửa Voucher" : "Tạo Voucher mới"}
        </h3>

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
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
            {formik.touched.discountPercent &&
              formik.errors.discountPercent && (
                <div className="text-red-500 text-sm">
                  {formik.errors.discountPercent}
                </div>
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
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
            {formik.touched.maxDiscount && formik.errors.maxDiscount && (
              <div className="text-red-500 text-sm">
                {formik.errors.maxDiscount}
              </div>
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
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Có thể thu thập
            </label>
            <input
              type="checkbox"
              name="collectible"
              checked={formik.values.collectible}
              onChange={formik.handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            {formik.touched.collectible && formik.errors.collectible && (
              <div className="text-red-500 text-sm">
                {formik.errors.collectible}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800"
            onClick={formik.handleSubmit}
          >
            {voucher ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
