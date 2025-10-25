import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Power your journey.</h1>
        <p style={styles.heroSubtitle}>
          Welcome back, {user?.firstName}. Manage your EV charging network with ease.
        </p>
      </div>

      {/* Featured Cards */}
      <div style={styles.featuredGrid}>
        <div style={styles.featuredCard} onClick={() => navigate('/users')}>
          <img 
            src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80" 
            alt="Users Management"
            style={styles.cardImage}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Users</h3>
            <p style={styles.cardDescription}>Manage your team and permissions</p>
            <span style={styles.cardLink}>Learn more →</span>
          </div>
        </div>

        <div style={styles.featuredCard} onClick={() => navigate('/bookings')}>
          <img 
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80" 
            alt="Bookings Management"
            style={styles.cardImage}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Bookings</h3>
            <p style={styles.cardDescription}>Schedule and manage charging sessions</p>
            <span style={styles.cardLink}>Learn more →</span>
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div style={styles.secondaryGrid}>
        <div style={styles.smallCard} onClick={() => navigate('/analytics')}>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" 
            alt="Analytics"
            style={styles.smallCardImage}
          />
          <div style={styles.smallCardContent}>
            <h4 style={styles.smallCardTitle}>Analytics</h4>
            <p style={styles.smallCardDesc}>Real-time insights and reports</p>
            <span style={styles.smallCardLink}>View →</span>
          </div>
        </div>

        <div style={styles.smallCard} onClick={() => navigate('/profile')}>
          <img 
            src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80" 
            alt="Profile Settings"
            style={styles.smallCardImage}
          />
          <div style={styles.smallCardContent}>
            <h4 style={styles.smallCardTitle}>Profile</h4>
            <p style={styles.smallCardDesc}>Your account settings</p>
            <span style={styles.smallCardLink}>Manage →</span>
          </div>
        </div>

        <div style={styles.smallCard}>
          <img 
            src="https://images.unsplash.com/photo-1564053489984-317bbd824340?w=600&q=80" 
            alt="EV Charging Network"
            style={styles.smallCardImage}
          />
          <div style={styles.smallCardContent}>
            <h4 style={styles.smallCardTitle}>Network</h4>
            <p style={styles.smallCardDesc}>Monitor station status</p>
            <span style={styles.smallCardLink}>Explore →</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsSection}>
        <h2 style={styles.statsTitle}>Your impact</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Network Uptime</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>99.9%</div>
            <div style={styles.statLabel}>Reliability</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>Smart</div>
            <div style={styles.statLabel}>Booking System</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>Secure</div>
            <div style={styles.statLabel}>Role-Based Access</div>
          </div>
        </div>
      </div>

      {/* Full Width Banner */}
      <div style={styles.banner}>
        <img 
          src="https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=1600&q=80" 
          alt="EV Charging Future"
          style={styles.bannerImage}
        />
        <div style={styles.bannerContent}>
          <h2 style={styles.bannerTitle}>The future is electric.</h2>
          <p style={styles.bannerText}>
            Empowering sustainable transportation with intelligent charging solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '0',
    maxWidth: '100%',
  },
  // Hero Section
  hero: {
    textAlign: 'center',
    padding: '80px 0 60px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    lineHeight: '1.1',
  },
  heroSubtitle: {
    fontSize: '21px',
    color: '#6e6e73',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.01em',
  },
  // Featured Grid
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  featuredCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  cardImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    display: 'block',
  },
  cardContent: {
    padding: '32px',
  },
  cardTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  cardDescription: {
    fontSize: '17px',
    color: '#6e6e73',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  cardLink: {
    fontSize: '17px',
    color: '#0071e3',
    fontWeight: '400',
  },
  // Secondary Grid
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  },
  smallCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  smallCardImage: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    display: 'block',
  },
  smallCardContent: {
    padding: '24px',
  },
  smallCardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '6px',
    letterSpacing: '-0.01em',
  },
  smallCardDesc: {
    fontSize: '14px',
    color: '#6e6e73',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  smallCardLink: {
    fontSize: '14px',
    color: '#0071e3',
    fontWeight: '400',
  },
  // Stats Section
  statsSection: {
    textAlign: 'center',
    padding: '60px 0',
    backgroundColor: '#f5f5f7',
    borderRadius: '18px',
    marginBottom: '60px',
  },
  statsTitle: {
    fontSize: '40px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '48px',
    letterSpacing: '-0.02em',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 40px',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '17px',
    color: '#6e6e73',
    fontWeight: '400',
  },
  // Banner
  banner: {
    position: 'relative',
    borderRadius: '18px',
    overflow: 'hidden',
    height: '500px',
    marginBottom: '60px',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  bannerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#ffffff',
    width: '80%',
    maxWidth: '800px',
  },
  bannerTitle: {
    fontSize: '48px',
    fontWeight: '600',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  bannerText: {
    fontSize: '21px',
    fontWeight: '400',
    lineHeight: '1.4',
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
};

export default DashboardPage;