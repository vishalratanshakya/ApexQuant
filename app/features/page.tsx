'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturesSection from '@/components/home/FeaturesSection';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-navy text-text selection-blue font-sans relative overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1">
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
