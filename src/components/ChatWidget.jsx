/* eslint-disable react/prop-types */
import React, { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    // ===== Load Fchat script =====
    const fchatScript = document.createElement("script");
    fchatScript.src = "https://cdn.fchat.vn/assets/embed/webchat.js?id=686dc526b7fbfe64fd0f1c82";
    fchatScript.async = true;
    fchatScript.id = "fchat-script";
    document.body.appendChild(fchatScript);

    // ===== Load Facebook SDK script =====
    let fbScript = document.getElementById("facebook-jssdk");
    if (!fbScript) {
      fbScript = document.createElement("script");
      fbScript.id = "facebook-jssdk";
      fbScript.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js"; // dùng https đầy đủ
      fbScript.async = true;
      document.body.appendChild(fbScript);
    }

    // ===== Facebook Messenger plugin init =====
    window.fbMessengerPlugins = window.fbMessengerPlugins || {
      init: function () {
        window.FB?.init({
          appId: "1784956665094089", // App ID của bạn
          xfbml: true,
          version: "v19.0",
        });
      },
      callable: [],
    };

    window.fbAsyncInit = window.fbAsyncInit || function () {
      window.fbMessengerPlugins.callable.forEach((item) => item());
      window.fbMessengerPlugins.init();
    };

    // ===== Cleanup khi unmount =====
    // return () => {
    //   // Gỡ script Fchat
    //   const fcScript = document.getElementById("fchat-script");
    //   if (fcScript && fcScript.parentNode) {
    //     fcScript.parentNode.removeChild(fcScript);
    //   }

    //   // Gỡ script Facebook
    //   const fbSdkScript = document.getElementById("facebook-jssdk");
    //   if (fbSdkScript && fbSdkScript.parentNode) {
    //     fbSdkScript.parentNode.removeChild(fbSdkScript);
    //   }

    //   // Gỡ iframe & div chat
    //   document
    //     .querySelectorAll(".fb-customerchat, iframe[src*='fchat.vn']")
    //     .forEach((el) => el.parentNode?.removeChild(el));

    //   // Xóa global variables
    //   delete window.FB;
    //   delete window.fbMessengerPlugins;
    //   delete window.fbAsyncInit;
    // };
    return () => {
  document.querySelectorAll(".fb-customerchat, iframe[src*='fchat.vn']").forEach(el => el.remove());
  const fbSdkScript = document.getElementById("facebook-jssdk");
  if (fbSdkScript) fbSdkScript.remove();
  const fcScript = document.getElementById("fchat-script");
  if (fcScript) fcScript.remove();
  delete window.FB;
  delete window.fbMessengerPlugins;
  delete window.fbAsyncInit;
};

  }, []);

  return (
    <div>
      {/* Facebook Customer Chat box */}
      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id="697490283449445" // Page Facebook ID
        theme_color="#DB4444"
        logged_in_greeting="Xin chào! Bạn cần hỗ trợ gì không?"
        logged_out_greeting="Vui lòng đăng nhập Facebook để chat với chúng tôi."
      ></div>
    </div>
  );
};

export default ChatWidget;
