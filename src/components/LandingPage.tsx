import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Globe2, 
  Calendar, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (user: { username: string; role: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin1234');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials. Default: admin / admin1234');
      }

      // Save token in sessionStorage
      sessionStorage.setItem('optimax_auth_token', data.token);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              OA
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Optimax Access
              </span>
              <span className="text-[10px] font-mono text-blue-400 block -mt-0.5">
                LinkedIn Automation Studio
              </span>
            </div>
          </div>

          <a
            href="#login-section"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <span>Login to Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Agent Thought Leadership · Zero Make.com Required</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Automated LinkedIn Publishing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400">HEOR & Market Access</span> Leaders
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              Monitor accredited HTA authorities and payer bodies worldwide (NICE, G-BA, HAS, ICER, EU JCA), synthesize high-credibility 150–220 word executive posts, generate 1080×1350 branded social cards, and maintain 100% human-in-the-loop review control before publishing.
            </p>

            {/* Feature Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span>13+ Verified HTA Registries</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Continuous tracking of EU, UK, US, Canadian, and APAC clinical & economic evaluation updates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory Human Approval</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  No automated slips: inspect primary evidence, live mobile previews, and edit before sign-off.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>1080×1350 Branded Canvas</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Built-in portrait social graphic generator formatted with Optimax typography, colors, and 3 key points.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Flexible AI & Agent Prompts</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Switch between Gemini, OpenAI, Claude, DeepSeek, or custom endpoints with full prompt customization.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Authentication Card (5 cols) */}
          <div id="login-section" className="lg:col-span-5">
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
              
              {/* Subtle blue accent glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Sign In to Portal
                  </h2>
                  <p className="text-xs text-slate-400">
                    Access editorial queue & publishing controls
                  </p>
                </div>
              </div>

              {/* Default Credential Notice */}
              <div className="mb-5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between text-xs">
                <div className="text-slate-300">
                  <span className="font-semibold text-blue-300">Default Access:</span>
                  <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                    User: <strong className="text-white">admin</strong> · Pass: <strong className="text-white">admin1234</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin1234');
                  }}
                  className="text-[11px] text-blue-400 hover:underline font-semibold"
                >
                  Auto-Fill
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="admin"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verifying Credentials...' : 'Enter Studio Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Optimax Access Ltd.</span>
                <span>Password changeable in Settings</span>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Optimax Access · Health Economics & Market Access Intelligence</span>
          <span className="font-mono text-[11px]">Secure Editorial Environment</span>
        </div>
      </footer>

    </div>
  );
};
