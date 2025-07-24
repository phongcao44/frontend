import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { addProductToWishlist } from '../redux/slices/wishlistSlice';
import Swal from 'sweetalert2';

export default function WishlistButton({ productId, className = '' }) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  // Fix: check productId at root, fallback to item.product?.id for compatibility
  const isInWishlist = wishlistItems.some(
    item => item.productId === productId || item.product?.id === productId
  );

  const handleAddToWishlist = async () => {
    try {
      if (!isInWishlist) {
        await dispatch(addProductToWishlist(productId)).unwrap();
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã thêm sản phẩm vào danh sách yêu thích',
          icon: 'success',
          timer: 1500
        });
      } else {
        Swal.fire({
          title: 'Thông báo',
          text: 'Sản phẩm đã có trong danh sách yêu thích',
          icon: 'info',
          timer: 1500
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Lỗi!',
        text: error.message || 'Không thể thêm vào danh sách yêu thích',
        icon: 'error'
      });
    }
  };

  return (
    <button
      onClick={handleAddToWishlist}
      className={`p-2 rounded-full transition-all duration-200 ${
        isInWishlist 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
      } ${className}`}
      title={isInWishlist ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart 
        className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
      />
    </button>
  );
} 