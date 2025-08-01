# Hướng dẫn Hệ thống Authentication

## Tổng quan
Hệ thống authentication đã được cập nhật để lưu trữ thông tin đăng nhập trong localStorage với thời gian hết hạn 8 tiếng. Điều này giúp người dùng không bị đăng xuất khi reload trang hoặc đóng/mở lại trình duyệt.

## Cách hoạt động

### 1. Đăng nhập
- Khi người dùng đăng nhập thành công, thông tin sẽ được lưu vào:
  - **Cookies**: `access_token` và `user` (cho tương thích ngược)
  - **localStorage**: `authData` với thời gian hết hạn 8 tiếng

### 2. Khôi phục trạng thái đăng nhập
- Khi ứng dụng khởi động, Redux store sẽ tự động khôi phục trạng thái đăng nhập từ localStorage
- Các component sẽ kiểm tra cả Redux state và localStorage để xác định trạng thái đăng nhập

### 3. Đăng xuất
- Khi người dùng đăng xuất, tất cả dữ liệu sẽ được xóa khỏi:
  - localStorage
  - Cookies
  - Redux state

### 4. Thời gian hết hạn
- Dữ liệu trong localStorage sẽ tự động hết hạn sau 8 tiếng
- Khi hết hạn, dữ liệu sẽ được xóa tự động và người dùng sẽ cần đăng nhập lại

## Các file đã được cập nhật

### 1. `src/utils/authUtils.js`
Chứa các utility functions:
- `saveAuthToStorage(userData, accessToken)`: Lưu thông tin đăng nhập với thời gian hết hạn
- `getAuthFromStorage()`: Lấy thông tin đăng nhập từ localStorage
- `clearAuthFromStorage()`: Xóa thông tin đăng nhập khỏi localStorage
- `checkAuthFromStorage()`: Kiểm tra xem có đăng nhập hay không

### 2. `src/redux/slices/authSlice.jsx`
- Cập nhật `loginUser` và `googleLoginUser` để lưu vào localStorage
- Cập nhật `logoutUser` để xóa cả localStorage và cookies
- Thêm actions `restoreAuthState` và `clearAuthState`

### 3. `src/redux/store.jsx`
- Thêm `preloadedState` để khôi phục trạng thái đăng nhập khi khởi động

### 4. `src/components/layout/NavMenu.jsx`
- Cập nhật logic để kiểm tra trạng thái đăng nhập từ cả Redux và localStorage
- Hiển thị menu phù hợp dựa trên trạng thái đăng nhập

### 5. `src/components/layout/MainHeader.jsx`
- Cập nhật logic tương tự NavMenu
- Hiển thị AccountDropdown hoặc Sign Up icon dựa trên trạng thái đăng nhập

## Cách sử dụng

### Kiểm tra trạng thái đăng nhập trong component
```javascript
import { useSelector } from "react-redux";
import { checkAuthFromStorage } from "../../utils/authUtils";

const MyComponent = () => {
  const authState = useSelector((state) => state.auth.isLoggedIn);
  const isLoggedInFromStorage = checkAuthFromStorage();
  const finalIsLoggedIn = authState || isLoggedInFromStorage;
  
  // Sử dụng finalIsLoggedIn để hiển thị UI phù hợp
};
```

### Đăng xuất
```javascript
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

const MyComponent = () => {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
};
```

## Lưu ý
- Hệ thống vẫn tương thích với cookies để đảm bảo không ảnh hưởng đến các tính năng hiện có
- Thời gian hết hạn có thể được điều chỉnh trong `authUtils.js` (hiện tại là 8 tiếng)
- Khi localStorage bị xóa hoặc hết hạn, người dùng sẽ cần đăng nhập lại 