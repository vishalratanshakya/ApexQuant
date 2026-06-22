'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BrokerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: { id: string; name: string; color: string; initial: string } | null;
  onConnect: (brokerId: string, brokerName: string, apiKey: string, apiSecret: string) => Promise<void>;
}

export default function BrokerConnectModal({ isOpen, onClose, broker, onConnect }: BrokerConnectModalProps) {
  const [step, setStep] = useState<'auth' | 'keys' | 'connecting' | 'success'>('auth');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  // Reset state when opening
  if (!isOpen && step !== 'auth') {
    setTimeout(() => {
      setStep('auth');
      setApiKey('');
      setApiSecret('');
    }, 300);
  }

  if (!broker) return null;

  const handleSimulatedOAuth = () => {
    setStep('connecting');
    setTimeout(() => {
      setStep('keys');
    }, 1500);
  };

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error('Please enter both API Key and Secret');
      return;
    }
    setStep('connecting');
    try {
      await onConnect(broker.id, broker.name, apiKey, apiSecret);
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('auth');
        setApiKey('');
        setApiSecret('');
      }, 2000);
    } catch (e) {
      setStep('keys');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-[60]"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${broker.color}`}>
                    {broker.initial}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Connect {broker.name}</h3>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {step === 'auth' && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                      <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Authorization Required</h4>
                      <p className="text-sm text-slate-500 mb-6">You will be redirected to {broker.name} to authorize ApexQuant to place trades on your behalf securely.</p>
                      <button onClick={handleSimulatedOAuth} className="btn-primary w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
                        Continue to Authorization
                      </button>
                    </div>
                  </div>
                )}

                {step === 'keys' && (
                  <div className="space-y-5">
                    <div className="bg-success/10 border border-success/20 rounded-xl p-3 flex gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      <p className="text-success font-medium">Authorization successful. Please enter your API keys for programmatic trading access.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">API Key</label>
                      <input 
                        type="text" 
                        value={apiKey} 
                        onChange={e => setApiKey(e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                        placeholder="Enter your API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">API Secret</label>
                      <input 
                        type="password" 
                        value={apiSecret} 
                        onChange={e => setApiSecret(e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                        placeholder="Enter your API Secret"
                      />
                    </div>
                    <button onClick={handleConnect} className="btn-primary w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:shadow-primary/40 transition-all">
                      <Key className="w-4 h-4" /> Securely Connect Broker
                    </button>
                  </div>
                )}

                {step === 'connecting' && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Establishing secure connection...</p>
                  </div>
                )}

                {step === 'success' && (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h3 className="font-bold text-2xl text-slate-900">Connected!</h3>
                    <p className="text-sm text-slate-500">{broker.name} has been successfully connected to your ApexQuant account.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
