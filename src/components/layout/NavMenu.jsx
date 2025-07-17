import { Link } from "react-router-dom";

const menuItems = [
  { key: "home", label: "Home", path: "/" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "about", label: "About", path: "/about" },
  { key: "signup", label: "Sign Up", path: "/signup" },
];

// eslint-disable-next-line react/prop-types
const NavMenu = ({ activePath, vertical = false, isLoggedIn = false }) => {
  const filteredMenuItems = isLoggedIn
    ? menuItems.filter((item) => item.key !== "signup")
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
        {filteredMenuItems.map(({ key, label, path }) => (
          <li key={key}>
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
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
