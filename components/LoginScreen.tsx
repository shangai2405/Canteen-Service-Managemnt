
import React, { useState } from 'react';
import { Utensils, ShieldCheck, Lock, User, Loader2, AlertCircle, Mail, Phone, ArrowLeft, CheckCircle, Fingerprint, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (data: { name: string, username: string, email: string, phone: string, password: string }) => void;
  isLoading: boolean;
  error?: string | null;
}

export const LoginScreen = ({ onLogin, onRegister, isLoading, error: externalError }: LoginScreenProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regData, setRegData] = useState({ name: '', username: '', email: '', phone: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!regData.name || !regData.username || !regData.email || !regData.phone || !regData.password) {
        setError('All fields, including password, are required.');
        return;
      }
      if (regData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      onRegister(regData);
      setIsSuccess(true);
    } else {
      if (!username || !password) {
        setError('Please enter both username and password.');
        return;
      }
      onLogin(username, password);
    }
    setError(null);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-500 border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Your registration is currently under review. Once approved, you can login with the credentials you just created!
          </p>
          <button 
            onClick={() => { setIsSuccess(false); setIsRegistering(false); }}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        <div className="bg-emerald-600 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner">
              <Utensils size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">SmartCanteen</h1>
            <p className="text-emerald-100/80 text-[10px] font-black uppercase tracking-[0.2em]">
              {isRegistering ? 'Student Registration' : 'Secure Portal Access'}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-4">
          {(error || externalError) && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <p>{error || externalError}</p>
            </div>
          )}

          <div className="space-y-3">
            {isRegistering ? (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Full Name" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Desired Username" value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" placeholder="Email Address" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="tel" placeholder="Phone (+91...)" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create Password" 
                    value={regData.password} 
                    onChange={e => setRegData({...regData, password: e.target.value})} 
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm" />
                </div>
              </>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'Register Me' : 'Sign In')}
          </button>

          <div className="pt-2 text-center">
            <button 
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
            >
              {isRegistering ? 'Back to account login' : 'New student? Request access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
