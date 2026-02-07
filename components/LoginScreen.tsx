
import React, { useState } from 'react';
import { Utensils, ShieldCheck, Lock, User, Loader2, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const LoginScreen = ({ onLogin, isLoading, error: externalError }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError(null);
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        <div className="bg-emerald-600 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-xl">
              <Utensils size={40} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">SmartCanteen</h1>
            <p className="text-emerald-100/80 font-medium mt-2">Campus Pre-Order System</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {(error || externalError) && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <p>{error || externalError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Login'}
          </button>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Credentials for Demo</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase">Student</p>
                <p className="text-[9px] font-bold text-slate-600">student / 123</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase">Kitchen</p>
                <p className="text-[9px] font-bold text-slate-600">counter / 123</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase">Admin</p>
                <p className="text-[9px] font-bold text-slate-600">admin / 123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
