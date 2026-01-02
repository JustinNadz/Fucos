import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

export default function Header({ title = "Tasks" }) {
  const { user, signOut } = useContext(AuthContext);

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
            <button className="signout-btn" onClick={signOut} title="Sign Out">
              <FiLogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <Link to="/signin" className="primary-btn">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
