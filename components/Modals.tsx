
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { 
  X, ShoppingBag, Sparkles, Loader2, ArrowRight, AlertTriangle, 
  CreditCard, Smartphone, Banknote, ShieldCheck, Check, Info, QrCode,
  ChevronRight, Landmark, Scan, Camera, Send, Trash2, RotateCcw
} from 'lucide-react';
import { MenuItem, CartItem, TimeSlot, Order } from '../types';

export const CartDrawer = ({ isOpen, onClose, cart, onRemove, onPlaceOrder, onClearCart, selectedSlot, setSelectedSlot, isLoading, timeSlots }: any) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (!isOpen) setShowConfirmClear(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const total = cart.reduce((s: number, i: CartItem) => s + (i.price * i.quantity), 0);

  const handleClear = () => {
    onClearCart();
    setShowConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-10 animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900">Basket</h2>
            {cart.length > 0 && (
              <div className="relative">
                {!showConfirmClear ? (
                  <button 
                    onClick={() => setShowConfirmClear(true)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Clear All"
                  >
                    <Trash2 size={20} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-100 animate-in zoom-in duration-200">
                    <p className="text-[8px] font-black text-rose-600 uppercase px-2">Clear?</p>
                    <button onClick={handleClear} className="bg-rose-600 text-white p-1.5 rounded-lg hover:bg-rose-700"><Check size={12} /></button>
                    <button onClick={() => setShowConfirmClear(false)} className="bg-slate-200 text-slate-600 p-1.5 rounded-lg hover:bg-slate-300"><X size={12} /></button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={28} /></button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-4 no-scrollbar">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-emerald-200 transition-all">
              <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-grow">
                <p className="font-black text-slate-900">{item.name}</p>
                <p className="text-emerald-600 font-bold">₹{item.price} x {item.quantity}</p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center py-20">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <ShoppingBag size={40} />
               </div>
               <p className="opacity-30 font-black uppercase text-xs tracking-widest">Your basket is empty</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-10 border-t pt-8 space-y-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Pickup Slot</p>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                {timeSlots.map((s: TimeSlot) => (
                  <button 
                    key={s.id} 
                    disabled={s.currentOrders >= s.capacity}
                    onClick={() => setSelectedSlot(s.id)}
                    className={`py-3 rounded-xl text-[10px] font-black border transition-all flex flex-col items-center ${selectedSlot === s.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' : 'bg-white text-slate-400 border-slate-200'}`}
                  >
                    {s.time}
                    <span className="text-[8px] mt-1 opacity-60">{s.currentOrders}/{s.capacity}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <p className="text-slate-400 font-bold">Total Payable</p>
                <p className="text-3xl font-black text-emerald-400">₹{total}</p>
              </div>
              <button 
                onClick={onPlaceOrder} 
                disabled={!selectedSlot} 
                className="w-full bg-emerald-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:bg-slate-700 disabled:text-slate-500"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AIAssistant = ({ isOpen, onClose, history, isLoading, onAsk }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onAsk(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-950 h-full flex flex-col text-white shadow-2xl animate-in slide-in-from-right duration-500">
        <div className="p-8 bg-emerald-600 flex justify-between items-center shadow-lg relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl leading-none">Nutri-Bot</h3>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-100 mt-1">AI Nutritionist</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 no-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
          <div className="flex flex-col gap-1 max-w-[85%]">
            <div className="bg-slate-800/80 p-5 rounded-2xl rounded-tl-none border border-slate-700/50 text-sm font-medium leading-relaxed">
              Hello! I'm your SmartCanteen AI. I know every detail of our menu. How can I help you eat better today?
            </div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Nutri-Bot</span>
          </div>

          {history.map((msg: any, idx: number) => (
            <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-5 rounded-2xl text-sm font-medium leading-relaxed max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700/50'
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">
                {msg.role === 'user' ? 'You' : 'Nutri-Bot'}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-emerald-500 animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Bot is thinking...</span>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 pr-16 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" 
              placeholder="Ask about protein, calories, prices..." 
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-emerald-600"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[8px] font-bold text-slate-600 mt-4 uppercase tracking-[0.1em]">
            Powered by Gemini 3 Pro
          </p>
        </div>
      </div>
    </div>
  );
};

export const PaymentGateway = ({ isOpen, onClose, amount, onSuccess }: any) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'wallet' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(method);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-slate-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900">Payment</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center mb-8">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Amount Due</p>
            <p className="text-2xl font-black text-slate-900">₹{amount}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'upi', label: 'UPI / Scan', icon: <Smartphone size={20} /> },
              { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={20} /> },
              { id: 'wallet', label: 'Canteen Wallet', icon: <Banknote size={20} /> }
            ].map((m: any) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${method === m.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === m.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {m.icon}
                </div>
                <span className="font-black text-xs uppercase tracking-widest">{m.label}</span>
                {method === m.id && <Check className="ml-auto" size={16} />}
              </button>
            ))}
          </div>
        </div>
        <div className="p-10">
          <button
            onClick={handlePay}
            disabled={!method || isProcessing}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
            {isProcessing ? 'Verifying...' : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export const QRModal = ({ order, onClose }: { order: Order | null, onClose: () => void }) => {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    if (order) {
      QRCode.toDataURL(`SC_ORDER_${order.id}`)
        .then(url => setQrSrc(url))
        .catch(err => console.error(err));
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"><X size={24} /></button>
        <div className="mb-8">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pick up ready</p>
          <h3 className="text-2xl font-black text-slate-900">Scan at Counter</h3>
        </div>
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8 inline-block shadow-inner">
          {qrSrc ? <img src={qrSrc} alt="Order QR" className="w-48 h-48 mix-blend-multiply" /> : <div className="w-48 h-48 flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" /></div>}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-black text-slate-900">Order #{order.id}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Show this QR to the canteen staff for collection</p>
        </div>
      </div>
    </div>
  );
};

export const ScannerModal = ({ isOpen, onClose, onScan }: { isOpen: boolean, onClose: () => void, onScan: (data: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            requestAnimationFrame(scan);
          }
        })
        .catch(err => console.error("Camera access denied:", err));
    }

    const scan = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            onScan(code.data);
            return;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scan);
    };

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Scan size={16} /></div>
            <h3 className="font-black text-slate-900">QR Scanner</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>
        <div className="relative aspect-square bg-slate-900 overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
            <div className="w-full h-full border-2 border-emerald-500/50 rounded-2xl relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500/50 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="p-8 text-center bg-slate-50">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Align QR code within the frame to scan</p>
        </div>
      </div>
    </div>
  );
};
