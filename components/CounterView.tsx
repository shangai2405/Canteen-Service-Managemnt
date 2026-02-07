
import React from 'react';
import { ChefHat, Clock, Scan } from 'lucide-react';
// Fix: Import from shared types module
import { Order } from '../types';

interface CounterViewProps {
  orders: Order[];
  updateStatus: (id: number, status: Order['status']) => void;
  onOpenScanner: () => void;
}

export const CounterView = ({ orders, updateStatus, onOpenScanner }: CounterViewProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="text-left">
          <h2 className="text-4xl font-black tracking-tight mb-2">Kitchen Board</h2>
          <p className="text-slate-400 font-medium">Real-time order management system.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-md border border-white/5">
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Placed').length}</p>
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mt-1">Pending</p>
          </div>
          <div className="bg-emerald-500 px-6 py-4 rounded-3xl shadow-lg shadow-emerald-500/20">
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Preparing').length}</p>
            <p className="text-[10px] font-black uppercase text-emerald-100 tracking-widest mt-1">Cooking</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {['Placed', 'Approved', 'Preparing', 'Ready'].map(section => (
          <div key={section} className="bg-white rounded-[2rem] border border-slate-200 p-6 h-fit shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">{section}</h3>
              <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] font-black">{orders.filter(o => o.status === section).length}</span>
            </div>
            <div className="space-y-4">
              {orders.filter(o => o.status === section).map(o => (
                <div key={o.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-black text-sm tracking-tight">ID #{o.id}</p>
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">{o.slot}</span>
                  </div>
                  <ul className="mb-4 text-xs text-slate-500 space-y-1">
                    {o.items.map((it, i) => <li key={i} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span> {it.name}</li>)}
                  </ul>
                  <button 
                    onClick={() => {
                      if (section === 'Ready') {
                        onOpenScanner();
                      } else {
                        updateStatus(o.id, section === 'Placed' ? 'Approved' : section === 'Approved' ? 'Preparing' : 'Ready');
                      }
                    }}
                    className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all ${
                      section === 'Ready' 
                        ? 'bg-slate-900 text-white hover:bg-black shadow-slate-900/10' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                    }`}
                  >
                    {section === 'Ready' && <Scan size={14} />}
                    {section === 'Placed' ? 'Approve' : section === 'Approved' ? 'Cook' : section === 'Preparing' ? 'Done' : 'Scan to Collect'}
                  </button>
                </div>
              ))}
              {orders.filter(o => o.status === section).length === 0 && (
                <div className="text-center py-10 opacity-20">
                  <Clock size={32} className="mx-auto" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
