import React from 'react';
import { 
  Building2, 
  Map, 
  SearchCheck, 
  PlusCircle, 
  ArrowRightLeft, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  FileBadge
} from 'lucide-react';
import { LandMarketplaceListing } from '../types/landRecords';
import { formatINR } from '../services/marketplaceEngine';

export type ActiveTab = 'marketplace' | 'deal-room' | 'seller-portal' | 'workflow-tracker' | 'admin-console';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCircle: string;
  setSelectedCircle: (circle: string) => void;
  listings: LandMarketplaceListing[];
  onOpenTutorial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCircle,
  setSelectedCircle,
  listings,
  onOpenTutorial
}) => {
  const verifiedCount = listings.filter(l => l.governmentVerified.titleClearanceBadge === 'GOLD_VERIFIED').length;
  const totalValuation = listings.reduce((sum, l) => sum + l.sellerRepresentations.askingPriceINR, 0);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Government of Assam</span>
          <span className="text-slate-500">•</span>
          <span>Revenue & Disaster Management Department</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-semibold">NESFIC-D-52 Pilot Solution</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 hidden sm:inline">Dharitree • Bhudakshya • e-Panjeeyan • e-Khajana</span>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono">
            {listings.length} Active Listings ({verifiedCount} Gold Verified)
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono hidden md:inline">
            Marketplace Volume: {formatINR(totalValuation)}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  BhumiBinimoy <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-normal">ভূমি বিনিময়</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Assam Land Exchange • Government-Verified Cadastral Marketplace
              </p>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4 text-emerald-400" />
              <span>Cadastral Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('deal-room')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'deal-room'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <SearchCheck className="w-4 h-4 text-teal-400" />
              <span>Buyer Deal Room</span>
            </button>

            <button
              onClick={() => setActiveTab('seller-portal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'seller-portal'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Sell Land</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow-tracker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'workflow-tracker'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-blue-400" />
              <span>Assisted Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-console')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'admin-console'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Dept Console</span>
            </button>

            {/* Tutorial Button */}
            <button
              onClick={onOpenTutorial}
              title="Platform Guide & Architecture Walkthrough"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circle Filter Bar */}
        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Target Pilot Circle:</span>
            <div className="flex items-center space-x-1">
              {['ALL', 'Dispur', 'Guwahati', 'Sonapur', 'North Guwahati'].map(circle => (
                <button
                  key={circle}
                  onClick={() => setSelectedCircle(circle)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    selectedCircle === circle
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {circle === 'ALL' ? 'All Circles' : `${circle} Circle`}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Gold Verified (Clean Title)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              Conditional (Co-Sharer / Dues)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Chapter X Tribal Belt
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
