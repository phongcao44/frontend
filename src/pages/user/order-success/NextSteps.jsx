export default function NextSteps({ orderId }) {
  const steps = [
    {
      icon: 'ri-check-line',
      title: 'Xác nhận đơn hàng',
      description: 'Đơn hàng đã được xác nhận thành công',
      status: 'completed',
      time: 'Vừa xong'
    },
    {
      icon: 'ri-package-line',
      title: 'Chuẩn bị hàng',
      description: 'Đang chuẩn bị và đóng gói sản phẩm',
      status: 'completed',
      time: 'Trong 2-4 giờ'
    },
    {
      icon: 'ri-truck-line',
      title: 'Giao hàng',
      description: 'Sản phẩm đang được vận chuyển',
      status: 'in-progress',
      time: '1-2 ngày'
    },
    {
      icon: 'ri-home-line',
      title: 'Đã giao',
      description: 'Sản phẩm đã được giao thành công',
      status: 'pending',
      time: '2-3 ngày'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trạng Thái Đơn Hàng</h2>
      
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4 mb-8 last:mb-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.status === 'completed' 
                ? 'bg-green-100 text-green-600' 
                : step.status === 'in-progress'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              <i className={`${step.icon} text-lg`}></i>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${
                  step.status === 'completed' 
                    ? 'text-green-600' 
                    : step.status === 'in-progress'
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : step.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.time}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`absolute left-6 w-0.5 h-8 -mt-2 ${
                step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
              }`} style={{ top: `${(index + 1) * 80 + 24}px` }}></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="ri-smartphone-line text-white text-sm"></i>
          </div>
          <h4 className="font-semibold text-blue-800">Theo Dõi Đơn Hàng</h4>
        </div>
        <p className="text-blue-700 text-sm mb-3">
          Bạn có thể theo dõi trạng thái đơn hàng realtime bằng cách:
        </p>
        <ul className="text-blue-700 text-sm space-y-2">
          <li className="flex items-center space-x-2">
            <i className="ri-check-line text-blue-600"></i>
            <span>Truy cập trang "Đơn hàng của tôi" với mã: <strong>{orderId}</strong></span>
          </li>
          <li className="flex items-center space-x-2">
            <i className="ri-check-line text-blue-600"></i>
            <span>Nhận thông báo qua SMS và email</span>
          </li>
          <li className="flex items-center space-x-2">
            <i className="ri-check-line text-blue-600"></i>
            <span>Gọi hotline: <strong>1900 xxxx</strong> để được hỗ trợ</span>
          </li>
        </ul>
      </div>
    </div>
  );
}