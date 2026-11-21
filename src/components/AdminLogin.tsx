import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Key, ArrowRight, UserCheck, AlertCircle, Building2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { name: string; designation: string; email: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Official Demo Credentials
  const DEMO_EMAIL = 'admin@assam.gov.in';
  const DEMO_PASS = 'dispur2026';

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASS) {
        onLoginSuccess({
          name: 'Ron Hatibaruah',
          designation: 'Circle Officer & System Administrator',
          email: DEMO_EMAIL
        });
      } else {
        setError('Invalid credentials. Please use the demo credentials provided below.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASS);
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Ron Hatibaruah',
        designation: 'Circle Officer & System Administrator',
        email: DEMO_EMAIL
      });
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600" />

        {/* Emblems & Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Building2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Assam State Data Centre (ASDC) • Zero-Trust</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Revenue Department Console</h2>
            <p className="text-xs text-slate-400">Assam Land Exchange (BhumiBinimoy) Administration</p>
          </div>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 mb-6 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              Demo Access Credentials
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              Dispur Pilot
            </span>
          </div>

          <div className="space-y-1 font-mono text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Username:</span>
              <span className="text-slate-200 font-bold">{DEMO_EMAIL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Password:</span>
              <span className="text-slate-200 font-bold">{DEMO_PASS}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Authorized Role:</span>
              <span className="text-emerald-400">Circle Officer / Super Admin</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full mt-3 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>1-Click Instant Demo Login</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email / ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@assam.gov.in"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Secure Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate & Access Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge Footnote */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            Protected by NIC e-Pramaan OAuth2 • TLS 1.3 End-to-End Encryption • Tamper-Evident SHA-256 Audit
          </p>
        </div>

      </div>
    </div>
  );
};
