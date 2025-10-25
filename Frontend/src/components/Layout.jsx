import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div style={styles.layout}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/dashboard" style={styles.navBrand}>
            EV Charging
          </Link>

          <div style={styles.navLinks}>
            <Link
              to="/dashboard"
              style={{
                ...styles.navLink,
                ...(isActive('/dashboard') ? styles.navLinkActive : {}),
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/users"
              style={{
                ...styles.navLink,
                ...(isActive('/users') ? styles.navLinkActive : {}),
              }}
            >
              Users
            </Link>
            <Link
              to="/bookings"
              style={{
                ...styles.navLink,
                ...(isActive('/bookings') ? styles.navLinkActive : {}),
              }}
            >
              Bookings
            </Link>
            <Link
              to="/analytics"
              style={{
                ...styles.navLink,
                ...(isActive('/analytics') ? styles.navLinkActive : {}),
              }}
            >
              Analytics
            </Link>
          </div>

          <div style={styles.navRight}>
            <Link to="/profile" style={styles.profileLink}>
              {user?.firstName}
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.contentWrapper}>{children}</div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <p style={styles.footerText}>
              © 2025 EV Charging System. All rights reserved.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>Terms of Use</a>
            <a href="#" style={styles.footerLink}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  // Navigation Bar Styles - Apple-inspired
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '44px',
  },
  navBrand: {
    color: '#1d1d1f',
    fontSize: '21px',
    fontWeight: '600',
    textDecoration: 'none',
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
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  profileLink: {
    color: '#1d1d1f',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '-0.01em',
    opacity: 0.8,
    transition: 'opacity 0.15s ease',
    cursor: 'pointer',
  },
  logoutButton: {
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
  // Main Content Styles
  main: {
    flex: 1,
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    padding: '64px 22px',
  },
  contentWrapper: {
    backgroundColor: '#ffffff',
    minHeight: '500px',
  },
  // Footer Styles
  footer: {
    backgroundColor: '#f5f5f7',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
    padding: '17px 0',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerSection: {
    display: 'flex',
    alignItems: 'center',
  },
  footerText: {
    color: '#6e6e73',
    fontSize: '12px',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  footerLink: {
    color: '#6e6e73',
    fontSize: '12px',
    fontWeight: '400',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    transition: 'color 0.15s ease',
    cursor: 'pointer',
  },
};

export default Layout;