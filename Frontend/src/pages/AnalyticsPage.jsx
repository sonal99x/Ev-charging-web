import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { BOOKING_STATUS } from '../utils/constants';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getAnalytics();
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error || 'No data available'}</div>
      </div>
    );
  }

  const PRICE_PER_HOUR = 20;
  const calculateRevenue = () => {
    if (!analytics.totalBookings) return 0;
    return (analytics.totalBookings * 2 * PRICE_PER_HOUR).toFixed(2);
  };

  const utilizationRate = analytics.totalBookings
    ? ((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(1)
    : 0;

  const conversionRate = analytics.pendingBookings
    ? ((analytics.confirmedBookings / (analytics.pendingBookings + analytics.confirmedBookings)) * 100).toFixed(1)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Analytics</h1>
          <p style={styles.subtitle}>Booking statistics and performance insights</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={styles.dateSelect}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{analytics.totalBookings || 0}</div>
          <div style={styles.metricLabel}>Total Bookings</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricValue}>${calculateRevenue()}</div>
          <div style={styles.metricLabel}>Total Revenue</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{analytics.completedBookings || 0}</div>
          <div style={styles.metricLabel}>Completed</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{analytics.pendingBookings || 0}</div>
          <div style={styles.metricLabel}>Pending</div>
        </div>
      </div>

      {/* Status Overview */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Booking Status</h2>
        <div style={styles.statusGrid}>
          <div style={styles.statusCard}>
            <div style={styles.statusTitle}>Pending</div>
            <div style={styles.statusValue}>{analytics.pendingBookings || 0}</div>
            <div style={styles.statusBar}>
              <div
                style={{
                  ...styles.statusBarFill,
                  width: `${
                    analytics.totalBookings
                      ? (analytics.pendingBookings / analytics.totalBookings) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div style={styles.statusCard}>
            <div style={styles.statusTitle}>Confirmed</div>
            <div style={styles.statusValue}>{analytics.confirmedBookings || 0}</div>
            <div style={styles.statusBar}>
              <div
                style={{
                  ...styles.statusBarFill,
                  width: `${
                    analytics.totalBookings
                      ? (analytics.confirmedBookings / analytics.totalBookings) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div style={styles.statusCard}>
            <div style={styles.statusTitle}>Completed</div>
            <div style={styles.statusValue}>{analytics.completedBookings || 0}</div>
            <div style={styles.statusBar}>
              <div
                style={{
                  ...styles.statusBarFill,
                  width: `${
                    analytics.totalBookings
                      ? (analytics.completedBookings / analytics.totalBookings) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div style={styles.statusCard}>
            <div style={styles.statusTitle}>Cancelled</div>
            <div style={styles.statusValue}>{analytics.cancelledBookings || 0}</div>
            <div style={styles.statusBar}>
              <div
                style={{
                  ...styles.statusBarFill,
                  width: `${
                    analytics.totalBookings
                      ? (analytics.cancelledBookings / analytics.totalBookings) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Performance</h2>
        <div style={styles.performanceGrid}>
          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Station Utilization</div>
            <div style={styles.performanceValue}>{utilizationRate}%</div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${utilizationRate}%`,
                }}
              />
            </div>
          </div>

          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Conversion Rate</div>
            <div style={styles.performanceValue}>{conversionRate}%</div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${conversionRate}%`,
                }}
              />
            </div>
          </div>

          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Avg Revenue per Booking</div>
            <div style={styles.performanceValue}>
              ${analytics.totalBookings ? (calculateRevenue() / analytics.totalBookings).toFixed(2) : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Revenue</h2>
        <div style={styles.revenueGrid}>
          <div style={styles.revenueCard}>
            <div style={styles.revenueLabel}>Total Revenue</div>
            <div style={styles.revenueAmount}>${calculateRevenue()}</div>
            <div style={styles.revenueDesc}>Estimated earnings</div>
          </div>

          <div style={styles.revenueCard}>
            <div style={styles.revenueLabel}>Completed Revenue</div>
            <div style={styles.revenueAmount}>
              ${(analytics.completedBookings * 2 * PRICE_PER_HOUR).toFixed(2)}
            </div>
            <div style={styles.revenueDesc}>{analytics.completedBookings} sessions</div>
          </div>

          <div style={styles.revenueCard}>
            <div style={styles.revenueLabel}>Potential Revenue</div>
            <div style={styles.revenueAmount}>
              ${(analytics.pendingBookings * 2 * PRICE_PER_HOUR).toFixed(2)}
            </div>
            <div style={styles.revenueDesc}>{analytics.pendingBookings} pending</div>
          </div>
        </div>
      </div>

      {/* User Activity */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>User Activity</h2>
        <div style={styles.insightsGrid}>
          <div style={styles.insightCard}>
            <div style={styles.insightValue}>{analytics.totalUsers || 0}</div>
            <div style={styles.insightLabel}>Active Users</div>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightValue}>
              {analytics.totalUsers
                ? (analytics.totalBookings / analytics.totalUsers).toFixed(1)
                : 0}
            </div>
            <div style={styles.insightLabel}>Avg Bookings per User</div>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightValue}>
              {100 - (analytics.totalBookings
                ? ((analytics.cancelledBookings / analytics.totalBookings) * 100).toFixed(1)
                : 0)}%
            </div>
            <div style={styles.insightLabel}>Success Rate</div>
          </div>

          <div style={styles.insightCard}>
            <div style={styles.insightValue}>
              {analytics.confirmedBookings + analytics.pendingBookings}
            </div>
            <div style={styles.insightLabel}>Active Bookings</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {(utilizationRate < 50 || analytics.pendingBookings > analytics.confirmedBookings || 
        analytics.cancelledBookings / analytics.totalBookings > 0.2 || utilizationRate > 80) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Insights</h2>
          <div style={styles.insights}>
            {utilizationRate < 50 && (
              <div style={styles.insightItem}>
                Low utilization rate. Consider marketing campaigns to increase bookings.
              </div>
            )}
            {analytics.pendingBookings > analytics.confirmedBookings && (
              <div style={styles.insightItem}>
                High pending bookings. Review and confirm pending reservations.
              </div>
            )}
            {analytics.cancelledBookings / analytics.totalBookings > 0.2 && (
              <div style={styles.insightItem}>
                High cancellation rate. Investigate reasons and improve booking experience.
              </div>
            )}
            {utilizationRate > 80 && (
              <div style={styles.insightItem}>
                Excellent performance. Consider expanding capacity to meet demand.
              </div>
            )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
    gap: '20px',
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
  dateSelect: {
    padding: '10px 16px',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  metricCard: {
    padding: '32px',
    borderRadius: '18px',
    backgroundColor: '#f5f5f7',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: '48px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  metricLabel: {
    fontSize: '17px',
    color: '#6e6e73',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '32px',
    color: '#1d1d1f',
    marginBottom: '24px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  statusCard: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  statusTitle: {
    fontSize: '14px',
    color: '#6e6e73',
    marginBottom: '12px',
    fontWeight: '400',
  },
  statusValue: {
    fontSize: '40px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  statusBar: {
    height: '6px',
    backgroundColor: '#e5e5e5',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  statusBarFill: {
    height: '100%',
    backgroundColor: '#1d1d1f',
    transition: 'width 0.3s ease',
  },
  performanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  performanceCard: {
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  performanceLabel: {
    fontSize: '14px',
    color: '#6e6e73',
    marginBottom: '12px',
  },
  performanceValue: {
    fontSize: '40px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#e5e5e5',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1d1d1f',
    transition: 'width 0.3s ease',
  },
  revenueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmin(250px, 1fr))',
    gap: '20px',
  },
  revenueCard: {
    padding: '32px',
    backgroundColor: '#f5f5f7',
    borderRadius: '18px',
  },
  revenueLabel: {
    fontSize: '14px',
    color: '#6e6e73',
    marginBottom: '12px',
  },
  revenueAmount: {
    fontSize: '40px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  revenueDesc: {
    fontSize: '14px',
    color: '#6e6e73',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  insightCard: {
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  insightValue: {
    fontSize: '40px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  insightLabel: {
    fontSize: '14px',
    color: '#6e6e73',
  },
  insights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  insightItem: {
    padding: '20px 24px',
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    fontSize: '17px',
    color: '#1d1d1f',
    lineHeight: '1.5',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '17px',
    color: '#6e6e73',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '20px 24px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '17px',
  },
};

export default AnalyticsPage;