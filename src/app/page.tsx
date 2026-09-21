import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import { Stats, Services, Steps, Why, CtaBanner } from '@/components/landing/Sections';
import Quote from '@/components/landing/Quote';
import Testimonial from '@/components/landing/Testimonial';
import Faq from '@/components/landing/Faq';
import Contact from '@/components/landing/Contact';
import WhatsAppFloat from '@/components/landing/WhatsAppFloat';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Quote />
        <Services />
        <Steps />
        <Why />
        <Testimonial />
        <CtaBanner />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
