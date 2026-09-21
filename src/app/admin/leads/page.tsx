'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './leads.module.scss';

interface Lead {
  id: string;
  name: string;
  business: string;
  phone: string;
  route: string;
  cargo: string;
  weight: string;
  vendor: string;
  campaign: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  date: string;
}

const mockLeads: Lead[] = [
  {
    id: '#001',
    name: 'Rahul Jain',
    business: 'Rahul Furniture',
    phone: '+91-9876-543210',
    route: 'Pune → Delhi',
    cargo: 'Furniture',
    weight: '100 KG',
    vendor: 'Vendor A',
    campaign: 'Pune Furniture',
    status: 'new',
    date: 'Today',
  },
  {
    id: '#002',
    name: 'Priya Sharma',
    business: 'ABC Logistics',
    phone: '+91-9876-543211',
    route: 'Mumbai → Bangalore',
    cargo: 'General Cargo',
    weight: '500 KG',
    vendor: 'Vendor B',
    campaign: 'Mumbai Logistics',
    status: 'contacted',
    date: 'Yesterday',
  },
  {
    id: '#003',
    name: 'Vikram Singh',
    business: 'XYZ Traders',
    phone: '+91-9876-543212',
    route: 'Chennai → Hyderabad',
    cargo: 'Electronics',
    weight: '200 KG',
    vendor: 'Vendor C',
    campaign: 'Chennai Trade',
    status: 'qualified',
    date: '2 days ago',
  },
];

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockLeads);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLeads = filterStatus === 'all'
    ? leads
    : leads.filter(l => l.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className={styles.badgeNew}>New</span>;
      case 'contacted':
        return <span className={styles.badgeContacted}>Contacted</span>;
      case 'qualified':
        return <span className={styles.badgeQualified}>Qualified</span>;
      case 'converted':
        return <span className={styles.badgeConverted}>Converted</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="leads">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Lead Management</h2>
          <div className={styles.filters}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Name</th>
                <th>Business</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Vendor</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td><strong>{lead.id}</strong></td>
                  <td>{lead.name}</td>
                  <td>{lead.business}</td>
                  <td>{lead.route}</td>
                  <td>{lead.cargo}</td>
                  <td>{lead.vendor}</td>
                  <td>{lead.campaign}</td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td>{lead.date}</td>
                  <td>
                    <button className={styles.actionBtn}>Update</button>
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
