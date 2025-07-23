import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { generateToken, messaging } from "./notification/firebase"; // điều chỉnh path nếu cần
import { onMessage } from "firebase/messaging";
import Cookies from "js-cookie";

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

  return (
    <>
      <AppRouter />
    </>
  );
};

export default App;
