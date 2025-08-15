import React, { useEffect, useState } from 'react';
import { RotateCcw, Image as ImageIcon } from 'lucide-react';
import { fetchUserReturnRequests } from '../../services/returnRequestService';

const MyReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserReturnRequests()
      .then((data) => setRequests(data))
      .catch(() => console.error('Failed to fetch return requests'))
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Chờ duyệt',
          class: 'bg-orange-100 text-orange-700 border-orange-200',
        };
      case 'APPROVED':
        return {
          label: 'Đã duyệt',
          class: 'bg-green-100 text-green-700 border-green-200',
        };
      case 'REJECTED':
        return {
          label: 'Từ chối',
          class: 'bg-red-100 text-red-700 border-red-200',
        };
      default:
        return {
          label: 'Không xác định',
          class: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
          <RotateCcw className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Yêu cầu đổi/trả
          </h1>
          <p className="text-gray-600 mt-1">Kiểm tra các yêu cầu bạn đã gửi</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Đang tải dữ liệu...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không có yêu cầu nào
            </h3>
            <p className="text-gray-500">Bạn chưa gửi yêu cầu đổi trả nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map((req) => {
              const statusInfo = getStatus(req.status);
              
              return (
                <div key={req.id} className="flex flex-col md:flex-row gap-4 p-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                    {req.productImageUrl ? (
                      <img
                        src={req.productImageUrl}
                        alt={req.productName}
                        className="object-cover w-full h-full rounded-xl"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{display: req.productImageUrl ? 'none' : 'flex'}}>
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{req.productName}</h2>
                    <div className="text-sm text-gray-500 space-y-1 mt-1">
                      <p><strong>Lý do:</strong> <span className="italic">{req.reason}</span></p>
                      <p><strong>Số lượng:</strong> {req.quantity}</p>
                      <p><strong>Giá:</strong> {req.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      <p><strong>Gửi lúc:</strong> {new Date(req.createdAt).toLocaleString('vi-VN', { hour12: false, timeZone: 'Asia/Ho_Chi_Minh' })}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-40 flex md:justify-end items-start">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${statusInfo.class}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReturnRequests;
