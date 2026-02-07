
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { 
  X, ShoppingBag, Sparkles, Loader2, ArrowRight, AlertTriangle, 
  CreditCard, Smartphone, Banknote, ShieldCheck, Check, Info, QrCode,
  ChevronRight, Landmark, Scan, Camera
} from 'lucide-react';
import { MenuItem, CartItem, TimeSlot, Order } from '../types';

export const CartDrawer = ({ isOpen, onClose, cart, onRemove, onPlaceOrder, selectedSlot, setSelectedSlot, isLoading, timeSlots }: any) => {
  if (!isOpen) return null;

  const total = cart.reduce((s: number, i: CartItem) => s + (i.price * i.quantity), 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-md bg-white h-full shadow-2xl flex flex-col p-10 animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">Basket</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={28} /></button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-4 no-scrollbar">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-emerald-200 transition-all">
              <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-grow">
                <p className="font-black text-slate-900">{item.name}</p>
                <p className="text-emerald-600 font-bold">₹{item.price} x {item.quantity}</p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500"><X size={20} /></button>
            </div>
          ))}
          {cart.length === 0 && <p className="text-center py-20 opacity-30 font-black">Your basket is empty</p>}
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

export const AIAssistant = ({ isOpen, onClose, response, isLoading, onAsk }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-slate-900 h-full flex flex-col text-white shadow-2xl animate-in slide-in-from-right duration-500">
        <div className="p-8 bg-emerald-600 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Sparkles size={24} />
            <h3 className="font-black text-xl">Nutri-Bot</h3>
          </div>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="flex-grow p-8 overflow-y-auto space-y-6 no-scrollbar">
          <div className="bg-slate-800/50 p-6 rounded-2xl rounded-tl-none border border-slate-700/50 text-sm font-medium leading-relaxed">
            Hi! I analyze the menu to suggest protein-rich or low-calorie options. What's your goal today?
          </div>
          {response && <div className="bg-emerald-900/30 border border-emerald-500/30 p-6 rounded-2xl rounded-tl-none text-sm animate-in fade-in">{response}</div>}
          {isLoading && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={32} />}
        </div>
        <div className="p-8 border-t border-slate-800 bg-slate-800/50">
          <div className="relative">
            <input 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 pr-14 text-sm outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="Ask Nutri-Bot..." 
              onKeyDown={e => { if(e.key === 'Enter' && e.currentTarget.value) { onAsk(e.currentTarget.value); e.currentTarget.value = ''; } }} 
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 p-2"><ArrowRight size={24} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PaymentGateway = ({ isOpen, onClose, amount, onSuccess }: any) => {
  const [step, setStep] = useState<'methods' | 'processing' | 'success'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('methods');
      setSelectedMethod(null);
    }
  }, [isOpen]);

  const handlePay = (method: string) => {
    setSelectedMethod(method);
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(method);
      }, 2000);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-black tracking-tight">SmartPay</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Checkout</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
          </div>
          
          <div className="flex justify-between items-end">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Amount to Pay</p>
            <h2 className="text-4xl font-black text-emerald-400">₹{amount}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px] flex flex-col justify-center">
          {step === 'methods' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Payment Method</p>
              
              <button 
                onClick={() => handlePay('UPI')}
                className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-3xl transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <QrCode size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900">UPI / QR Code</p>
                    <p className="text-[10px] text-slate-400 font-bold">GPay, PhonePe, Paytm</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500" />
              </button>

              <button 
                onClick={() => handlePay('Card')}
                className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-3xl transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-400 font-bold">Visa, Mastercard, Rupay</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500" />
              </button>

              <button 
                onClick={() => handlePay('Net Banking')}
                className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-3xl transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Landmark size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900">Net Banking</p>
                    <p className="text-[10px] text-slate-400 font-bold">All Major Indian Banks</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500" />
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-8 animate-in fade-in duration-500">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                  {selectedMethod === 'UPI' ? <Smartphone size={40}/> : <ShieldCheck size={40}/>}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Verifying Payment</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">Waiting for confirmation from your bank...</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Info size={14}/>
                Do not press back or refresh the page
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 text-white animate-bounce">
                <Check size={48} strokeWidth={4} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">Payment Successful!</h3>
                <p className="text-sm text-slate-400 font-medium mt-2">Your order has been placed successfully.</p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  Redirecting to Orders...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-500"/>
            PCI DSS Compliant
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            256-bit SSL Secure
          </div>
        </div>
      </div>
    </div>
  );
};

export const QRModal = ({ order, onClose }: { order: Order | null, onClose: () => void }) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  
  useEffect(() => {
    if (order) {
      // Data to encode: a unique identifier for the order
      const data = `SMART_CANTEEN_ORDER_ID_${order.id}`;
      QRCode.toDataURL(data, { width: 300, margin: 2 }, (err, url) => {
        if (!err) setQrSrc(url);
      });
    } else {
      setQrSrc('');
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl text-slate-900">Pickup QR</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 mb-6">
          {qrSrc ? (
            <img src={qrSrc} alt="Pickup QR Code" className="w-full aspect-square object-contain mix-blend-multiply" />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center"><Loader2 size={40} className="animate-spin text-slate-300" /></div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Identifier</p>
            <p className="font-black text-2xl text-slate-900">#{order.id}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              <Info size={16} />
            </div>
            <p className="text-[10px] font-bold text-emerald-800 leading-tight">
              Present this QR code to the canteen staff at the counter to collect your items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScannerModal = ({ isOpen, onClose, onScan }: { isOpen: boolean, onClose: () => void, onScan: (data: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setHasPermission(true);
          scanFrame();
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setHasPermission(false);
      }
    };

    const scanFrame = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            onScan(code.data);
          }
        }
      }
      animationFrameId = requestAnimationFrame(scanFrame);
    };

    if (isOpen) {
      startCamera();
    } else {
      if (stream) stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationFrameId);
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Scan size={24} className="text-emerald-500" />
            <h3 className="font-black text-xl">Verify Pickup</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="relative aspect-square bg-black">
          {hasPermission === false ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center text-white space-y-4">
              <Camera size={48} className="text-slate-600" />
              <p className="font-bold">Camera access denied</p>
              <p className="text-xs text-slate-400">Please enable camera permissions in your browser to scan QR codes.</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 aspect-square border-2 border-emerald-500 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1 rounded-br-lg"></div>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/50 animate-[scan_2s_infinite_linear]"></div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-8 bg-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructions</p>
          <p className="text-sm font-medium text-slate-700">Scan the student's order QR code to verify pickup.</p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};
