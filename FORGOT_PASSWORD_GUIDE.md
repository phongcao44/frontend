# Forgot Password Feature Implementation

## Overview
Hệ thống quên mật khẩu đã được cập nhật để hoạt động với backend API và hiển thị popup thông báo thành công.

## Flow hoạt động

### 1. Forgot Password Page (`/forgot-password`)
- User nhập email
- Click "Đặt lại mật khẩu"
- Backend kiểm tra email có tồn tại không
- Nếu thành công: Hiển thị popup thông báo "Gửi thông tin đổi mật khẩu mới thành công! Vui lòng kiểm tra email của bạn và click vào link để đặt lại mật khẩu."
- Nếu lỗi: Hiển thị thông báo lỗi cụ thể

### 2. Email Reset Link
- Backend gửi email với link: `http://localhost:5173/reset-password?token=xxx`
- User click vào link trong email

### 3. Reset Password Page (`/reset-password`)
- Tự động lấy token từ URL query parameter
- User nhập mật khẩu mới và xác nhận
- Gửi request đến backend để đặt lại mật khẩu
- Nếu thành công: Redirect đến `/login` với thông báo thành công
- Nếu lỗi: Hiển thị thông báo lỗi

## Files đã cập nhật

### 1. `src/pages/user/ForgotPassword.jsx`
- Sử dụng Redux thunk `forgotPasswordUser`
- Hiển thị popup thành công thay vì redirect
- Xử lý lỗi cụ thể cho "Email không tồn tại"
- Loại bỏ validation chỉ cho Gmail

### 2. `src/pages/user/ResetPassword.jsx`
- Sử dụng `useSearchParams` để lấy token từ query parameter
- Sử dụng Redux thunk `resetPasswordUser`
- Xử lý lỗi tốt hơn với kiểm tra kiểu dữ liệu
- Redirect đến login page với thông báo thành công

### 3. `src/components/SuccessPopup.jsx` (mới)
- Component popup hiển thị thông báo thành công
- Tự động đóng sau 5 giây
- Có thể đóng thủ công

### 4. `src/routes/UserRoutes.jsx`
- Cập nhật route từ `reset-password/:token` thành `reset-password`
- Token được truyền qua query parameter

### 5. `src/redux/slices/authSlice.jsx`
- Sửa lỗi typo `return data;zz` thành `return data;`

## API Endpoints

### Forgot Password
```
POST /api/v1/auth/forgot-password
Body: { "email": "user@example.com" }
```

### Reset Password
```
POST /api/v1/auth/reset-password?token=xxx
Body: { "password": "newpassword123" }
```

## Error Handling

### Forgot Password Errors
- "Email không tồn tại trong hệ thống" - khi email không có trong database
- "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu" - lỗi chung

### Reset Password Errors
- "Token không hợp lệ hoặc đã hết hạn" - khi token sai hoặc hết hạn
- "Mật khẩu không hợp lệ" - khi password không đúng format
- "Yêu cầu không hợp lệ" - khi request format sai
- "Có lỗi xảy ra khi đặt lại mật khẩu" - lỗi chung

## Testing

### Test Forgot Password
1. Vào `/forgot-password`
2. Nhập email hợp lệ
3. Click "Đặt lại mật khẩu"
4. Kiểm tra popup thông báo thành công xuất hiện
5. Kiểm tra email field được clear

### Test Reset Password
1. Click link trong email (hoặc truy cập `/reset-password?token=xxx`)
2. Nhập mật khẩu mới và xác nhận
3. Click "Đặt lại mật khẩu"
4. Kiểm tra redirect đến `/login` với thông báo thành công

### Test Error Cases
1. Nhập email không tồn tại → Kiểm tra thông báo lỗi
2. Sử dụng token không hợp lệ → Kiểm tra thông báo lỗi
3. Nhập mật khẩu không khớp → Kiểm tra validation

## Notes
- Popup thành công tự động đóng sau 5 giây
- User có thể đóng popup thủ công
- Sau khi gửi email thành công, user vẫn ở lại trang `/forgot-password`
- Token được truyền qua query parameter thay vì URL parameter
- Backend gửi email với link format: `http://localhost:5173/reset-password?token=xxx` 