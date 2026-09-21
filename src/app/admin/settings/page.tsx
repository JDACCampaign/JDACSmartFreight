'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import styles from './settings.module.scss';

export default function SettingsPage() {
  return (
    <AdminLayout currentPage="settings">
      <div className={styles.container}>
        <h2>Settings</h2>
        <p>Coming soon: Configure platform settings and integrations.</p>
      </div>
    </AdminLayout>
  );
}
