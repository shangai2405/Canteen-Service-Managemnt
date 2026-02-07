
import React, { useState, useMemo } from 'react';
import { 
  Wallet, ShoppingBag, Zap, Clock, Plus, Trash2, Edit2, Check, X, 
  TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight,
  ChevronRight, Users, Package, AlertCircle, Save
} from 'lucide-react';
import { Order, MenuItem, TimeSlot } from '../types';

interface AdminViewProps {
  orders: Order[];
  menu: MenuItem[];
  timeSlots: TimeSlot[];
  onAddTimeSlot: (slot: Omit<TimeSlot, 'id' | 'currentOrders'>) => void;
  onUpdateTimeSlot: (id: string, updated: Partial<TimeSlot>) => void;
  onDeleteTimeSlot: (id: string) => void;
  onUpdateMenuStock: (id: number, newStock: number) => void;
}

export const AdminView = ({ 
  orders, 
  menu, 
  timeSlots, 
  onAddTimeSlot, 
  onUpdateTimeSlot, 
  onDeleteTimeSlot,
  onUpdateMenuStock
}: AdminViewProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({ time: '', capacity: 20, cutoffTime: '' });
  const [editSlotValues, setEditSlotValues] = useState<Partial<TimeSlot>>({});
  
  // Inventory Edit State
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  // --- Analytics Logic ---
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const avgOrderValue = useMemo(() => orders.length ? Math.round(totalRevenue / orders.length) : 0, [totalRevenue, orders]);
  
  // Calculate category distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        counts[item.category] = (counts[item.category] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  // Mock revenue trend
  const revenueHistory = useMemo(() => {
    const factor = totalRevenue / 1000 || 1;
    return [45 * factor, 52 * factor, 38 * factor, 65 * factor, 48 * factor, 72 * factor, 55 * factor];
  }, [totalRevenue]);

  const resetAddForm = () => {
    setNewSlot({ time: '', capacity: 20, cutoffTime: '' });
    setIsAdding(false);
  };

  const handleStartEditStock = (item: MenuItem) => {
    setEditingStockId(item.id);
    setTempStock(item.stock);
  };

  const handleSaveStock = (id: number) => {
    onUpdateMenuStock(id, tempStock);
    setEditingStockId(null);
  };

  const handleStartEditSlot = (slot: TimeSlot) => {
    setEditingSlotId(slot.id);
    setEditSlotValues({ ...slot });
  };

  const handleSaveEditSlot = (id: string) => {
    onUpdateTimeSlot(id, editSlotValues);
    setEditingSlotId(null);
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm("Are you sure you want to delete this pickup slot?")) {
      onDeleteTimeSlot(id);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          trend="+12.4%" 
          trendUp={true} 
          icon={<Wallet className="text-emerald-600" size={24} />} 
          color="emerald"
        />
        <StatCard 
          title="Total Orders" 
          value={orders.length.toString()} 
          trend="+8.2%" 
          trendUp={true} 
          icon={<ShoppingBag className="text-blue-600" size={24} />} 
          color="blue"
        />
        <StatCard 
          title="Avg. Ticket" 
          value={`₹${avgOrderValue}`} 
          trend="-2.1%" 
          trendUp={false} 
          icon={<TrendingUp className="text-orange-600" size={24} />} 
          color="orange"
        />
        <StatCard 
          title="Active Slots" 
          value={timeSlots.length.toString()} 
          trend="Stable" 
          trendUp={true} 
          icon={<Clock className="text-purple-600" size={24} />} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Revenue Stream</h3>
              <p className="text-sm text-slate-400 font-medium">Daily transaction volume (Last 7 Days)</p>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {revenueHistory.map((val, i) => (
              <div key={i} className="flex-grow flex flex-col items-center gap-4 group">
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                   <div 
                    className="w-full max-w-[40px] bg-emerald-100 rounded-t-2xl group-hover:bg-emerald-500 transition-all duration-500 relative cursor-pointer" 
                    style={{ height: `${(val / Math.max(...revenueHistory)) * 100}%` }}
                   >
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                       ₹{Math.round(val)}
                     </div>
                   </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Categories</h3>
          <p className="text-sm text-slate-400 font-medium mb-8">Sales by food group</p>
          
          <div className="space-y-6">
            {categoryData.length > 0 ? categoryData.map(([cat, val]) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{cat.replace('_', ' ')}</span>
                  <span className="text-xs font-black text-emerald-600">₹{val}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(val / totalRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 opacity-20">
                <PieChart size={48} className="mx-auto" />
                <p className="mt-2 font-black text-xs uppercase">No Data Yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Monitor Section */}
      <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
         <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Package className="text-slate-900" size={24} />
              <div>
                <h3 className="text-2xl font-black text-slate-900">Inventory Monitor</h3>
                <p className="text-sm text-slate-400 font-medium">Real-time stock availability. Click edit to adjust.</p>
              </div>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.sort((a, b) => a.stock - b.stock).map(item => (
              <div key={item.id} className={`p-6 rounded-2xl border transition-all group relative ${item.stock < 10 ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-slate-900">{item.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingStockId === item.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleSaveStock(item.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setEditingStockId(null)} className="p-1.5 bg-slate-200 text-slate-500 rounded-lg hover:bg-slate-300 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleStartEditStock(item)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-lg transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {item.stock < 5 && editingStockId !== item.id && <AlertCircle className="text-orange-500" size={18} />}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Available Stock</span>
                    {editingStockId === item.id ? (
                      <input 
                        type="number" 
                        autoFocus
                        className="w-20 bg-white border-2 border-emerald-500 rounded-lg px-2 py-1 text-xl font-black text-slate-900 outline-none"
                        value={tempStock}
                        onChange={e => setTempStock(parseInt(e.target.value) || 0)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveStock(item.id)}
                      />
                    ) : (
                      <span className={`text-2xl font-black ${item.stock < 10 ? 'text-orange-600' : 'text-slate-900'}`}>{item.stock}</span>
                    )}
                  </div>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.stock < 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </div>

      {/* Time Slot Mgmt (Refined) */}
      <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Pickup Logistics</h3>
            <p className="text-sm text-slate-400 font-medium">Manage traffic flow and cut-off points.</p>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10"
            >
              <Plus size={16} /> New Slot
            </button>
          )}
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-6">
                <th className="pb-6 pl-4">Time Window</th>
                <th className="pb-6">Current Load</th>
                <th className="pb-6">Cut-off Point</th>
                <th className="pb-6 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isAdding && (
                <tr className="bg-emerald-50/50 animate-in slide-in-from-left-4 duration-300">
                  <td className="py-6 pl-4">
                    <input 
                      autoFocus
                      className="border border-slate-200 p-3 rounded-xl text-sm w-full max-w-[150px] outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                      placeholder="e.g. 1:00 PM" 
                      value={newSlot.time} 
                      onChange={e => setNewSlot({...newSlot, time: e.target.value})}
                    />
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        className="border border-slate-200 p-3 rounded-xl text-sm w-20 outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                        value={newSlot.capacity} 
                        onChange={e => setNewSlot({...newSlot, capacity: parseInt(e.target.value) || 0})}
                      />
                      <span className="text-xs font-bold text-slate-400">max</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <input 
                      className="border border-slate-200 p-3 rounded-xl text-sm w-full max-w-[150px] outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                      placeholder="e.g. 12:30 PM" 
                      value={newSlot.cutoffTime} 
                      onChange={e => setNewSlot({...newSlot, cutoffTime: e.target.value})}
                    />
                  </td>
                  <td className="py-6 pr-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { if(newSlot.time) { onAddTimeSlot(newSlot); resetAddForm(); } }} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all"><Check size={20}/></button>
                      <button onClick={resetAddForm} className="p-3 bg-white text-slate-400 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"><X size={20}/></button>
                    </div>
                  </td>
                </tr>
              )}
              {timeSlots.map(slot => (
                <tr key={slot.id} className="group hover:bg-slate-50/80 transition-colors">
                  {editingSlotId === slot.id ? (
                    <>
                      <td className="py-6 pl-4">
                        <input 
                          autoFocus
                          className="border border-emerald-500 border-2 p-3 rounded-xl text-sm w-full max-w-[150px] outline-none font-black text-slate-900" 
                          value={editSlotValues.time || ''} 
                          onChange={e => setEditSlotValues({...editSlotValues, time: e.target.value})}
                        />
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            className="border border-emerald-500 border-2 p-3 rounded-xl text-sm w-20 outline-none font-black text-slate-900" 
                            value={editSlotValues.capacity || 0} 
                            onChange={e => setEditSlotValues({...editSlotValues, capacity: parseInt(e.target.value) || 0})}
                          />
                          <span className="text-xs font-bold text-slate-400">max</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <input 
                          className="border border-emerald-500 border-2 p-3 rounded-xl text-sm w-full max-w-[150px] outline-none font-black text-slate-900" 
                          value={editSlotValues.cutoffTime || ''} 
                          onChange={e => setEditSlotValues({...editSlotValues, cutoffTime: e.target.value})}
                        />
                      </td>
                      <td className="py-6 pr-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSaveEditSlot(slot.id)} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all"><Check size={20}/></button>
                          <button onClick={() => setEditingSlotId(null)} className="p-3 bg-white text-slate-400 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"><X size={20}/></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-6 pl-4 font-black text-slate-900 text-lg">{slot.time}</td>
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${slot.currentOrders >= slot.capacity ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${(slot.currentOrders / slot.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-slate-500">{slot.currentOrders}/{slot.capacity}</span>
                        </div>
                      </td>
                      <td className="py-6 text-slate-400 font-bold flex items-center gap-2">
                        <Clock size={14} /> {slot.cutoffTime}
                      </td>
                      <td className="py-6 pr-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleStartEditSlot(slot)} 
                            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                          >
                            <Edit2 size={16}/>
                          </button>
                          <button 
                            onClick={() => handleDeleteSlot(slot.id)} 
                            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {timeSlots.length === 0 && !isAdding && (
            <div className="py-20 text-center opacity-30">
              <Calendar size={48} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">No active pickup slots</p>
            </div>
          )}
        </div>
      </div>
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
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 ${colorMap[color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <h4 className="text-4xl font-black text-slate-900 mb-1">{value}</h4>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    </div>
  );
};
