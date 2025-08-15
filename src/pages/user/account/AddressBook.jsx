import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getAddresses,
  removeAddress,
} from "../../../redux/slices/addressSlice";
import AddressForm from "./AddressForm";

export default function AddressBook() {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [localAddresses, setLocalAddresses] = useState([]);

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  // Sync local list whenever Redux addresses change
  useEffect(() => {
    setLocalAddresses(addresses || []);
  }, [addresses]);

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      // Ask for confirmation first
      const result = await Swal.fire({
        title: "Xóa địa chỉ?",
        text: "Địa chỉ này sẽ bị ẩn khỏi danh sách của bạn.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
      });

      if (!result.isConfirmed) return;

      // Optimistic UI update: remove immediately
      setLocalAddresses((prev) => prev.filter((a) => (a.id || a.addressId) !== id));

      // Call API to set deleted = true
      await dispatch(removeAddress(id)).unwrap();

      // Success toast like the screenshot
      await Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Địa chỉ đã được xóa.",
        toast: true,
        position: "top-end",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      // Revert by refetching
      dispatch(getAddresses());
      await Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể xóa địa chỉ. Vui lòng thử lại.",
      });
    }
  };

  const handleNewAddress = () => {
    setSelectedAddress(null);
    setShowForm(true);
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white rounded-xl p-6 md:p-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.5 8c0 7-7.5 13-7.5 13S4.5 15 4.5 8a7.5 7.5 0 1115 0z"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-green-700">Địa chỉ của tôi</h2>
            <p className="text-sm text-gray-500">Quản lý địa chỉ giao hàng của bạn</p>
          </div>
        </div>
        <button
          onClick={handleNewAddress}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white shadow-sm hover:bg-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.5 8c0 7-7.5 13-7.5 13S4.5 15 4.5 8a7.5 7.5 0 1115 0z"/></svg>
          Thêm địa chỉ mới
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Address List or Empty State */}
      {localAddresses.length === 0 ? (
        <p className="text-gray-600 mb-6">Chưa có địa chỉ nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {localAddresses.map((address) => {
            const id = address.id || address.addressId;
            const ward = address.ward || address.wardName;
            const district = address.district || address.districtName;
            const province = address.province || address.provinceName;
            return (
              <div key={id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{address.recipientName}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h2l2 4-2 1a12 12 0 006 6l1-2 4 2v2a2 2 0 01-2 2h-1C9.716 20 4 14.284 4 7V6a1 1 0 00-1-1H3z" /></svg>
                        <span>{address.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-0.92l9.06-9.06.92.92L5.92 19.58zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7h12v2H6V7zm2 3h8l-1 9H9L8 10zm3-6h2v2h-2V4z"/></svg>
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-gray-800 font-semibold">
                    {address.fullAddress}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2 bg-white border border-gray-200 rounded-md px-3 py-2 shadow-inner">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-green-50 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z"/></svg>
                    </span>
                    <span>
                      {ward}, {district}, {province}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Địa chỉ giao hàng
                  </span>
                  <span className="text-xs text-gray-400">ID: #{id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showForm && (
        <AddressForm
          address={selectedAddress}
          onClose={() => {
            setShowForm(false);
            // Refresh list just in case
            dispatch(getAddresses());
          }}
        />
      )}
    </div>
  );
}
