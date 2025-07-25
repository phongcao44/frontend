import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";

const menuItems = [
  { key: "home", label: "Home", path: "/" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "about", label: "About", path: "/about" },
  { key: "signup", label: "Sign Up", path: "/signup" },
  { key: "blog", label: "Blog", path: "/blog" },
];

// eslint-disable-next-line react/prop-types
const NavMenu = ({ activePath, vertical = false }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const filteredMenuItems = isLoggedIn
    ? [
        ...menuItems.filter((item) => item.key !== "signup"),
        { key: "logout", label: "Logout", action: () => dispatch(logoutUser()) },
      ]
    : menuItems;

  return (
    <nav
      className={`flex ${
        vertical ? "flex-col" : "flex-row justify-center"
      } w-full`}
    >
      <ul
        className={`flex ${
          vertical ? "flex-col space-y-4" : "flex-row space-x-12"
        } list-none m-0 p-0`}
      >
        {filteredMenuItems.map(({ key, label, path, action }) => (
          <li key={key}>
            {action ? (
              <button
                onClick={action}
                className={`text-black text-base no-underline transition-colors duration-200 ${
                  vertical ? "block px-4 py-2" : ""
                }`}
              >
                {label}
              </button>
            ) : (
              <Link
                to={path}
                className={`text-black text-base no-underline transition-colors duration-200 ${
                  activePath === path
                    ? "border-b-2 border-gray-400 pb-1"
                    : "border-b-2 border-transparent hover:border-gray-300 pb-1"
                } ${vertical ? "block px-4 py-2" : ""}`}
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;