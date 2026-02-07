
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Utensils, ShoppingBag, Sparkles, Search, User, ChefHat, BarChart3, 
  ArrowRight, Loader2, Zap, Clock, Wallet, X, ChevronRight, Flame, 
  Plus, Minus, Activity, TrendingUp, Check, ShieldCheck, ArrowUpRight, 
  Coffee, Leaf, Dumbbell, History, CreditCard, Smartphone, Trash2,
  Banknote, ExternalLink, Landmark, Pizza, Soup, Dessert, AlertTriangle, Edit2,
  QrCode, Scan, Package, Filter, ChevronDown, LogOut
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Role, MenuItem, CartItem, TimeSlot, Order } from './types';
import { CartDrawer, AIAssistant, PaymentGateway, QRModal, ScannerModal } from './components/Modals';
import { OrdersView } from './components/OrdersView';
import { CounterView } from './components/CounterView';
import { AdminView } from './components/AdminView';
import { LoginScreen } from './components/LoginScreen';

// ==========================================
// 1. MOCK DATA
// ==========================================

const INITIAL_MENU: MenuItem[] = [
  { id: 1, name: 'Plain Dosa', category: 'south_indian', price: 60, calories: 180, protein: '4g', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600', description: 'Traditional crispy rice and lentil crepe served with sambar and chutney.', popularity: 85, stock: 40 },
  { id: 2, name: 'Masala Dosa', category: 'south_indian', price: 90, calories: 310, protein: '6g', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600', description: 'Crispy dosa stuffed with a spicy tempered potato filling.', popularity: 150, stock: 35 },
  { id: 3, name: 'Egg Dosa', category: 'south_indian', price: 110, calories: 350, protein: '12g', image: 'https://images.unsplash.com/photo-1632233035043-7e974b702524?auto=format&fit=crop&q=80&w=600', description: 'Fresh dosa topped with a layer of seasoned egg and spices.', popularity: 110, stock: 20 },
  { id: 4, name: 'Idli Sambar (2 pcs)', category: 'south_indian', price: 50, calories: 120, protein: '5g', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600', description: 'Steam fermented rice cakes served with hot lentil soup.', popularity: 200, stock: 50 },
  { id: 5, name: 'Medu Vada (2 pcs)', category: 'south_indian', price: 55, calories: 280, protein: '4g', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600', description: 'Crispy fried savory donuts made of urad dal.', popularity: 180, stock: 30 },
  { id: 8, name: 'Chicken Biriyani', category: 'mains', price: 220, calories: 580, protein: '24g', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600', description: 'Aromatic basmati rice cooked with premium chicken and spices.', popularity: 300, stock: 25 },
  { id: 9, name: 'Veg Pulao', category: 'mains', price: 150, calories: 320, protein: '8g', image: 'https://images.unsplash.com/photo-1567333324141-7c307e600508?auto=format&fit=crop&q=80&w=600', description: 'Fragrant basmati rice cooked with mixed vegetables and mild spices.', popularity: 95, stock: 30 },
  { id: 15, name: 'Paneer Butter Masala', category: 'mains', price: 180, calories: 390, protein: '14g', image: 'https://images.unsplash.com/photo-1596797038558-9570a5943519?auto=format&fit=crop&q=80&w=600', description: 'Cottage cheese cubes in a creamy and slightly sweet gravy.', popularity: 150, stock: 15 },
  { id: 20, name: 'Pani Puri', category: 'snacks', price: 60, calories: 120, protein: '2g', image: 'https://images.unsplash.com/photo-1601050638917-3f80fc01d3bb?auto=format&fit=crop&q=80&w=600', description: 'The ultimate street snack with spicy mint water.', popularity: 210, stock: 60 },
  { id: 21, name: 'Bread Omelette', category: 'snacks', price: 75, calories: 340, protein: '12g', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600', description: 'Egg omelette sandwiched between toasted bread slices.', popularity: 140, stock: 20 },
  { id: 23, name: 'Masala Tea', category: 'beverages', price: 25, calories: 60, protein: '1g', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=600', description: 'Hand-brewed tea with milk, ginger, and cardamom.', popularity: 350, stock: 100 },
  { id: 24, name: 'Filter Coffee', category: 'beverages', price: 35, calories: 80, protein: '1g', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a4f?auto=format&fit=crop&q=80&w=600', description: 'Traditional South Indian frothy coffee.', popularity: 200, stock: 80 },
  { id: 25, name: 'Watermelon Juice', category: 'beverages', price: 45, calories: 90, protein: '1g', image: 'https://images.unsplash.com/photo-1562158074-27926c07340d?auto=format&fit=crop&q=80&w=600', description: 'Freshly pressed watermelon juice, served chilled.', popularity: 160, stock: 25 },
];

const INITIAL_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '12:00 PM', capacity: 20, cutoffTime: '11:00 AM', currentOrders: 12 },
  { id: '2', time: '12:15 PM', capacity: 20, cutoffTime: '11:15 AM', currentOrders: 5 },
  { id: '3', time: '12:30 PM', capacity: 20, cutoffTime: '11:30 AM', currentOrders: 8 },
  { id: '4', time: '12:45 PM', capacity: 20, cutoffTime: '11:45 AM', currentOrders: 2 },
];

const CATEGORIES = [
  { label: 'All Items', value: 'all' },
  { label: 'South Indian', value: 'south_indian' },
  { label: 'Mains', value: 'mains' },
  { label: 'Snacks', value: 'snacks' },
  { label: 'Beverages', value: 'beverages' },
];

// ==========================================
// 4. MAIN APP
// ==========================================

const App = () => {
  const [user, setUser] = useState<{ role: Role, name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Modals for QR
  const [qrOrder, setQrOrder] = useState<Order | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('sc_user_v2');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedOrders = localStorage.getItem('sc_orders_v2');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedSlots = localStorage.getItem('sc_slots_v2');
    if (savedSlots) setTimeSlots(JSON.parse(savedSlots));
    
    const savedMenu = localStorage.getItem('sc_menu_v2');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('sc_user_v2', JSON.stringify(user));
    else localStorage.removeItem('sc_user_v2');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sc_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sc_slots_v2', JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('sc_menu_v2', JSON.stringify(menu));
  }, [menu]);

  const handleLogin = (usernameInput: string, passwordInput: string) => {
    setIsLoading(true);
    setLoginError(null);

    // Simple validation for demo
    setTimeout(() => {
      const u = usernameInput.toLowerCase();
      const p = passwordInput;

      if (u === 'student' && p === '123') {
        setUser({ role: 'student', name: 'Alex Student' });
      } else if (u === 'counter' && p === '123') {
        setUser({ role: 'counter', name: 'Kitchen Lead' });
      } else if (u === 'admin' && p === '123') {
        setUser({ role: 'admin', name: 'Canteen Manager' });
      } else {
        setLoginError('Invalid username or password. Use "student/123", "counter/123", or "admin/123".');
      }
      setIsLoading(false);
      setActiveTab('menu');
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setSelectedSlotId(null);
    setLoginError(null);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          alert(`Sorry, only ${item.stock} units of ${item.name} are available.`);
          return prev;
        }
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      if (item.stock <= 0) {
        alert("This item is currently out of stock.");
        return prev;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleInitiatePayment = () => {
    if (!selectedSlotId || cart.length === 0) return;
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (method: string) => {
    const slot = timeSlots.find(s => s.id === selectedSlotId);
    if (!slot) return;

    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const newOrder: Order = {
      id: Math.floor(Math.random() * 9000) + 1000,
      userId: 'STU_001',
      total: total,
      slot: slot.time,
      status: 'Placed',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      paymentMethod: method,
      paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentStatus: 'Success'
    };

    // Deduct Stock
    setMenu(prev => prev.map(m => {
      const cartItem = cart.find(ci => ci.id === m.id);
      if (cartItem) {
        return { ...m, stock: Math.max(0, m.stock - cartItem.quantity) };
      }
      return m;
    }));

    setOrders([newOrder, ...orders]);
    setTimeSlots(prev => prev.map(s => s.id === selectedSlotId ? { ...s, currentOrders: s.currentOrders + 1 } : s));
    setCart([]);
    setSelectedSlotId(null);
    setIsCartOpen(false);
    setIsPaymentOpen(false);
    setActiveTab('orders');
  };

  const handleUpdateStatus = (id: number, nextStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  const handleScanSuccess = (data: string) => {
    const prefix = "SMART_CANTEEN_ORDER_ID_";
    if (data.startsWith(prefix)) {
      const orderId = parseInt(data.replace(prefix, ""));
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        if (order.status === 'Ready') {
          handleUpdateStatus(orderId, 'Collected');
          setIsScannerOpen(false);
          alert(`Success! Order #${orderId} verified and closed.`);
        } else if (order.status === 'Collected') {
          alert(`Order #${orderId} was already collected.`);
        } else {
          alert(`Order #${orderId} is not ready for pickup yet (Current Status: ${order.status}).`);
        }
      } else {
        alert("Order not found in the system.");
      }
    } else {
      alert("Invalid QR Code for SmartCanteen.");
    }
  };

  // --- Admin Logic Handlers ---
  const handleAddTimeSlot = (slot: Omit<TimeSlot, 'id' | 'currentOrders'>) => {
    const newId = (Date.now()).toString();
    const newSlotItem: TimeSlot = { ...slot, id: newId, currentOrders: 0 };
    setTimeSlots(prev => [...prev, newSlotItem]);
  };

  const handleUpdateTimeSlot = (id: string, updated: Partial<TimeSlot>) => {
    setTimeSlots(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const handleDeleteTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateMenuStock = (id: number, newStock: number) => {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, stock: newStock } : m));
  };

  const askAi = async (prompt: string) => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: Canteen menu has Dosas, Biriyani, Snacks, and Tea. Suggest a healthy option or nutrition tip. User says: ${prompt}`,
      });
      setAiResponse(response.text);
    } catch (e) {
      setAiResponse("I'm having trouble connecting, but the Masala Tea with ginger is excellent for focus!");
    } finally {
      setAiLoading(false);
    }
  };

  const cartTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  // Filtered menu logic
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menu, searchQuery, selectedCategory]);

  if (!user) {
    return <LoginScreen onLogin={handleLogin} isLoading={isLoading} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter'] selection:bg-emerald-100 selection:text-emerald-900">
      <header className="sticky top-0 z-[60] bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('menu')}>
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <Utensils size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900">SmartCanteen</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Kitchen</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <p className="text-xs font-black text-slate-900 leading-none mb-1">{user.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user.role}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all flex items-center gap-2 group"
            title="Logout"
          >
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest group-hover:text-rose-600 transition-colors">Logout</span>
            <LogOut size={20} />
          </button>

          {user.role === 'counter' && (
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all active:scale-95"
            >
              <Scan size={18} /> Scan Pickup
            </button>
          )}
          
          {user.role === 'student' && (
            <button onClick={() => setIsAiOpen(true)} className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
              <Sparkles size={20}/>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-8 flex-grow">
        {user.role === 'student' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-slate-200">
                <button onClick={() => setActiveTab('menu')} className={`px-10 py-4 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'menu' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Menu</button>
                <button onClick={() => setActiveTab('orders')} className={`px-10 py-4 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Orders</button>
              </div>
              
              {activeTab === 'menu' && (
                <div className="flex flex-col md:flex-row gap-4 items-center flex-grow w-full animate-in slide-in-from-top-4 duration-300">
                  <div className="relative flex-grow w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="text" 
                      placeholder="Hungry for something specific?" 
                      className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="relative w-full md:w-auto min-w-[180px]">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Filter size={18} />
                    </div>
                    <select 
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full pl-12 pr-10 py-5 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {activeTab === 'menu' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredMenu.map(item => (
                  <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-xl transition-all flex flex-col relative">
                    {item.stock <= 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center p-6 text-center">
                         <div className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20">Out of Stock</div>
                      </div>
                    )}
                    <div className="relative h-48">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-xl font-black text-emerald-700 shadow-sm">₹{item.price}</div>
                      {item.stock > 0 && item.stock < 10 && (
                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter animate-pulse">Low Stock: {item.stock} left</div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.category.replace('_', ' ')}</p>
                      <h3 className="font-black text-lg text-slate-900 mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={item.stock <= 0}
                        className="mt-auto w-full py-3 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {item.stock <= 0 ? 'Unavailable' : 'Add to Basket'}
                      </button>
                    </div>
                  </div>
                ))}
                {filteredMenu.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Search size={40} />
                    </div>
                    <h4 className="font-black text-lg">No matches found</h4>
                    <p className="text-slate-400 text-sm mt-2">Try adjusting your search or category filter.</p>
                  </div>
                )}
              </div>
            ) : (
              <OrdersView orders={orders} onShowQR={(o) => setQrOrder(o)} />
            )}
          </div>
        )}

        {user.role === 'counter' && (
          <CounterView 
            orders={orders} 
            updateStatus={handleUpdateStatus} 
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {user.role === 'admin' && (
          <AdminView 
            orders={orders}
            menu={menu}
            timeSlots={timeSlots}
            onAddTimeSlot={handleAddTimeSlot}
            onUpdateTimeSlot={handleUpdateTimeSlot}
            onDeleteTimeSlot={handleDeleteTimeSlot}
            onUpdateMenuStock={handleUpdateMenuStock}
          />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart} 
        onPlaceOrder={handleInitiatePayment} 
        selectedSlot={selectedSlotId} 
        setSelectedSlot={setSelectedSlotId}
        timeSlots={timeSlots}
      />

      <AIAssistant 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        response={aiResponse} 
        isLoading={aiLoading} 
        onAsk={askAi}
      />

      <PaymentGateway 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={cartTotal}
        onSuccess={handlePaymentSuccess}
      />

      <QRModal 
        order={qrOrder} 
        onClose={() => setQrOrder(null)} 
      />

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScanSuccess}
      />

      {user.role === 'student' && cart.length > 0 && !isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 group active:scale-95 transition-all z-50 ring-8 ring-white/50"
        >
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-black">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <p className="font-black uppercase tracking-widest text-xs">Basket • ₹{cartTotal}</p>
        </button>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
