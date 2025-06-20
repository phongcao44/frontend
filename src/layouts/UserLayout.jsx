import Footer from "../components/layout/Footer";
import MainHeader from "../components/layout/MainHeader";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <MainHeader />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default UserLayout;
