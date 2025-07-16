/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  RefreshCw,
  ArrowLeft,
  Wifi,
  WifiOff,
  Database,
  Server,
  AlertCircle,
} from "lucide-react";

// Component NoDataPage có thể tùy chỉnh
const NoDataPage = ({
  title = "Không Có Dữ Liệu",
  subtitle = "Không thể tải dữ liệu từ máy chủ",
  description = "Có thể do kết nối mạng không ổn định hoặc máy chủ đang bảo trì.",
  errorCode = "NET_ERR_CONNECTION_FAILED",
  onRetry,
  onGoBack,
  showAutoRetry = true,
  maxRetries = 3,
  retryDelay = 30000,
  icon = "📭",
  type = "network", // network, server, database, empty
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("offline");

  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine ? "online" : "offline");
    };

    checkConnection();
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  useEffect(() => {
    if (!showAutoRetry) return;

    const timer = setTimeout(() => {
      if (retryCount < maxRetries) {
        handleRetry();
      }
    }, retryDelay);

    return () => clearTimeout(timer);
  }, [retryCount, showAutoRetry, maxRetries, retryDelay]);

  const handleRetry = async () => {
    setIsLoading(true);
    setRetryCount((prev) => prev + 1);

    if (onRetry) {
      try {
        await onRetry();
      } catch (error) {
        console.error("Retry failed:", error);
      }
    } else {
      // Default retry logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const success = Math.random() > 0.7;
      if (success) {
        alert("Kết nối thành công!");
      }
    }

    setIsLoading(false);
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.length > 1
        ? window.history.back()
        : (window.location.href = "/");
    }
  };

  const getTypeConfig = () => {
    const configs = {
      network: {
        icon: <WifiOff className="w-16 h-16 text-red-500" />,
        color: "from-red-500 to-pink-600",
        bgColor: "text-red-600 bg-red-50",
      },
      server: {
        icon: <Server className="w-16 h-16 text-orange-500" />,
        color: "from-orange-500 to-red-600",
        bgColor: "text-orange-600 bg-orange-50",
      },
      database: {
        icon: <Database className="w-16 h-16 text-blue-500" />,
        color: "from-blue-500 to-purple-600",
        bgColor: "text-blue-600 bg-blue-50",
      },
      empty: {
        icon: <AlertCircle className="w-16 h-16 text-gray-500" />,
        color: "from-gray-500 to-gray-600",
        bgColor: "text-gray-600 bg-gray-50",
      },
    };
    return configs[type] || configs.network;
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-800 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Container responsive cho tất cả màn hình */}
      <div
        className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl w-full text-center border border-white/20 
                    /* Mobile Portrait */ 
                    max-w-sm p-6 
                    /* Mobile Landscape & Small Tablet */ 
                    landscape:max-w-2xl landscape:p-8 landscape:flex landscape:flex-col landscape:justify-center landscape:min-h-[85vh]
                    /* Tablet Portrait */ 
                    sm:max-w-md sm:p-8 
                    /* Tablet Landscape */ 
                    md:max-w-lg md:p-10 
                    /* Desktop */ 
                    lg:max-w-xl lg:p-12
                    /* Large Desktop */ 
                    xl:max-w-2xl xl:p-16
                    /* Ultra Wide */ 
                    2xl:max-w-3xl 2xl:p-20"
      >
        {/* Icon - Responsive sizes */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
          {typeof icon === "string" ? (
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl animate-bounce">
              {icon}
            </div>
          ) : (
            <div className="animate-bounce [&>svg]:w-12 [&>svg]:h-12 sm:[&>svg]:w-14 sm:[&>svg]:h-14 md:[&>svg]:w-16 md:[&>svg]:h-16 lg:[&>svg]:w-20 lg:[&>svg]:h-20 xl:[&>svg]:w-24 xl:[&>svg]:h-24">
              {typeConfig.icon}
            </div>
          )}
        </div>

        {/* Status Indicator - Responsive */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 ${typeConfig.bgColor}`}
        >
          {connectionStatus === "online" ? (
            <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          <span className="hidden sm:inline">
            {connectionStatus === "online"
              ? "Có kết nối internet"
              : "Không có kết nối"}
          </span>
          <span className="sm:hidden">
            {connectionStatus === "online" ? "Online" : "Offline"}
          </span>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full animate-pulse"></div>
        </div>

        {/* Content - Responsive typography */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
          {subtitle}
        </p>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2 sm:px-4">
          {description}
        </p>

        {/* Retry Info - Responsive */}
        {retryCount > 0 && showAutoRetry && (
          <div className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 px-2">
            <span className="block sm:inline">
              Đã thử {retryCount}/{maxRetries} lần
            </span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">
              Tự động thử lại sau {retryDelay / 1000}s
            </span>
          </div>
        )}

        {/* Loading - Responsive */}
        {isLoading && (
          <div className="mb-6 sm:mb-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2 sm:mb-3"></div>
            <p className="text-sm sm:text-base text-gray-600">
              Đang thử lại...
            </p>
          </div>
        )}

        {/* Actions - Responsive layout */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
            <button
              onClick={handleRetry}
              className={`flex items-center justify-center gap-2 bg-gradient-to-r ${typeConfig.color} text-white 
                        px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 lg:px-12 lg:py-4 
                        text-sm sm:text-base md:text-lg
                        rounded-full font-medium hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl
                        w-full sm:w-auto max-w-xs sm:max-w-none`}
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Thử Lại</span>
            </button>

            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 
                        px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 lg:px-12 lg:py-4 
                        text-sm sm:text-base md:text-lg
                        rounded-full font-medium hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-200
                        w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Quay Lại</span>
            </button>
          </div>
        )}

        {/* Error Info - Responsive */}
        <div className="text-xs sm:text-sm text-gray-400 space-y-1">
          <p>
            Mã lỗi: <span className="font-mono">{errorCode}</span>
          </p>
          <p className="hidden sm:block">
            Thời gian: {new Date().toLocaleString("vi-VN")}
          </p>
          <p className="sm:hidden">
            Thời gian: {new Date().toLocaleTimeString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Background Animation - Responsive */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-20 sm:top-40 right-10 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-10 sm:bottom-20 left-20 sm:left-40 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );
};
export default NoDataPage;
