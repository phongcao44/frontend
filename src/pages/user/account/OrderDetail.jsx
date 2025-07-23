export default function OrderDetail({ order, onBack }) {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const timeline = [
    { status: 'Đã đặt hàng', date: '2024-01-15 10:30', completed: true },
    { status: 'Đã xác nhận', date: '2024-01-15 11:00', completed: order.status !== 'pending' },
    { status: 'Đang chuẩn bị', date: '2024-01-15 14:30', completed: order.status === 'shipping' || order.status === 'delivered' },
    { status: 'Đang giao hàng', date: '2024-01-16 09:00', completed: order.status === 'delivered' },
    { status: 'Đã giao hàng', date: order.status === 'delivered' ? '2024-01-16 15:30' : '', completed: order.status === 'delivered' }
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <h2 className="text-xl font-semibold">{order.id}</h2>
              <span className="text-gray-600">{order.date}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {order.status === 'pending' && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer whitespace-nowrap">
                  Hủy đơn
                </button>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                Mua lại
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`
                        w-4 h-4 rounded-full flex items-center justify-center
                        ${item.completed ? 'bg-green-500' : 'bg-gray-300'}
                      `}>
                        {item.completed && <i className="ri-check-line text-white text-xs"></i>}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? 'text-green-700' : 'text-gray-500'}`}>
                          {item.status}
                        </p>
                        {item.date && (
                          <p className="text-sm text-gray-600">{item.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {item.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h3>
                <div className="space-y-2">
                  <p className="font-medium">Nguyễn Văn An</p>
                  <p className="text-sm text-gray-600">0123456789</p>
                  <p className="text-sm text-gray-600">
                    123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Phương thức thanh toán</h3>
                <div className="flex items-center space-x-2">
                  <i className="ri-bank-card-line text-blue-600"></i>
                  <span className="text-sm">Thanh toán khi nhận hàng</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tóm tắt đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{order.total.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Giảm giá:</span>
                    <span>-0đ</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-lg text-blue-600">
                        {order.total.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}