import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Gift, Tag, Calendar, Percent, DollarSign, CheckCircle, RotateCcw } from 'lucide-react';
import { fetchUserVouchers, fetchCollectibleVouchers, userCollectVoucher, fetchUnusedVouchers, fetchUsedVouchers } from '../../../redux/slices/voucherSlice';
import Swal from 'sweetalert2';

export default function VoucherSection() {
  const [error, setError] = useState(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.users);
  const { unusedVouchers, usedVouchers, collectibleVouchers } = useSelector((state) => state.voucher || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        await dispatch(fetchUnusedVouchers()).unwrap();
        await dispatch(fetchUsedVouchers()).unwrap();
      } catch (error) {
        console.error('Failed to fetch voucher data:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải thông tin voucher');
      }
    };
    fetchData();
  }, [dispatch]);

  const handleCollectVoucher = async (voucher) => {
    const userId = userDetail?.id || userDetail?.userId || userDetail?.user?.id;

    const payload = {
      userId: userId,
      voucherCode: voucher.code
    };

    if (!userId) {
      setError('Không thể xác định ID người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await dispatch(userCollectVoucher(payload)).unwrap();

      Swal.fire({
        title: 'Thành công!',
        text: 'Bạn đã thu thập voucher thành công',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      await dispatch(fetchUnusedVouchers());
      await dispatch(fetchUsedVouchers());
      await dispatch(fetchCollectibleVouchers());
      setIsCollectModalOpen(false);
    } catch (err) {
      console.error('Lỗi thu thập voucher:', err);
      setError(err?.message || 'Có lỗi xảy ra khi thu thập voucher');
    }
  };

  const handleOpenCollectModal = async () => {
    try {
      await dispatch(fetchCollectibleVouchers()).unwrap();
      setIsCollectModalOpen(true);
    } catch (error) {
      setError('Có lỗi xảy ra khi tải danh sách voucher có thể thu thập');
    }
  };

  const renderMyVouchers = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Voucher của tôi</h2>
            <p className="text-sm text-gray-500">Quản lý voucher và mã giảm giá</p>
          </div>
        </div>
        <button
          onClick={handleOpenCollectModal}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Thu thập voucher
        </button>
      </div>

      {/* Unused Vouchers Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          Voucher có thể sử dụng ({unusedVouchers?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unusedVouchers && unusedVouchers.length > 0 ? (
            unusedVouchers.map((voucher) => (
              <div key={voucher.id} className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-blue-700">{voucher.code}</h3>
                      <p className="text-sm text-gray-600">{voucher.description || voucher.name}</p>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    Có thể sử dụng
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>HSD: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : (voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : 'Không xác định')}</span>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center gap-2">
                      {voucher.discountPercent > 0 ? (
                        <>
                          <Percent className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-lg text-blue-600">Giảm Giá: {voucher.discountPercent}%</span>
                        </>
                      ) : voucher.discountAmount > 0 ? (
                        <>
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-lg text-blue-600">Giảm Giá: {voucher.discountAmount.toLocaleString('vi-VN')}₫</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Không xác định</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có voucher nào có thể sử dụng</h3>
              <p className="text-gray-500">Hãy thu thập voucher để nhận ưu đãi hấp dẫn!</p>
            </div>
          )}
        </div>
      </div>

      {/* Used Vouchers Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-gray-600" />
          Voucher đã sử dụng ({usedVouchers?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usedVouchers && usedVouchers.length > 0 ? (
            usedVouchers.map((voucher) => {
              const isExpired = voucher.expiryDate ? new Date(voucher.expiryDate) < new Date() : 
                               voucher.endDate ? new Date(voucher.endDate) < new Date() : false;
              
              return (
                <div key={voucher.id} className="border rounded-xl p-6 hover:shadow-lg transition-all duration-200 group bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-gray-500 to-slate-600">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-700">{voucher.code}</h3>
                        <p className="text-sm text-gray-600">{voucher.description || voucher.name}</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-300">
                      {isExpired ? 'Đã hết hạn' : 'Đã sử dụng'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {isExpired ? (
                        <span>Hết hạn vào ngày: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : (voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : 'Không xác định')}</span>
                      ) : (
                        <span>HSD: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : (voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : 'Không xác định')}</span>
                      )}
                    </div>

                    <div className="rounded-lg p-3 border bg-white border-gray-100">
                      <div className="flex items-center gap-2">
                        {voucher.discountPercent > 0 ? (
                          <>
                            <Percent className="w-4 h-4 text-gray-600" />
                            <span className="font-bold text-lg text-gray-600">Giảm Giá: {voucher.discountPercent}%</span>
                          </>
                        ) : voucher.discountAmount > 0 ? (
                          <>
                            <DollarSign className="w-4 h-4 text-gray-600" />
                            <span className="font-bold text-lg text-gray-600">Giảm Giá: {voucher.discountAmount.toLocaleString('vi-VN')}₫</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Không xác định</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có voucher nào đã sử dụng</h3>
              <p className="text-gray-500">Bạn chưa sử dụng voucher nào!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCollectModal = () => (
    isCollectModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Thu thập voucher</h2>
                <p className="text-sm text-gray-500">Chọn voucher bạn muốn thu thập</p>
              </div>
            </div>
            <button
              onClick={() => setIsCollectModalOpen(false)}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collectibleVouchers && collectibleVouchers.length > 0 ? (
              collectibleVouchers.map((voucher) => (
                <div key={voucher.id} className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-700">{voucher.code}</h3>
                        <p className="text-sm text-gray-600">{voucher.description || voucher.name}</p>
                      </div>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      Có thể thu thập
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>HSD: {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : (voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : 'Không xác định')}</span>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2">
                        {voucher.discountPercent > 0 ? (
                          <>
                            <Percent className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-lg text-blue-600">Giảm {voucher.discountPercent}%</span>
                          </>
                        ) : voucher.discountAmount > 0 ? (
                          <>
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-lg text-blue-600">Giảm {voucher.discountAmount.toLocaleString('vi-VN')}₫</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Không xác định</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105"
                    onClick={() => handleCollectVoucher(voucher)}
                  >
                    <Gift className="w-4 h-4" />
                    Thu thập ngay
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có voucher nào để thu thập</h3>
                <p className="text-gray-500">Hãy quay lại sau để xem voucher mới!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {renderMyVouchers()}
      {renderCollectModal()}
    </>
  );
}
