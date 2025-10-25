import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Hero */}
      <div style={styles.leftPanel}>
        <div style={styles.heroContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>EV</div>
            <span style={styles.logoText}>Charging</span>
          </div>
          
          <h1 style={styles.heroTitle}>Power your journey.</h1>
          <p style={styles.heroSubtitle}>
            Advanced charging management platform for modern electric vehicle infrastructure.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign in</h2>
            <p style={styles.formSubtitle}>Welcome back to EV Charging</p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={loading ? {...styles.submitButton, ...styles.submitButtonDisabled} : styles.submitButton}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <Link to="/register" style={styles.secondaryButton}>
            Create Account
          </Link>
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80")',
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
    maxWidth: '400px',
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
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#1d1d1f',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '17px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#1d1d1f',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0071e3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: '400',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '32px 0',
  },
  dividerText: {
    backgroundColor: '#ffffff',
    padding: '0 16px',
    color: '#6e6e73',
    fontSize: '14px',
    fontWeight: '400',
  },
  secondaryButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '17px',
    fontWeight: '400',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
};

export default LoginPage;