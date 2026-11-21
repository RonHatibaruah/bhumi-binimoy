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
  Info
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
  const [activeSection, setActiveSection] = useState<'overview' | 'features' | 'due-diligence' | 'pilot'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden animate-fadeIn text-white">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  BhumiBinimoy (ভূমি বিনিময়) • Assam Land Exchange Guide
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
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 text-xs">
          {[
            { id: 'overview', label: '1. Problem & Vision' },
            { id: 'features', label: '2. Core Marketplace Capabilities' },
            { id: 'due-diligence', label: '3. 8-Point Due-Diligence' },
            { id: 'pilot', label: '4. Dispur Pilot & Revenue Model' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-3 px-4 font-semibold border-b-2 transition-all ${
                activeSection === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">The Challenge (NESFIC-D-52): Opaque Broker Networks vs. Verified Land Exchange</h4>
              <p>
                Citizens buying or selling land in Assam currently depend on informal private brokers and multiple disconnected government portals (<em>Dharitree</em>, <em>Bhudakshya</em>, <em>e-Panjeeyan</em>, <em>e-Khajana</em>) to verify title, boundaries, and land revenue status.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl space-y-1">
                  <h5 className="font-bold text-red-300">Current Broker-Driven Market</h5>
                  <ul className="list-disc list-inside space-y-1 text-red-200/80 text-[11px]">
                    <li>Information asymmetry and hidden title defects.</li>
                    <li>Extortionate 5% to 10% private broker commissions.</li>
                    <li>Speculative, inflated prices disconnected from Zonal rates.</li>
                    <li>45 to 90 days manual physical searches across offices.</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
                  <h5 className="font-bold text-emerald-300">BhumiBinimoy Solution</h5>
                  <ul className="list-disc list-inside space-y-1 text-emerald-200/80 text-[11px]">
                    <li>Interactive Cadastral GIS map with verified boundaries.</li>
                    <li>0% private broker cut; 0.25% Govt facilitation fee.</li>
                    <li>Transparent comparison against official Zonal Rates.</li>
                    <li>Instantaneous 8-point automated title reconciliation.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">4 Primary Platform Modules</h4>
              
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400">1. Cadastral Map Marketplace Explorer</span>
                  <p className="text-[11px] text-slate-400">
                    Buyers can navigate the official cadastral map of Assam, click on verified polygons, and inspect authenticated Dag and Patta records in real time.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-teal-400">2. Buyer Due-Diligence & Deal Room</span>
                  <p className="text-[11px] text-slate-400">
                    Enforces strict separation between Government-verified official particulars and self-reported seller representations. Displays Zonal Value benchmark and statutory fee calculator.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400">3. Voluntary Seller Onboarding Portal</span>
                  <p className="text-[11px] text-slate-400">
                    Lawful landowners authenticate via Aadhaar e-KYC, query Dharitree to fetch official Jamabandi records, set asking prices, and sign a voluntary consent declaration.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-blue-400">4. Assisted Conveyancing Pipeline</span>
                  <p className="text-[11px] text-slate-400">
                    Streamlines the transaction through 5 milestones: EOI Agreement ➔ Milestone Escrow ➔ Circle Officer Sale NOC ➔ e-Panjeeyan Deed ➔ Mission Basundhara Auto-Mutation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'due-diligence' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">8-Point Statutory Due-Diligence Framework</h4>
              <p className="text-slate-400 text-[11px]">
                Every parcel listed on the exchange is cross-checked against 8 statutory dimensions under the <em>Assam Land and Revenue Regulation 1886</em>:
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">1. Patta Tenure:</strong>
                  <span>Periodic Patta (Khiraj Myadi) alienability confirmed.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">2. Area Variance:</strong>
                  <span>Bhudakshya polygon and Jamabandi match within 5%.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">3. Share Balance:</strong>
                  <span>Co-sharer Pattadar fractional shares equal 100%.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">4. e-Khajana Revenue:</strong>
                  <span>Zero outstanding land revenue or local cess arrears.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">5. Encumbrance Search:</strong>
                  <span>Zero active bank mortgages or financial attachments.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">6. Litigation Check:</strong>
                  <span>Zero pending civil injunctions or revenue stay orders.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">7. Chapter X Safeguards:</strong>
                  <span>Protection of backward classes in Tribal Belts/Blocks.</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block">8. Ecological Buffers:</strong>
                  <span>Zero overlap with Village Grazing Reserves (VGR/PGR).</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pilot' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Dispur Pilot & Economic Sustainability</h4>
              <p>
                The initial 6-month pilot is launched in <strong>Dispur Revenue Circle</strong> (Kamrup Metropolitan District), where cadastral mapping and Jamabandi digitization are 100% complete.
              </p>

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-2">
                <span className="font-bold text-purple-300 block">Government Facilitation Fee (Policy Option)</span>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  In lieu of unregulated 5% private broker cuts, the State can levy a modest <strong>0.25% to 0.50% statutory facilitation fee</strong>. In Kamrup Metro alone, this projects to generate <strong>₹7.5 to ₹15 Crore in annual non-tax revenue</strong> for the Revenue Department, fully self-funding platform operations.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Assam Innovation & Startup Foundation • NESFIC 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Explore Platform
          </button>
        </div>

      </div>
    </div>
  );
};
