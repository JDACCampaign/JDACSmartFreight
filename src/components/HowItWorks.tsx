import styles from './HowItWorks.module.scss';

const steps = [
  {
    number: '01',
    title: 'Enter Shipment Details',
    description: 'Tell us where your cargo is going.',
  },
  {
    number: '02',
    title: 'Compare Freight Rates',
    description: 'See rates from multiple surface cargo vendors.',
  },
  {
    number: '03',
    title: 'Choose Your Vendor',
    description: 'Compare price, delivery time and serviceability.',
  },
  {
    number: '04',
    title: 'Get Quote / Book Shipment',
    description: 'Continue with your selected vendor.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container">
        <h2>How It Works</h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className={styles.arrow}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
