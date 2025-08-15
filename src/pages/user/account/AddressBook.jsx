import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Edit, Trash2, Phone } from 'lucide-react';
import { getAddresses, removeAddress } from '../../../redux/slices/addressSlice';
import AddressForm from './AddressForm';
import Swal from 'sweetalert2';

export default function AddressBook() {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(getAddresses()).unwrap();
      } catch (err) {
        console.error('Error fetching addresses:', err);
        Swal.fire({
          title: 'Lỗi!',
          text: err.message || 'Có lỗi xảy ra khi tải danh sách địa chỉ',
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    };
    fetchInitialData();
  }, [dispatch]);

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressFormOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleAddressFormClose = () => {
    setIsAddressFormOpen(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(removeAddress(addressId)).unwrap();
        Swal.fire({
          title: 'Thành công!',
          text: 'Địa chỉ đã được xóa thành công',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } catch (err) {
        console.error('Error deleting address:', err);
        Swal.fire({
          title: 'Lỗi!',
          text: err.message || 'Có lỗi xảy ra khi xóa địa chỉ',
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    }
  };

  if (loading && !isAddressFormOpen) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error && !isAddressFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600">{error}</div>
        <button
          onClick={() => dispatch(getAddresses())}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Địa chỉ của tôi
              </h1>
              <p className="text-gray-600 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
            </div>
          </div>

          {/* Add Address Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleAddAddress}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Thêm địa chỉ mới
            </button>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses && addresses.length > 0 ? (
            addresses.map((addr) => (
              <div key={addr.addressId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{addr.recipientName}</h3>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {addr.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105 transform flex items-center gap-1 text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.addressId)}
                      className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-105 transform flex items-center gap-1 text-sm font-medium"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 font-medium">{addr.fullAddress}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {addr.wardName}, {addr.districtName}, {addr.provinceName}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-blue-700 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Địa chỉ giao hàng
                    </span>
                    <div className="text-xs text-gray-500">
                      ID: #{addr.addressId}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bạn chưa có địa chỉ nào</h3>
                <p className="text-gray-500 mb-6">Hãy thêm địa chỉ để thuận tiện cho việc giao hàng!</p>
                <button
                  onClick={handleAddAddress}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  <MapPin className="w-4 h-4" />
                  Thêm địa chỉ đầu tiên
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddressFormOpen && (
        <AddressForm
          address={selectedAddress}
          onClose={handleAddressFormClose}
        />
      )}
    </div>
  );
}