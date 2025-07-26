import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAddress, editAddress } from '../../../redux/slices/addressSlice';
import { fetchUserView } from '../../../redux/slices/userSlice';
import { fetchProvinces, fetchDistricts, fetchWards } from '../../../services/ghnService';
import Swal from 'sweetalert2';

export default function AddressForm({ address, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    fullAddress: '',
    ward: '',
    district: '',
    province: '',
    provinceId: '',
    districtId: '',
    wardCode: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await fetchProvinces();
        setProvinces(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Không thể tải danh sách tỉnh/thành phố');
      }
    };
    loadProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!formData.provinceId) {
        setDistricts([]);
        return;
      }
      try {
        const data = await fetchDistricts(formData.provinceId);
        setDistricts(data);
        
        // Nếu đang edit và có district, tìm và set districtId
        if (address && address.district && data.length > 0) {
          const foundDistrict = data.find(d => d.DistrictName === address.district);
          if (foundDistrict) {
            setFormData(prev => ({ ...prev, districtId: foundDistrict.DistrictID.toString() }));
          }
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError('Không thể tải danh sách quận/huyện');
      }
    };
    loadDistricts();
  }, [formData.provinceId, address]);

  // Fetch wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (!formData.districtId) {
        setWards([]);
        return;
      }
      try {
        const data = await fetchWards(formData.districtId);
        setWards(data);
        
        // Nếu đang edit và có ward, tìm và set wardCode
        if (address && address.ward && data.length > 0) {
          const foundWard = data.find(w => w.WardName === address.ward);
          if (foundWard) {
            setFormData(prev => ({ ...prev, wardCode: foundWard.WardCode }));
          }
        }
      } catch (err) {
        console.error('Error fetching wards:', err);
        setError('Không thể tải danh sách phường/xã');
      }
    };
    loadWards();
  }, [formData.districtId, address]);

  useEffect(() => {
    if (address) {
      // Khi edit địa chỉ, hiển thị thông tin hiện tại
      setFormData({
        recipientName: address.recipientName || '',
        phone: address.phone || '',
        fullAddress: address.fullAddress || '',
        ward: address.ward || '',
        district: address.district || '',
        province: address.province || '',
        provinceId: '',
        districtId: '',
        wardCode: ''
      });
      
      // Tìm và set provinceId, districtId, wardCode dựa trên tên
      if (address.province) {
        const foundProvince = provinces.find(p => p.ProvinceName === address.province);
        if (foundProvince) {
          setFormData(prev => ({ ...prev, provinceId: foundProvince.ProvinceID.toString() }));
        }
      }
    } else {
      // Khi thêm mới, reset form
      setFormData({
        recipientName: '',
        phone: '',
        fullAddress: '',
        ward: '',
        district: '',
        province: '',
        provinceId: '',
        districtId: '',
        wardCode: ''
      });
    }
  }, [address, provinces]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const selectedProvince = provinces.find(p => p.ProvinceID === Number(provinceId));
    setFormData(prev => ({
      ...prev,
      provinceId,
      province: selectedProvince ? selectedProvince.ProvinceName : '',
      district: '',
      districtId: '',
      ward: '',
      wardCode: ''
    }));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const selectedDistrict = districts.find(d => d.DistrictID === Number(districtId));
    setFormData(prev => ({
      ...prev,
      districtId,
      district: selectedDistrict ? selectedDistrict.DistrictName : '',
      ward: '',
      wardCode: ''
    }));
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const selectedWard = wards.find(w => w.WardCode === wardCode);
    setFormData(prev => ({
      ...prev,
      wardCode,
      ward: selectedWard ? selectedWard.WardName : ''
    }));
  };

  const validateForm = () => {
    if (!formData.recipientName.trim()) {
      setError('Vui lòng nhập tên người nhận');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.fullAddress.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return false;
    }
    if (!formData.province) {
      setError('Vui lòng chọn tỉnh/thành phố');
      return false;
    }
    if (!formData.district) {
      setError('Vui lòng chọn quận/huyện');
      return false;
    }
    if (!formData.ward) {
      setError('Vui lòng chọn phường/xã');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const addressRequest = {
        recipientName: formData.recipientName,
        phone: formData.phone,
        fullAddress: formData.fullAddress,
        ward: formData.ward,
        district: formData.district,
        province: formData.province
      };

      if (address?.id) {
        await dispatch(editAddress({ id: address.id, payload: addressRequest })).unwrap();
      } else {
        await dispatch(createAddress(addressRequest)).unwrap();
      }

      await dispatch(fetchUserView());
      
      // Hiển thị thông báo thành công
      Swal.fire({
        title: 'Thành công!',
        text: address?.id ? 'Địa chỉ đã được cập nhật thành công' : 'Địa chỉ đã được thêm thành công',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
      onClose();
    } catch (err) {
      console.error('Error saving address:', err);
      setError(err.message || 'Có lỗi xảy ra khi lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên người nhận
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên người nhận"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ chi tiết"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố
              </label>
              <select
                name="provinceId"
                value={formData.provinceId}
                onChange={handleProvinceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện
              </label>
              <select
                name="districtId"
                value={formData.districtId}
                onChange={handleDistrictChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.provinceId}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã
              </label>
              <select
                name="wardCode"
                value={formData.wardCode}
                onChange={handleWardChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.districtId}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Đang lưu...' : address ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 