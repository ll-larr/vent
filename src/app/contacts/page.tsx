import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ContactSection from '@/components/ContactSection/ContactSection';

export const metadata: Metadata = {
  title: 'Контакты — Clean Vent',
  description: 'Оставьте заявку на чистку вентиляции. Перезвоним в течение 30 минут.',
};

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
