'use client';
import { useState } from 'react';
import Calculator from '@/components/Calculator/Calculator';
import ContactSection from '@/components/ContactSection/ContactSection';
import type { ServiceId } from '@/components/Calculator/types';

export default function HomeOrchestrator() {
  const [preselectedServices, setPreselectedServices] = useState<ServiceId[]>([]);
  const [preselectedArea, setPreselectedArea] = useState<number | undefined>();

  const handleOrder = (services: ServiceId[], area: number) => {
    setPreselectedServices(services);
    setPreselectedArea(area);
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Calculator onOrder={handleOrder} />
      <ContactSection
        preselectedServices={preselectedServices}
        preselectedArea={preselectedArea}
      />
    </>
  );
}
