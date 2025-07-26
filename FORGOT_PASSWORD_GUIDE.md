# Hướng dẫn chức năng Quên Mật khẩu

## Tổng quan
Chức năng quên mật khẩu cho phép người dùng đặt lại mật khẩu khi quên mật khẩu cũ.

## Luồng hoạt động

### 1. Trang Đăng nhập
- Người dùng vào trang đăng nhập
- Click nút "Quên mật khẩu?"
- Chuyển đến trang ForgotPassword

### 2. Trang Quên mật khẩu (`/forgot-password`)
- Người dùng nhập email Gmail (@gmail.com)
- Validation chỉ chấp nhận Gmail
- Click "Đặt lại mật khẩu"
- Hệ thống gọi API và tạo token demo
- Tự động chuyển đến trang ResetPassword với token

### 3. Trang Đặt lại mật khẩu (`/reset-password/:token`)
- Người dùng nhập mật khẩu mới và xác nhận
- Click "Đặt lại mật khẩu"
- Hiển thị thông báo thành công
- Chuyển về trang đăng nhập

## Các trang đã tạo

### 1. ForgotPassword.jsx
- Form nhập email Gmail với validation
- Chỉ chấp nhận email @gmail.com
- Gọi API forgotPassword
- Tự động chuyển đến ResetPassword với token demo

### 2. ResetPassword.jsx
- Form nhập mật khẩu mới và xác nhận
- Validation mật khẩu
- Gọi API resetPassword
- Hiển thị thông báo thành công

## Routes
- `/forgot-password` - Trang quên mật khẩu
- `/reset-password/:token` - Trang đặt lại mật khẩu

## API Endpoints (Backend)
- `POST /api/v1/auth/forgot-password` - Gửi yêu cầu đặt lại mật khẩu
- `POST /api/v1/auth/reset-password?token={token}` - Đặt lại mật khẩu

## Demo Mode
- Khi API chưa sẵn sàng, hệ thống sẽ tạo token demo
- Token demo có format: `demo-token-{timestamp}`
- Demo mode cho phép test chức năng mà không cần backend

## Cách sử dụng

1. Vào trang đăng nhập
2. Click "Quên mật khẩu?"
3. Nhập email Gmail (ví dụ: example@gmail.com)
4. Click "Đặt lại mật khẩu"
5. Nhập mật khẩu mới và xác nhận
6. Click "Đặt lại mật khẩu"
7. Thấy thông báo thành công
8. Click "Đăng nhập ngay"

## Tính năng

- ✅ Validation email Gmail (@gmail.com)
- ✅ Validation mật khẩu
- ✅ Hiển thị/ẩn mật khẩu
- ✅ Loading states
- ✅ Error handling
- ✅ Demo mode
- ✅ Responsive design
- ✅ Navigation giữa các trang 