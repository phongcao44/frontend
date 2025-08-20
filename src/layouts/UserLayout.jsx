import Footer from "../components/layout/Footer";
import MainHeader from "../components/layout/MainHeader";
import { Outlet, useLocation } from "react-router-dom";
import GeminiChatButton from "../pages/user/home/GeminiChatButton";
import ChatWidget from "../components/ChatWidget";

function UserLayout() {
  const { pathname } = useLocation();

  // Hide chat widgets on login/signup pages
  const hideChat = ["/login", "/signup"].some((path) =>
    pathname.startsWith(path)
  );

  return (
    <>
      <MainHeader />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>

      {!hideChat && (
        <>
          <GeminiChatButton />
          <ChatWidget />
        </>
      )}

      <Footer />
    </>
  );
}

export default UserLayout;
