import Footer from "../components/layout/Footer";
import MainHeader from "../components/layout/MainHeader";
import { Outlet, useLocation } from "react-router-dom";
import GeminiChatButton from "../pages/user/home/GeminiChatButton";
import ChatWidget from "../components/ChatWidget";

function UserLayout() {
  const location = useLocation();
const hideChat = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup");


  return (
    <>
      <MainHeader />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      {!hideChat && (
        <>
          <GeminiChatButton />
          <ChatWidget key={location.pathname} />
        </>
      )}
      <Footer />
    </>
  );
}

export default UserLayout;
