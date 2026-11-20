import React from 'react';
import { ShieldCheck, Map, ClipboardList, UserCheck, Activity, Building2, BookOpen } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'gis-map' | 'field-verification' | 'citizen-portal';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCircle: string;
  setSelectedCircle: (circle: string) => void;
  totalRecords: number;
  criticalCount: number;
  onOpenTutorial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCircle,
  setSelectedCircle,
  totalRecords,
  criticalCount,
  onOpenTutorial
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-200">Government of Assam</span>
          <span className="text-slate-500">•</span>
          <span>Revenue & Disaster Management Department</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-semibold">NESFIC-D-50 Pilot Solution</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Dharitree & Bhudakshya Active Sync</span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono">
            {totalRecords} Parcels Audited
          </span>
          {criticalCount > 0 && (
            <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[11px] font-semibold animate-pulse">
              {criticalCount} Critical Flags
            </span>
          )}
        </div>
      </div>

      {/* Main App Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  BhumiSwasthya <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-normal">ভূমি স্বাস্থ্য</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Automated Land Record Health-Check & Anomaly Detection Engine
              </p>
            </div>
          </div>

          {/* Navigation Controls, Role Switcher & Tutorial Link */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Tutorial Link / Button */}
            <button
              onClick={onOpenTutorial}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ring-1 ring-emerald-400/30"
              title="Learn what this app does and how to use it"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tutorial & Guide</span>
            </button>

            {/* Circle Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-slate-900">All Revenue Circles</option>
                <option value="Dispur" className="bg-slate-900">Dispur (Kamrup Metro)</option>
                <option value="Sonapur" className="bg-slate-900">Sonapur (Tribal Belt)</option>
                <option value="Kaliabor" className="bg-slate-900">Kaliabor (Nagaon)</option>
              </select>
            </div>

            {/* Tab Buttons */}
            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Executive Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('gis-map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'gis-map'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Cadastral GIS Map</span>
              </button>

              <button
                onClick={() => setActiveTab('field-verification')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'field-verification'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Field Mandal Queue</span>
              </button>

              <button
                onClick={() => setActiveTab('citizen-portal')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'citizen-portal'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-300/80 hover:text-amber-200 hover:bg-slate-700/60'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen Self-Check</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

