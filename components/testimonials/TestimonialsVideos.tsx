'use client';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { toast } from 'react-hot-toast';

const videos = [
  { id: 1, name: 'Arjun M.', location: 'Delhi', style: 'Intraday Options', cover: 'bg-gradient-to-br from-blue-100 to-blue-50' },
  { id: 2, name: 'Sneha R.', location: 'Bangalore', style: 'Swing Equities', cover: 'bg-gradient-to-br from-indigo-100 to-indigo-50' },
  { id: 3, name: 'Vikram K.', location: 'Mumbai', style: 'Algo Beginner', cover: 'bg-gradient-to-br from-purple-100 to-purple-50' },
];

export default function TestimonialsVideos() {
  const handlePlay = () => {
    toast('Video testimonials are coming soon!', { icon: '🎥' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text mb-4">Hear From Our Community</h2>
        <p className="text-slate-500">Watch full interviews with successful ApexQuant users.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="group relative rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer aspect-video bg-white" onClick={handlePlay}>
            <div className={`absolute inset-0 ${vid.cover} opacity-50 group-hover:opacity-70 transition-opacity`} />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <Play className="w-6 h-6 text-primary group-hover:text-white fill-current ml-1" />
              </div>
            </div>

            {/* User Info Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-12">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-bold text-white text-lg">{vid.name}</h4>
                  <p className="text-white/80 text-sm font-medium">{vid.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-white/20 text-white rounded uppercase tracking-wider backdrop-blur-sm">
                  {vid.style}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
