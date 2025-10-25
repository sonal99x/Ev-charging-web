import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/usersApi';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      await usersApi.updateUser(user.id, updateData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await usersApi.changePassword(
        user.id,
        formData.currentPassword,
        formData.newPassword
      );
      setSuccess('Password changed successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.subtitle}>Manage your account settings</p>
      </div>

      {error && <div style={styles.alert}>{error}</div>}
      {success && <div style={styles.alertSuccess}>{success}</div>}

      <div style={styles.content}>
        {/* Profile Information */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      ...formData,
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                    });
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={styles.saveButton}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div style={styles.profileInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{user?.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Role</span>
                <span style={styles.roleBadge}>{user?.role}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Member Since</span>
                <span style={styles.infoValue}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter current password"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                style={styles.input}
                placeholder="Enter new password"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                style={styles.input}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Account Settings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Account Settings</h2>
          </div>

          <div style={styles.settingsContent}>
            <div style={styles.settingItem}>
              <div>
                <div style={styles.settingTitle}>Account Status</div>
                <div style={styles.settingDesc}>Your account is active</div>
              </div>
              <span style={styles.statusBadge}>Active</span>
            </div>

            <div style={styles.settingItem}>
              <div>
                <div style={styles.settingTitle}>Notifications</div>
                <div style={styles.settingDesc}>
                  Manage notification preferences
                </div>
              </div>
              <button style={styles.settingButton}>Configure</button>
            </div>

            <div style={styles.settingItem}>
              <div>
                <div style={styles.settingTitle}>Security</div>
                <div style={styles.settingDesc}>
                  Two-factor authentication settings
                </div>
              </div>
              <button style={styles.settingButton}>Manage</button>
            </div>

            <div style={styles.divider} />

            <div style={styles.settingItem}>
              <div>
                <div style={styles.settingTitle}>Sign Out</div>
                <div style={styles.settingDesc}>Sign out from your account</div>
              </div>
              <button onClick={logout} style={styles.logoutButton}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '0',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '21px',
    color: '#6e6e73',
    fontWeight: '400',
  },
  alert: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  alertSuccess: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '32px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '24px',
    color: '#1d1d1f',
    margin: 0,
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  editButton: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '400',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontWeight: '400',
    color: '#6e6e73',
    fontSize: '14px',
  },
  infoValue: {
    color: '#1d1d1f',
    fontSize: '14px',
  },
  roleBadge: {
    padding: '4px 12px',
    backgroundColor: '#f5f5f7',
    color: '#1d1d1f',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
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
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '400',
    fontSize: '14px',
  },
  saveButton: {
    padding: '10px 24px',
    backgroundColor: '#0071e3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '400',
    fontSize: '14px',
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#0071e3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '400',
    alignSelf: 'flex-start',
  },
  settingsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontWeight: '500',
    color: '#1d1d1f',
    marginBottom: '4px',
    fontSize: '14px',
  },
  settingDesc: {
    fontSize: '14px',
    color: '#6e6e73',
  },
  statusBadge: {
    padding: '4px 12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
  },
  settingButton: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '400',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.05)',
    margin: '8px 0',
  },
  logoutButton: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '400',
  },
};

export default ProfilePage;