
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PrepTimer } from './PrepTimer.tsx';

export const OrderStatusTracker = ({ status, prepTime, approvedAt }: { status: string, prepTime?: number, approvedAt?: string }) => {
  const steps = ['Placed', 'Approved', 'Preparing', 'Ready', 'Collected'];
  const currentIndex = steps.indexOf(status);
  
  return (
    <div className="space-y-4">
      <div className="relative flex justify-between items-center w-full py-6 px-4">
        <div className="absolute top-[38px] left-8 right-8 h-[2px] bg-slate-100 z-0"></div>
        <div 
          className="absolute top-[38px] left-8 h-[2px] bg-emerald-500 z-1 transition-all duration-700"
          style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 4rem)` }}
        ></div>
        {steps.map((step, idx) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              idx <= currentIndex ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-300'
            }`}>
              {idx < currentIndex ? <CheckCircle2 size={18} /> : <span className="text-xs font-bold">{idx + 1}</span>}
            </div>
            <span className={`mt-3 text-[10px] font-black uppercase tracking-tighter ${idx <= currentIndex ? 'text-emerald-700' : 'text-slate-400'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      {prepTime && (status === 'Approved' || status === 'Preparing') && (
        <div className="flex flex-col items-center gap-2">
          <PrepTimer approvedAt={approvedAt} prepTime={prepTime} />
          <div className="flex items-center justify-center gap-2 bg-emerald-50/50 py-2 px-4 rounded-2xl border border-emerald-100/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Chef is working on it</p>
          </div>
        </div>
      )}
    </div>
  );
};
