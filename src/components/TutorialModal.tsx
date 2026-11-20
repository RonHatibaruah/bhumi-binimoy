import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  Map, 
  ClipboardList, 
  UserCheck, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'dashboard' | 'gis-map' | 'field-verification' | 'citizen-portal') => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'features' | 'scoring' | 'walkthrough'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  BhumiSwasthya User Guide & Tutorial
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  NESFIC-D-50
                </span>
              </div>
              <p className="text-xs text-slate-400">
                How automated land record health scanning protects citizens and revenue officials
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

        {/* Tab Navigation inside Modal */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'overview' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Problem & What It Does
          </button>
          <button
            onClick={() => setActiveSection('features')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'features' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Key Portals & How to Use
          </button>
          <button
            onClick={() => setActiveSection('scoring')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'scoring' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Health Score (0-100) Explained
          </button>
          <button
            onClick={() => setActiveSection('walkthrough')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'walkthrough' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Quick 4-Step Interactive Tour
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
          
          {/* Section 1: Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950">
                <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  The Core Challenge (NESFIC-D-50)
                </h4>
                <p className="mt-1 text-xs text-emerald-900/90 leading-relaxed">
                  Assam has a large volume of digitised land records created over several years across two core state systems:
                  <strong> Dharitree</strong> (Textual Jamabandi / Record of Rights) and <strong>Bhudakshya</strong> (Cadastral GIS Maps).
                  Historically, errors such as missing area, zero revenue, fractional share imbalances, and cadastral map overlaps were only discovered <em>reactively</em> when a citizen applied for a sale NOC, mortgage, or partition—causing severe delays and disputes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  What BhumiSwasthya Does
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      Proactive Anomaly Auditing
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Continuously runs 7 deterministic legal & mathematical rules comparing textual Jamabandis against spatial cadastral geometries without waiting for a citizen application.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      Cadastral GIS Reconciliation
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Converts Assam traditional units (Bigha, Katha, Lesa) to square meters and detects when cadastral polygon boundaries drift from recorded paper area by &gt;5%.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
                      Prioritized Field Dispatch
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Auto-generates ground survey tasks for Lat Mandals and Kanungos for parcels flagged with boundary conflicts, adverse possession, or tribal belt violations.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                      Citizen Self-Check & Peace of Mind
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Allows citizens to check their land health card before taking loans or initiating sale deeds, with a 1-click pathway to proactive correction under Mission Basundhara.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                <strong>Mandatory Government Safeguard:</strong> BhumiSwasthya is an advisory decision-support system. It <em>never</em> automatically modifies a land record or alters legal title. All corrections require human Lat Mandal survey and Circle Officer order.
              </div>
            </div>
          )}

          {/* Section 2: Features & How to Use */}
          {activeSection === 'features' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                How to Navigate & Use the Portals
              </h4>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                      Executive Analytics Dashboard
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Designed for Circle Officers, Deputy Commissioners, and Department Leadership. View district-level health grade distributions (Grade A through D), filter anomalies by rule type (e.g., Spatial Mismatches, Zero Revenue, Chapter X violations), and export audit rolls to CSV.
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('dashboard'); }}
                    className="shrink-0 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold"
                  >
                    Open Dashboard
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                      Cadastral GIS Map Viewer
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Displays digitized parcel polygons rendered over real geography. Green indicates clean parcels, yellow/orange indicates minor drift, and red with dashed outlines highlights critical boundary conflicts and overlaps (e.g. Dag 103 overlapping Dag 104 in Jatia). Click any parcel to inspect.
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('gis-map'); }}
                    className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                  >
                    Open GIS Map
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                      Lat Mandal Field Queue
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Mobile-responsive interface for field staff (Lat Mandals & Kanungos). Shows assigned inspection targets, permits recording ground-measured Bigha-Katha-Lesa, boundary pillar condition, GPS lock, and geo-tagged photos to submit formal survey recommendations to the Circle Officer.
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('field-verification'); }}
                    className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold"
                  >
                    Open Field Queue
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
                      Citizen Self-Check Portal
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Public-facing transparency portal. Citizens search by village and Dag/Patta number, view their Land Health Score, verify if their land is ready for instant mutation, print official health certificates, or file proactive rectification requests.
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('citizen-portal'); }}
                    className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold"
                  >
                    Open Citizen Check
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Scoring Model */}
          {activeSection === 'scoring' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Land Health Scoring Matrix (0–100 Scale)
              </h4>
              <p className="text-[11px] text-slate-600">
                Every parcel begins with a base score of 100 points. Penalties are deducted based on rule violation severity:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-emerald-900 text-xs">Grade A (85 – 100)</span>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">CLEAN</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    High data integrity. No spatial overlap, no share deficit, area variance &lt;5%, valid revenue assessment. Eligible for straight-through automated digital transactions.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-amber-900 text-xs">Grade B (65 – 84)</span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">MINOR RISK</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Minor clerical or metadata gaps (e.g. unverified Aadhaar KYC or 5–10% spatial drift). Reconcilable through administrative desk review without field dispatch.
                  </p>
                </div>

                <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-orange-900 text-xs">Grade C (40 – 64)</span>
                    <span className="text-[10px] font-bold bg-orange-200 text-orange-900 px-2 py-0.5 rounded">MODERATE RISK</span>
                  </div>
                  <p className="text-[11px] text-orange-800">
                    Substantial textual discrepancies, missing heir shares (sum &lt; 100%), unassessed ₹0 touzi revenue, or unredeemed legacy bank hypothecation notes.
                  </p>
                </div>

                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-rose-900 text-xs">Grade D (&lt; 40)</span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">CRITICAL RISK</span>
                  </div>
                  <p className="text-[11px] text-rose-800">
                    Severe spatial overlap with adjacent dags, private patta on Village Grazing Reserve (VGR), or Chapter X Tribal Belt non-protected holding. Triggers mandatory Lat Mandal ground survey.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Quick Interactive Walkthrough */}
          {activeSection === 'walkthrough' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Try Out These 4 Live Scenarios In The App
              </h4>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Scenario A: Check a Healthy Record (Dag 101, Jatia)</span>
                    <p className="text-[11px] text-slate-500">Score 100/100 • Clean spatial match • Full Aadhaar KYC • Verified Touzi</p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('citizen-portal'); }}
                    className="px-3 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                  >
                    Inspect Dag 101
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Scenario B: Area Mismatch & Lat Mandal Dispatch (Dag 102)</span>
                    <p className="text-[11px] text-slate-500">19.6% shortfall between Jamabandi and Bhudakshya polygon • Assigned to field</p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('field-verification'); }}
                    className="px-3 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold"
                  >
                    View Field Task
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Scenario C: Boundary Overlap on GIS Map (Dag 103 & 104)</span>
                    <p className="text-[11px] text-slate-500">Watch the two parcels overlap with red dashed conflict borders in Jatia</p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('gis-map'); }}
                    className="px-3 py-1 bg-rose-600 text-white rounded text-[11px] font-semibold"
                  >
                    View Map Overlap
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Scenario D: Chapter X Tribal Belt Transfer Flag (Dag 310, Sonapur)</span>
                    <p className="text-[11px] text-slate-500">Non-tribal holding in notified Dimoria tribal belt • Circle Officer legal inquiry</p>
                  </div>
                  <button
                    onClick={() => { onClose(); onNavigateTab('dashboard'); }}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-[11px] font-semibold"
                  >
                    View in Audit Table
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">
            Assam Innovation & Startup Foundation (AISF) • NESFIC 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            Got It, Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
