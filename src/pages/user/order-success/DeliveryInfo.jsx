export default function DeliveryInfo({ deliveryInfo }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Vận Chuyển</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="ri-truck-line text-white"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Phương Thức Giao Hàng</h3>
                <p className="text-blue-600 font-medium">{deliveryInfo.method}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Đơn hàng sẽ được giao đến địa chỉ của bạn trong thời gian sớm nhất
            </p>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <i className="ri-calendar-check-line text-white"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Thời Gian Giao Hàng</h3>
                <p className="text-green-600 font-medium">{deliveryInfo.estimatedDate}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Thời gian giao hàng dự kiến (không bao gồm thứ 7, chủ nhật)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-information-line text-yellow-600"></i>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Lưu Ý Quan Trọng</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Vui lòng có mặt tại địa chỉ giao hàng trong khung giờ đã chọn</li>
              <li>• Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
              <li>• Liên hệ hotline nếu có bất kỳ thắc mắc nào</li>
              <li>• Đơn hàng có thể được giao sớm hơn dự kiến</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}