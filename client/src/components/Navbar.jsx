import { FiLogOut, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FiMessageCircle size={24} />
        ChatApp
      </div>

      <div className="navbar-user">
        <div className="user-profile">
          <img src={user?.avatar} alt={user?.username} className="avatar" />
          <span className="user-name-display">{user?.username}</span>
        </div>
        <button onClick={logout} className="btn-icon" title="Logout">
          <FiLogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
