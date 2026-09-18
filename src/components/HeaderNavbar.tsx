import React from 'react';
import { 
  Building2, 
  Users, 
  Home, 
  FileText, 
  Sparkles, 
  HeartHandshake, 
  Search, 
  Globe, 
  Plus, 
  Activity,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Moon,
  Sun,
  Calendar
} from 'lucide-react';
import { Language, SwissCanton, ThemeMode } from '../types';
import { getTranslation } from '../i18n';

interface HeaderNavbarProps {
  currentTab: 'dashboard' | 'residents' | 'leads' | 'rooms' | 'billing' | 'roster' | 'ai-assistant';
  setCurrentTab: (tab: 'dashboard' | 'residents' | 'leads' | 'rooms' | 'billing' | 'roster' | 'ai-assistant') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  selectedCantonFilter: string;
  setSelectedCantonFilter: (canton: string) => void;
  onOpenAddResident: () => void;
  onOpenAddLead: () => void;
  onOpenAiAssistant: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  theme,
  setTheme,
  selectedCantonFilter,
  setSelectedCantonFilter,
  onOpenAddResident,
  onOpenAddLead,
  onOpenAiAssistant,
  searchQuery,
  setSearchQuery
}) => {
  const cantons: (SwissCanton | 'ALL')[] = ['ALL', 'ZH', 'BE', 'LU', 'SG', 'TI', 'VD', 'AG'];
  const t = getTranslation(language);

  return (
    <header className={`${theme === 'night' ? 'bg-slate-950 border-slate-800' : 'bg-[#1E293B] border-slate-700/60'} text-white sticky top-0 z-40 shadow-md border-b transition-colors duration-300`}>
      {/* Top Bar: Brand, Search, Quick Actions & Language */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo & Swiss Badge */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-red-500/30">
            {/* Swiss Cross graphic */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute w-4 h-1.5 bg-white rounded-xs"></div>
              <div className="absolute w-1.5 h-4 bg-white rounded-xs"></div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-[9px] text-white font-black px-1 rounded-full border border-slate-900">
              CH
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold tracking-tight text-white">SanoCare<span className="text-emerald-400 font-sans font-medium text-lg">.ch</span></h1>
              {theme === 'night' ? (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                  <Moon className="w-3 h-3 text-amber-300" />
                  Nachtdienst
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  BESA / KVG Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{t.tagline} • Residenz Alpina</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-800/80 border border-slate-700 focus:border-emerald-500 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none transition-all placeholder:text-slate-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Section: Actions & Language Selector */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end w-full md:w-auto">
          {/* Canton Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400">Kanton:</span>
            <select
              value={selectedCantonFilter}
              onChange={(e) => setSelectedCantonFilter(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-slate-800 text-white">{t.allCantons}</option>
              {cantons.filter(c => c !== 'ALL').map(c => (
                <option key={c} value={c} className="bg-slate-800 text-white">Kt. {c}</option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Button (Night Shift Mode) */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'night' : 'light')}
            title={theme === 'night' ? t.dayMode : t.nightShiftMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-xs ${
              theme === 'night'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 ring-2 ring-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {theme === 'night' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30 animate-pulse" />
                <span className="text-[11px] font-bold tracking-tight text-amber-200">{t.nightShiftMode}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-slate-200 hidden sm:inline">{t.dayMode}</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-0.5 text-xs">
            <Globe className="w-3.5 h-3.5 ml-1 text-slate-400" />
            {(['de', 'fr', 'it', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                  language === lang 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border border-emerald-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.ai}</span>
          </button>

          {/* Quick Action Menu */}
          <button
            onClick={onOpenAddResident}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border border-slate-600"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.addResident}</span>
          </button>

          <button
            onClick={onOpenAddLead}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{t.addLead}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-900/90 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t.dashboard}</span>
          </button>

          <button
            onClick={() => setCurrentTab('residents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'residents'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.residents}</span>
          </button>

          <button
            onClick={() => setCurrentTab('leads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'leads'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.leads}</span>
          </button>

          <button
            onClick={() => setCurrentTab('rooms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'rooms'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.rooms}</span>
          </button>

          <button
            onClick={() => setCurrentTab('billing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'billing'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.billing}</span>
          </button>

          <button
            onClick={() => setCurrentTab('roster')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'roster'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{t.shiftScheduler}</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              currentTab === 'ai-assistant'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-emerald-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-amber-300" />
            <span>{t.ai}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
