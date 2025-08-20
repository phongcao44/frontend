import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    // Inject Fchat script
    const script = document.createElement("script");
    script.src =
      "https://cdn.fchat.vn/assets/embed/webchat.js?id=686dc526b7fbfe64fd0f1c82";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Định nghĩa window.fbMessengerPlugins nếu chưa có
    window.fbMessengerPlugins = window.fbMessengerPlugins || {
      init: function () {
        FB.init({
          appId: "1784956665094089",
          xfbml: true,
          version: "v3.0",
        });
      },
      callable: [],
    };

    window.fbAsyncInit =
      window.fbAsyncInit ||
      function () {
        window.fbMessengerPlugins.callable.forEach(function (item) {
          item();
        });
        window.fbMessengerPlugins.init();
      };

    // Thêm script Facebook SDK động
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "//connect.facebook.net/vi_VN/sdk.js";
      document.body.appendChild(js);
    }
  }, []);

  return (
    <div
      className="fb-customerchat"
      attribution="biz_inbox"
      page_id="697490283449445"
      theme_color="#DB4444"
      logged_in_greeting="Xin chào! Bạn cần hỗ trợ gì không?"
      logged_out_greeting="Vui lòng đăng nhập Facebook để chat với chúng tôi."
    ></div>
  );
};

export default ChatWidget;
