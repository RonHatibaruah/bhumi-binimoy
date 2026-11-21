import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { LandMarketplaceListing } from '../types/landRecords';
import { formatINR, formatBKL } from '../services/marketplaceEngine';

interface AdminConsoleProps {
  listings: LandMarketplaceListing[];
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ listings }) => {
  const [selectedCircleView, setSelectedCircleView] = useState('Dispur');

  const totalMarketValuation = listings.reduce((sum, l) => sum + l.sellerRepresentations.askingPriceINR, 0);
  const totalFacilitationRevenue = listings.reduce((sum, l) => sum + l.estimatedFacilitationFeeINR, 0);
  const totalAvoidedBrokerFees = Math.round(totalMarketValuation * 0.05);
  const goldVerifiedCount = listings.filter(l => l.governmentVerified.titleClearanceBadge === 'GOLD_VERIFIED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded">
                Super Admin & Circle Officer Command
              </span>
              <span className="text-xs text-slate-400">Assam State Data Centre (ASDC)</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Assam Land Exchange Command Console <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-normal">ৰাজহ বিভাগ নিয়ন্ত্ৰণ কক্ষ</span>
            </h1>
            <p className="text-xs text-slate-400">
              Department of Revenue & Disaster Management • Dispur Pilot Governance Telemetry & Anti-Fraud Oversight
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Active Pilot Circle:</span>
            <span className="text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-lg">
              Dispur Circle (Kamrup Metro)
            </span>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold">Active Verified Volume</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {formatINR(totalMarketValuation)}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span>{listings.length} parcels ({goldVerifiedCount} Gold Verified)</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold">State Facilitation Revenue</span>
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-purple-400">
              {formatINR(totalFacilitationRevenue)}
            </div>
            <div className="text-[11px] text-slate-400">
              At 0.25% statutory facilitation fee rate
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold">Citizen Savings vs Brokers</span>
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-teal-300">
              {formatINR(totalAvoidedBrokerFees)}
            </div>
            <div className="text-[11px] text-slate-400">
              Avoided 5% private broker commissions
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-semibold">Due-Diligence Time</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-blue-400">
              &lt; 5 Minutes
            </div>
            <div className="text-[11px] text-emerald-400">
              Down from 45 days manual searches
            </div>
          </div>

        </div>

        {/* Voluntary Listing Verification & Approval Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Circle Officer Voluntary Listing Verification Queue</h3>
            </div>
            <span className="text-xs text-slate-400">
              Pre-cleared via automated 8-point statutory reconciliation
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Listing Ref</th>
                  <th className="py-2.5 px-3">Dag / Patta</th>
                  <th className="py-2.5 px-3">Village / Mouza</th>
                  <th className="py-2.5 px-3">Recorded Area</th>
                  <th className="py-2.5 px-3">Asking vs Zonal</th>
                  <th className="py-2.5 px-3">Title Badge</th>
                  <th className="py-2.5 px-3">Statutory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {listings.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{l.id}</td>
                    <td className="py-2.5 px-3 font-mono">Dag {l.governmentVerified.dagNumber} • {l.governmentVerified.pattaNumber}</td>
                    <td className="py-2.5 px-3">{l.village}, {l.mouza}</td>
                    <td className="py-2.5 px-3 font-mono">{formatBKL(l.governmentVerified.recordedAreaBKL)}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-200">{formatINR(l.sellerRepresentations.askingPriceINR)}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Zonal: {formatINR(l.governmentVerified.totalZonalValuationINR)}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        l.governmentVerified.titleClearanceBadge === 'GOLD_VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {l.governmentVerified.titleClearanceBadge.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-400 font-medium">✓ Verified & Live on Map</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* State Economic & Non-Tax Revenue Projections */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">State Facilitation Revenue & Policy Modeling</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
              <span className="text-slate-400 block text-[11px]">Dispur Pilot Annual Target</span>
              <span className="text-lg font-mono font-bold text-white">₹7.50 Crore</span>
              <p className="text-[10px] text-slate-500">Based on 1,500 facilitated transactions at 0.25% fee</p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
              <span className="text-slate-400 block text-[11px]">Kamrup Metro Full Coverage</span>
              <span className="text-lg font-mono font-bold text-purple-400">₹15.00 Crore / year</span>
              <p className="text-[10px] text-slate-500">Self-funds State Land Records digitization & WebGIS maintenance</p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
              <span className="text-slate-400 block text-[11px]">Statewide Assam Potential (35 Districts)</span>
              <span className="text-lg font-mono font-bold text-emerald-400">₹45.00+ Crore / year</span>
              <p className="text-[10px] text-slate-500">Permanent non-tax revenue stream for Revenue Department</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
