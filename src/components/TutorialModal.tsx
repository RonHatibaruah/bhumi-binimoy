import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  Map, 
  SearchCheck, 
  PlusCircle, 
  ArrowRightLeft, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  Info,
  UserCheck,
  FileCheck,
  Scale,
  Compass,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'what-it-is' | 'how-to-use' | 'due-diligence' | 'pilot'>('what-it-is');
  const [userRoleGuide, setUserRoleGuide] = useState<'BUYER' | 'SELLER' | 'CONVEYANCING' | 'ADMIN'>('BUYER');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  BhumiBinimoy (ভূমি বিনিময়) • Platform Tutorial & Guide
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  NESFIC-D-52
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Government-Verified Cadastral Marketplace for Buying and Selling Land
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 text-xs overflow-x-auto">
          {[
            { id: 'what-it-is', label: '1. What the Application Is' },
            { id: 'how-to-use', label: '2. How to Use the Application' },
            { id: 'due-diligence', label: '3. 8-Point Title Due-Diligence' },
            { id: 'pilot', label: '4. Dispur Pilot & Revenue Model' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-3 px-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed text-slate-300 custom-scrollbar">
          
          {/* SECTION 1: WHAT THE APPLICATION IS */}
          {activeSection === 'what-it-is' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Problem Statement: NESFIC-D-52 (Stream 1 — Government Track)
                </span>
                <h4 className="text-base font-bold text-white">
                  What is BhumiBinimoy (Assam Land Exchange)?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>BhumiBinimoy</strong> is a government-verified, cadastral-map-anchored digital marketplace developed for the <strong>Revenue & Disaster Management Department, Government of Assam</strong>. It bridges the gap between private property commerce and official land governance.
                </p>
              </div>

              {/* Core Problem vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>The Problem: Predatory Broker Cartels</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-rose-200/80 list-disc list-inside">
                    <li><strong>Extreme Information Asymmetry:</strong> Buyers depend on unverified word-of-mouth and self-declared seller claims.</li>
                    <li><strong>Extortionate Brokerage:</strong> Middlemen extract <strong>5% to 10%</strong> in commissions and artificially inflate land prices (+30% to +50%).</li>
                    <li><strong>Fragmented Records:</strong> Checking title, boundaries, and encumbrances requires 45–90 days of manual paper chasing across multiple offices.</li>
                    <li><strong>Hidden Defects & Disputes:</strong> Sudden transaction freezes due to unpartitioned co-sharer heirs or Chapter X Tribal Belt violations.</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>The Solution: Government-Verified Exchange</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-emerald-200/80 list-disc list-inside">
                    <li><strong>Cadastral Vector Map Discovery:</strong> Parcels are overlaid directly on Assam's official <em>Bhudakshya</em> cadastral sheets with verified Dag boundaries.</li>
                    <li><strong>Automated 8-Point Due Diligence:</strong> Instant algorithmic audit of Jamabandi tenure, area consistency, co-shares, and tax dues.</li>
                    <li><strong>Zero Broker Commissions:</strong> Landowners voluntarily list for <strong>0% fee</strong>, transparently benchmarked against Circle Zonal Rates.</li>
                    <li><strong>Assisted Conveyancing:</strong> Straight-through digital workflow leading to <strong>72-hour automated mutation</strong> under Mission Basundhara 3.0.</li>
                  </ul>
                </div>
              </div>

              {/* The 5 Pillars Federation Ecosystem */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block text-xs">
                  Unified GovTech Data Federation Ecosystem:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-emerald-400 block font-mono">Dharitree</strong>
                    <span className="text-slate-400">Jamabandi Textual RoR, Pattadars & Lineage</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-400 block font-mono">Bhudakshya</strong>
                    <span className="text-slate-400">Cadastral WebGIS Vector Dag Polygons</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-purple-400 block font-mono">e-Panjeeyan</strong>
                    <span className="text-slate-400">SRO Deed Registry & Bank Lien Checks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-amber-400 block font-mono">Zonal DB</strong>
                    <span className="text-slate-400">Gazetted Circle Unit Rates (₹/Bigha)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-blue-400 block font-mono">Basundhara 3.0</strong>
                    <span className="text-slate-400">72-Hour Auto-Mutation Pipeline</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: HOW TO USE THE APPLICATION */}
          {activeSection === 'how-to-use' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">How to Use the Application: User Journey Guides</h4>
                  <p className="text-[11px] text-slate-400">Select your role below to view step-by-step instructions:</p>
                </div>

                {/* Role Switcher */}
                <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                  <button
                    onClick={() => setUserRoleGuide('BUYER')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userRoleGuide === 'BUYER' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Land Buyers
                  </button>
                  <button
                    onClick={() => setUserRoleGuide('SELLER')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userRoleGuide === 'SELLER' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Landowners (Sellers)
                  </button>
                  <button
                    onClick={() => setUserRoleGuide('CONVEYANCING')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userRoleGuide === 'CONVEYANCING' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Conveyancing Flow
                  </button>
                  <button
                    onClick={() => setUserRoleGuide('ADMIN')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userRoleGuide === 'ADMIN' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Admin Console
                  </button>
                </div>
              </div>

              {/* GUIDE A: FOR BUYERS */}
              {userRoleGuide === 'BUYER' && (
                <div className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <SearchCheck className="w-4 h-4" />
                    <span>Step-by-Step Guide for Prospective Land Buyers</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 1: Explore Cadastral Map</strong>
                      <p className="text-slate-400">
                        Click on <strong>Cadastral Marketplace</strong> in the header. Use the top-right <strong>Layers & Styling</strong> button to toggle between <em>CartoDB Blueprint</em>, <em>Esri High-Res Satellite</em>, and <em>OpenStreetMap</em>.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 2: Check Verification Badges</strong>
                      <p className="text-slate-400">
                        Click any parcel polygon. Look for the Title Clearance Badge: <strong>Gold Verified</strong> (90-100 pts), <strong>Silver</strong>, or <strong>Conditional</strong>. Notice the strict separation between Government Data and Seller claims.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 3: Benchmark Zonal Rates</strong>
                      <p className="text-slate-400">
                        Click <strong>Inspect Deal Room</strong>. The platform automatically benchmarks the seller's asking price against the official Circle Zonal Valuation (₹/Bigha) and calculates transparent stamp duty and registration fees.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 4: Submit Expression of Interest (EOI)</strong>
                      <p className="text-slate-400">
                        Inside the Deal Room, click <strong>Submit Formal Expression of Interest</strong>. Enter your proposed price, token deposit, and financing terms to initiate the protected conveyancing workflow.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { onClose(); onNavigateTab('marketplace'); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs"
                    >
                      <span>Try It: Open Cadastral Marketplace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* GUIDE B: FOR SELLERS */}
              {userRoleGuide === 'SELLER' && (
                <div className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <PlusCircle className="w-4 h-4" />
                    <span>Step-by-Step Guide for Lawful Landowners (Sellers)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 1: Aadhaar e-KYC Verification</strong>
                      <p className="text-slate-400">
                        Click <strong>Sell Land</strong> in the header. Enter your mobile number and Aadhaar number to verify your identity against UIDAI.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 2: Instant Dharitree Query</strong>
                      <p className="text-slate-400">
                        Enter your District, Circle, Mouza, Dag Number, and Patta Number. The platform pulls official Jamabandi records, verifying recorded BKL area and co-sharers.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 3: Declare Asking Price & Features</strong>
                      <p className="text-slate-400">
                        Input your desired asking price. View the real-time Zonal Rate comparison. Add property highlights (e.g. 30ft PWD road frontage, water supply, electricity).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Step 4: 0% Broker Fee Publishing</strong>
                      <p className="text-slate-400">
                        Sign the voluntary consent declaration. Your listing is verified by the 8-point engine and published directly to the vector cadastral map with zero broker commissions!
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { onClose(); onNavigateTab('seller-portal'); }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs"
                    >
                      <span>Try It: Open Voluntary Seller Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* GUIDE C: FOR CONVEYANCING */}
              {userRoleGuide === 'CONVEYANCING' && (
                <div className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>The 5-Stage Assisted Conveyancing Pipeline</span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Click on <strong>Assisted Pipeline</strong> in the header to view the end-to-end conveyancing state machine that guides transactions from listing to automated mutation:
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                      <div>
                        <strong className="text-white">Milestone 1: EOI & Price Mutual Acceptance:</strong> Buyer submits an EOI; seller reviews and accepts price terms through the Deal Room.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                      <div>
                        <strong className="text-white">Milestone 2: Cyber-Treasury Token Escrow:</strong> Buyer deposits a protected 2% token in government escrow, locking the parcel.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                      <div>
                        <strong className="text-white">Milestone 3: Circle Officer Land Sale NOC:</strong> Pre-filled statutory NOC dossier is routed directly to the Circle Officer for Lat Mandal field inquiry.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                      <div>
                        <strong className="text-white">Milestone 4: Biometric e-Panjeeyan Deed Execution:</strong> Automatic appointment scheduling at the Sub-Registrar Office with stamp duty payment.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
                      <div>
                        <strong className="text-white">Milestone 5: 72-Hour Mission Basundhara 3.0 Mutation:</strong> Registered deed triggers straight-through mutation, updating Jamabandi RoRs automatically.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GUIDE D: FOR ADMINS */}
              {userRoleGuide === 'ADMIN' && (
                <div className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>How to Use the Department Admin Console</span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Click on <strong>Dept Console</strong> in the header to access the revenue administration command suite.
                  </p>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-[11px] space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Demo Access Credentials:</span>
                    </div>
                    <p className="text-slate-300 font-mono">
                      Username: <strong>admin@assam.gov.in</strong> • Password: <strong>dispur2026</strong>
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      Or simply click the green <strong>"1-Click Instant Demo Login"</strong> button on the login screen!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Listing Moderation Queue:</strong>
                      <p className="text-slate-400">
                        Inspect RoR records, click <em>Approve</em>, <em>Flag</em>, or <em>Put on Hold</em>. Changes update the live marketplace immediately.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Zonal Valuation Engine:</strong>
                      <p className="text-slate-400">
                        View and update gazetted unit rates (₹/Bigha) and PWD road frontage multipliers across Kamrup Metro mouzas.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">Dispute & Fraud Alerts:</strong>
                      <p className="text-slate-400">
                        Real-time telemetry flagging area discrepancies &gt;5%, co-sharer complaints, or Chapter X Tribal Belt blocks.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-white block">SHA-256 Audit Ledger:</strong>
                      <p className="text-slate-400">
                        Tamper-evident chronological stream recording every listing approval, NOC status change, and officer signature.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { onClose(); onNavigateTab('admin-console'); }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs"
                    >
                      <span>Try It: Open Dept Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: 8-POINT DUE DILIGENCE */}
          {activeSection === 'due-diligence' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">8-Point Statutory Due-Diligence Framework</h4>
              <p className="text-slate-400 text-[11px]">
                Every parcel listed on the exchange is cross-checked against 8 statutory dimensions under the <em>Assam Land and Revenue Regulation 1886</em>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-emerald-400">
                    <span>1. Patta Tenure Classification</span>
                    <span className="font-mono text-[10px]">20 PTS</span>
                  </div>
                  <p className="text-slate-300">Periodic Patta (Khiraj Myadi) alienability confirmed. Non-alienable Annual Pattas automatically restricted.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-cyan-400">
                    <span>2. Bhudakshya Cadastral Area Variance</span>
                    <span className="font-mono text-[10px]">15 PTS</span>
                  </div>
                  <p className="text-slate-300">Vector polygon area and Jamabandi text area matched within a strict 5.0% tolerance threshold.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-teal-400">
                    <span>3. Co-Sharer Partition Integrity</span>
                    <span className="font-mono text-[10px]">15 PTS</span>
                  </div>
                  <p className="text-slate-300">Verified that recorded Pattadar fractional shares equal exactly 100.0% with no unpartitioned claims.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-emerald-400">
                    <span>4. e-Khajana Revenue Tax Clearance</span>
                    <span className="font-mono text-[10px]">10 PTS</span>
                  </div>
                  <p className="text-slate-300">Real-time query of the Touzi ledger confirms zero outstanding land revenue arrears or local cess dues.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-purple-400">
                    <span>5. e-Panjeeyan SRO Encumbrance & Liens</span>
                    <span className="font-mono text-[10px]">15 PTS</span>
                  </div>
                  <p className="text-slate-300">12-year registered encumbrance search confirms zero active bank mortgages or court attachments.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-orange-400">
                    <span>6. Revenue Court Litigation Check</span>
                    <span className="font-mono text-[10px]">10 PTS</span>
                  </div>
                  <p className="text-slate-300">Automated registry check confirms zero pending civil title injunctions or lis pendens dispute notices.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-rose-400">
                    <span>7. Chapter X Tribal Belt Safeguard</span>
                    <span className="font-mono text-[10px]">10 PTS</span>
                  </div>
                  <p className="text-slate-300">Strict protection of backward classes under ALRR Chapter X. Non-eligible transferees blocked.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-slate-400">
                    <span>8. Ecological & PWD Road Setbacks</span>
                    <span className="font-mono text-[10px]">5 PTS</span>
                  </div>
                  <p className="text-slate-300">Confirms zero encroachment on Village Grazing Reserves (VGR), wetlands, or statutory road buffers.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PILOT & ECONOMIC MODEL */}
          {activeSection === 'pilot' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Dispur Pilot & Financial Sustainability Model</h4>
              <p>
                The 6-month initial pilot is deployed in <strong>Dispur Revenue Circle</strong> (Kamrup Metropolitan District), Assam's commercial capital hub featuring 100% digitized Dharitree Jamabandis and complete Bhudakshya cadastral mapping.
              </p>

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-2xl space-y-2">
                <span className="font-bold text-purple-300 block text-xs">Self-Funding Government Facilitation Fee Model (0.25%)</span>
                <p className="text-[11px] text-purple-200/90 leading-relaxed">
                  In lieu of predatory 5% to 10% private broker cuts, the State levies a modest <strong>0.25% facilitation fee</strong> on completed transactions. At ₹3,000 Crore annual Dispur transaction value, this generates <strong>₹7.50 Crore annually</strong> for the Revenue Department, fully self-funding ASDC cloud hosting, vector tile caching, and Lat Mandal helpdesk operations while saving citizens ₹15+ Crore in avoided broker cuts!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-emerald-400 block font-mono">Phase 1: Dispur Pilot</strong>
                  <span className="text-slate-300 block">1,500 Facilitated Trades</span>
                  <span className="text-slate-500 text-[10px]">Revenue: ₹7.50 Cr • Savings: ₹15 Cr</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-cyan-400 block font-mono">Phase 2: Kamrup Metro</strong>
                  <span className="text-slate-300 block">6,000 Annual Trades</span>
                  <span className="text-slate-500 text-[10px]">Revenue: ₹15.0 Cr • Savings: ₹60 Cr</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <strong className="text-purple-400 block font-mono">Phase 3: Statewide Assam</strong>
                  <span className="text-slate-300 block">35 Revenue Districts</span>
                  <span className="text-slate-500 text-[10px]">Revenue: ₹45+ Cr • Savings: ₹200+ Cr</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Assam Innovation & Startup Foundation • NESFIC 2026
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => { onClose(); onNavigateTab('marketplace'); }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
