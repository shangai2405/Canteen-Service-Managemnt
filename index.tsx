
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Utensils, ShoppingBag, Sparkles, Search, User, ChefHat, BarChart3, 
  ArrowRight, Loader2, Zap, Clock, Wallet, X, ChevronRight, Flame, 
  Plus, Minus, Activity, TrendingUp, Check, ShieldCheck, ArrowUpRight, 
  Coffee, Leaf, Dumbbell, History, CreditCard, Smartphone, Trash2,
  Banknote, ExternalLink, Landmark, Pizza, Soup, Dessert, AlertTriangle, Edit2,
  QrCode, Scan, Package, Filter, ChevronDown, LogOut, MessageSquareText
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Role, MenuItem, CartItem, TimeSlot, Order } from './types';
import { CartDrawer, AIAssistant, PaymentGateway, QRModal, ScannerModal } from './components/Modals';
import { OrdersView } from './components/OrdersView';
import { CounterView } from './components/CounterView';
import { AdminView } from './components/AdminView';
import { LoginScreen } from './components/LoginScreen';
import { StudentView } from './components/StudentView';

const INITIAL_MENU: MenuItem[] = [
  { id: 1, name: 'Plain Dosa', category: 'South Indian', price: 60, calories: 180, protein: '4g', image: 'https://images.unsplash.com/photo-1668236543090-52ee3d351d14?auto=format&fit=crop&q=80&w=600', description: 'Traditional crispy rice and lentil crepe served with sambar and chutney.', popularity: 85, stock: 40 },
  { id: 2, name: 'Masala Dosa', category: 'South Indian', price: 90, calories: 310, protein: '6g', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600', description: 'Crispy dosa stuffed with a spicy tempered potato filling.', popularity: 250, stock: 35 },
  { id: 3, name: 'Chicken Biriyani', category: 'Mains', price: 220, calories: 580, protein: '24g', image: 'https://images.unsplash.com/photo-1563379091339-03b21ef4a4f8?auto=format&fit=crop&q=80&w=600', description: 'Aromatic basmati rice cooked with premium chicken and spices.', popularity: 300, stock: 25 },
  { id: 4, name: 'Paneer Butter Masala', category: 'Mains', price: 180, calories: 450, protein: '12g', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600', description: 'Rich and creamy cottage cheese curry with tomato-based gravy.', popularity: 210, stock: 20 },
  { id: 5, name: 'Veg Thali', category: 'Mains', price: 150, calories: 650, protein: '18g', image: 'https://images.unsplash.com/photo-1626777552726-4a6b547b4e5d?auto=format&fit=crop&q=80&w=600', description: 'A wholesome meal with dal, two veg curries, rice, and roti.', popularity: 180, stock: 30 },
  { id: 6, name: 'Grilled Chicken Salad', category: 'Healthy', price: 160, calories: 280, protein: '30g', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', description: 'Fresh greens topped with grilled chicken breast and vinaigrette.', popularity: 120, stock: 15 },
  { id: 7, name: 'Fruit Platter', category: 'Healthy', price: 80, calories: 120, protein: '2g', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=600', description: 'Selection of seasonal fresh fruits served chilled.', popularity: 90, stock: 25 },
  { id: 8, name: 'Veg Hakka Noodles', category: 'Mains', price: 110, calories: 420, protein: '8g', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600', description: 'Stir-fried noodles with crisp vegetables and oriental spices.', popularity: 240, stock: 40 },
  { id: 9, name: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: 50, calories: 300, protein: '4g', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600', description: 'Soft milk solids dumplings dipped in warm sugar syrup.', popularity: 280, stock: 50 },
  { id: 10, name: 'Chocolate Brownie', category: 'Desserts', price: 70, calories: 350, protein: '5g', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600', description: 'Fudgy chocolate brownie with a gooey center.', popularity: 170, stock: 20 },
  { id: 11, name: 'Butter Chicken', category: 'Mains', price: 240, calories: 520, protein: '28g', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600', description: 'Tender chicken in a velvety, spice-infused tomato butter sauce.', popularity: 320, stock: 20 },
  { id: 12, name: 'Masala Papad', category: 'South Indian', price: 30, calories: 45, protein: '2g', image: 'https://images.unsplash.com/photo-1601050638917-3f90dfad9227?auto=format&fit=crop&q=80&w=600', description: 'Crispy lentil wafer topped with spicy onion and tomato salsa.', popularity: 110, stock: 80 },
  { id: 13, name: 'Mango Lassi', category: 'Beverages', price: 60, calories: 210, protein: '5g', image: 'https://images.unsplash.com/photo-1571006682881-8012678687ba?auto=format&fit=crop&q=80&w=600', description: 'Thick, chilled yogurt drink blended with sweet Alphonso mangoes.', popularity: 260, stock: 40 },
  { id: 14, name: 'Quinoa Bowl', category: 'Healthy', price: 190, calories: 310, protein: '12g', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', description: 'Protein-packed quinoa with roasted chickpeas and kale.', popularity: 145, stock: 15 },
  { id: 15, name: 'Rasmalai', category: 'Desserts', price: 80, calories: 250, protein: '6g', image: 'https://images.unsplash.com/photo-1605197509751-62ad29802871?auto=format&fit=crop&q=80&w=600', description: 'Soft cheese patties soaked in saffron-flavored sweetened milk.', popularity: 215, stock: 25 },
  { id: 23, name: 'Masala Tea', category: 'Beverages', price: 25, calories: 60, protein: '1g', image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=600', description: 'Hand-brewed tea with milk, ginger, and cardamom.', popularity: 350, stock: 100 },
  { id: 24, name: 'Cold Coffee', category: 'Beverages', price: 80, calories: 220, protein: '4g', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600', description: 'Blended chilled coffee topped with chocolate syrup.', popularity: 190, stock: 50 },
  { id: 25, name: 'Fresh Lime Soda', category: 'Beverages', price: 40, calories: 45, protein: '0g', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600', description: 'Refreshing sweet and salty lemon soda.', popularity: 220, stock: 60 },
];

const INITIAL_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '12:00 PM', capacity: 20, cutoffTime: '11:00 AM', currentOrders: 12 },
  { id: '2', time: '12:15 PM', capacity: 20, cutoffTime: '11:15 AM', currentOrders: 5 },
  { id: '3', time: '12:30 PM', capacity: 20, cutoffTime: '11:30 AM', currentOrders: 8 },
  { id: '4', time: '01:00 PM', capacity: 20, cutoffTime: '12:00 PM', currentOrders: 2 },
  { id: '5', time: '01:30 PM', capacity: 20, cutoffTime: '12:30 PM', currentOrders: 0 },
];

const App = () => {
  const [user, setUser] = useState<{ role: Role, name: string, username: string, email: string, phone: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  // Modals & UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [qrOrder, setQrOrder] = useState<Order | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanningOrderId, setScanningOrderId] = useState<number | null>(null);

  // AI Chat History
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('sc_user_v4');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedOrders = localStorage.getItem('sc_orders_v4');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    const savedPending = localStorage.getItem('sc_pending_v4');
    if (savedPending) setPendingUsers(JSON.parse(savedPending));
    const savedApproved = localStorage.getItem('sc_approved_v4');
    if (savedApproved) setApprovedUsers(JSON.parse(savedApproved));
    const savedSlots = localStorage.getItem('sc_slots_v4');
    if (savedSlots) setTimeSlots(JSON.parse(savedSlots));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('sc_user_v4', JSON.stringify(user));
    else localStorage.removeItem('sc_user_v4');
  }, [user]);

  const handleRegister = (data: { name: string, username: string, email: string, phone: string, password: string }) => {
    const newUser = { ...data, id: Date.now().toString(), timestamp: new Date().toLocaleString() };
    setPendingUsers(prev => [...prev, newUser]);
  };

  const handleApproveUser = async (userId: string) => {
    const userToApprove = pendingUsers.find(u => u.id === userId);
    if (!userToApprove) return;
    const updatedApproved = [...approvedUsers, userToApprove];
    setApprovedUsers(updatedApproved);
    localStorage.setItem('sc_approved_v4', JSON.stringify(updatedApproved));
    const updatedPending = pendingUsers.filter(u => u.id !== userId);
    setPendingUsers(updatedPending);
    localStorage.setItem('sc_pending_v4', JSON.stringify(updatedPending));
    alert(`Access granted for ${userToApprove.name}.`);
  };

  const handleLogin = (usernameInput: string, passwordInput: string) => {
    setIsLoading(true);
    setLoginError(null);
    setTimeout(() => {
      const u = usernameInput.toLowerCase();
      if (u === 'admin' && passwordInput === '123') {
        setUser({ role: 'admin', name: 'Manager', username: 'admin', email: 'admin@canteen.com', phone: '9999999999' });
      } else if (u === 'counter' && passwordInput === '123') {
        setUser({ role: 'counter', name: 'Kitchen Head', username: 'counter', email: 'cook@canteen.com', phone: '8888888888' });
      } else {
        const approvedList = JSON.parse(localStorage.getItem('sc_approved_v4') || '[]');
        const approved = approvedList.find((user: any) => user.username.toLowerCase() === u);
        if (approved && approved.password === passwordInput) {
          setUser({ role: 'student', ...approved });
        } else if (u === 'student' && passwordInput === '123') {
          setUser({ role: 'student', name: 'Alex Demo', username: 'student', email: 'alex@edu.com', phone: '9123456789' });
        } else {
          setLoginError('Account not found or pending approval.');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const handleAskAI = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsAiLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', text: prompt }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const menuContext = menu.map(m => `${m.name} (${m.category}): ₹${m.price}, ${m.calories}kcal, Protein: ${m.protein}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are the SmartCanteen Nutri-Bot. Your job is to help students make healthy food choices from the canteen menu.
          Below is the current menu available:
          ${menuContext}
          
          Guidelines:
          1. Be friendly, concise, and professional.
          2. Recommend items ONLY from the menu above.
          3. If someone asks for a calorie-specific goal (e.g. "under 500 kcal"), calculate the best combination.
          4. Highlight high-protein options if asked about fitness/muscle gain.
          5. Mention prices if relevant.`,
        }
      });

      const botMessage = response.text || "I'm sorry, I couldn't process that. Try asking about a specific food goal!";
      setChatHistory(prev => [...prev, { role: 'bot', text: botMessage }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatHistory(prev => [...prev, { role: 'bot', text: "Error connecting to Nutri-Bot service. Please try again later." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, nextStatus: Order['status'], prepTime?: number) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { 
        ...o, 
        status: nextStatus, 
        prepTime: prepTime ?? o.prepTime,
        approvedAt: nextStatus === 'Approved' ? new Date().toISOString() : o.approvedAt
      } : o);
      localStorage.setItem('sc_orders_v4', JSON.stringify(updated));
      return updated;
    });
    const order = orders.find(o => o.id === id);
    try {
      await fetch('api/twilio_sms.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, status: nextStatus, phone: order?.customerPhone || '+91XXXXXXXXXX' })
      });
    } catch (err) {
      console.error("SMS failed:", err);
    }
  };

  const handlePaymentSuccess = (method: string) => {
    const slot = timeSlots.find(s => s.id === selectedSlotId);
    if (!slot) return;
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const newOrder: Order = {
      id: Math.floor(Math.random() * 9000) + 1000,
      userId: user?.username || 'user',
      customerPhone: user?.phone,
      total: total,
      slot: slot.time,
      status: 'Placed',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      paymentMethod: method,
      paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentStatus: 'Success'
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('sc_orders_v4', JSON.stringify(updatedOrders));
    setCart([]);
    setSelectedSlotId(null);
    setIsCartOpen(false);
    setIsPaymentOpen(false);
    setActiveTab('orders');
  };

  const handleClearCart = () => {
    setCart([]);
    setSelectedSlotId(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} isLoading={isLoading} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Utensils size={20} /></div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">SmartCanteen</h1>
            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">Status: Operational</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-black text-slate-900 leading-none mb-1">{user.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">@{user.username}</p>
          </div>
          <button onClick={() => { setUser(null); setCart([]); setSelectedSlotId(null); }} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><LogOut size={20} /></button>
          {user.role === 'counter' && <button onClick={() => setIsScannerOpen(true)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-colors"><Scan size={16} /></button>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-8 flex-grow pb-32">
        {user.role === 'student' && (
          <div className="space-y-10">
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 w-fit">
              <button onClick={() => setActiveTab('menu')} className={`px-10 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'menu' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Food Menu</button>
              <button onClick={() => setActiveTab('orders')} className={`px-10 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>My Orders</button>
            </div>
            {activeTab === 'menu' ? (
              <StudentView 
                menu={menu} 
                onAddToCart={(item) => { 
                  setCart(prev => {
                    const existing = prev.find(i => i.id === item.id);
                    if (existing) return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
                    return [...prev, {...item, quantity: 1}];
                  });
                }} 
                onOpenBot={() => setIsAiOpen(true)}
              />
            ) : <OrdersView orders={orders.filter(o => o.userId === user.username)} onShowQR={(o) => setQrOrder(o)} />}
          </div>
        )}
        {user.role === 'counter' && <CounterView orders={orders} updateStatus={handleUpdateStatus} onOpenScanner={(id) => { setScanningOrderId(id); setIsScannerOpen(true); }} />}
        {user.role === 'admin' && (
          <AdminView 
            orders={orders} menu={menu} timeSlots={timeSlots} pendingUsers={pendingUsers}
            onAddTimeSlot={(slot) => setTimeSlots(prev => [...prev, { ...slot, id: Date.now().toString(), currentOrders: 0 }])} 
            onUpdateTimeSlot={(id, updated) => setTimeSlots(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s))} 
            onDeleteTimeSlot={(id) => setTimeSlots(prev => prev.filter(s => s.id !== id))} 
            onUpdateMenuStock={(id, newStock) => setMenu(prev => prev.map(m => m.id === id ? { ...m, stock: newStock } : m))}
            onApproveUser={handleApproveUser}
            onRejectUser={(id) => setPendingUsers(prev => prev.filter(u => u.id !== id))}
          />
        )}
      </main>

      {user.role === 'student' && cart.length > 0 && (
        <button 
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-10 right-10 z-[70] w-20 h-20 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-in zoom-in"
        >
            <ShoppingBag size={28} className="group-hover:animate-bounce" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-50 flex items-center justify-center text-[10px] font-black">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
        </button>
      )}

      {user.role === 'student' && (
        <button 
          onClick={() => setIsAiOpen(true)}
          className={`fixed bottom-10 ${cart.length > 0 ? 'right-36' : 'right-10'} z-[70] w-20 h-20 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-in zoom-in`}
        >
          <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={(id: number) => setCart(prev => prev.filter(c => c.id !== id))} 
        onPlaceOrder={() => setIsPaymentOpen(true)} 
        onClearCart={handleClearCart}
        selectedSlot={selectedSlotId} 
        setSelectedSlot={setSelectedSlotId} 
        timeSlots={timeSlots} 
      />
      <PaymentGateway isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} amount={cart.reduce((s, i) => s + (i.price * i.quantity), 0)} onSuccess={handlePaymentSuccess} />
      <QRModal order={qrOrder} onClose={() => setQrOrder(null)} />
      <ScannerModal isOpen={isScannerOpen} onClose={() => { setIsScannerOpen(false); setScanningOrderId(null); }} onScan={(data) => {
          const match = data.match(/SC_ORDER_(\d+)/);
          if (match) {
            const orderId = parseInt(match[1]);
            
            if (scanningOrderId && orderId !== scanningOrderId) {
              alert(`Error: This QR code belongs to Order #${orderId}, but you are trying to collect Order #${scanningOrderId}. Please scan the correct QR code.`);
              return;
            }

            const order = orders.find(o => o.id === orderId);
            
            if (!order) {
              alert("Order not found in system.");
              setIsScannerOpen(false);
              setScanningOrderId(null);
              return;
            }

            if (order.status === 'Collected') {
              alert("This order has already been collected!");
              setIsScannerOpen(false);
              setScanningOrderId(null);
              return;
            }

            handleUpdateStatus(orderId, 'Collected');
            setIsScannerOpen(false);
            setScanningOrderId(null);
            alert(`Success: Order #${orderId} has been scanned correctly and marked as collected!`);
          } else {
            alert("Invalid QR code scanned.");
          }
      }} />
      <AIAssistant 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        history={chatHistory} 
        isLoading={isAiLoading} 
        onAsk={handleAskAI} 
      />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
