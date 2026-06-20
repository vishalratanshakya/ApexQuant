'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { TemplateCategory, TemplateDifficulty, InstrumentType } from '@/lib/mockTemplates';

interface TemplateFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: TemplateCategory | 'All';
  setSelectedCategory: (c: TemplateCategory | 'All') => void;
  selectedDifficulty: TemplateDifficulty | 'All';
  setSelectedDifficulty: (d: TemplateDifficulty | 'All') => void;
  selectedInstrument: InstrumentType | 'All';
  setSelectedInstrument: (i: InstrumentType | 'All') => void;
}

export function TemplateFilters({
  searchQuery, setSearchQuery,
  selectedCategory, setSelectedCategory,
  selectedDifficulty, setSelectedDifficulty,
  selectedInstrument, setSelectedInstrument
}: TemplateFiltersProps) {
  
  const categories: (TemplateCategory | 'All')[] = ['All', 'Momentum', 'Mean Reversion', 'Options', 'Intraday', 'Swing', 'Trend Following'];
  const difficulties: (TemplateDifficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const instruments: (InstrumentType | 'All')[] = ['All', 'NIFTY', 'BANKNIFTY', 'FINNIFTY', 'Stocks', 'Commodities'];

  return (
    <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center mb-8">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search templates (e.g. Straddle, Trend, Nifty)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors"
        />
      </div>

      <div className="w-px h-8 bg-slate-200 hidden md:block" />

      {/* Filters */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        <div className="flex items-center gap-2 text-slate-500 shrink-0">
          <Filter className="w-4 h-4" /> <span className="text-sm font-bold">Filters:</span>
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-primary shrink-0"
        >
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>

        <select 
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-primary shrink-0"
        >
          {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>)}
        </select>

        <select 
          value={selectedInstrument}
          onChange={(e) => setSelectedInstrument(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-primary shrink-0"
        >
          {instruments.map(i => <option key={i} value={i}>{i === 'All' ? 'All Instruments' : i}</option>)}
        </select>
      </div>
    </div>
  );
}
