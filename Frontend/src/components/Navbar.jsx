import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo Section */}
        <Link to="/dashboard" style={styles.logo}>
          EV Charging
        </Link>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <Link 
            to="/dashboard" 
            style={isActive('/dashboard') ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
          >
            Dashboard
          </Link>
          <Link 
            to="/users" 
            style={isActive('/users') ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
          >
            Users
          </Link>
          <Link 
            to="/bookings" 
            style={isActive('/bookings') ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
          >
            Bookings
          </Link>
          <Link 
            to="/analytics" 
            style={isActive('/analytics') ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
          >
            Analytics
          </Link>
        </div>

        {/* User Profile Section */}
        <div style={styles.userSection}>
          <Link to="/profile" style={styles.profileLink}>
            {user?.firstName}
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '44px',
  },
  logo: {
    textDecoration: 'none',
    color: '#1d1d1f',
    fontSize: '21px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    transition: 'opacity 0.15s ease',
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  navLink: {
    color: '#1d1d1f',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '-0.01em',
    transition: 'opacity 0.15s ease',
    opacity: 0.8,
    cursor: 'pointer',
  },
  navLinkActive: {
    opacity: 1,
    fontWeight: '500',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  profileLink: {
    textDecoration: 'none',
    color: '#1d1d1f',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '-0.01em',
    opacity: 0.8,
    transition: 'opacity 0.15s ease',
    cursor: 'pointer',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '-0.01em',
    transition: 'opacity 0.15s ease',
    opacity: 0.9,
  },
};

export default Navbar;