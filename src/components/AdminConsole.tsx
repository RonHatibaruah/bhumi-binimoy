import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  FileCheck, 
  Activity, 
  Scale, 
  MapPin, 
  Users,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Lock,
  LogOut,
  Edit3,
  Hash,
  Database,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { LandMarketplaceListing, ListingStage } from '../types/landRecords';
import { formatINR, formatBKL } from '../services/marketplaceEngine';
import { AdminLogin } from './AdminLogin';

interface AdminConsoleProps {
  listings: LandMarketplaceListing[];
  onUpdateListingStatus?: (listingId: string, newStage: ListingStage, note?: string) => void;
}

interface AdminUser {
  name: string;
  designation: string;
  email: string;
}

// Zonal baseline rates across Kamrup Metro Mouzas
interface ZonalRateRow {
  mouza: string;
  circle: string;
  landClass: string;
  gazettedRatePerBighaINR: number;
  pwdRoadFrontageMultiplier: number;
  lastRevisionDate: string;
}

const INITIAL_ZONAL_RATES: ZonalRateRow[] = [
  { mouza: 'Beltola', circle: 'Dispur', landClass: 'Basti (Residential)', gazettedRatePerBighaINR: 8500000, pwdRoadFrontageMultiplier: 1.15, lastRevisionDate: '2026-01-15' },
  { mouza: 'Dispur', circle: 'Dispur', landClass: 'Commercial / Trade', gazettedRatePerBighaINR: 15000000, pwdRoadFrontageMultiplier: 1.25, lastRevisionDate: '2026-02-01' },
  { mouza: 'Sonapur', circle: 'Sonapur', landClass: 'Bari (Agricultural/Garden)', gazettedRatePerBighaINR: 3200000, pwdRoadFrontageMultiplier: 1.10, lastRevisionDate: '2025-11-20' },
  { mouza: 'Sila Sindhuri Ghopa', circle: 'North Guwahati', landClass: 'Faringati (Industrial)', gazettedRatePerBighaINR: 4800000, pwdRoadFrontageMultiplier: 1.20, lastRevisionDate: '2026-03-10' },
  { mouza: 'Panbari', circle: 'Chandrapur', landClass: 'Rupit (Agricultural)', gazettedRatePerBighaINR: 2800000, pwdRoadFrontageMultiplier: 1.05, lastRevisionDate: '2025-10-05' }
];

