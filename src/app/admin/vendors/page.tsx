'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './vendors.module.scss';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  routes: number;
  rating: number;
  status: 'active' | 'inactive' | 'new';
}

const mockVendors: Vendor[] = [
  { id: '1', name: 'Vendor A', email: 'vendor.a@logistics.com', phone: '+91-9999-999999', routes: 12, rating: 4.8, status: 'active' },
  { id: '2', name: 'Vendor B', email: 'vendor.b@logistics.com', phone: '+91-9999-999998', routes: 8, rating: 4.5, status: 'active' },
  { id: '3', name: 'Vendor C', email: 'vendor.c@logistics.com', phone: '+91-9999-999997', routes: 15, rating: 4.6, status: 'active' },
  { id: '4', name: 'New Vendor', email: 'newvendor@logistics.com', phone: '+91-9999-999996', routes: 2, rating: 0, status: 'new' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className={styles.badgeActive}>Active</span>;
      case 'inactive':
        return <span className={styles.badgeInactive}>Inactive</span>;
      case 'new':
        return <span className={styles.badgeNew}>New</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="vendors">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Vendor Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Vendor'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h3>Add New Vendor</h3>
            <form className={styles.form}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Vendor Name *</label>
                  <input type="text" placeholder="e.g., Vendor Name" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" placeholder="email@vendor.com" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input type="tel" placeholder="+91-9999-999999" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" placeholder="Operating City" className="form-input" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Vendor</button>
            </form>
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Routes</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor.id}>
                  <td><strong>{vendor.name}</strong></td>
                  <td>{vendor.email}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.routes}</td>
                  <td>{vendor.rating > 0 ? `⭐ ${vendor.rating}/5` : 'New'}</td>
                  <td>{getStatusBadge(vendor.status)}</td>
                  <td>
                    <button className={styles.actionBtn}>Edit</button>
                    <button className={styles.actionBtn}>View Rates</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
