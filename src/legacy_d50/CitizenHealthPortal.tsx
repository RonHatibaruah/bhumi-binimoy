import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  FileText, 
  Printer, 
  Send, 
  HelpCircle,
  Building,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';
import { formatBKL } from '../services/healthCheckEngine';

interface CitizenHealthPortalProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
}

export const CitizenHealthPortal: React.FC<CitizenHealthPortalProps> = ({
  records,
  onSelectRecord
}) => {
  const [selectedVillage, setSelectedVillage] = useState<string>('Jatia');
  const [queryDag, setQueryDag] = useState<string>('101');
  const [searchedRecord, setSearchedRecord] = useState<LandRecord | null>(
    records.find(r => r.dagNumber === '101') || records[0]
  );
  const [correctionRequested, setCorrectionRequested] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionRequested(false);
    const found = records.find(r => 
      r.dagNumber.trim() === queryDag.trim() && 
      (selectedVillage === 'ALL' || r.village.toLowerCase() === selectedVillage.toLowerCase())
    );
    setSearchedRecord(found || null);
  };

  const handlePresetSelect = (dagNum: string, village: string) => {
    setQueryDag(dagNum);
    setSelectedVillage(village);
    setCorrectionRequested(false);
    const found = records.find(r => r.dagNumber === dagNum);
    setSearchedRecord(found || null);
  };

  const printHealthCard = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Citizen Welcome Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Assam Citizen Land Health Self-Check • আপোনাৰ ভূমি স্বাস্থ্য পৰীক্ষা</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Check Your Land Record Before You Transact
        </h2>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Scan your Dag and Patta records against official cadastral GIS maps and revenue rolls to catch errors and boundary discrepancies early, preventing delays during sale, mutation, or bank loans.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Village / গাঁও
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500"
            >
              <option value="Jatia">Jatia (Dispur Circle)</option>
              <option value="Khanapara">Khanapara (Dispur Circle)</option>
              <option value="Sonapur Gaon">Sonapur Gaon (Sonapur Circle)</option>
              <option value="Jakhalabandha">Jakhalabandha (Kaliabor Circle)</option>
              <option value="ALL">All Villages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dag Number / দাগ নং
            </label>
            <input
              type="text"
              value={queryDag}
              onChange={(e) => setQueryDag(e.target.value)}
              placeholder="e.g. 101, 102, 103, 205..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Generate Land Health Card</span>
          </button>

        </form>

        {/* Quick Presets for Demo */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Demo Scenarios:</span>
          <button
            type="button"
            onClick={() => handlePresetSelect('101', 'Jatia')}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold hover:bg-emerald-100"
          >
            ✓ Clean Record (Dag 101)
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('102', 'Jatia')}
            className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-semibold hover:bg-amber-100"
          >
            ⚠️ Area Shortfall (Dag 102)
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('103', 'Jatia')}
            className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold hover:bg-rose-100"
          >
            ⚠️ Map Overlap (Dag 103)
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('205', 'Khanapara')}
            className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-semibold hover:bg-purple-100"
          >
            ⚠️ Share Deficit (Dag 205)
          </button>
        </div>
      </div>

      {/* Result Card */}
      {searchedRecord ? (
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  Government of Assam • Land Record Health Evaluation
                </span>
                <h3 className="text-xl font-extrabold mt-1">
                  Parcel Health Card: Dag No. {searchedRecord.dagNumber}
                </h3>
                <p className="text-xs text-slate-300">
                  Village: {searchedRecord.village} • Circle: {searchedRecord.circle} • Patta: {searchedRecord.pattaNumber}
                </p>
              </div>

              {/* Health Score Badge */}
              <div className={`px-4 py-2.5 rounded-xl border text-center shadow-md ${
                searchedRecord.healthReport.grade === 'GRADE_A' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600' :
                searchedRecord.healthReport.grade === 'GRADE_D' ? 'bg-rose-950/80 text-rose-400 border-rose-600' :
                'bg-amber-950/80 text-amber-400 border-amber-600'
              }`}>
                <div className="text-2xl font-black">{searchedRecord.healthReport.score}/100</div>
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  {searchedRecord.healthReport.riskStatus.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Status Recommendation Box */}
            {searchedRecord.healthReport.grade === 'GRADE_A' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    Record Status: Fast-Track Ready (উত্তম স্বাস্থ্য)
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Cadastral polygon geometry matches the recorded Jamabandi area with 0 boundary conflicts. All landholder shares are fully accounted for, and touzi revenue is up-to-date. Eligible for instant mutation upon transfer.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                    Action Required Before Mutation / Sale
                  </h4>
                  <p className="text-xs text-rose-800 mt-0.5">
                    This parcel has {searchedRecord.healthReport.anomalies.length} detected inconsistency. Applying for registration or bank mortgage right now may result in service delays or title objections.
                  </p>
                </div>
              </div>
            )}

            {/* Core Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Jamabandi Area</span>
                <span className="font-bold text-slate-900 text-sm font-mono">
                  {formatBKL(searchedRecord.jamabandiArea)}
                </span>
                <span className="text-[10px] text-slate-500 block">({searchedRecord.jamabandiAreaSqM.toFixed(1)} sq.m)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Bhudakshya GIS Area</span>
                <span className="font-bold text-slate-900 text-sm font-mono">
                  {formatBKL(searchedRecord.cadastralAreaBKL)}
                </span>
                <span className="text-[10px] text-slate-500 block">({searchedRecord.cadastralAreaSqM.toFixed(1)} sq.m)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Patta Type</span>
                <span className="font-bold text-slate-900">{searchedRecord.pattaType}</span>
                <span className="text-[10px] text-slate-500 block">{searchedRecord.landClass}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Annual Revenue</span>
                <span className="font-bold text-slate-900">₹{searchedRecord.annualRevenueRs.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">Touzi Assessed</span>
              </div>
            </div>

            {/* Detected Issues List */}
            {searchedRecord.healthReport.anomalies.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Identified Inconsistencies & Recommended Corrections
                </h4>
                <div className="space-y-2">
                  {searchedRecord.healthReport.anomalies.map((a) => (
                    <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{a.title}</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{a.description}</p>
                      <div className="text-slate-800 font-medium text-[11px] pt-1 border-t border-slate-200">
                        💡 <strong>Citizen Guide:</strong> {a.suggestedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pattadar Ownership Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Recorded Landholders (Pattadars)
              </h4>
              <div className="space-y-2">
                {searchedRecord.pattadars.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.relation} {p.guardianName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{p.sharePercentage}% Share</div>
                      <div className="text-[11px] text-emerald-600 font-medium">Aadhaar {p.aadhaarStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proactive Correction Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={printHealthCard}
                className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Health Card</span>
              </button>

              {searchedRecord.healthReport.grade !== 'GRADE_A' && (
                <div>
                  {correctionRequested ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Correction Application #MB-2026-9812 Filed with Circle Officer
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCorrectionRequested(true)}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Request Proactive Correction (Mission Basundhara)</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          No record found for Dag {queryDag} in selected village. Please verify the Dag number.
        </div>
      )}

    </div>
  );
};
