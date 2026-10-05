import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";

const Navbar = () => {
  const { user, loadingUser, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span>Memories</span>
        <img src="/memories.png" alt="Memories" />
      </Link>

      <div className="navbar-actions">
        {loadingUser ? (
          <div className="navbar-loading">Loading...</div>
        ) : user ? (
          <>
            <div className="user-info">
              <div className="avatar">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="navbar-avatar"
                  />
                ) : (
                  <div className="navbar-avatar navbar-avatar-fallback">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <span>{user.name}</span>
            </div>

            <button className="btn btn-secondary" onClick={handleLogout}>
              <Icon name="logout" size={18} />
              Logout
            </button>
          </>
        ) : (
          <Link className="btn btn-primary" to="/login">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
