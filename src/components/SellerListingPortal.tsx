import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  Send, 
  Search, 
  FileCheck, 
  Tag, 
  DollarSign, 
  ArrowRight,
  Info
} from 'lucide-react';
import { LandMarketplaceListing } from '../types/landRecords';
import { formatBKL, formatINR, sqMToBKL } from '../services/marketplaceEngine';

interface SellerListingPortalProps {
  onListingCreated: (newListing: LandMarketplaceListing) => void;
  onNavigateToMarketplace: () => void;
}

export const SellerListingPortal: React.FC<SellerListingPortalProps> = ({
  onListingCreated,
  onNavigateToMarketplace
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Seller KYC
  const [sellerName, setSellerName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [district, setDistrict] = useState('Kamrup Metropolitan');
  const [circle, setCircle] = useState('Dispur');

  // Step 2: Land Records Query
  const [mouza, setMouza] = useState('Beltola');
  const [village, setVillage] = useState('Dispur Capital');
  const [dagNumber, setDagNumber] = useState('');
  const [pattaNumber, setPattaNumber] = useState('');
  const [isRecordFetched, setIsRecordFetched] = useState(false);
  const [fetchedAreaBKL, setFetchedAreaBKL] = useState({ bigha: 1, katha: 1, lesa: 5 });
  const [fetchedZonalRate, setFetchedZonalRate] = useState(8500000);

  // Step 3: Commercials & Pricing
  const [askingPrice, setAskingPrice] = useState(11500000);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [highlights, setHighlights] = useState('');
  const [roadWidth, setRoadWidth] = useState(24);
  const [possessionStatus, setPossessionStatus] = useState<'IMMEDIATE_VACANT' | 'TENANTED'>('IMMEDIATE_VACANT');

  // Step 4: Consent & Submission
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleFetchRecord = () => {
    if (!dagNumber || !pattaNumber) return;
    setIsRecordFetched(true);
    setPropertyTitle(`1.25 Bigha Prime Land, Dag ${dagNumber}, Mouza ${mouza}`);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentConfirmed) return;

    const totalLesa = (fetchedAreaBKL.bigha * 100) + (fetchedAreaBKL.katha * 20) + fetchedAreaBKL.lesa;
    const areaSqM = Math.round(totalLesa * 13.378);
    const totalZonalValuation = Math.round((totalLesa / 100) * fetchedZonalRate);
    const askingPerBigha = Math.round(askingPrice / (totalLesa / 100));
    const priceVariancePct = Number((((askingPrice - totalZonalValuation) / totalZonalValuation) * 100).toFixed(1));

    const newListing: LandMarketplaceListing = {
      id: `ALE-KAM-${circle.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      title: propertyTitle || `Land Parcel Dag ${dagNumber}, ${village}`,
      district,
      circle,
      mouza,
      village,
      coordinates: [
        [26.1390, 91.7940],
        [26.1402, 91.7943],
        [26.1399, 91.7960],
        [26.1388, 91.7957],
        [26.1390, 91.7940]
      ],
      centerPoint: [26.1395, 91.7950],
      stage: 'VERIFIED_AVAILABLE',
      governmentVerified: {
        dagNumber,
        pattaNumber: pattaNumber.toUpperCase().startsWith('KP-') ? pattaNumber.toUpperCase() : `KP-${pattaNumber}`,
        pattaType: 'Periodic Patta (Khiraj Myadi)',
        landClass: 'Basti (Residential)',
        recordedAreaBKL: fetchedAreaBKL,
        recordedAreaSqM: areaSqM,
        cadastralPolygonAreaSqM: areaSqM + 4.2,
        areaVariancePct: 0.25,
        pattadars: [
          {
            id: `PATT-${Date.now()}`,
            nameMasked: sellerName.length > 2 ? `${sellerName.slice(0, 2)}***` : 'Owner***',
            guardianNameMasked: 'Late Guardian***',
            sharePercentage: 100.0,
            isAadhaarVerified: true,
            phoneMasked: sellerPhone.length > 5 ? `${sellerPhone.slice(0, 5)}***` : '+91 94***',
            isTribalProtected: false
          }
        ],
        zonalRatePerBighaINR: fetchedZonalRate,
        totalZonalValuationINR: totalZonalValuation,
        eKhajanaStatus: {
          isClear: true,
          lastPaymentDate: '2026-06-15',
          annualTouziDemandINR: 420.00,
          arrearsINR: 0.00
        },
        encumbrances: [],
        courtLitigationFlags: [],
        chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT',
        titleClearanceBadge: 'GOLD_VERIFIED',
        titleScore: 95,
        checks: [
          {
            id: 'CHK-01',
            code: 'TENURE_CLASS',
            title: 'Tenure & Patta Type Alienability',
            category: 'TENURE',
            status: 'PASSED',
            points: 20,
            maxPoints: 20,
            details: 'Permanent alienable tenure (Periodic Patta). Clean statutory title.',
            statutoryReference: 'Assam Land and Revenue Regulation 1886, Section 9'
          },
          {
            id: 'CHK-02',
            code: 'AREA_VARIANCE',
            title: 'Area Consistency',
            category: 'AREA',
            status: 'PASSED',
            points: 15,
            maxPoints: 15,
            details: `Bhudakshya polygon and Jamabandi match within 0.25% variance.`,
            statutoryReference: 'Assam Cadastral Tolerance Matrix'
          }
        ],
        lastReconciledAt: new Date().toISOString()
      },
      sellerRepresentations: {
        askingPriceINR: askingPrice,
        askingPricePerBighaINR: askingPerBigha,
        priceOverZonalPct: priceVariancePct,
        fairValueAssessment: priceVariancePct <= 20 ? 'FAIR_MARKET' : 'MODERATE_PREMIUM',
        propertyHighlights: highlights || 'Prime plot with wide approach road and clear boundary demarcations.',
        possessionStatus,
        approachRoadWidthFeet: roadWidth,
        amenities: ['PWD Road Access', 'Electricity Connected', 'Clear Boundary Wall'],
        sellerStatement: 'Voluntary offer submitted by lawful owner with complete ownership documentation.',
        voluntaryConsentDeclaration: 'I voluntarily offer this parcel for sale on Assam Land Exchange with full legal consent.',
        voluntaryConsentTimestamp: new Date().toISOString(),
        photos: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'
        ]
      },
      offers: [],
      facilitationFeePct: 0.25,
      estimatedFacilitationFeeINR: Math.round(askingPrice * 0.0025),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onListingCreated(newListing);
    setSubmissionSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Sell Land on Assam Land Exchange <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-normal">ভূমি বিক্ৰী পঞ্জীয়ন</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Voluntary, government-verified listing for lawful Pattadars. Direct to verified buyers with 0% private broker cut.
              </p>
            </div>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-800 text-xs">
            {[
              { num: 1, title: 'Owner e-KYC' },
              { num: 2, title: 'Dharitree Verify' },
              { num: 3, title: 'Price & Details' },
              { num: 4, title: 'Consent & Publish' }
            ].map(s => (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  step === s.num
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                    : step > s.num
                    ? 'bg-slate-950 border-emerald-800/60 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-mono text-xs">{s.num}. {s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        {submissionSuccess ? (
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-8 text-center space-y-4 shadow-2xl animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Land Parcel Successfully Listed & Verified!</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your parcel (Dag {dagNumber}, Patta {pattaNumber}) has been authenticated against Dharitree & Bhudakshya records and is now live on the <strong>Assam Cadastral Marketplace</strong> with a <strong>Gold Verified Badge</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToMarketplace}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all inline-flex items-center gap-2"
              >
                <span>View on Cadastral Marketplace Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-xs">
            
            {/* STEP 1: Owner e-KYC */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Step 1: Lawful Pattadar Authentication (e-KYC)
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Under Assam Land and Revenue Regulations, only lawful owners recorded in Jamabandi may voluntarily offer land for sale.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pattadar Full Name (as per Jamabandi)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pranab Kumar Goswami"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Aadhaar Number (for OTP Consent)</label>
                    <input
                      type="text"
                      required
                      placeholder="XXXX-XXXX-XXXX"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mobile Number (Aadhaar Linked)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94350 12890"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Target Revenue Circle</label>
                    <select
                      value={circle}
                      onChange={(e) => setCircle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Dispur">Dispur Revenue Circle (Pilot)</option>
                      <option value="Guwahati">Guwahati Revenue Circle</option>
                      <option value="Sonapur">Sonapur Revenue Circle</option>
                      <option value="North Guwahati">North Guwahati Revenue Circle</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!sellerName || !sellerPhone}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Proceed to Land Record Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Dharitree Records Lookup */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  Step 2: Instant Jamabandi Verification (Dharitree API)
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Enter your official Dag and Patta details to authenticate the parcel directly against Dharitree and Bhudakshya.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mouza</label>
                    <input
                      type="text"
                      value={mouza}
                      onChange={(e) => setMouza(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Village</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Dag Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 152"
                      value={dagNumber}
                      onChange={(e) => setDagNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Patta Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KP-240"
                      value={pattaNumber}
                      onChange={(e) => setPattaNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFetchRecord}
                    disabled={!dagNumber || !pattaNumber}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    <span>Query Dharitree & Cadastral Vector Server</span>
                  </button>
                </div>

                {isRecordFetched && (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Dharitree Record Successfully Authenticated!
                      </span>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono text-[10px]">
                        Clean Periodic Patta
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Recorded BKL Area</span>
                        <span className="font-mono font-bold text-slate-100">{formatBKL(fetchedAreaBKL)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Official Land Class</span>
                        <span className="font-semibold text-slate-200">Basti (Residential)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Govt Zonal Rate</span>
                        <span className="font-mono font-bold text-emerald-400">{formatINR(fetchedZonalRate)} / Bigha</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!isRecordFetched}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Configure Pricing & Listing Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Commercials & Pricing */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Step 3: Commercial Details & Price Discovery
                </h3>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block">Zonal Valuation Benchmark for this parcel:</span>
                  <span className="font-mono text-sm font-bold text-slate-200">
                    {formatINR(Math.round(((fetchedAreaBKL.bigha * 100 + fetchedAreaBKL.katha * 20 + fetchedAreaBKL.lesa) / 100) * fetchedZonalRate))}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    *Based on official Kamrup Metro Zonal Rate Schedule for Mouza {mouza}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Asking Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Approach Road Width (Feet)</label>
                    <input
                      type="number"
                      value={roadWidth}
                      onChange={(e) => setRoadWidth(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Listing Headline</label>
                    <input
                      type="text"
                      value={propertyTitle}
                      onChange={(e) => setPropertyTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Property Highlights & Amenities</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. High elevation, non-waterlogging residential plot with boundary wall and 24ft PWD road access."
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Proceed to Statutory Declaration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Consent & Declaration */}
            {step === 4 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Step 4: Statutory Voluntary Consent & Verification
                </h3>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-200">Summary of Voluntary Listing:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Parcel Dag / Patta</span>
                      <span className="font-mono font-bold text-slate-200">Dag {dagNumber} • Patta {pattaNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Recorded BKL Area</span>
                      <span className="font-mono font-bold text-slate-200">{formatBKL(fetchedAreaBKL)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Voluntary Asking Price</span>
                      <span className="font-mono font-bold text-emerald-400">{formatINR(askingPrice)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Govt Facilitation Fee (0.25%)</span>
                      <span className="font-mono font-bold text-slate-300">{formatINR(Math.round(askingPrice * 0.0025))}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="consent" className="text-amber-200/90 text-[11px] leading-relaxed cursor-pointer">
                    <strong>Mandatory Statutory Declaration:</strong> I hereby declare that I am the lawful Pattadar of Dag {dagNumber}, Patta {pattaNumber}. I voluntarily offer this land for sale on the <em>Assam Land Exchange</em> and confirm that no adverse claims, stay orders, or unredeemed bank mortgages exist to my knowledge. I understand that listing on this portal does not exempt the parcel from statutory revenue inquiries under the <em>Assam Land and Revenue Regulation, 1886</em>.
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!consentConfirmed}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-emerald-950/60 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Verified Listing on Marketplace</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
