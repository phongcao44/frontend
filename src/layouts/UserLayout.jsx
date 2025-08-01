import Footer from "../components/layout/Footer";
import MainHeader from "../components/layout/MainHeader";
import { Outlet } from "react-router-dom";
import GeminiChatButton from "../pages/user/home/GeminiChatButton";

function UserLayout() {
  return (
    <>
      <MainHeader />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
       <GeminiChatButton />
      <Footer />
    </>
  );
}

export default UserLayout;
