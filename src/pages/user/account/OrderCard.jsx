export default function OrderCard({ order, onSelect, getStatusColor, getStatusText }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
        <div className="flex items-center space-x-4 mb-2 lg:mb-0">
          <h3 className="font-semibold text-gray-900">{order.id}</h3>
          <span className="text-sm text-gray-600">{order.date}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold text-gray-900">
            {order.total.toLocaleString('vi-VN')}đ
          </span>
          <button
            onClick={onSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-600">SL: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}