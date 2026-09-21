import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import { Stats, Services, Steps, Why, CtaBanner } from '@/components/landing/Sections';
import Testimonial from '@/components/landing/Testimonial';
import Faq from '@/components/landing/Faq';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Steps />
        <Why />
        <Testimonial />
        <CtaBanner />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
