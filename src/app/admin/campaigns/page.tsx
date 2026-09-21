'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './campaigns.module.scss';

interface Campaign {
  id: string;
  name: string;
  target: string;
  destination: string;
  leads: number;
  goal: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  progress: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Pune Furniture Sellers',
    target: 'Pune',
    destination: 'Delhi',
    leads: 127,
    goal: 500,
    status: 'active',
    progress: 25,
  },
  {
    id: '2',
    name: 'Mumbai Logistics Partners',
    target: 'Mumbai',
    destination: 'Bangalore',
    leads: 89,
    goal: 300,
    status: 'active',
    progress: 30,
  },
  {
    id: '3',
    name: 'Chennai Trade Network',
    target: 'Chennai',
    destination: 'Hyderabad',
    leads: 45,
    goal: 200,
    status: 'paused',
    progress: 22,
  },
];

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className={styles.badgeActive}>Active</span>;
      case 'draft':
        return <span className={styles.badgeDraft}>Draft</span>;
      case 'paused':
        return <span className={styles.badgePaused}>Paused</span>;
      case 'completed':
        return <span className={styles.badgeCompleted}>Completed</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout currentPage="campaigns">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Campaign Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Create Campaign'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h3>Create New Campaign</h3>
            <form className={styles.form}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Campaign Name *</label>
                  <input type="text" placeholder="e.g., Pune Furniture Sellers" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Location *</label>
                  <input type="text" placeholder="e.g., Pune" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination *</label>
                  <input type="text" placeholder="e.g., Delhi" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Lead Goal *</label>
                  <input type="number" placeholder="e.g., 500" className="form-input" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Campaign</button>
            </form>
          </div>
        )}

        <div className={styles.campaignsGrid}>
          {campaigns.map(campaign => (
            <div key={campaign.id} className={styles.campaignCard}>
              <div className={styles.cardHeader}>
                <h3>{campaign.name}</h3>
                {getStatusBadge(campaign.status)}
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.infoRow}>
                  <span>From:</span>
                  <strong>{campaign.target}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>To:</span>
                  <strong>{campaign.destination}</strong>
                </div>
              </div>

              <div className={styles.progress}>
                <div className={styles.progressHeader}>
                  <span>Progress</span>
                  <span>{campaign.leads} / {campaign.goal}</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.actionBtn}>Edit</button>
                <button className={styles.actionBtn}>View Leads</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
