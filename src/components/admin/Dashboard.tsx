'use client';

import styles from './Dashboard.module.scss';

const stats = [
  { label: 'Total Leads', value: '127', color: 'blue' },
  { label: 'Qualified Leads', value: '64', color: 'orange' },
  { label: 'Freight Calculations', value: '214', color: 'green' },
  { label: 'Quotes Generated', value: '89', color: 'purple' },
  { label: 'Bookings', value: '32', color: 'red' },
  { label: 'Conversion Rate', value: '25.2%', color: 'blue' },
];

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3>Leads by Campaign</h3>
          <div className={styles.chartPlaceholder}>
            <p>Chart will be rendered here</p>
            <p>Use Chart.js, Recharts or similar library</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Leads by City</h3>
          <div className={styles.chartPlaceholder}>
            <p>Chart will be rendered here</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Leads by Cargo Type</h3>
          <div className={styles.chartPlaceholder}>
            <p>Chart will be rendered here</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Quote to Booking Conversion</h3>
          <div className={styles.chartPlaceholder}>
            <p>Chart will be rendered here</p>
          </div>
        </div>
      </div>

      <div className={styles.recentLeads}>
        <h3>Recent Leads</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Business</th>
              <th>Route</th>
              <th>Weight</th>
              <th>Vendor</th>
              <th>Campaign</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#001</td>
              <td>Rahul Furniture</td>
              <td>Pune → Delhi</td>
              <td>100 KG</td>
              <td>Vendor A</td>
              <td>Pune Furniture</td>
              <td><span className={styles.badgeNew}>New</span></td>
              <td>Today</td>
            </tr>
            <tr>
              <td>#002</td>
              <td>ABC Logistics</td>
              <td>Mumbai → Bangalore</td>
              <td>500 KG</td>
              <td>Vendor B</td>
              <td>Mumbai Logistics</td>
              <td><span className={styles.badgeContacted}>Contacted</span></td>
              <td>Yesterday</td>
            </tr>
            <tr>
              <td>#003</td>
              <td>XYZ Traders</td>
              <td>Chennai → Hyderabad</td>
              <td>200 KG</td>
              <td>Vendor C</td>
              <td>Chennai Trade</td>
              <td><span className={styles.badgeQualified}>Qualified</span></td>
              <td>2 days ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
