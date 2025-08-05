import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { addProductToWishlist, removeProductFromWishlist, getUserWishlist } from '../redux/slices/wishlistSlice';
import Swal from 'sweetalert2';

export default function WishlistButton({ productId, className = '' }) {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.productDetail);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  // Kiểm tra trạng thái yêu thích dựa trên product.isFavorite
  const isInWishlist = product?.id === productId && product?.isFavorite === true;

  // Tìm wishlistId tương ứng với productId
  const wishlistItem = wishlistItems.find(item => item.product.id === productId);
  const wishlistId = wishlistItem?.wishlistId;

  const handleWishlistToggle = async () => {
    try {
      // Log để debug
      console.log('Before toggle - productId:', productId, 'isInWishlist:', isInWishlist, 'wishlistId:', wishlistId, 'wishlistItems:', wishlistItems);

      if (!isInWishlist) {
        // Thêm vào danh sách yêu thích
        await dispatch(addProductToWishlist(productId)).unwrap();
        // Cập nhật product.isFavorite trong Redux store
        dispatch({
          type: 'products/updateProductFavoriteStatus',
          payload: { productId, isFavorite: true },
        });
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã thêm sản phẩm vào danh sách yêu thích',
          icon: 'success',
          timer: 1500,
        });
      } else {
        // Kiểm tra lại wishlistId ngay trước khi xóa
        const currentWishlistItem = wishlistItems.find(item => item.product.id === productId);
        const currentWishlistId = currentWishlistItem?.wishlistId;

        if (!currentWishlistId) {
          // Refetch wishlist nếu wishlistId không tồn tại
          console.log('wishlistId is undefined, refetching wishlist');
          await dispatch(getUserWishlist()).unwrap();
          Swal.fire({
            title: 'Cảnh báo!',
            text: 'Dữ liệu yêu thích không đồng bộ. Đã làm mới danh sách.',
            icon: 'warning',
            timer: 1500,
          });
          return;
        }

           console.log('wishlistId is undefined, refetching wishlist');

        // Xóa khỏi danh sách yêu thích
        console.log('Calling removeProductFromWishlist with wishlistId:', currentWishlistId);
        await dispatch(removeProductFromWishlist(currentWishlistId)).unwrap();
        // Cập nhật product.isFavorite trong Redux store
        dispatch({
          type: 'products/updateProductFavoriteStatus',
          payload: { productId, isFavorite: false },
        });
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
          icon: 'success',
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error in handleWishlistToggle:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: error.message || 'Không thể cập nhật danh sách yêu thích',
        icon: 'error',
      });
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      className={`p-2 rounded-full transition-all duration-200 ${
        isInWishlist 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
      } ${className}`}
      title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart 
        className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
      />
    </button>
  );
}