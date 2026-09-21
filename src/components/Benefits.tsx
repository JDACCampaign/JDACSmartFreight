import styles from './Benefits.module.scss';

const benefits = [
  {
    icon: '💰',
    title: 'Better Price Visibility',
    description: 'Compare available vendor rates before choosing.',
  },
  {
    icon: '🚚',
    title: 'Multiple Vendors',
    description: 'Access multiple surface cargo options in one place.',
  },
  {
    icon: '⭐',
    title: 'Smart Recommendations',
    description: 'Get a suitable vendor suggestion based on shipment requirements.',
  },
  {
    icon: '⚡',
    title: 'Faster Decision Making',
    description: 'Avoid manually checking multiple transporters.',
  },
  {
    icon: '✓',
    title: 'Transparent Comparison',
    description: 'See price and delivery information together.',
  },
  {
    icon: '📈',
    title: 'Growing Vendor Network',
    description: 'New vendors can continuously be added to the platform.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className={styles.section}>
      <div className="container">
        <h2>Why Use JDAC?</h2>
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
