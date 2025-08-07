import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPaymentInfo } from "../../../services/paymentService";

export default function VNPayCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Lấy tất cả query parameters từ URL
        const searchParams = new URLSearchParams(location.search);
        const params = {};
        
        // Chuyển đổi URLSearchParams thành object
        for (let [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        console.log("VNPay callback params:", params);

        // Gọi API để xác thực và xử lý kết quả thanh toán
        const response = await getPaymentInfo(params);
        
        console.log("Payment info response:", response);

        if (response.code === "00" && response.data) {
          const { orderId, status } = response.data;
          
          if (status === "SUCCESS" || status === "PAID") {
            // Thanh toán thành công
            navigate(`/payment-success/${orderId}`, { replace: true });
          } else {
            // Thanh toán thất bại
            navigate(`/payment-failed/${orderId}`, { replace: true });
          }
        } else {
          // Lỗi từ API hoặc response không hợp lệ
          console.error("Payment verification failed:", response);
          
          // Thử lấy orderId từ params nếu có
          const orderId = params.vnp_TxnRef || params.orderId;
          if (orderId) {
            navigate(`/payment-failed/${orderId}`, { replace: true });
          } else {
            navigate("/payment-failed/unknown", { replace: true });
          }
        }
      } catch (error) {
        console.error("VNPay callback error:", error);
        
        // Thử lấy orderId từ URL params
        const searchParams = new URLSearchParams(location.search);
        const orderId = searchParams.get("vnp_TxnRef") || searchParams.get("orderId");
        
        if (orderId) {
          navigate(`/payment-failed/${orderId}`, { replace: true });
        } else {
          navigate("/payment-failed/unknown", { replace: true });
        }
      } finally {
        setProcessing(false);
      }
    };

    handlePaymentCallback();
  }, [location.search, navigate]);

  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Đang xử lý thanh toán...
          </h2>
          <p className="text-gray-600">
            Vui lòng đợi trong giây lát, chúng tôi đang xác thực kết quả thanh toán của bạn.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
