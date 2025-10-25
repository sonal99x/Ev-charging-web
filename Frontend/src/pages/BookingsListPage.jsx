import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../api/bookingsApi';
import { getStations } from '../api/stationsApi';
import { BOOKING_STATUS } from '../utils/constants';

const BookingsListPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stations, setStations] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleModel: '',
    stationId: '',
    startTime: '',
    endTime: '',
    status: BOOKING_STATUS.PENDING,
  });

  useEffect(() => {
    fetchBookings();
    fetchStations();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getAllBookings();
      setBookings(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
    } catch (err) {
      console.error('Failed to fetch stations:', err);
      // Don't show error to user, just log it
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.vehicleModel?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const validateAdvanceBooking = (startTime) => {
    const now = new Date();
    const bookingDate = new Date(startTime);
    const daysDifference = Math.ceil((bookingDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDifference > 7) {
      setError('Bookings can only be made up to 7 days in advance');
      return false;
    }
    
    if (daysDifference < 0) {
      setError('Cannot book in the past');
      return false;
    }
    
    return true;
  };

  const validate12HourRule = (createdAt) => {
    const now = new Date();
    const bookingCreatedDate = new Date(createdAt);
    const hoursSinceCreation = (now - bookingCreatedDate) / (1000 * 60 * 60);
    
    // Can only modify within 12 hours of creation
    if (hoursSinceCreation > 12) {
      return false;
    }
    return true;
  };

  const getHoursRemaining = (createdAt) => {
    const now = new Date();
    const bookingCreatedDate = new Date(createdAt);
    const hoursSinceCreation = (now - bookingCreatedDate) / (1000 * 60 * 60);
    const hoursRemaining = 12 - hoursSinceCreation;
    return hoursRemaining > 0 ? hoursRemaining : 0;
  };

  const openCreateModal = () => {
    setModalMode('create');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 16);
    
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicleModel: '',
      stationId: stations.length > 0 ? stations[0].id : '',
      startTime: tomorrowStr,
      endTime: '',
      status: BOOKING_STATUS.PENDING,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    // Check if user is SuperAdmin or if within 12 hours
    const isSuperAdmin = user?.role === 'SuperAdmin';
    const canModifyTime = validate12HourRule(booking.createdAt);

    if (!isSuperAdmin && !canModifyTime) {
      setError('Cannot modify booking after 12 hours of creation');
      return;
    }

    setModalMode('edit');
    setSelectedBooking(booking);
    setFormData({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone || '',
      vehicleModel: booking.vehicleModel,
      stationId: booking.stationId,
      startTime: new Date(booking.startTime).toISOString().slice(0, 16),
      endTime: new Date(booking.endTime).toISOString().slice(0, 16),
      status: booking.status,
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if user is logged in
    if (!user?.id) {
      setError('You must be logged in to create a booking');
      return;
    }

    if (!validateAdvanceBooking(formData.startTime)) {
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('End time must be after start time');
      return;
    }

    try {
      if (modalMode === 'create') {
        // Add userId to formData for new bookings
        const bookingData = {
          ...formData,
          userId: user?.id
        };
        await bookingsApi.createBooking(bookingData);
        setSuccess('Booking created successfully');
      } else {
        await bookingsApi.updateBooking(selectedBooking.id, formData);
        setSuccess('Booking updated successfully');
      }
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (booking) => {
    // Check if user is SuperAdmin or if within 12 hours
    const isSuperAdmin = user?.role === 'SuperAdmin';
    const canModifyTime = validate12HourRule(booking.createdAt);

    if (!isSuperAdmin && !canModifyTime) {
      setError('Cannot cancel booking after 12 hours of creation');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsApi.deleteBooking(booking.id);
      setSuccess('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      await bookingsApi.updateBooking(bookingId, { status: BOOKING_STATUS.CONFIRMED });
      setSuccess('Booking confirmed');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await bookingsApi.updateBooking(bookingId, { status: BOOKING_STATUS.COMPLETED });
      setSuccess('Booking marked as completed');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return { bg: '#fef3c7', color: '#92400e' };
      case BOOKING_STATUS.CONFIRMED:
        return { bg: '#dbeafe', color: '#1e40af' };
      case BOOKING_STATUS.COMPLETED:
        return { bg: '#d1fae5', color: '#065f46' };
      case BOOKING_STATUS.CANCELLED:
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const canModifyOrCancel = (booking) => {
    const isSuperAdmin = user?.role === 'SuperAdmin';
    if (isSuperAdmin) return true;
    
    // Check if user owns this booking
    if (booking.userId !== user?.id) return false;
    
    return validate12HourRule(booking.createdAt);
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
        <h1 style={styles.title}>Bookings</h1>
        <p style={styles.subtitle}>
          Manage charging station reservations
        </p>
      </div>

      {error && <div style={styles.alert}>{error}</div>}
      {success && <div style={styles.alertSuccess}>{success}</div>}

      <div style={styles.toolbar}>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Status</option>
            <option value={BOOKING_STATUS.PENDING}>Pending</option>
            <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
            <option value={BOOKING_STATUS.COMPLETED}>Completed</option>
            <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>
        <button onClick={openCreateModal} style={styles.createButton}>
          New Booking
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Vehicle</th>
              <th style={styles.th}>Station</th>
              <th style={styles.th}>Start Time</th>
              <th style={styles.th}>End Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Modification Window</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.noData}>
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const statusColors = getStatusColor(booking.status);
                const canModify = canModifyOrCancel(booking);
                const hoursRemaining = getHoursRemaining(booking.createdAt);
                const isSuperAdmin = user?.role === 'SuperAdmin';
                
                return (
                  <tr key={booking.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.customerName}>{booking.customerName}</div>
                      <div style={styles.customerEmail}>{booking.customerEmail}</div>
                      {booking.customerPhone && (
                        <div style={styles.customerPhone}>{booking.customerPhone}</div>
                      )}
                    </td>
                    <td style={styles.td}>{booking.vehicleModel}</td>
                    <td style={styles.td}>
                      {stations.find(s => s.id === booking.stationId)?.name || booking.stationId}
                    </td>
                    <td style={styles.td}>
                      {new Date(booking.startTime).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      {new Date(booking.endTime).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                        }}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {isSuperAdmin ? (
                        <span style={styles.superAdminBadge}>Full Access</span>
                      ) : hoursRemaining > 0 ? (
                        <span style={styles.timeRemaining}>
                          {hoursRemaining.toFixed(1)}h left
                        </span>
                      ) : (
                        <span style={styles.expired}>Expired</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        {booking.status === BOOKING_STATUS.PENDING && isSuperAdmin && (
                          <button
                            onClick={() => handleConfirm(booking.id)}
                            style={styles.actionButton}
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === BOOKING_STATUS.CONFIRMED && isSuperAdmin && (
                          <button
                            onClick={() => handleComplete(booking.id)}
                            style={styles.actionButton}
                          >
                            Complete
                          </button>
                        )}
                        {booking.status !== BOOKING_STATUS.COMPLETED &&
                          booking.status !== BOOKING_STATUS.CANCELLED && (
                            <>
                              <button
                                onClick={() => openEditModal(booking)}
                                style={{
                                  ...styles.actionButton,
                                  ...(canModify ? {} : styles.disabledButton),
                                }}
                                disabled={!canModify}
                                title={!canModify ? '12-hour window expired or not your booking' : 'Edit booking'}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(booking)}
                                style={{
                                  ...styles.actionButton,
                                  ...(canModify ? {} : styles.disabledButton),
                                }}
                                disabled={!canModify}
                                title={!canModify ? '12-hour window expired or not your booking' : 'Cancel booking'}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{bookings.length}</div>
          <div style={styles.statLabel}>Total</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length}
          </div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length}
          </div>
          <div style={styles.statLabel}>Confirmed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length}
          </div>
          <div style={styles.statLabel}>Completed</div>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {modalMode === 'create' ? 'New Booking' : 'Edit Booking'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Tesla Model 3"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Station</label>
                  <select
                    name="stationId"
                    value={formData.stationId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select a station</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} - {station.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              {modalMode === 'edit' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value={BOOKING_STATUS.PENDING}>Pending</option>
                    <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
                    <option value={BOOKING_STATUS.COMPLETED}>Completed</option>
                    <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                  </select>
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
  customerName: {
    fontWeight: '500',
    marginBottom: '2px',
  },
  customerEmail: {
    fontSize: '12px',
    color: '#6e6e73',
  },
  customerPhone: {
    fontSize: '12px',
    color: '#6e6e73',
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
    flexWrap: 'wrap',
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
  superAdminBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  timeRemaining: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  expired: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
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
    maxWidth: '600px',
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
};

export default BookingsListPage;