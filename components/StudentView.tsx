
import React from 'react';
import { Search, TrendingUp, Zap, Clock } from 'lucide-react';
// Fix: Import from shared types module
import { MenuItem } from '../types';

interface StudentViewProps {
  menu: MenuItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddToCart: (item: MenuItem) => void;
  trendingItems: MenuItem[];
}

export const StudentView = ({ menu, searchQuery, setSearchQuery, onAddToCart, trendingItems }: StudentViewProps) => {
  return (
    <div className="space-y-12">
      {!searchQuery && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-orange-500" />
            <h3 className="text-xl font-black">Trending Now</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingItems.map(item => (
              <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => onAddToCart(item)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg">
                    <Zap size={12} fill="currentColor" /> Popular
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-emerald-700 shadow-xl">₹{item.price}</div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-lg mb-1">{item.name}</h4>
                  <p className="text-slate-400 text-xs font-medium mb-4 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={12} /> Fast Prep</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{item.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xl font-black mb-6">Full Menu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:border-emerald-500/50 transition-all">
              <div className="relative h-40">
                <img src={item.image} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 px-2.5 py-1 rounded-lg font-black text-xs shadow-sm">₹{item.price}</div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                <p className="text-[10px] text-slate-400 mb-4 line-clamp-1">{item.description}</p>
                <button 
                  onClick={() => onAddToCart(item)} 
                  className="mt-auto w-full py-2.5 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-900 rounded-xl text-xs font-black transition-all active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
