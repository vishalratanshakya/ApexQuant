import Navbar from '@/components/layout/Navbar';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-surface-2 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 relative z-10 w-full max-w-3xl mx-auto">
        <OnboardingWizard />
      </div>
    </main>
  );
}
