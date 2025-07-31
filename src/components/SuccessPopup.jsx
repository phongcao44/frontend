import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const SuccessPopup = ({ message, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Thành công!
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup; 