export const AdminConsole: React.FC<AdminConsoleProps> = ({ listings, onUpdateListingStatus }) => {
  // Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('ale_admin_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'OVERVIEW' | 'MODERATION' | 'ZONAL_RATES' | 'ALERTS' | 'AUDIT_LEDGER'>('OVERVIEW');
  const [selectedCircleView, setSelectedCircleView] = useState('Dispur');
  const [searchQuery, setSearchQuery] = useState('');
  const [moderationFilter, setModerationFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'FLAGGED'>('ALL');

  // Inspection Modal State
  const [inspectListing, setInspectListing] = useState<LandMarketplaceListing | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Zonal Rates State
  const [zonalRates, setZonalRates] = useState<ZonalRateRow[]>(INITIAL_ZONAL_RATES);
  const [editingMouza, setEditingMouza] = useState<string | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(0);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; timestamp: string; action: string; details: string; officer: string; hash: string }>>([
    {
      id: 'AUD-001',
      timestamp: '2026-11-21T10:45:00Z',
      action: 'SYSTEM_AUDIT_PASS',
      details: '8-Point statutory title check executed on Dag 101 Beltola (Score: 98/100)',
      officer: 'Automated Dharitree Engine',
      hash: 'e7c79e960942a893cec2533d'
    },
    {
      id: 'AUD-002',
      timestamp: '2026-11-21T09:30:15Z',
      action: 'LISTING_STATUS_VERIFIED',
      details: 'Approved voluntary listing ALE-KAM-DIS-001 for public cadastral map publishing',
      officer: 'Abhishek Satyam (Circle Officer & Lead Architect)',
      hash: '322c114d39c27889208c56ca'
    },
    {
      id: 'AUD-003',
      timestamp: '2026-11-21T08:15:30Z',
      action: 'ZONAL_RATE_RECONCILIATION',
      details: 'Synchronized Kamrup Metro Circle Gazette rates for Q4 2026',
      officer: 'Dispur Revenue Branch',
      hash: '500de40637ba4c7a9ff554e2'
    }
  ]);

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('ale_admin_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('ale_admin_session');
  };

  // Moderation Action Handler
  const handleModerateListing = (listingId: string, newStage: ListingStage, actionLabel: string) => {
    if (onUpdateListingStatus) {
      onUpdateListingStatus(listingId, newStage, `Updated via Circle Officer console: ${actionLabel}`);
    }

    // Add to audit log
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action: `LISTING_${actionLabel.toUpperCase().replace(/\s+/g, '_')}`,
      details: `Listing ${listingId} transitioned to ${newStage} by officer`,
      officer: adminUser?.name || 'Authorized Officer',
      hash: Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 10)
    };

    setAuditLogs(prev => [newLog, ...prev]);
    setActionSuccessMessage(`Successfully updated listing ${listingId}: ${actionLabel}`);
    setInspectListing(null);

    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  // Save Zonal Rate Edit
  const handleSaveZonalRate = (mouza: string) => {
    if (editRateValue > 0) {
      setZonalRates(prev => prev.map(r => r.mouza === mouza ? { ...r, gazettedRatePerBighaINR: editRateValue, lastRevisionDate: new Date().toISOString().split('T')[0] } : r));
      setEditingMouza(null);
      setActionSuccessMessage(`Updated Gazetted Zonal Rate for Mouza ${mouza} to ${formatINR(editRateValue)}/Bigha`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    }
  };

  // If unauthenticated, show the secure login screen
  if (!adminUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Metrics
  const totalMarketValuation = listings.reduce((sum, l) => sum + l.sellerRepresentations.askingPriceINR, 0);
  const totalFacilitationRevenue = listings.reduce((sum, l) => sum + l.estimatedFacilitationFeeINR, 0);
  const totalAvoidedBrokerFees = Math.round(totalMarketValuation * 0.05);
  const goldVerifiedCount = listings.filter(l => l.governmentVerified.titleClearanceBadge === 'GOLD_VERIFIED').length;

  // Filter listings for moderation
  const filteredModerationListings = listings.filter(l => {
    const matchesSearch = l.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.governmentVerified.dagNumber.includes(searchQuery) ||
                          l.village.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (moderationFilter === 'VERIFIED') return l.stage === 'VERIFIED_AVAILABLE';
    if (moderationFilter === 'PENDING') return l.stage === 'INQUIRIES_OPEN' || l.stage === 'EOI_SUBMITTED';
    if (moderationFilter === 'FLAGGED') return l.stage === 'FLAGGED_DISCREPANCY' || l.governmentVerified.titleClearanceBadge === 'RESTRICTED' || l.governmentVerified.titleClearanceBadge === 'CONDITIONAL';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar with Authenticated Officer Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600" />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded-full">
                Super Admin & Circle Officer Command
              </span>
              <span className="text-xs text-slate-400">Assam State Data Centre (ASDC)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Assam Land Exchange Command Console
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-normal hidden sm:inline-block">
                ৰাজহ বিভাগ নিয়ন্ত্ৰণ কক্ষ
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Department of Revenue & Disaster Management • Dispur Pilot Governance Telemetry & Anti-Fraud Oversight
            </p>
          </div>

          {/* Authenticated Officer Session Card */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
              RH
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>{adminUser.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">{adminUser.designation}</div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition-colors border border-slate-700 hover:border-rose-800"
              title="Logout from Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
          <button
            onClick={() => setAdminTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'OVERVIEW'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setAdminTab('MODERATION')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'MODERATION'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Listing Moderation Queue</span>
            <span className="px-1.5 py-0.2 bg-slate-950 text-emerald-400 text-[10px] rounded-full font-mono">
              {listings.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('ZONAL_RATES')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'ZONAL_RATES'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Zonal Valuation Rates</span>
          </button>

          <button
            onClick={() => setAdminTab('ALERTS')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'ALERTS'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispute & Fraud Alerts</span>
          </button>

          <button
            onClick={() => setAdminTab('AUDIT_LEDGER')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              adminTab === 'AUDIT_LEDGER'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>SHA-256 Audit Ledger</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {adminTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Facilitated Land Volume</span>
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mb-1">
                  {formatINR(totalMarketValuation)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{listings.length} Dispur parcels voluntarily listed</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>State Facilitation Revenue</span>
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mb-1">
                  {formatINR(totalFacilitationRevenue)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Levied at 0.25% • Self-funds ASDC GIS stack
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Citizen Broker Savings</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
                  {formatINR(totalAvoidedBrokerFees)}
                </div>
                <div className="text-[11px] text-emerald-300">
                  Calculated at 5% baseline avoided commission
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Gold Title Clearance Rate</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-purple-400 mb-1">
                  {Math.round((goldVerifiedCount / listings.length) * 100)}%
                </div>
                <div className="text-[11px] text-slate-400">
                  {goldVerifiedCount} of {listings.length} parcels fully clean title
                </div>
              </div>
            </div>

            {/* Circle Projection Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Kamrup Metropolitan District Scaling Model</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Phase 1: Dispur Pilot</span>
                    <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">₹7.50 Cr / yr</div>
                  <p className="text-[11px] text-slate-400">Target 1,500 facilitated trades. Citizen savings: ₹15.0 Cr.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Phase 2: Kamrup Metro</span>
                    <span className="text-cyan-400 font-mono text-[11px]">MONTH 9</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">₹15.00 Cr / yr</div>
                  <p className="text-[11px] text-slate-400">Expanded across 6 revenue circles. Citizen savings: ₹60.0 Cr.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Phase 3: Statewide Assam</span>
                    <span className="text-purple-400 font-mono text-[11px]">MONTH 18</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-white">₹45.00+ Cr / yr</div>
                  <p className="text-[11px] text-slate-400">All 35 districts. Complete elimination of broker cartels.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LISTING MODERATION QUEUE */}
        {adminTab === 'MODERATION' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Dag, ID, or Village..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setModerationFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${moderationFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  All ({listings.length})
                </button>
                <button
                  onClick={() => setModerationFilter('VERIFIED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${moderationFilter === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-emerald-400'}`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setModerationFilter('FLAGGED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${moderationFilter === 'FLAGGED' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-amber-400'}`}
                >
                  Flagged
                </button>
              </div>
            </div>

            {/* Moderation Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Parcel ID & Dag</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Area & Land Class</th>
                      <th className="py-3 px-4">Asking vs Zonal</th>
                      <th className="py-3 px-4">Title Score</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Moderator Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredModerationListings.map(listing => {
                      const badge = listing.governmentVerified.titleClearanceBadge;

                      return (
                        <tr key={listing.id} className="hover:bg-slate-850 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-white">Dag {listing.governmentVerified.dagNumber}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Patta {listing.governmentVerified.pattaNumber} • {listing.id}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-slate-200">{listing.village}</div>
                            <div className="text-[11px] text-slate-400">{listing.mouza}, {listing.circle}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-mono text-slate-200">{formatBKL(listing.governmentVerified.recordedAreaBKL)}</div>
                            <div className="text-[11px] text-slate-400">{listing.governmentVerified.landClass}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-emerald-400 font-mono">{formatINR(listing.sellerRepresentations.askingPriceINR)}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Zonal: {formatINR(listing.governmentVerified.totalZonalValuationINR)}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                              {listing.governmentVerified.titleScore}/100
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                              badge === 'GOLD_VERIFIED' 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : badge === 'SILVER_VERIFIED' 
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                                : badge === 'CONDITIONAL' 
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {badge.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInspectListing(listing)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="Inspect RoR & Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleModerateListing(listing.id, 'VERIFIED_AVAILABLE', 'Approved')}
                                className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800"
                                title="Approve Listing"
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleModerateListing(listing.id, 'FLAGGED_DISCREPANCY', 'Flagged')}
                                className="p-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-400 border border-amber-800"
                                title="Flag Discrepancy"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleModerateListing(listing.id, 'PAUSED', 'Paused')}
                                className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800"
                                title="Put on Hold / Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ZONAL RATE MANAGEMENT */}
        {adminTab === 'ZONAL_RATES' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Circle Zonal Valuation Engine Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Statutory land unit value floors (₹/Bigha) under Kamrup Metropolitan Gazette Notifications
                  </p>
                </div>

                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-xl">
                  Dispur Circle Active
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Mouza & Circle</th>
                      <th className="py-3 px-4">Land Class</th>
                      <th className="py-3 px-4">Gazetted Rate / Bigha</th>
                      <th className="py-3 px-4">PWD Frontage Multiplier</th>
                      <th className="py-3 px-4">Last Revised</th>
                      <th className="py-3 px-4 text-right">Officer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {zonalRates.map(row => {
                      const isEditing = editingMouza === row.mouza;

                      return (
                        <tr key={row.mouza} className="hover:bg-slate-850 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-white">{row.mouza}</span>
                            <span className="text-[11px] text-slate-400 block">{row.circle} Circle</span>
                          </td>

                          <td className="py-3 px-4 text-slate-300">
                            {row.landClass}
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                            {isEditing ? (
                              <input
                                type="number"
                                defaultValue={row.gazettedRatePerBighaINR}
                                onChange={(e) => setEditRateValue(Number(e.target.value))}
                                className="w-36 bg-slate-950 border border-emerald-500 rounded px-2 py-1 text-xs text-white"
                              />
                            ) : (
                              formatINR(row.gazettedRatePerBighaINR)
                            )}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-300">
                            +{((row.pwdRoadFrontageMultiplier - 1) * 100).toFixed(0)}% ({row.pwdRoadFrontageMultiplier}x)
                          </td>

                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {row.lastRevisionDate}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveZonalRate(row.mouza)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingMouza(null)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingMouza(row.mouza);
                                  setEditRateValue(row.gazettedRatePerBighaINR);
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs ml-auto"
                              >
                                <Edit3 className="w-3 h-3 text-emerald-400" />
                                <span>Adjust Rate</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DISPUTE & FRAUD ALERTS */}
        {adminTab === 'ALERTS' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Active Telemetry Watchlist</span>
                  </span>
                  <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                    2 Triggered
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/50 space-y-1">
                    <div className="flex justify-between font-bold text-rose-400">
                      <span>Chapter X Protected Belt Violation Attempt</span>
                      <span className="font-mono text-[10px]">CRITICAL</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Attempted voluntary listing of tribal block parcel in Sonapur by non-protected class transferee. Automatically halted by rule CHK-07.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-900/50 space-y-1">
                    <div className="flex justify-between font-bold text-amber-400">
                      <span>Cadastral Area Variance Alert</span>
                      <span className="font-mono text-[10px]">MONITOR</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Parcel ALE-KAM-NGU-004 area difference between GIS polygon and Jamabandi is 0.45%. Within statutory tolerance (&lt;5%), verified green.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Automated Rule Safeguards Status</span>
                  </span>
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                    8/8 Active
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span>1. Patta Tenure Alienability (Khiraj Myadi)</span>
                    <span className="text-emerald-400 font-mono">ACTIVE (20 pts)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span>2. Bhudakshya Cadastral Area Variance &lt;= 5%</span>
                    <span className="text-emerald-400 font-mono">ACTIVE (15 pts)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span>3. Co-Sharer Partition 100% Consent</span>
                    <span className="text-emerald-400 font-mono">ACTIVE (15 pts)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span>4. e-Khajana Revenue Tax Clearance</span>
                    <span className="text-emerald-400 font-mono">ACTIVE (10 pts)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CRYPTOGRAPHIC AUDIT LEDGER */}
        {adminTab === 'AUDIT_LEDGER' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Hash className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic SHA-256 Audit Trail</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Immutable event sequence capturing all listing approvals, circle officer actions, and state transitions
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  SHA-256 Append-Only
                </span>
              </div>

              <div className="space-y-2">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{log.action}</span>
                        <span className="text-slate-600">•</span>
                        <span>{log.id}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{log.timestamp}</span>
                    </div>

                    <div className="text-slate-200 font-sans text-xs">
                      {log.details}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>Authorized By: <strong className="text-slate-400 font-sans">{log.officer}</strong></span>
                      <span className="truncate max-w-[200px] text-slate-600">hash: {log.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INSPECTION MODAL */}
        {inspectListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold bg-slate-800 px-2.5 py-1 rounded text-white border border-slate-700">
                    Dag {inspectListing.governmentVerified.dagNumber}
                  </span>
                  <span className="text-xs text-slate-400">Patta {inspectListing.governmentVerified.pattaNumber}</span>
                </div>
                <button onClick={() => setInspectListing(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-sm text-slate-100">{inspectListing.title}</h4>
                <p className="text-slate-400">{inspectListing.sellerRepresentations.propertyHighlights}</p>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Recorded Area</span>
                    <span className="font-mono font-bold text-slate-200">{formatBKL(inspectListing.governmentVerified.recordedAreaBKL)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Zonal Benchmark</span>
                    <span className="font-mono font-bold text-slate-200">{formatINR(inspectListing.governmentVerified.totalZonalValuationINR)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Asking Price</span>
                    <span className="font-mono font-bold text-emerald-400">{formatINR(inspectListing.sellerRepresentations.askingPriceINR)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Title Clearance</span>
                    <span className="font-bold text-emerald-400">{inspectListing.governmentVerified.titleClearanceBadge}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setInspectListing(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleModerateListing(inspectListing.id, 'VERIFIED_AVAILABLE', 'Approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Listing</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
