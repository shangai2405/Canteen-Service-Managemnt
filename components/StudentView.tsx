
import React, { useState, useMemo } from 'react';
import { TrendingUp, Zap, Clock, Utensils, Coffee, Pizza, Soup, LayoutGrid, Plus, Flame, Dumbbell, Sparkles, Leaf, Dessert } from 'lucide-react';
import { MenuItem } from '../types';

interface StudentViewProps {
  menu: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onOpenBot: () => void;
}

type MenuTab = 'all' | 'popular' | 'South Indian' | 'Mains' | 'Beverages' | 'Healthy' | 'Desserts';

export const StudentView = ({ menu, onAddToCart, onOpenBot }: StudentViewProps) => {
  const [activeTab, setActiveTab] = useState<MenuTab>('all');

  const filteredMenu = useMemo(() => {
    if (activeTab === 'all') return menu;
    // Strictly only show items with popularity > 200 (Best Sellers)
    if (activeTab === 'popular') return menu.filter(item => item.popularity > 200);
    return menu.filter(item => item.category === activeTab);
  }, [menu, activeTab]);

  const tabs: { id: MenuTab, label: string, icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <LayoutGrid size={14} /> },
    { id: 'popular', label: 'Best Sellers', icon: <Zap size={14} /> },
    { id: 'South Indian', label: 'South Indian', icon: <Soup size={14} /> },
    { id: 'Mains', label: 'Mains', icon: <Pizza size={14} /> },
    { id: 'Healthy', label: 'Healthy', icon: <Leaf size={14} /> },
    { id: 'Desserts', label: 'Desserts', icon: <Dessert size={14} /> },
    { id: 'Beverages', label: 'Beverages', icon: <Coffee size={14} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Nutri-Bot Promo Banner */}
      <div 
        onClick={onOpenBot}
        className="group relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 transition-all border border-slate-800"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-lg animate-pulse">
              <Sparkles size={32} />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight">Meet Nutri-Bot AI</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Get personalized recommendations based on calories & protein goals.</p>
            </div>
          </div>
          <button className="px-8 py-3.5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
            Start Chatting
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col group relative">
            {item.popularity > 200 && (
              <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-orange-500/20 animate-pulse">
                <Zap size={10} fill="currentColor" /> Best Seller
              </div>
            )}
            <div className="h-48 overflow-hidden relative">
               <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-xl font-black text-emerald-700 text-xs shadow-sm">₹{item.price}</div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                <span className="text-[8px] font-black uppercase text-slate-300 tracking-tighter">{item.category}</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-5 line-clamp-2 leading-relaxed">{item.description}</p>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[9px] font-black uppercase tracking-widest mb-6">
                <span className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  <Clock size={10} /> Fast
                </span>
                <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg">
                  <Flame size={10} /> {item.calories} kcal
                </span>
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                  <Dumbbell size={10} /> {item.protein} Protein
                </span>
              </div>

              <button 
                onClick={() => onAddToCart(item)} 
                className="mt-auto w-full py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-600/10"
              >
                <Plus size={14} /> Add to Basket
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <Utensils size={40} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No items found in this category</p>
        </div>
      )}
    </div>
  );
};
