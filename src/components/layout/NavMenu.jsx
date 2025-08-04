import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '../../redux/slices/authSlice';
import { checkAuthFromStorage } from '../../utils/authUtils';

const menuItems = [
  { key: 'home', labelKey: 'navMenu.home', path: '/' },
  { key: 'contact', labelKey: 'navMenu.contact', path: '/contact' },
  { key: 'about', labelKey: 'navMenu.about', path: '/about' },
  { key: 'blog', labelKey: 'navMenu.blog', path: '/blog' },
  { key: 'signup', labelKey: 'navMenu.signup', path: '/signup' },
];

const NavMenu = ({ activePath, vertical = false }) => {
  const { t } = useTranslation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const isLoggedInFromStorage = checkAuthFromStorage();
  const finalIsLoggedIn = isLoggedIn || isLoggedInFromStorage;

  const filteredMenuItems = finalIsLoggedIn
    ? [
        ...menuItems.filter((item) => item.key !== 'signup'),
        {
          key: 'logout',
          labelKey: 'navMenu.logout',
          action: () => dispatch(logoutUser()),
        },
      ]
    : menuItems;

  return (
    <nav
      className={`flex ${
        vertical ? 'flex-col' : 'flex-row justify-center'
      } w-full`}
    >
      <ul
        className={`flex ${
          vertical ? 'flex-col space-y-4' : 'flex-row space-x-12'
        } list-none m-0 p-0`}
      >
        {filteredMenuItems.map(({ key, labelKey, path, action }) => (
          <li key={key}>
            {action ? (
              <button
                onClick={action}
                className={`text-black text-base no-underline transition-colors duration-200 ${
                  vertical ? 'block px-4 py-2' : ''
                }`}
              >
                {t(labelKey)}
              </button>
            ) : (
              <Link
                to={path}
                className={`text-black text-base no-underline transition-colors duration-200 ${
                  activePath === path
                    ? 'border-b-2 border-gray-400 pb-1'
                    : 'border-b-2 border-transparent hover:border-gray-300 pb-1'
                } ${vertical ? 'block px-4 py-2' : ''}`}
              >
                {t(labelKey)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;