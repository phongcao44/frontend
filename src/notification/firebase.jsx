// notification/firebase.jsx
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import Cookies from "js-cookie";

// Cấu hình Firebase (dữ liệu của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyDdT5RLKprhhQHdrzlhdtymsevVdOLZ-UE",
  authDomain: "ecommer-project-e7caa.firebaseapp.com",
  projectId: "ecommer-project-e7caa",
  storageBucket: "ecommer-project-e7caa.firebasestorage.app",
  messagingSenderId: "235971664136",
  appId: "1:235971664136:web:7a8da987fd2b55644974bd",
  measurementId: "G-E3M5E6W32W",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Hàm sinh token khi client cho phép gửi thông báo
export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(" Notification permission:", permission);

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BD0tg7YTVthzEIsgC4605zp0TRu_K3Mj5zbXxrmGkfe0ZJPChYzCmyHWpB-uydiWa8za0c1aw-Dz87mHIlKZi_g",
      });

      if (token) {
        console.log("FCM Token ...:", token);

        const accessToken = Cookies.get("access_token") || "";

        // Lấy token từ localStorage
        const userInfoRaw = Cookies.get("user");
        console.log("Raw user info:", userInfoRaw);

        console.log("Access Token:", accessToken);

        await fetch("http://localhost:8080/api/v1/fcm-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            token: token,
            deviceInfo: navigator.userAgent, // hoặc thêm thông tin nếu muốn
          }),
        });
      } else {
        console.warn("Không lấy được token FCM.");
      }
    } else {
      console.warn("Người dùng không cho phép gửi thông báo.");
    }
  } catch (error) {
    console.error(" Lỗi khi lấy FCM token:", error);
  }
};

export { messaging };
