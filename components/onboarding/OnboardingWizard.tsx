'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1Auth from './Step1Auth';
import Step2Style from './Step2Style';
import Step3Broker from './Step3Broker';
import Step4Strategy from './Step4Strategy';
import Step5Success from './Step5Success';
import { useAuth } from '@/hooks/useAuth';
import { createUserProfile } from '@/lib/db';
import { toast } from 'react-hot-toast';

export default function OnboardingWizard() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [preferences, setPreferences] = useState<any>({
    tradingStyle: [],
    broker: null,
    experience: null,
  });

  useEffect(() => {
    // If user is already logged in, skip Step 1 automatically
    if (!loading && user && step === 1) {
      // Just manually skip if already authed
      setStep(2);
    }
  }, [user, loading, step]);

  const nextStep = async (data?: any) => {
    if (data) {
      setPreferences((prev: any) => ({ ...prev, ...data }));
    }
    
    // If we are moving from Step 4 to Step 5, save to Firestore
    if (step === 4 && user) {
      try {
        await createUserProfile(user.uid, {
          email: user.email,
          preferences: { ...preferences, ...data },
          onboarded: true,
          credits: 1000,
        });
      } catch (err) {
        console.error('Failed to save profile', err);
        toast.error('Failed to save profile data.');
      }
    }

    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (loading && step === 1) {
    return (
      <div className="glass-card w-full h-96 rounded-2xl flex items-center justify-center shadow-xl">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Auth onNext={() => nextStep()} />;
      case 2: return <Step2Style onNext={(styles) => nextStep({ tradingStyle: styles })} onBack={prevStep} />;
      case 3: return <Step3Broker onNext={(broker) => nextStep({ broker })} onBack={prevStep} />;
      case 4: return <Step4Strategy onNext={(exp) => nextStep({ experience: exp })} onBack={prevStep} />;
      case 5: return <Step5Success />;
      default: return null;
    }
  };

  // Progress logic: Step 1 is 0%, Step 2 is 25%, Step 3 is 50%, Step 4 is 75%, Step 5 is 100% (hidden)
  const progressPercent = ((step - 1) / 4) * 100;

  return (
    <div className="w-full relative">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Main Wizard Area */}
      <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-xl border border-border w-full min-h-[480px] flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col h-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
