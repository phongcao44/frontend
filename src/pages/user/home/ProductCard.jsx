import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import WishlistButton from '../../../components/WishlistButton';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
        <div className="absolute top-2 right-2 flex gap-2">
          <WishlistButton productId={product.id} className="shadow-md" />
        </div>
      </div>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          <button
            onClick={() => onAddToCart?.(product)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}