import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/usersApi';
import { USER_ROLES } from '../utils/constants';

const UsersListPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: USER_ROLES.STATION_OPERATOR,
    isActive: true,
  });

  const isSuperAdmin = currentUser?.role === 'SuperAdmin';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'All') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const openCreateModal = () => {
    if (!isSuperAdmin) {
      setError('Only SuperAdmin can create users');
      return;
    }
    
    setModalMode('create');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: USER_ROLES.STATION_OPERATOR,
      isActive: true,
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    if (!isSuperAdmin) {
      setError('Only SuperAdmin can edit users');
      return;
    }

    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (modalMode === 'create') {
        await usersApi.createUser(formData);
      } else {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await usersApi.updateUser(selectedUser.id, updateData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!isSuperAdmin) {
      setError('Only SuperAdmin can delete users');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersApi.deleteUser(userId);
      fetchUsers();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Users</h1>
        <p style={styles.subtitle}>Manage team members and permissions</p>
      </div>

      {!isSuperAdmin && (
        <div style={styles.warning}>
          ⚠️ You need SuperAdmin privileges to create, edit, or delete users. You can only view the user list.
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.toolbar}>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Roles</option>
            <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
            <option value={USER_ROLES.BACKOFFICE}>Backoffice</option>
            <option value={USER_ROLES.STATION_OPERATOR}>Station Operator</option>
          </select>
        </div>
        <button onClick={openCreateModal} style={styles.createButton} disabled={!isSuperAdmin}>
          New User
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: 
                          user.role === USER_ROLES.SUPER_ADMIN ? '#e0e7ff' :
                          user.role === USER_ROLES.BACKOFFICE ? '#dbeafe' : '#fef3c7',
                        color: 
                          user.role === USER_ROLES.SUPER_ADMIN ? '#3730a3' :
                          user.role === USER_ROLES.BACKOFFICE ? '#1e40af' : '#92400e',
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        onClick={() => openEditModal(user)}
                        style={{
                          ...styles.actionButton,
                          ...(isSuperAdmin ? {} : styles.disabledButton),
                        }}
                        disabled={!isSuperAdmin}
                        title={!isSuperAdmin ? 'Only SuperAdmin can edit users' : 'Edit user'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          ...styles.actionButton,
                          ...((!isSuperAdmin || user.id === currentUser?.id) ? styles.disabledButton : {}),
                        }}
                        disabled={!isSuperAdmin || user.id === currentUser?.id}
                        title={
                          !isSuperAdmin ? 'Only SuperAdmin can delete users' :
                          user.id === currentUser?.id ? 'Cannot delete yourself' : 'Delete user'
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{users.length}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {users.filter((u) => u.role === USER_ROLES.SUPER_ADMIN).length}
          </div>
          <div style={styles.statLabel}>Super Admins</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {users.filter((u) => u.role === USER_ROLES.BACKOFFICE).length}
          </div>
          <div style={styles.statLabel}>Backoffice</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {users.filter((u) => u.role === USER_ROLES.STATION_OPERATOR).length}
          </div>
          <div style={styles.statLabel}>Operators</div>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {modalMode === 'create' ? 'New User' : 'Edit User'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  disabled={modalMode === 'edit'}
                />
              </div>

              <div style={styles.formRow}>
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
                <label style={styles.label}>
                  Password {modalMode === 'edit' && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={modalMode === 'create'}
                  style={styles.input}
                  minLength={6}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
                  <option value={USER_ROLES.BACKOFFICE}>Backoffice</option>
                  <option value={USER_ROLES.STATION_OPERATOR}>
                    Station Operator
                  </option>
                </select>
              </div>

              {modalMode === 'edit' && (
                <div style={styles.formGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={styles.checkbox}
                    />
                    <span style={styles.checkboxText}>Account is Active</span>
                  </label>
                </div>
              )}

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '0',
    maxWidth: '100%',
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
  warning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #ffeaa7',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '10px 16px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  createButton: {
    padding: '10px 24px',
    backgroundColor: '#0071e3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '400',
    fontSize: '14px',
    transition: 'opacity 0.3s ease',
  },
  tableWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    overflow: 'hidden',
    marginBottom: '40px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f5f5f7',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '500',
    fontSize: '12px',
    color: '#6e6e73',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#1d1d1f',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: '#0071e3',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '400',
    transition: 'opacity 0.3s ease',
  },
  disabledButton: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: '#f5f5f7',
    padding: '32px',
    borderRadius: '18px',
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
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '18px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    marginBottom: '32px',
    color: '#1d1d1f',
    fontWeight: '600',
    fontSize: '28px',
    letterSpacing: '-0.01em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
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
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '32px',
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
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#0071e3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '400',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '17px',
    color: '#6e6e73',
  },
  noData: {
    textAlign: 'center',
    padding: '60px',
    color: '#6e6e73',
    fontSize: '17px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  checkboxText: {
    color: '#1d1d1f',
    fontWeight: '400',
  },
};

export default UsersListPage