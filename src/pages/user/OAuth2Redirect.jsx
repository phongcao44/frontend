import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLoginUser, handleGoogleCallback } from "../../redux/slices/authSlice";

const OAuth2Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        // Lấy code từ URL parameters
        const code = searchParams.get("code");
        
        if (!code) {
          setError("Không tìm thấy mã xác thực từ Google");
          setIsProcessing(false);
          return;
        }

        // Gửi code lên backend để xử lý
        const data = await dispatch(handleGoogleCallback({
          code: code,
          redirectUri: "http://localhost:5173/oauth2/redirect"
        })).unwrap();

        if (data && data.accessToken) {
          // Cập nhật Redux state với Google login
          await dispatch(googleLoginUser(data));

          // Redirect dựa trên role
          if (data.roles?.includes("ROLE_ADMIN")) {
            navigate("/admin/dashboard");
          } else if (data.roles?.includes("ROLE_MODERATOR")) {
            navigate("/shipper/dashboard");
          } else {
            navigate("/");
          }
        } else {
          setError("Không nhận được token từ server");
        }
      } catch (err) {
        console.error("Lỗi xử lý Google callback:", err);
        setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng nhập bằng Google");
      } finally {
        setIsProcessing(false);
      }
    };

    processGoogleCallback();
  }, [searchParams, navigate, dispatch]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Đăng nhập thất bại</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuth2Redirect; 