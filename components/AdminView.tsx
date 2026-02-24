
import React, { useState, useMemo } from 'react';
import { 
  Wallet, ShoppingBag, Zap, Clock, Plus, Trash2, Edit2, Check, X, 
  TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight,
  ChevronRight, Users, Package, AlertCircle, Save, Mail, UserPlus, CheckCircle2, Fingerprint,
  ShieldCheck, Loader2
} from 'lucide-react';
import { Order, MenuItem, TimeSlot } from '../types';

interface PendingUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  timestamp: string;
}

interface AdminViewProps {
  orders: Order[];
  menu: MenuItem[];
  timeSlots: TimeSlot[];
  pendingUsers: PendingUser[];
  onAddTimeSlot: (slot: Omit<TimeSlot, 'id' | 'currentOrders'>) => void;
  onUpdateTimeSlot: (id: string, updated: Partial<TimeSlot>) => void;
  onDeleteTimeSlot: (id: string) => void;
  onUpdateMenuStock: (id: number, newStock: number) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
}

export const AdminView = ({ 
  orders, menu, timeSlots, pendingUsers, 
  onAddTimeSlot, onUpdateTimeSlot, onDeleteTimeSlot, 
  onUpdateMenuStock, onApproveUser, onRejectUser 
}: AdminViewProps) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'users' | 'inventory' | 'slots'>('dashboard');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);

  const handleApprove = async (userId: string) => {
    setApprovingId(userId);
    try {
      await onApproveUser(userId);
    } finally {
      setApprovingId(null);
    }
  };
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-slate-200 w-fit">
        {(['dashboard', 'users', 'inventory', 'slots'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveAdminTab(tab)}
            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAdminTab === tab ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
            {tab === 'users' && pendingUsers.length > 0 && (
              <span className="ml-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[8px] animate-pulse">{pendingUsers.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeAdminTab === 'dashboard' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} trend="+12.4%" trendUp={true} icon={<Wallet size={24} />} color="emerald" />
            <StatCard title="Total Orders" value={orders.length.toString()} trend="+8.2%" trendUp={true} icon={<ShoppingBag size={24} />} color="blue" />
            <StatCard title="Pending Users" value={pendingUsers.length.toString()} trend="Action Required" icon={<Users size={24} />} color="orange" />
            <StatCard title="Active Slots" value={timeSlots.length.toString()} trend="Stable" trendUp={true} icon={<Clock size={24} />} color="purple" />
          </div>
        </div>
      )}

      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">User Approvals</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Verification required for {pendingUsers.length} registrations.</p>
            </div>
          </div>

          {pendingUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pendingUsers.map(u => (
                <div key={u.id} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col gap-6 group hover:border-emerald-300 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <UserPlus size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-xl leading-none mb-1">{u.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <Fingerprint size={12} />
                          <span>@{u.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <Mail size={16} className="text-slate-400" /> {u.email}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      disabled={approvingId === u.id}
                      onClick={() => handleApprove(u.id)}
                      className="flex-grow flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-black transition-all disabled:opacity-50"
                    >
                      {approvingId === u.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
                      {approvingId === u.id ? 'Granting...' : 'Grant Access'}
                    </button>
                    <button 
                      disabled={approvingId === u.id}
                      onClick={() => onRejectUser(u.id)}
                      className="px-6 flex items-center justify-center bg-white text-rose-500 border border-rose-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <ShieldCheck size={56} className="mx-auto text-slate-200 mb-4" />
              <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs">All clear!</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp, icon, color }: any) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
      <div className={`w-14 h-14 ${colorMap[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h4 className="text-4xl font-black text-slate-900 mb-4">{value}</h4>
      <div className={`flex items-center gap-1 text-[9px] font-black uppercase px-3 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
         {trend}
      </div>
    </div>
  );
};
