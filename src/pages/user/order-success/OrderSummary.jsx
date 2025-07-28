export default function OrderSummary({ orderData }) {
  const subtotal = orderData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = orderData.shippingFee || 0;
  const discount = orderData.voucher ? (subtotal * orderData.voucher.discountAmount) / 100 : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tóm Tắt Đơn Hàng</h2>
      
      <div className="space-y-6">
        {orderData.items.map((item) => (
          <div key={item.variantId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-sm">
              <img 
                src={item.images.find(img => img.is_main)?.image_url || item.images[0]?.image_url}
                alt={item.productName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.productName} ({item.color.name}, {item.size.name})</h3>
              <p className="text-gray-600">Số lượng: {item.quantity}</p>
              <p className="text-blue-600 font-bold">{item.price.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">
                {item.totalPrice.toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí giao hàng:</span>
            <span>{deliveryFee === 0 ? 'Miễn phí' : `${deliveryFee.toLocaleString('vi-VN')}đ`}</span>
          </div>
          {orderData.voucher && (
            <div className="flex justify-between text-gray-600">
              <span>Giảm giá ({orderData.voucher.code}):</span>
              <span>-{discount.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}