import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Download, 
  Eye, 
  Check, 
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { LandMarketplaceListing } from '../types/landRecords';
import { formatBKL, formatINR } from '../services/marketplaceEngine';

interface WorkflowTrackerProps {
  listings: LandMarketplaceListing[];
  onSelectListing: (listing: LandMarketplaceListing) => void;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  listings,
  onSelectListing
}) => {
  const [selectedListing, setSelectedListing] = useState<LandMarketplaceListing>(
    listings.find(l => l.stage !== 'VERIFIED_AVAILABLE') || listings[0]
  );
  const [showNOCPreview, setShowNOCPreview] = useState(false);

  const stages = [
    {
      num: 1,
      id: 'LISTED',
      name: 'Voluntary Listing & Audit',
      desc: 'Jamabandi & Bhudakshya GIS 8-point auto-reconciliation',
      status: 'COMPLETED'
    },
    {
      num: 2,
      id: 'EOI_AGREED',
      name: 'Buyer EOI & Price Agreement',
      desc: 'Buyer offer accepted; mutual transaction terms locked',
      status: selectedListing.stage !== 'VERIFIED_AVAILABLE' ? 'COMPLETED' : 'IN_PROGRESS'
    },
    {
      num: 3,
      id: 'ESCROW_TOKEN',
      name: 'Milestone Token Escrow',
      desc: 'Earnest deposit secured in State-facilitated escrow',
      status: selectedListing.stage === 'OFFER_ACCEPTED' || selectedListing.stage === 'SALE_NOC_IN_PROGRESS' ? 'COMPLETED' : 'PENDING'
    },
    {
      num: 4,
      id: 'SALE_NOC',
      name: 'Circle Officer Sale NOC',
      desc: 'Automated statutory inquiry & 30-day public objection clearance',
      status: selectedListing.stage === 'SALE_NOC_IN_PROGRESS' ? 'IN_PROGRESS' : selectedListing.stage === 'COMPLETED_MUTATED' ? 'COMPLETED' : 'PENDING'
    },
    {
      num: 5,
      id: 'REGISTRATION_MUTATION',
      name: 'e-Panjeeyan & Auto-Mutation',
      desc: 'Sub-Registrar deed execution & Mission Basundhara 3.0 mutation',
      status: selectedListing.stage === 'COMPLETED_MUTATED' ? 'COMPLETED' : 'PENDING'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Assisted Conveyancing Pipeline <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full font-normal">লেনদেন প্ৰক্ৰিয়া</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end statutory facilitation: From verified discovery to biometric Sub-Registrar registration and auto-mutation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Active Transaction:</span>
            <select
              value={selectedListing.id}
              onChange={(e) => {
                const found = listings.find(l => l.id === e.target.value);
                if (found) setSelectedListing(found);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none"
            >
              {listings.map(l => (
                <option key={l.id} value={l.id}>
                  {l.id} (Dag {l.governmentVerified.dagNumber} • {l.circle})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5-Step Visual Progress Stepper */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                Case ID: {selectedListing.id}
              </span>
              <h2 className="text-base font-bold text-white mt-2">
                {selectedListing.title}
              </h2>
              <p className="text-xs text-slate-400">
                Dag {selectedListing.governmentVerified.dagNumber}, Patta {selectedListing.governmentVerified.pattaNumber} • {selectedListing.village}, {selectedListing.circle}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Agreed Transaction Value</span>
              <span className="text-xl font-mono font-bold text-emerald-400 block">
                {formatINR(selectedListing.sellerRepresentations.askingPriceINR)}
              </span>
              <span className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Facilitation Fee: {formatINR(selectedListing.estimatedFacilitationFeeINR)}
              </span>
            </div>
          </div>

          {/* Stepper Line */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
            {stages.map((st) => (
              <div
                key={st.num}
                className={`p-3.5 rounded-xl border relative ${
                  st.status === 'COMPLETED'
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                    : st.status === 'IN_PROGRESS'
                    ? 'bg-blue-950/40 border-blue-600 text-blue-200 ring-1 ring-blue-500/50 animate-pulse'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 text-xs font-mono font-bold flex items-center justify-center">
                    {st.num}
                  </span>
                  {st.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : st.status === 'IN_PROGRESS' ? (
                    <Clock className="w-4 h-4 text-blue-400" />
                  ) : (
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Pending</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-200">{st.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Stage Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          
          {/* Card 1: Verified Parties & EOI Terms */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Authenticated Parties</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Lawful Seller (Pattadar)</span>
                <span className="font-bold text-slate-200 text-xs block">
                  {selectedListing.governmentVerified.pattadars[0]?.nameMasked}
                </span>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Phone: {selectedListing.governmentVerified.pattadars[0]?.phoneMasked}
                </span>
                <span className="text-[10px] text-emerald-400 block">✓ Aadhaar e-KYC Authenticated</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Active Buyer EOI</span>
                <span className="font-bold text-slate-200 text-xs block">
                  {selectedListing.offers[0]?.buyerNameMasked || 'Dr. Ananya B***'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Phone: {selectedListing.offers[0]?.buyerPhoneMasked || '+91 98640 ***44'}
                </span>
                <span className="text-[10px] text-blue-400 block">✓ Earnest Escrow Deposited (₹2,00,000)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Circle Officer Sale NOC Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Circle Officer Sale NOC</h3>
              </div>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
                {selectedListing.circle} Circle
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Sale NOC pre-populated automatically from verified Jamabandi & Bhudakshya layers. Mandals field inquiry pre-cleared via 8-point automated engine.
              </p>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                <span className="text-slate-500 block text-[10px]">NOC Application Ref</span>
                <span className="font-mono font-bold text-slate-200">NOC-DIS-2026-08942</span>
                <span className="text-emerald-400 text-[10px] block">Public Objection Window: 0 Objections Received</span>
              </div>

              <button
                onClick={() => setShowNOCPreview(!showNOCPreview)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showNOCPreview ? 'Hide NOC Draft' : 'Preview Pre-Filled Sale NOC'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: e-Panjeeyan & Basundhara Hand-off */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Registration & Mutation</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">e-Panjeeyan Sub-Registrar Slot</span>
                <span className="font-bold text-slate-200 block">Sub-Registrar Office, Kamrup Metro</span>
                <span className="text-emerald-400 text-[10px] block">Biometric Deed Execution Scheduled</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Mission Basundhara 3.0 Mutation</span>
                <span className="font-bold text-slate-200 block">Auto-Triggered upon Deed Registration</span>
                <span className="text-slate-400 text-[10px] block">Target Turnaround: 72 Hours straight-through</span>
              </div>
            </div>
          </div>

        </div>

        {/* NOC Draft Preview Modal / Drawer */}
        {showNOCPreview && (
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Government of Assam • Office of the Circle Officer, {selectedListing.circle}</h4>
              </div>
              <button onClick={() => setShowNOCPreview(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 leading-relaxed">
              <div className="text-center font-bold text-white pb-2 border-b border-slate-800">
                NO OBJECTION CERTIFICATE FOR TRANSFER OF IMMOVABLE PROPERTY (DRAFT)
              </div>
              <div>Certified that land measuring <strong>{formatBKL(selectedListing.governmentVerified.recordedAreaBKL)}</strong> covered by Dag No. <strong>{selectedListing.governmentVerified.dagNumber}</strong> and Patta No. <strong>{selectedListing.governmentVerified.pattaNumber}</strong> of Village <strong>{selectedListing.village}</strong>, Mouza <strong>{selectedListing.mouza}</strong> has been audited through the <em>Assam Land Exchange</em>.</div>
              <div>1. Alienability: Periodic Patta (Khiraj Myadi) confirmed.</div>
              <div>2. Chapter X Status: Complies with Tribal Belt/Block transfer provisions.</div>
              <div>3. Encumbrances: Zero adverse bank charges or court stay notices found.</div>
              <div>Recommended for execution of registered deed at Sub-Registrar Office, Kamrup Metro.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
