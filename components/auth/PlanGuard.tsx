'use client';

import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import UpgradePrompt from './UpgradePrompt';
import { Lock } from 'lucide-react';

interface PlanGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresPro?: boolean;
  requiresEnterprise?: boolean;
  featureName?: string;
  actionType?: 'hide' | 'lock' | 'intercept';
  onClick?: () => void;
  className?: string;
}

export default function PlanGuard({ 
  children, 
  fallback = null, 
  requiresPro = true, 
  requiresEnterprise = false, 
  featureName = 'This feature',
  actionType = 'lock',
  onClick,
  className = ''
}: PlanGuardProps) {
  const { isPro, isEnterprise, loading } = useSubscription();
  const [showPrompt, setShowPrompt] = useState(false);

  if (loading) return <div className="opacity-50 pointer-events-none">{children}</div>;

  const hasAccess = requiresEnterprise ? isEnterprise : (requiresPro ? isPro : true);

  if (hasAccess) {
    return <div onClick={onClick} className={className}>{children}</div>;
  }

  if (actionType === 'hide') {
    return <>{fallback}</>;
  }

  if (actionType === 'intercept') {
    return (
      <>
        <div onClick={() => setShowPrompt(true)} className={`cursor-pointer ${className}`}>
          {children}
        </div>
        <UpgradePrompt 
          isOpen={showPrompt} 
          onClose={() => setShowPrompt(false)} 
          title="Pro Feature"
          description={`${featureName} requires a Pro plan. Upgrade today to unlock your trading potential.`}
        />
      </>
    );
  }

  // Default 'lock' styling
  return (
    <>
      <div 
        onClick={() => setShowPrompt(true)}
        className={`relative group cursor-pointer ${className}`}
      >
        <div className="opacity-40 group-hover:opacity-30 transition-opacity pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xl">
            <Lock className="w-3 h-3" />
            Pro Feature
          </div>
        </div>
      </div>
      
      <UpgradePrompt 
        isOpen={showPrompt} 
        onClose={() => setShowPrompt(false)} 
        title="Pro Feature"
        description={`${featureName} requires a Pro plan. Upgrade today to unlock your trading potential.`}
      />
    </>
  );
}
