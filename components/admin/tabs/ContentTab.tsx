import React, { useState } from 'react';
import { LayoutTemplate, Plus, Search, Edit2, Trash2, MoreVertical, FileText, Image as ImageIcon } from 'lucide-react';
import { mockTemplates } from '@/lib/mockTemplates';

export function ContentTab() {
  const [activeSubTab, setActiveSubTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = mockTemplates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveSubTab('templates')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutTemplate className="w-4 h-4" /> Strategy Templates
        </button>
        <button 
          onClick={() => setActiveSubTab('blog')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === 'blog' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FileText className="w-4 h-4" /> Blog & News
        </button>
      </div>

      {activeSubTab === 'templates' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm"
              />
            </div>
            
            <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Template
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden group">
                <div className="p-5 border-b border-border bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{template.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{template.category} • {template.instrument}</p>
                  </div>
                  <div className="relative group/dropdown">
                    <button className="p-2 -mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-border overflow-hidden opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 font-medium">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-loss hover:bg-loss/5 flex items-center gap-2 font-medium border-t border-border">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${
                      template.difficulty === 'Beginner' ? 'bg-success/10 text-success' :
                      template.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {template.difficulty}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{template.metrics.winRate} Win Rate</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{template.description}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Return</p>
                      <p className="text-sm font-bold text-success">{template.metrics.avgReturn}</p>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Trades/Mo</p>
                      <p className="text-sm font-bold text-slate-700">{template.metrics.tradesPerMonth}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'blog' && (
        <div className="text-center py-20 bg-white rounded-2xl border border-border shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Blog Management</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Create and manage platform updates, trading tutorials, and market news.</p>
          <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Post
          </button>
        </div>
      )}
    </div>
  );
}
