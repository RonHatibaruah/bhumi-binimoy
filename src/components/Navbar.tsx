import React from 'react';
import { ShieldCheck, Map, ClipboardList, UserCheck, Activity, Building2, BookOpen, Sliders } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'gis-map' | 'field-verification' | 'citizen-portal' | 'admin';

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
            <a
              href="#tutorial"
              onClick={(e) => {
                e.preventDefault();
                onOpenTutorial();
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ring-1 ring-emerald-400/30"
              title="Learn what this app does, how to use it, and view the system architecture guide"
              aria-label="Open Interactive Tutorial & System Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tutorial & Guide</span>
            </a>

            {/* Circle Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCircle}
                onChange={(e) => setSelectedCircle(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
                aria-label="Filter records by Assam Revenue Circle"
                title="Select Assam Revenue Circle"
              >
                <option value="ALL" className="bg-slate-900">All Revenue Circles</option>
                <option value="Dispur" className="bg-slate-900">Dispur (Kamrup Metro)</option>
                <option value="Sonapur" className="bg-slate-900">Sonapur (Tribal Belt)</option>
                <option value="Kaliabor" className="bg-slate-900">Kaliabor (Nagaon)</option>
              </select>
            </div>

            {/* Tab Links - SEO and GEO Friendly */}
            <nav className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700" aria-label="Main Application Views">
              <a
                href="#dashboard"
                onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
                title="Executive Analytics & Cadastral Health Register Dashboard (Assam Revenue Circles)"
                aria-label="View Executive Analytics Dashboard"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Executive Analytics</span>
              </a>

              <a
                href="#gis-map"
                onClick={(e) => { e.preventDefault(); setActiveTab('gis-map'); }}
                title="Cadastral WebGIS Parcel Inspector & Overlap Conflict Viewer (Bhudakshya & Satellite)"
                aria-label="View Cadastral WebGIS Parcel Map"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'gis-map'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Cadastral GIS Map</span>
              </a>

              <a
                href="#field-verification"
                onClick={(e) => { e.preventDefault(); setActiveTab('field-verification'); }}
                title="Lat Mandal Field Verification Queue & Offline Ground-Truthing Roster"
                aria-label="View Lat Mandal Field Queue"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'field-verification'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Field Mandal Queue</span>
              </a>

              <a
                href="#citizen-portal"
                onClick={(e) => { e.preventDefault(); setActiveTab('citizen-portal'); }}
                title="Citizen Land Health Card Self-Check Portal & Pre-Emptive Mutation Fast-Track"
                aria-label="View Citizen Land Health Portal"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'citizen-portal'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-300/80 hover:text-amber-200 hover:bg-slate-700/60'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen Self-Check</span>
              </a>

              <a
                href="#admin"
                onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}
                title="Super Admin Command Console: Rule Engine Calibration, Officer Roster, Data Sentry & Audit Trail"
                aria-label="View Super Admin Command Console"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm ring-1 ring-amber-400/50'
                    : 'text-amber-300/90 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Admin Command</span>
              </a>
            </nav>

          </div>

        </div>
      </div>
    </header>
  );
};

