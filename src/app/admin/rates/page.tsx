'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import styles from './rates.module.scss';

export default function RatesPage() {
  return (
    <AdminLayout currentPage="rates">
      <div className={styles.container}>
        <h2>Freight Rate Management</h2>
        <p>Coming soon: Manage freight rates for all vendors and routes.</p>
      </div>
    </AdminLayout>
  );
}
