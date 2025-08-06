import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getProductImagesByProduct } from "../../../redux/slices/productImageSlice";

const DEFAULT_IMAGE_URL = "https://i.pinimg.com/736x/f0/b6/ce/f0b6ce5a334490ba1ec286bd8bc348e9.jpg";

const ProductImageGallery = ({ productId }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const {
    list: imageList,
    loading: imageLoading,
    error: imageError,
  } = useSelector((state) => state.productImage);

  useEffect(() => {
    if (productId) {
      dispatch(getProductImagesByProduct(productId));
    }
  }, [dispatch, productId]);

  // Reset khi productId thay đổi
  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  if (imageLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 border-gray-200 rounded-full"></div>
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <span className="text-red-600">Lỗi: {imageError}</span>
      </div>
    );
  }

  // Sử dụng ảnh mặc định nếu không có ảnh
  const displayImages = imageList?.length > 0 
    ? imageList 
    : [{ imageUrl: DEFAULT_IMAGE_URL, productName: "Sản phẩm" }];

  const currentImage = displayImages[selectedImage] || displayImages[0];

  const goToPrevious = () => {
    setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={currentImage.imageUrl}
          alt={currentImage.productName || `Ảnh ${selectedImage + 1}`}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE_URL;
          }}
        />
        
        {/* Navigation arrows - chỉ hiện khi có nhiều hơn 1 ảnh */}
        {displayImages.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all"
              onClick={goToPrevious}
            >
              <LeftOutlined />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all"
              onClick={goToNext}
            >
              <RightOutlined />
            </button>
            
            {/* Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1}/{displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - chỉ hiện khi có nhiều hơn 1 ảnh */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded-lg cursor-pointer transition-all overflow-hidden ${
                selectedImage === index
                  ? "opacity-100 ring-2 ring-gray-400"
                  : "opacity-60 hover:opacity-80"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE_URL;
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;