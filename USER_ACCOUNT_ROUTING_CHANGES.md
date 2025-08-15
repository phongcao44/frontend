# Thay đổi User Account Routing

## Tổng quan
Đã tách user account page thành các router riêng biệt cho profile và edit profile để cải thiện cấu trúc code và trải nghiệm người dùng.

## Các thay đổi đã thực hiện

### 1. Tạo component mới

#### `src/pages/user/account/ProfilePage.jsx`
- Component riêng biệt để hiển thị thông tin profile người dùng
- Bao gồm tất cả thông tin cá nhân, trạng thái tài khoản, lịch sử và điểm tích lũy
- Có nút "Chỉnh sửa thông tin" để chuyển đến trang edit profile

#### `src/pages/user/account/EditProfilePage.jsx`
- Component wrapper cho EditProfileForm
- Xử lý navigation khi đóng form
- Tự động chuyển về trang profile sau khi lưu

### 2. Cập nhật UserAccountPage.jsx
- Loại bỏ logic profile và edit profile
- Chỉ giữ lại layout chung và navigation
- Cập nhật active tab detection để hỗ trợ route mới

### 3. Cập nhật EditProfileForm.jsx
- Thêm useNavigate hook để hỗ trợ navigation
- Cập nhật tất cả các nút "Hủy" và "Đóng" để hoạt động với cả onClose prop và navigation
- Tự động chuyển về trang profile sau khi lưu thành công

### 4. Cập nhật UserRoutes.jsx
- Thêm route `/user/profile` cho ProfilePage
- Thêm route `/user/edit-profile` cho EditProfilePage
- Cập nhật route index để chuyển đến ProfilePage thay vì EditProfileForm

## Cấu trúc routing mới

```
/user/
├── / (index) → ProfilePage
├── /profile → ProfilePage
├── /edit-profile → EditProfilePage
├── /addresses → AddressBook
├── /orders → Orders
├── /wishlist → WishList
├── /myVouchers → VoucherSection
├── /deliveredProduct → DeliveredProductSection
└── /returns → MyReturnRequests
```

## Lợi ích

1. **Tách biệt rõ ràng**: Profile và Edit Profile giờ là các trang riêng biệt
2. **URL có ý nghĩa**: `/user/profile` và `/user/edit-profile` dễ hiểu hơn
3. **Navigation tốt hơn**: Có thể bookmark và share URL cụ thể
4. **Code sạch hơn**: Mỗi component có trách nhiệm rõ ràng
5. **UX cải thiện**: Người dùng có thể quay lại trang trước đó dễ dàng

## Cách sử dụng

1. Truy cập `/user` hoặc `/user/profile` để xem thông tin cá nhân
2. Click "Chỉnh sửa thông tin" để chuyển đến `/user/edit-profile`
3. Sau khi lưu hoặc hủy, sẽ tự động chuyển về `/user/profile`
4. Navigation sidebar vẫn hoạt động bình thường cho tất cả các trang khác
