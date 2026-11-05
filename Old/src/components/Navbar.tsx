import React from 'react';
import { 
  Sparkles, 
  Send, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Globe2, 
  Calendar, 
  SlidersHorizontal,
  LogOut,
  BarChart3
} from 'lucide-react';

export type ActiveTab = 'queue' | 'analytics' | 'calendar' | 'sources' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  isDark: boolean;
  toggleDark: () => void;
  onOpenRunModal: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  isDark,
  toggleDark,
  onOpenRunModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20">
            OA
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Optimax Access
          </span>
          <span className="hidden sm:inline text-xs font-mono text-slate-400 dark:text-slate-500">
            Studio
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Review Queue</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-mono font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule & Log</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Source Register</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Log out to Landing Page"
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenRunModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Research Engine</span>
          </button>
        </div>

      </div>
    </header>
  );
};
