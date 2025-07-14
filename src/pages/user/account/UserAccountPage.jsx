import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function UserAccountPage() {
  const [isAccountOpen, setIsAccountOpen] = useState(true);

  const toggleAccountMenu = () => {
    setIsAccountOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white mx-auto font-sans  max-w-[1200px] mx-auto">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center space-x-3 text-sm text-gray-500">
            <span className="hover:text-gray-900 transition-colors">Home</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">My Account</span>
          </nav>
          <div className="text-sm flex items-center space-x-2">
            <span className="text-gray-600">Welcome,</span>
            <span className="text-red-600 font-semibold">
              {localStorage.getItem("username") || "Md Rimel"}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <h3
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-red-600 transition-colors"
                onClick={toggleAccountMenu}
              >
                Manage My Account
              </h3>
              {isAccountOpen && (
                <div className="mt-3 space-y-3 pl-3">
                  <NavLink
                    to="/user/profile"
                    className={({ isActive }) =>
                      `block text-sm font-medium transition-colors ${
                        isActive
                          ? "text-red-600 font-semibold"
                          : "text-gray-600 hover:text-red-600"
                      }`
                    }
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/user/addresses"
                    className={({ isActive }) =>
                      `block text-sm font-medium transition-colors ${
                        isActive
                          ? "text-red-600 font-semibold"
                          : "text-gray-600 hover:text-red-600"
                      }`
                    }
                  >
                    Address Book
                  </NavLink>
                  <NavLink
                    to="/user/change-password"
                    className={({ isActive }) =>
                      `block text-sm font-medium transition-colors ${
                        isActive
                          ? "text-red-600 font-semibold"
                          : "text-gray-600 hover:text-red-600"
                      }`
                    }
                  >
                    Change Password
                  </NavLink>
                </div>
              )}
            </div>

            <div>
              <NavLink
                to="/user/orders"
                className={({ isActive }) =>
                  `block text-lg font-semibold transition-colors ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : "text-gray-600 hover:text-red-600"
                  }`
                }
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  My Orders
                </span>
              </NavLink>
            </div>

            <div>
              <NavLink
                to="/user/wishlist"
                className={({ isActive }) =>
                  `block text-lg font-semibold transition-colors ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : "text-gray-600 hover:text-red-600"
                  }`
                }
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  My Wishlist
                </span>
              </NavLink>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
