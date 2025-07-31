# Google OAuth2 Implementation Guide

## Tổng quan
Hệ thống đã được tích hợp Google OAuth2 để cho phép người dùng đăng nhập bằng tài khoản Google.

## Luồng hoạt động

### 1. Khởi tạo đăng nhập Google
- Người dùng click nút "Đăng nhập với Google" trên trang Login
- Frontend gọi API `GET /api/v1/auth/google-login` để lấy URL redirect
- Frontend redirect người dùng đến Google OAuth consent screen

### 2. Xử lý callback từ Google
- Sau khi người dùng xác thực thành công, Google redirect về `http://localhost:5173/oauth2/redirect`
- Frontend trích xuất `code` từ URL parameters
- Frontend gửi `code` lên backend qua API `POST /api/v1/auth/google/code`

### 3. Xử lý token và đăng nhập
- Backend trao đổi `code` với Google để lấy access token
- Backend lấy thông tin user từ Google
- Backend tạo hoặc cập nhật user trong database
- Backend trả về JWT token cho frontend
- Frontend lưu token và redirect người dùng dựa trên role

## Các file đã tạo/cập nhật

### Services
- `src/services/authService.jsx` - Đã tích hợp Google OAuth functions

### Pages
- `src/pages/user/OAuth2Redirect.jsx` - Trang xử lý callback từ Google

### Redux
- `src/redux/slices/authSlice.jsx` - Thêm actions cho Google OAuth

### Routes
- `src/routes/UserRoutes.jsx` - Thêm route `/oauth2/redirect`

## Cách sử dụng

### 1. Đăng nhập Google
```jsx
import { initiateGoogleLogin } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  
  const handleGoogleLogin = async () => {
    await dispatch(initiateGoogleLogin()).unwrap();
  };
  
  return (
    <button onClick={handleGoogleLogin}>
      Đăng nhập với Google
    </button>
  );
};
```

### 2. Xử lý callback
```jsx
import { googleLoginUser, handleGoogleCallback } from '../redux/slices/authSlice';

const OAuth2Redirect = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Xử lý code và đăng nhập
      const data = await dispatch(handleGoogleCallback({
        code,
        redirectUri: "http://localhost:5173/oauth2/redirect"
      })).unwrap();
      
      await dispatch(googleLoginUser(data));
    }
  }, []);
};
```

## Cấu hình Backend

### 1. Google OAuth Credentials
- Tạo project trên Google Cloud Console
- Enable Google+ API
- Tạo OAuth 2.0 credentials
- Thêm redirect URI: `http://localhost:5173/oauth2/redirect`

### 2. Environment Variables
```properties
google.client.id=your_google_client_id
google.client.secret=your_google_client_secret
```

### 3. Backend Endpoints
- `GET /api/v1/auth/google-login` - Lấy Google OAuth URL
- `POST /api/v1/auth/google/code` - Xử lý authorization code

## Testing

1. Test flow đăng nhập Google hoàn chỉnh
2. Test error handling khi Google trả về lỗi
3. Test redirect dựa trên user roles
4. Test token persistence và session management

## Troubleshooting

### Lỗi thường gặp

1. **"Invalid redirect_uri"**
   - Kiểm tra redirect URI trong Google Cloud Console
   - Đảm bảo URI khớp chính xác với cấu hình

2. **"Authorization code expired"**
   - Authorization codes chỉ có hiệu lực trong thời gian ngắn
   - Đảm bảo xử lý code ngay lập tức

3. **"Invalid client_id"**
   - Kiểm tra Google Client ID trong backend configuration
   - Đảm bảo sử dụng đúng credentials

4. **CORS errors**
   - Kiểm tra CORS configuration trong backend
   - Đảm bảo frontend domain được allow 