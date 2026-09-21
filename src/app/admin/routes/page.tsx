'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import styles from './routes.module.scss';

export default function RoutesPage() {
  return (
    <AdminLayout currentPage="routes">
      <div className={styles.container}>
        <h2>Routes Management</h2>
        <p>Coming soon: Manage available routes and vendor coverage.</p>
      </div>
    </AdminLayout>
  );
}
