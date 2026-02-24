
import React from 'react';
import { ChefHat, Clock, Scan, MessageSquareText, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { PrepTimer } from './PrepTimer.tsx';

interface CounterViewProps {
  orders: Order[];
  updateStatus: (id: number, status: Order['status'], prepTime?: number) => void;
  onOpenScanner: (orderId: number) => void;
}

export const CounterView = ({ orders, updateStatus, onOpenScanner }: CounterViewProps) => {
  const [selectedPrepTimes, setSelectedPrepTimes] = React.useState<Record<number, number>>({});

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="text-left">
          <div className="flex items-center gap-4 mb-2">
            <ChefHat size={32} className="text-emerald-500" />
            <h2 className="text-4xl font-black tracking-tight">Kitchen Board</h2>
          </div>
          <p className="text-slate-400 font-medium">Real-time order management with Twilio SMS Alerts.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-md border border-white/5">
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'Placed' || o.status === 'Approved').length}</p>
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
          <div key={section} className="bg-white rounded-[2rem] border border-slate-200 p-6 h-fit shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">{section}</h3>
              <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] font-black">
                {orders.filter(o => o.status === section).length}
              </span>
            </div>
            
            <div className="space-y-4">
              {orders.filter(o => o.status === section).map(o => (
                <div key={o.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-black text-sm tracking-tight">ID #{o.id}</p>
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">{o.slot}</span>
                  </div>
                  <ul className="mb-4 text-xs text-slate-500 space-y-1">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span> {it.name} (x{it.quantity})
                      </li>
                    ))}
                  </ul>

                  {section === 'Placed' && (
                    <div className="mb-4">
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Est. Prep Time (mins)</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[2, 5, 10, 15].map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedPrepTimes(prev => ({ ...prev, [o.id]: time }))}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all ${
                              (selectedPrepTimes[o.id] || 5) === time 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {time}m
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {o.prepTime && section !== 'Placed' && (
                    <div className="mb-4">
                      <PrepTimer approvedAt={o.approvedAt} prepTime={o.prepTime} />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        if (section === 'Ready') {
                          onOpenScanner(o.id);
                        } else {
                          const nextStatus = section === 'Placed' ? 'Approved' : section === 'Approved' ? 'Preparing' : 'Ready';
                          const prepTime = section === 'Placed' ? (selectedPrepTimes[o.id] || 5) : undefined;
                          updateStatus(o.id, nextStatus, prepTime);
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
                    
                    <div className="flex items-center justify-center gap-1.5 opacity-60">
                      <MessageSquareText size={10} className="text-emerald-600" />
                      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">SMS Notification Armed</span>
                    </div>
                  </div>
                </div>
              ))}
              {orders.filter(o => o.status === section).length === 0 && (
                <div className="text-center py-12 opacity-10">
                  <Clock size={40} className="mx-auto" />
                  <p className="mt-2 text-[8px] font-black uppercase tracking-widest">Quiet Zone</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
