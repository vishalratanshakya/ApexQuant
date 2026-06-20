'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const brokers = [
  {
    name: 'Zerodha',
    abbr: 'ZE',
    color: 'from-[#387ed1] to-[#2a5fa8]',
    textColor: 'text-white',
    bg: 'bg-[#387ed1]',
    desc: 'Kite API',
    icon: '/brokers/zerodha.svg',
  },
  {
    name: 'Angel One',
    abbr: 'AO',
    color: 'from-[#e63535] to-[#b22020]',
    textColor: 'text-white',
    bg: 'bg-[#e63535]',
    desc: 'SmartAPI',
    icon: '/brokers/angelone.svg',
  },
  {
    name: 'Upstox',
    abbr: 'UP',
    color: 'from-[#7b2d8b] to-[#5a1f67]',
    textColor: 'text-white',
    bg: 'bg-[#7b2d8b]',
    desc: 'Upstox API v2',
    icon: '/brokers/upstox.svg',
  },
  {
    name: 'Groww',
    abbr: 'GW',
    color: 'from-[#00d09c] to-[#00a57d]',
    textColor: 'text-white',
    bg: 'bg-[#00d09c]',
    desc: 'Groww API',
    icon: '/brokers/groww.svg',
  },
  {
    name: 'Alice Blue',
    abbr: 'AB',
    color: 'from-[#0052cc] to-[#003d99]',
    textColor: 'text-white',
    bg: 'bg-[#0052cc]',
    desc: 'ANT API',
    icon: '/brokers/aliceblue.svg',
  },
  {
    name: '5paisa',
    abbr: '5P',
    color: 'from-[#ff6b00] to-[#cc5500]',
    textColor: 'text-white',
    bg: 'bg-[#ff6b00]',
    desc: '5paisa API',
    icon: '/brokers/5paisa.svg',
  },
  {
    name: 'ICICI Direct',
    abbr: 'IC',
    color: 'from-[#f7941d] to-[#c97315]',
    textColor: 'text-white',
    bg: 'bg-[#f7941d]',
    desc: 'Breeze API',
    icon: '/brokers/icicidirect.svg',
  },
  {
    name: 'Finvasia',
    abbr: 'FV',
    color: 'from-[#1a1a2e] to-[#16213e]',
    textColor: 'text-white',
    bg: 'bg-[#1a1a2e]',
    desc: 'Shoonya API',
    border: 'border border-border',
    icon: '/brokers/finvasia.svg',
  },
];

export default function BrokerLogin() {
  const handleBrokerClick = (brokerName: string) => {
    // Placeholder: Implement broker-specific OAuth flow
    alert(`Broker login with ${brokerName} coming soon! Enter your API credentials in the dashboard after signing in.`);
  };

  return (
    <div className="mt-8">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-5 relative">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-slate-400 font-medium bg-white px-2 relative z-10 whitespace-nowrap">
          or login with your broker
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Broker Grid */}
      <div className="grid grid-cols-4 gap-2">
        {brokers.map((broker, i) => (
          <motion.button
            key={broker.name}
            id={`broker-${broker.name.toLowerCase().replace(/\s+/g, '-')}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={() => handleBrokerClick(broker.name)}
            title={`Login with ${broker.name} (${broker.desc})`}
            className={`broker-card rounded-xl p-3 flex flex-col items-center gap-1.5 group ${broker.border || ''}`}
          >
            {/* Logo avatar */}
            <div className="relative w-9 h-9 rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-200 shadow-md">
              <Image
                src={broker.icon}
                alt={`${broker.name} Logo`}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[9px] text-slate-500 group-hover:text-primary transition-colors font-medium leading-tight text-center">
              {broker.name}
            </span>
          </motion.button>
        ))}
      </div>

      <p className="text-[10px] text-slate-500 text-center mt-4">
        Your broker credentials are never stored on our servers
      </p>
    </div>
  );
}
