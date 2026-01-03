import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ title = "Tasks" }) {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="page-title">{title}</h2>
      </div>

      <div className="header-center"></div>

      <div className="header-right">
        {user ? (
          <div className="user">
            <div className="avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
            </div>
            <span className="username">{user.name || "User"}</span>
            <button
              className="signout-btn"
              onClick={() => setShowConfirm(true)}
              title="Sign Out"
            >
              <FiLogOut size={18} />
              <span>Sign Out</span>
            </button>
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 min-w-[320px] flex flex-col items-center">
                  <div className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Sign Out
                  </div>
                  <div className="mb-6 text-gray-700 dark:text-gray-300">
                    Are you sure you want to sign out?
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        setShowConfirm(false);
                        signOut();
                        navigate("/sign-in", { replace: true });
                      }}
                    >
                      Yes, Sign Out
                    </button>
                    <button
                      className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/sign-in" className="primary-btn">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
