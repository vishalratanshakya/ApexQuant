'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { mockTemplates, StrategyTemplate, TemplateCategory, TemplateDifficulty, InstrumentType } from '@/lib/mockTemplates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplateFilters } from '@/components/templates/TemplateFilters';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { Library, Flame } from 'lucide-react';

export default function StrategyTemplatesPage() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<TemplateDifficulty | 'All'>('All');
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | 'All'>('All');
  
  const [previewTemplate, setPreviewTemplate] = useState<StrategyTemplate | null>(null);

  const handleUseTemplate = (template: StrategyTemplate) => {
    toast.success(`Cloning ${template.name}...`);
    // Simulate cloning process delay
    setTimeout(() => {
      toast.success('Strategy cloned successfully!');
      router.push(`/dashboard/builder?templateId=${template.id}`);
    }, 800);
  };

  // Filter logic
  const filteredTemplates = mockTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || t.difficulty === selectedDifficulty;
    const matchesInstrument = selectedInstrument === 'All' || t.instrument === selectedInstrument;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesInstrument;
  });

  const trendingTemplates = filteredTemplates.filter(t => t.trending);
  const regularTemplates = filteredTemplates.filter(t => !t.trending);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <Library className="w-6 h-6 text-primary" /> Strategy Templates
          </h1>
          <p className="text-sm text-text-light">Browse, preview, and clone high-performance trading strategies to your portfolio.</p>
        </div>
      </div>

      <TemplateFilters 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty}
        selectedInstrument={selectedInstrument} setSelectedInstrument={setSelectedInstrument}
      />

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-border shadow-sm">
           <Library className="w-12 h-12 mx-auto text-slate-300 mb-4" />
           <h3 className="text-lg font-bold text-slate-700">No templates found</h3>
           <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
           <button 
             onClick={() => {
               setSearchQuery('');
               setSelectedCategory('All');
               setSelectedDifficulty('All');
               setSelectedInstrument('All');
             }}
             className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
           >
             Clear Filters
           </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Trending Section */}
          {trendingTemplates.length > 0 && selectedCategory === 'All' && selectedDifficulty === 'All' && selectedInstrument === 'All' && !searchQuery && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-lg font-bold text-text">Popular & Trending</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onPreview={setPreviewTemplate} 
                    onUseTemplate={handleUseTemplate} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Templates Section */}
          <div>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text">
                  {searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'All Templates'}
                </h2>
                <span className="text-sm font-bold text-slate-400">{filteredTemplates.length} templates</span>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedInstrument !== 'All' ? filteredTemplates : regularTemplates).map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onPreview={setPreviewTemplate} 
                    onUseTemplate={handleUseTemplate} 
                  />
                ))}
             </div>
          </div>
        </div>
      )}

      <TemplatePreviewModal 
        template={previewTemplate} 
        onClose={() => setPreviewTemplate(null)} 
        onUseTemplate={handleUseTemplate} 
      />
    </div>
  );
}
