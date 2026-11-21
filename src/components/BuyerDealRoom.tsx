import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  DollarSign, 
  Scale, 
  Download, 
  Send, 
  Info, 
  Clock, 
  Check, 
  PhoneCall, 
  UserCheck, 
  Tag,
  ArrowRight
} from 'lucide-react';
import { LandMarketplaceListing, BuyerOffer } from '../types/landRecords';
import { formatBKL, formatINR, calculateTransactionFees } from '../services/marketplaceEngine';

interface BuyerDealRoomProps {
  listing: LandMarketplaceListing;
  onBackToMap: () => void;
  onSubmitOffer: (listingId: string, offer: BuyerOffer) => void;
}

export const BuyerDealRoom: React.FC<BuyerDealRoomProps> = ({
  listing,
  onBackToMap,
  onSubmitOffer
}) => {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [offerAmount, setOfferAmount] = useState(listing.sellerRepresentations.askingPriceINR);
  const [earnestDeposit, setEarnestDeposit] = useState(200000);
  const [paymentTerms, setPaymentTerms] = useState('10% token deposit, balance via bank transfer upon Sale NOC approval.');
  const [offerSuccessMessage, setOfferSuccessMessage] = useState(false);

  const gov = listing.governmentVerified;
  const seller = listing.sellerRepresentations;
  const fees = calculateTransactionFees(seller.askingPriceINR, gov.totalZonalValuationINR, listing.facilitationFeePct);

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: BuyerOffer = {
      id: `OFF-${Date.now()}`,
      buyerNameMasked: buyerName.length > 2 ? `${buyerName.slice(0, 2)}***` : 'Buyer***',
      buyerPhoneMasked: buyerPhone.length > 5 ? `${buyerPhone.slice(0, 5)}***` : '+91 98***',
      offeredAmountINR: Number(offerAmount),
      earnestDepositTokenINR: Number(earnestDeposit),
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      proposedPaymentTerms: paymentTerms
    };

    onSubmitOffer(listing.id, newOffer);
    setOfferSuccessMessage(true);
    setTimeout(() => {
      setOfferSuccessMessage(false);
      setIsOfferModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToMap}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
          >
            ← Back to Cadastral Marketplace
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Listing Reference:</span>
            <span className="font-mono text-xs font-bold bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
              {listing.id}
            </span>
          </div>
        </div>

        {/* Hero Title & Verification Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg">
                  Dag {gov.dagNumber} • Patta {gov.pattaNumber}
                </span>

                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  gov.titleClearanceBadge === 'GOLD_VERIFIED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : gov.titleClearanceBadge === 'SILVER_VERIFIED'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  ✨ {gov.titleClearanceBadge.replace('_', ' ')}
                </span>

                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                  {gov.pattaType}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {listing.title}
              </h1>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Village {listing.village}, Mouza {listing.mouza}, Revenue Circle {listing.circle}, District {listing.district}
              </p>
            </div>

            {/* Quick Price & Action Box */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 shrink-0">
              <div className="text-left lg:text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Voluntary Asking Price</span>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 block">
                  {formatINR(seller.askingPriceINR)}
                </span>
                <span className="text-xs text-slate-400">
                  ({formatINR(seller.askingPricePerBighaINR)} / Bigha)
                </span>
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Express Interest & Submit Offer</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mandatory Statutory Non-Certification Disclaimer */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 flex items-start gap-3 text-amber-200/90 text-xs">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300">Mandatory Statutory Notice & Non-Warranty Disclaimer</h4>
            <p className="leading-relaxed text-amber-200/80">
              Information displayed on this portal reflects authenticated records available with the Government of Assam as of query date. Listing on the portal does not in itself constitute a formal guarantee or certification of title, nor does it guarantee that a statutory transfer will be approved. All active conveyances remain strictly subject to official revenue inquiries, public objection windows, and final registration under the <em>Assam Land and Revenue Regulation (ALRR), 1886</em>.
            </p>
          </div>
        </div>

        {/* Core Side-by-Side Comparison: Truth Separation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* COLUMN 1: Government-Verified Official Particulars */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Government-Verified Official Particulars</h3>
              </div>
              <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                Dharitree & Bhudakshya Sync
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Dag Number</span>
                <span className="font-mono font-bold text-slate-100 text-sm">{gov.dagNumber}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Patta Number</span>
                <span className="font-mono font-bold text-slate-100 text-sm">{gov.pattaNumber}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Patta Tenure Type</span>
                <span className="font-semibold text-emerald-400">{gov.pattaType}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Official Land Classification</span>
                <span className="font-semibold text-slate-200">{gov.landClass}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Jamabandi Recorded Area</span>
                <span className="font-mono font-bold text-slate-100">{formatBKL(gov.recordedAreaBKL)}</span>
                <span className="text-[10px] text-slate-400 block">({gov.recordedAreaSqM} sq.m)</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Bhudakshya Cadastral Polygon Area</span>
                <span className="font-mono font-bold text-slate-100">{gov.cadastralPolygonAreaSqM} sq.m</span>
                <span className="text-[10px] text-emerald-400 block">Variance: {gov.areaVariancePct.toFixed(2)}% (Clean)</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Zonal Valuation Rate</span>
                <span className="font-mono font-bold text-slate-200">{formatINR(gov.zonalRatePerBighaINR)} / Bigha</span>
                <span className="text-[10px] text-slate-400 block">Total: {formatINR(gov.totalZonalValuationINR)}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">e-Khajana Revenue Status</span>
                <span className={`font-bold flex items-center gap-1 ${gov.eKhajanaStatus.isClear ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {gov.eKhajanaStatus.isClear ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {gov.eKhajanaStatus.isClear ? 'Paid & Clear' : `Arrears: ₹${gov.eKhajanaStatus.arrearsINR}`}
                </span>
                <span className="text-[10px] text-slate-400 block">Annual Touzi: ₹{gov.eKhajanaStatus.annualTouziDemandINR}</span>
              </div>
            </div>

            {/* Pattadar Co-Sharer Table */}
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Recorded Pattadar Ownership (DPDP Masked for Privacy)
              </span>
              <div className="space-y-1.5">
                {gov.pattadars.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900 border border-slate-800">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {p.nameMasked} ({p.guardianNameMasked})
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{p.sharePercentage}% Share</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Encumbrances & Tribal Belt Status */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Bank Hypothecation / Liens</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Zero Active Liens
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Chapter X Tribal Belt Status</span>
                <span className={`font-semibold flex items-center gap-1 mt-0.5 ${
                  gov.chapterXTribalBeltStatus === 'OUTSIDE_TRIBAL_BELT' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {gov.chapterXTribalBeltStatus === 'OUTSIDE_TRIBAL_BELT' ? 'Outside Tribal Belt' : 'Protected Class Only'}
                </span>
              </div>
            </div>

          </div>

          {/* COLUMN 2: Seller Representations & Self-Declarations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Seller Representations & Property Commercials</h3>
              </div>
              <span className="text-[11px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                Self-Reported by Owner
              </span>
            </div>

            {/* Price Discovery & Zonal Benchmark Assessment */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">Price Discovery Benchmark</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  {seller.fairValueAssessment.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Seller Asking Price:</span>
                <span className="font-mono font-bold text-emerald-400">{formatINR(seller.askingPriceINR)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Government Zonal Value Benchmark:</span>
                <span className="font-mono text-slate-300">{formatINR(gov.totalZonalValuationINR)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Asking Variance vs. Zonal Rate:</span>
                <span className="font-mono font-bold text-amber-400">+{seller.priceOverZonalPct.toFixed(1)}%</span>
              </div>
            </div>

            {/* Highlights & Approach Road */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Property Description & Highlights</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{seller.propertyHighlights}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 block text-[11px]">Approach Road Width</span>
                  <span className="font-bold text-slate-100">{seller.approachRoadWidthFeet} Feet (Pucca)</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 block text-[11px]">Possession Readiness</span>
                  <span className="font-bold text-emerald-400">{seller.possessionStatus.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Amenities Badges */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <span className="text-slate-400 block text-[11px] mb-2">Available Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {seller.amenities.map((amenity, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-slate-700">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Voluntary Consent Declaration Card */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Lawful Owner's Voluntary Consent Declaration
                </span>
                <p className="text-[11px] text-emerald-200/80 italic">
                  "{seller.voluntaryConsentDeclaration}"
                </p>
                <span className="text-[10px] text-emerald-400/60 block pt-1 font-mono">
                  Digitally Authenticated: {new Date(seller.voluntaryConsentTimestamp).toLocaleString()}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Financial Transparency: Statutory Transfer Fees & Broker Savings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Transparent Statutory Transfer Fee Schedule</h3>
            </div>
            <span className="text-xs text-slate-400">
              Taxable Basis: Higher of Asking ({formatINR(seller.askingPriceINR)}) or Zonal ({formatINR(gov.totalZonalValuationINR)})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Assam Stamp Duty (6.0%)</span>
              <span className="text-lg font-mono font-bold text-slate-100">{formatINR(fees.stampDutyINR)}</span>
              <span className="text-[10px] text-slate-500 block">Payable via e-Challan / GRAS</span>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Registration Cess (2.0%)</span>
              <span className="text-lg font-mono font-bold text-slate-100">{formatINR(fees.registrationFeeINR)}</span>
              <span className="text-[10px] text-slate-500 block">Sub-Registrar e-Panjeeyan fee</span>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Govt Facilitation Fee ({listing.facilitationFeePct}%)</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{formatINR(fees.facilitationFeeINR)}</span>
              <span className="text-[10px] text-emerald-400/80 block">State Facilitation Revenue</span>
            </div>

            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60">
              <span className="text-emerald-300 block text-[11px] font-bold">Citizen Net Savings vs Private Broker</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{formatINR(fees.savingsComparedToBrokerINR)}</span>
              <span className="text-[10px] text-emerald-300/80 block">Avoided 5% private broker fee</span>
            </div>
          </div>
        </div>

        {/* 8-Point Title Due-Diligence Audit Ledger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">8-Point Statutory Due-Diligence Ledger</h3>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full">
              Title Score: {gov.titleScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gov.checks.map(check => (
              <div key={check.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {check.code}
                    </span>
                    <h5 className="font-bold text-slate-200">{check.title}</h5>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{check.details}</p>
                  <span className="text-[10px] text-slate-500 italic block">{check.statutoryReference}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    check.status === 'PASSED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : check.status === 'WARNING'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {check.status}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 block mt-1">
                    {check.points} / {check.maxPoints} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                Submit Expression of Interest (EOI)
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {offerSuccessMessage ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-emerald-300">EOI & Offer Successfully Logged!</h4>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  Your formal Expression of Interest has been securely dispatched to lawful Pattadar <strong>{gov.pattadars[0]?.nameMasked}</strong> and registered in the Revenue Department Assisted Workflow Pipeline.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name (Buyer)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Barua"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number (Aadhaar Linked for OTP)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98640 12345"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Offered Amount (INR)</label>
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Earnest Token Deposit (INR)</label>
                    <input
                      type="number"
                      required
                      value={earnestDeposit}
                      onChange={(e) => setEarnestDeposit(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Proposed Payment Terms</label>
                  <textarea
                    rows={2}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  *Submitting an EOI incurs zero platform charge. Token escrow is activated only after seller acceptance.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/60"
                  >
                    Dispatch Formal EOI
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
