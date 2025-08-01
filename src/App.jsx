import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { generateToken, messaging } from "./notification/firebase";
import { onMessage } from "firebase/messaging";

import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "./redux/slices/notificationSlice";

const App = () => {
  useEffect(() => {
    // Tạo token khi app load
    generateToken();

    // Lắng nghe tin nhắn push khi app đang mở
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Tin nhắn FCM nhận được:", payload);
      // Có thể hiển thị toast ở đây nếu muốn
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.notification);

  useEffect(() => {
    if (message && type) {
      // Hiển thị toast dựa trên type
      const toastOptions = {
        position: "top-right",
        autoClose: type === "success" ? 3000 : 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: `custom-toast-${type}`,
      };

      if (type === "success") {
        toast.success(message, toastOptions);
      } else if (type === "error") {
        toast.error(message, toastOptions);
      } else if (type === "info") {
        toast.info(message, toastOptions);
      }

      // Xóa thông báo sau khi hiển thị
      dispatch(clearNotification());
    }
  }, [message, type, dispatch]);

  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
