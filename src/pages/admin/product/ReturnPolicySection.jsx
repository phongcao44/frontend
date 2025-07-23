import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReturnPolicies,
  addReturnPolicy,
  editReturnPolicy,
  removeReturnPolicy,
} from "../../../redux/slices/returnPolicySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PolicyModal from "./PolicyModal";

const ReturnPolicySection = ({
  onChange,
  defaultPolicyId = null,
  productId = null,
}) => {
  const dispatch = useDispatch();
  const returnPolicies = useSelector((state) => state.returnPolicy.items || []);
  const loading = useSelector((state) => state.returnPolicy.loading);
  const error = useSelector((state) => state.returnPolicy.error);

  const [selectedPolicyId, setSelectedPolicyId] = useState(defaultPolicyId);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(!productId);
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);

  useEffect(() => {
    dispatch(getAllReturnPolicies());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Lỗi: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (returnPolicies.length === 0) {
      setSelectedPolicyId(null);
      setFormData(null);
      onChange?.(null);
      return;
    }

    const productPolicy = returnPolicies.find((p) => p.id === defaultPolicyId);

    if (productId && productPolicy && selectedPolicyId !== productPolicy.id) {
      setSelectedPolicyId(productPolicy.id);
      setFormData({ ...productPolicy });
      onChange?.(productPolicy);
    } else if (
      selectedPolicyId &&
      !returnPolicies.find((p) => p.id === selectedPolicyId)
    ) {
      setSelectedPolicyId(null);
      setFormData(null);
      onChange?.(null);
    } else if (selectedPolicyId) {
      const policy = returnPolicies.find((p) => p.id === selectedPolicyId);
      if (policy && (!formData || formData.id !== policy.id || JSON.stringify(formData) !== JSON.stringify(policy))) {
        setFormData({ ...policy });
        onChange?.(policy);
      }
    } else if (formData) {
      setFormData(null);
      onChange?.(null);
    }
  }, [returnPolicies, selectedPolicyId, defaultPolicyId, productId, onChange]);

  const handlePolicySelect = useCallback(
    (value) => {
      const policyId = value === "not_satisfied" ? null : parseInt(value);
      setSelectedPolicyId(policyId);
      if (value === "not_satisfied") {
        setAddModalVisible(true);
      } else {
        const selectedPolicy = returnPolicies.find((p) => p.id === policyId);
        if (selectedPolicy) {
          setFormData({ ...selectedPolicy });
          onChange?.(selectedPolicy);
        } else {
          setFormData(null);
          onChange?.(null);
        }
      }
    },
    [onChange, returnPolicies]
  );

  const handleCreatePolicy = useCallback(
    async (formData) => {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        returnDays: formData.returnDays,
        allowReturnWithoutReason: formData.allowReturnWithoutReason ?? false,
        status: formData.status ?? "ACTIVE",
      };
      try {
        const createdPolicy = await dispatch(
          addReturnPolicy(payload)
        ).unwrap();
        toast.success("Đã thêm chính sách mới");
        setSelectedPolicyId(createdPolicy.id);
        setFormData({ ...createdPolicy });
        setAddModalVisible(false);
        onChange?.(createdPolicy);
      } catch (err) {
        toast.error("Thêm chính sách thất bại");
        console.error(err);
      }
    },
    [dispatch, onChange]
  );

  const handleSavePolicy = useCallback(async () => {
    if (!formData?.title?.trim()) {
      toast.error("Vui lòng nhập tiêu đề chính sách");
      return;
    }
    if (!formData?.content?.trim()) {
      toast.error("Vui lòng nhập nội dung chính sách");
      return;
    }
    if (formData?.returnDays < 1) {
      toast.error("Số ngày đổi trả phải lớn hơn 0");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      returnDays: formData.returnDays,
      allowReturnWithoutReason: formData.allowReturnWithoutReason ?? false,
      status: formData.status ?? "ACTIVE",
    };

    try {
      console.log("Saving return policy:", payload);
      const updatedPolicy = await dispatch(
        editReturnPolicy({
          id: selectedPolicyId,
          requestDTO: payload,
        })
      ).unwrap();
      toast.success("Đã cập nhật chính sách");
      setFormData({ ...updatedPolicy });
      onChange?.(updatedPolicy);
    } catch (err) {
      toast.error("Cập nhật chính sách thất bại");
      console.error(err);
    }
  }, [dispatch, formData, selectedPolicyId, onChange]);

  const removePolicy = useCallback(
    async (policyId) => {
      try {
        await dispatch(removeReturnPolicy(policyId)).unwrap();
        toast.success("Đã xóa chính sách");
        setSelectedPolicyId(null);
        setFormData(null);
        onChange?.(null);
      } catch (err) {
        toast.error("Xóa chính sách thất bại");
        console.error(err);
      }
    },
    [dispatch, onChange]
  );

  const selectedPolicyDetails = useMemo(
    () => returnPolicies.find((p) => p.id === selectedPolicyId),
    [returnPolicies, selectedPolicyId]
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4">Chính sách đổi trả</h2>
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      <div className="flex items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn chính sách
          </label>
          <select
            value={selectedPolicyId ?? ""}
            onChange={(e) => handlePolicySelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="" disabled>
              {loading ? "Đang tải chính sách..." : "Chọn chính sách"}
            </option>
            {returnPolicies.length > 0 ? (
              returnPolicies.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  {policy.title}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Không có chính sách
              </option>
            )}
            <option value="not_satisfied">Không hài lòng</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddModalVisible(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
            disabled={loading}
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm chính sách mới
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 border border-gray-300 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Chi tiết chính sách
          </h3>
          <button
            onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${
                isDetailsCollapsed ? "rotate-0" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        {!isDetailsCollapsed && (
          <div className="space-y-4">
            {formData ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề chính sách
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    value={formData.content || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số ngày đổi trả
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.returnDays || 7}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        returnDays: parseInt(e.target.value) || 7,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cho phép đổi trả không cần lý do
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowReturnWithoutReason || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allowReturnWithoutReason: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm">
                      Cho phép đổi trả không cần lý do
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
                {selectedPolicyDetails && (
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={handleSavePolicy}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      disabled={loading}
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => removePolicy(selectedPolicyDetails.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={loading}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Không tìm thấy chính sách, vui lòng chọn hoặc thêm mới
              </p>
            )}
          </div>
        )}
      </div>

      <PolicyModal
        isOpen={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
        }}
        onSubmit={handleCreatePolicy}
        loading={loading}
      />
    </div>
  );
};

export default ReturnPolicySection;