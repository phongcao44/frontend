import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import ProductCard from "./home/ProductCard";

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Gucci duffle bag",
      price: 960,
      originalPrice: 1160,
      image: "/api/placeholder/200/150",
      rating: 4.5,
      reviews: 95,
      discount: "-36%",
      inStock: true,
    },
    {
      id: 2,
      name: "RGB liquid CPU Cooler",
      price: 1960,
      originalPrice: null,
      image: "/api/placeholder/200/150",
      rating: 4.8,
      reviews: 65,
      discount: null,
      inStock: true,
    },
    {
      id: 3,
      name: "GP11 Shooter USB Gamepad",
      price: 550,
      originalPrice: null,
      image: "/api/placeholder/200/150",
      rating: 4.6,
      reviews: 85,
      discount: null,
      inStock: true,
    },
    {
      id: 4,
      name: "Quilted Satin Jacket",
      price: 750,
      originalPrice: null,
      image: "/api/placeholder/200/150",
      rating: 4.7,
      reviews: 42,
      discount: null,
      inStock: true,
    },
  ]);

  const [justForYouItems] = useState([
    {
      id: 5,
      name: "ASUS FHD Gaming Laptop",
      price: 960,
      originalPrice: 1160,
      image: "/api/placeholder/200/150",
      rating: 4.3,
      reviews: 95,
      discount: "-35%",
      inStock: true,
    },
    {
      id: 6,
      name: "IPS LCD Gaming Monitor",
      price: 1160,
      originalPrice: null,
      image: "/api/placeholder/200/150",
      rating: 4.5,
      reviews: 65,
      discount: null,
      inStock: true,
    },
    {
      id: 7,
      name: "HAVIT HV-G92 Gamepad",
      price: 560,
      originalPrice: null,
      image: "/api/placeholder/200/150",
      rating: 4.6,
      reviews: 65,
      discount: "NEW",
      inStock: true,
    },
    {
      id: 8,
      name: "AK-900 Wired Keyboard",
      price: 200,
      originalPrice: null,
      image: "/api/placeholder/200/150",
      rating: 4.4,
      reviews: 65,
      discount: null,
      inStock: true,
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const moveAllToBag = () => {
    if (wishlistItems.length === 0) {
      console.log("Wishlist is empty!");
      return;
    }
    console.log("All items moved to shopping bag!");
    setWishlistItems([]);
  };

  const addToCart = (item) => {
    console.log(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wishlist Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Wishlist ({wishlistItems.length})
          </h1>
          <button
            onClick={moveAllToBag}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            disabled={wishlistItems.length === 0}
            aria-label="Move all items to shopping bag"
          >
            Move All To Bag
          </button>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => console.log("Navigating to shop...")}
              aria-label="Continue shopping"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                showRemove={true}
                onRemove={removeFromWishlist}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Just For You Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-8 bg-red-500 rounded"></div>
            <h2 className="text-xl font-bold text-gray-800">Just For You</h2>
          </div>
          <button
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="See all recommended products"
          >
            See All
          </button>
        </div>

        {/* Just For You Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {justForYouItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              showRemove={false}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishList;
