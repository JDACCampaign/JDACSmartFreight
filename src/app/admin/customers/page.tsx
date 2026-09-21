'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import styles from './customers.module.scss';

export default function CustomersPage() {
  return (
    <AdminLayout currentPage="customers">
      <div className={styles.container}>
        <h2>Customer Management</h2>
        <p>Coming soon: View and manage customer profiles and history.</p>
      </div>
    </AdminLayout>
  );
}
