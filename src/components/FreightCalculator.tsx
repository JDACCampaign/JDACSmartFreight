'use client';

import { useState } from 'react';
import styles from './FreightCalculator.module.scss';

interface ShipmentDetails {
  from: string;
  fromPincode: string;
  to: string;
  toPincode: string;
  cargoType: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  pieces: number;
  pickupType: string;
  deliveryType: string;
}

interface Vendor {
  id: string;
  name: string;
  price: number;
  deliveryDays: string;
  badge?: string;
  rating?: number;
  isNew?: boolean;
}

const CARGO_TYPES = ['Furniture', 'Spare Parts', 'Garments', 'Electronics', 'General Cargo', 'Other'];
const PICKUP_TYPES = ['Door Pickup', 'Drop-off'];
const DELIVERY_TYPES = ['Standard', 'Express'];

export default function FreightCalculator() {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [formData, setFormData] = useState<ShipmentDetails>({
    from: '',
    fromPincode: '',
    to: '',
    toPincode: '',
    cargoType: 'General Cargo',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    pieces: 1,
    pickupType: 'Door Pickup',
    deliveryType: 'Standard',
  });

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'fastest' | 'best-value'>('price-low');

  const handleInputChange = (field: keyof ShipmentDetails, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateFreight = () => {
    if (!formData.from || !formData.to || !formData.weight) {
      alert('Please fill in all required fields');
      return;
    }

    // Mock vendor data - in real app, fetch from database
    const mockVendors: Vendor[] = [
      {
        id: '1',
        name: 'Vendor B',
        price: 390,
        deliveryDays: '2 Days',
        badge: 'LOWEST PRICE',
      },
      {
        id: '2',
        name: 'Vendor A',
        price: 420,
        deliveryDays: '1–2 Days',
        badge: 'BEST VALUE',
        rating: 4.8,
      },
      {
        id: '3',
        name: 'Vendor C',
        price: 550,
        deliveryDays: '1 Day',
        badge: 'FASTEST',
        rating: 4.6,
      },
      {
        id: '4',
        name: 'New Vendor',
        price: 395,
        deliveryDays: '2 Days',
        badge: 'NEW VENDOR',
        isNew: true,
      },
    ];

    setVendors(mockVendors);
    setStep('results');
  };

  const getSortedVendors = () => {
    const sorted = [...vendors];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'fastest':
        return sorted.sort((a, b) => {
          const dayA = parseInt(a.deliveryDays);
          const dayB = parseInt(b.deliveryDays);
          return dayA - dayB;
        });
      case 'best-value':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const recommendedVendor = vendors.length > 0 ? vendors[1] : null; // Mock recommendation

  if (step === 'results') {
    return (
      <section className={styles.container}>
        <div className="container">
          <div className={styles.header}>
            <h2>Results for {formData.from} → {formData.to}</h2>
            <button className="btn btn-outline" onClick={() => setStep('form')}>
              ← Back to Calculator
            </button>
          </div>

          <div className={styles.controls}>
            <div className={styles.sortBy}>
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="fastest">Fastest Delivery</option>
                <option value="best-value">Best Value</option>
              </select>
            </div>
          </div>

          {recommendedVendor && (
            <div className={styles.recommendation}>
              <div className={styles.recommendationHeader}>⭐ JDAC Smart Suggestion</div>
              <div className={styles.recommendationContent}>
                <h3>Which vendor should you choose?</h3>
                <div className={styles.recommendedCard}>
                  <div className={styles.vendorName}>{recommendedVendor.name}</div>
                  <div className={styles.vendorPrice}>₹{recommendedVendor.price}</div>
                  <div className={styles.vendorDelivery}>Surface Cargo • {recommendedVendor.deliveryDays}</div>
                  <p className={styles.reason}>Best balance of price and delivery time for this shipment.</p>
                  <button className="btn btn-secondary btn-large">CHOOSE RECOMMENDED VENDOR</button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.vendorsSection}>
            <h3>Available Surface Cargo Vendors</h3>
            <div className={styles.vendorsList}>
              {getSortedVendors().map(vendor => (
                <div key={vendor.id} className={styles.vendorCard}>
                  {vendor.badge && <span className={styles.badge}>{vendor.badge}</span>}
                  {vendor.isNew && <span className={styles.newBadge}>🆕 NEW</span>}

                  <div className={styles.vendorInfo}>
                    <h4>{vendor.name}</h4>
                    <div className={styles.price}>₹{vendor.price}</div>
                    <div className={styles.service}>Surface Cargo</div>
                    <div className={styles.delivery}>{vendor.deliveryDays}</div>
                    {vendor.rating && <div className={styles.rating}>⭐ {vendor.rating}/5</div>}
                  </div>

                  <button className="btn btn-primary">Choose Vendor</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className="container">
        <h2>Calculate Your Surface Cargo Freight</h2>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); calculateFreight(); }}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">From *</label>
              <input
                type="text"
                placeholder="City"
                className="form-input"
                value={formData.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                className="form-input"
                value={formData.fromPincode}
                onChange={(e) => handleInputChange('fromPincode', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">To *</label>
              <input
                type="text"
                placeholder="City"
                className="form-input"
                value={formData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                className="form-input"
                value={formData.toPincode}
                onChange={(e) => handleInputChange('toPincode', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Cargo Type</label>
              <select
                className="form-select"
                value={formData.cargoType}
                onChange={(e) => handleInputChange('cargoType', e.target.value)}
              >
                {CARGO_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Weight (KG) *</label>
              <input
                type="number"
                placeholder="e.g., 100"
                className="form-input"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pieces</label>
              <input
                type="number"
                placeholder="e.g., 1"
                className="form-input"
                value={formData.pieces}
                onChange={(e) => handleInputChange('pieces', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Length (CM)</label>
              <input
                type="number"
                placeholder="Length"
                className="form-input"
                value={formData.length || ''}
                onChange={(e) => handleInputChange('length', parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Width (CM)</label>
              <input
                type="number"
                placeholder="Width"
                className="form-input"
                value={formData.width || ''}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Height (CM)</label>
              <input
                type="number"
                placeholder="Height"
                className="form-input"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Pickup Type</label>
              <select
                className="form-select"
                value={formData.pickupType}
                onChange={(e) => handleInputChange('pickupType', e.target.value)}
              >
                {PICKUP_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Requirement</label>
              <select
                className="form-select"
                value={formData.deliveryType}
                onChange={(e) => handleInputChange('deliveryType', e.target.value)}
              >
                {DELIVERY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            CALCULATE FREIGHT
          </button>
        </form>
      </div>
    </section>
  );
}
