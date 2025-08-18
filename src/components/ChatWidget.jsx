/* eslint-disable react/prop-types */
import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    // ===== Load Facebook SDK =====
    if (!document.getElementById("facebook-jssdk")) {
      const fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
      fbScript.async = true;
      document.body.appendChild(fbScript);
    }

    // ===== Facebook Messenger init =====
    window.fbAsyncInit = function () {
      window.FB?.init({
        appId: "1784956665094089", // optional
        xfbml: true,
        version: "v19.0",
      });
      // Force parse lại DOM để hiện icon chat
      window.FB?.XFBML.parse();
    };
  }, []);

  return (
    <div>
      {/* Messenger Chat Plugin */}
      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id="697490283449445"   // 👈 Thay bằng PAGE ID thật của Fanpage
        theme_color="#DB4444"
        logged_in_greeting="Xin chào! Bạn cần hỗ trợ gì không?"
        logged_out_greeting="Vui lòng đăng nhập Facebook để chat với chúng tôi."
      ></div>
    </div>
  );
};

export default ChatWidget;
