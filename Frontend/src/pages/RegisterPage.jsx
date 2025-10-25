import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: USER_ROLES.STATION_OPERATOR,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.heroContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>EV</div>
            <span style={styles.logoText}>Charging</span>
          </div>
          
          <h1 style={styles.heroTitle}>Join us.</h1>
          <p style={styles.heroSubtitle}>
            Start managing your EV charging infrastructure with powerful tools and insights.
          </p>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Get started with EV Charging</p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label htmlFor="firstName" style={styles.label}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="John"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="lastName" style={styles.label}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="role" style={styles.label}>
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value={USER_ROLES.STATION_OPERATOR}>Station Operator</option>
                <option value={USER_ROLES.BACKOFFICE}>Backoffice</option>
              </select>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter password"
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.link}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
  leftPanel: {
    flex: '1',
    position: 'relative',
    background: '#000000',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '500px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '80px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#000000',
  },
  logoText: {
    fontSize: '21px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: '600',
    marginBottom: '24px',
    lineHeight: '1.05',
    letterSpacing: '-0.03em',
  },
  heroSubtitle: {
    fontSize: '21px',
    lineHeight: '1.5',
    opacity: '0.9',
    fontWeight: '400',
  },
  rightPanel: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#ffffff',
  },
  formContainer: {
    width: '100%',
    maxWidth: '520px',
  },
  formHeader: {
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '40px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  formSubtitle: {
    fontSize: '17px',
    color: '#6e6e73',
    fontWeight: '400',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1,
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '400',
    color: '#1d1d1f',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '17px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    color: '#1d1d1f',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#0071e3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: '400',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s ease',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
  },
  footerText: {
    color: '#6e6e73',
    fontSize: '14px',
  },
  link: {
    color: '#0071e3',
    textDecoration: 'none',
    fontWeight: '400',
  },
};

export default RegisterPage;
