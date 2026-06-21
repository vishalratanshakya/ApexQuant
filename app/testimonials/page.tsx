'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TestimonialsStats from '@/components/testimonials/TestimonialsStats';
import TestimonialsGrid from '@/components/testimonials/TestimonialsGrid';
import TestimonialsVideos from '@/components/testimonials/TestimonialsVideos';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-navy text-text selection-blue font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <main className="pt-32 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-text font-display mb-6 tracking-tight">
              Real Traders, <span className="text-primary">Real Results</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 font-medium">
              See how ApexQuant is helping traders across India succeed by automating their edge.
            </p>
          </div>

          <TestimonialsStats />
          
          <div className="mt-24">
            <TestimonialsVideos />
          </div>

          <div className="mt-24">
            <TestimonialsGrid />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
