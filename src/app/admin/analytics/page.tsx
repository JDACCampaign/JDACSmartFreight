'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import styles from './analytics.module.scss';

export default function AnalyticsPage() {
  return (
    <AdminLayout currentPage="analytics">
      <div className={styles.container}>
        <h2>Analytics</h2>
        <p>Coming soon: View detailed analytics and reports.</p>
      </div>
    </AdminLayout>
  );
}
