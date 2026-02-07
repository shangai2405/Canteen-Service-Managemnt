
import React from 'react';
import { History, QrCode } from 'lucide-react';
// Fix: Import from shared types module
import { Order } from '../types';
import { OrderStatusTracker } from './OrderStatusTracker.tsx';

interface OrdersViewProps {
  orders: Order[];
  onShowQR: (order: Order) => void;
}

export const OrdersView = ({ orders, onShowQR }: OrdersViewProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
          <History size={40} />
        </div>
        <h4 className="font-black text-lg">No active orders</h4>
        <p className="text-slate-400 text-sm mt-2">Place an order from the menu to see it here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {orders.map(o => (
        <div key={o.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
          <div className="p-8 border-b border-slate-50 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Pick up: {o.slot}</p>
              <h4 className="text-2xl font-black">Order ID #{o.id}</h4>
              <p className="text-xs text-slate-400 font-medium mt-1">{o.items.length} items • {o.timestamp}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Ref: {o.paymentId}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="bg-emerald-50 px-5 py-3 rounded-2xl text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-0.5 tracking-widest">Paid</p>
                <p className="text-xl font-black text-emerald-700">₹{o.total}</p>
              </div>
              {o.status === 'Ready' && (
                <button 
                  onClick={() => onShowQR(o)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all active:scale-95"
                >
                  <QrCode size={14} /> Pickup QR
                </button>
              )}
            </div>
          </div>
          <div className="bg-slate-50/50 p-6">
            <OrderStatusTracker status={o.status} />
          </div>
        </div>
      ))}
    </div>
  );
};
