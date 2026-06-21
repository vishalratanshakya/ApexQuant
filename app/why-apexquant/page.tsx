'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BenefitsSection from '@/components/home/BenefitsSection';

export default function WhyApexQuantPage() {
  return (
    <div className="min-h-screen bg-navy text-text selection-blue font-sans relative overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1">
        <BenefitsSection />
      </main>

      <Footer />
    </div>
  );
}
