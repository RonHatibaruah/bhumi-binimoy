import React, { useState } from 'react';
import {
  X,
  Sliders,
  Users,
  RefreshCw,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Download,
  UploadCloud,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { LandRecord, VerificationTask } from '../types/landRecords';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: LandRecord[];
  tasks: VerificationTask[];
  onUpdateRuleConfig?: (config: any) => void;
}

type AdminTab = 'rules' | 'hierarchy' | 'ingestion' | 'sla' | 'audit';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  records,
  tasks
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('rules');

  // Rule Engine Calibration State
  const [areaTolerance, setAreaTolerance] = useState<number>(5.0);
  const [snappingTolerance, setSnappingTolerance] = useState<number>(0.15);
  const [overlapWeight, setOverlapWeight] = useState<number>(40);
  const [varianceWeight, setVarianceWeight] = useState<number>(30);
  const [unclosedWeight, setUnclosedWeight] = useState<number>(20);
  const [shareDeficitWeight, setShareDeficitWeight] = useState<number>(25);
  const [zeroTouziWeight, setZeroTouziWeight] = useState<number>(15);
  const [tribalBeltActive, setTribalBeltActive] = useState<boolean>(true);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Ingestion Batch Simulation
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStats, setAuditStats] = useState<{ processed: number; anomalies: number } | null>(null);

  if (!isOpen) return null;

  const handleSaveRules = () => {
    setSavedNotification('Statutory rules recalibrated successfully! System-wide LHS recalculated.');
    setTimeout(() => setSavedNotification(null), 3500);
  };

  const handleRunBatchAudit = () => {
    setIsAuditing(true);
    setBatchProgress(5);
    setAuditStats(null);

    const interval = setInterval(() => {
      setBatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setAuditStats({ processed: 28450, anomalies: 342 });
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-200">
        
        {/* Top Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-900/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  BhumiSwasthya Administrative Control Console
                </h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Revenue & Disaster Management Department • Government of Assam
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close Admin Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 flex space-x-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'rules'
                ? 'border-amber-400 text-amber-300 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Rule Engine & Scoring</span>
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'hierarchy'
                ? 'border-amber-400 text-amber-300 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Revenue Hierarchy & Mandals</span>
          </button>

          <button
            onClick={() => setActiveTab('ingestion')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'ingestion'
                ? 'border-amber-400 text-amber-300 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Data Ingestion & Sync Sentry</span>
          </button>

          <button
            onClick={() => setActiveTab('sla')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'sla'
                ? 'border-amber-400 text-amber-300 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Work-Order SLA Oversight</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'audit'
                ? 'border-amber-400 text-amber-300 font-semibold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cryptographic Audit Trail</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          
          {savedNotification && (
            <div className="mb-4 bg-emerald-950/80 border border-emerald-600 text-emerald-300 px-4 py-2.5 rounded-xl flex items-center space-x-2 text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{savedNotification}</span>
            </div>
          )}

          {/* TAB 1: RULE ENGINE CALIBRATION */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-1">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Statutory Rule Calibration Matrix (Assam Land Records Manual)
                </h3>
                <p className="text-xs text-slate-400">
                  Tune algorithmic deduction weights and tolerance windows without code recompilation. Affects all 154+ Revenue Circles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Area Variance Tolerance */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-200">
                      Area Variance Discrepancy Tolerance
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      ±{areaTolerance.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={areaTolerance}
                    onChange={(e) => setAreaTolerance(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    Acceptable threshold between Jamabandi text area and Bhudakshya polygon vector area before triggering Grade C/D penalty.
                  </p>
                </div>

                {/* Spatial Snapping Tolerance */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-200">
                      GIS Node Snapping Tolerance
                    </label>
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                      {snappingTolerance.toFixed(2)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.80"
                    step="0.05"
                    value={snappingTolerance}
                    onChange={(e) => setSnappingTolerance(parseFloat(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    Boundary vertex snapping distance to automatically eliminate legacy theodolite survey micro-slivers.
                  </p>
                </div>
              </div>

              {/* Deductive Penalty Weights */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Deductive Penalty Weights (w₁ to w₇)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">w₁: Boundary Overlap</span>
                      <span className="font-mono text-red-400 font-bold">-{overlapWeight} pts</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={overlapWeight}
                      onChange={(e) => setOverlapWeight(parseInt(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">w₂: Area Variance</span>
                      <span className="font-mono text-amber-400 font-bold">-{varianceWeight} pts</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={varianceWeight}
                      onChange={(e) => setVarianceWeight(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">w₃: Unclosed Boundary</span>
                      <span className="font-mono text-blue-400 font-bold">-{unclosedWeight} pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      value={unclosedWeight}
                      onChange={(e) => setUnclosedWeight(parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">w₄: Co-Sharer Deficit</span>
                      <span className="font-mono text-purple-400 font-bold">-{shareDeficitWeight} pts</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={shareDeficitWeight}
                      onChange={(e) => setShareDeficitWeight(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">w₅: Zero Touzi Default</span>
                      <span className="font-mono text-emerald-400 font-bold">-{zeroTouziWeight} pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={zeroTouziWeight}
                      onChange={(e) => setZeroTouziWeight(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Chapter X Tribal Sentry</div>
                      <div className="text-[10px] text-slate-400">Notified Belts (Sonapur/Dimoria)</div>
                    </div>
                    <button
                      onClick={() => setTribalBeltActive(!tribalBeltActive)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        tribalBeltActive ? 'bg-amber-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          tribalBeltActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setAreaTolerance(5.0);
                    setSnappingTolerance(0.15);
                    setOverlapWeight(40);
                    setVarianceWeight(30);
                    setUnclosedWeight(20);
                    setShareDeficitWeight(25);
                    setZeroTouziWeight(15);
                    setTribalBeltActive(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={handleSaveRules}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-950/40 flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply & Recalculate State LHS</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REVENUE HIERARCHY & LAT MANDALS */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Assam Land Administration Officer Directory
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    District $\rightarrow$ Revenue Circle $\rightarrow$ Mouza $\rightarrow$ Lat Mandal Roster Management
                  </p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <span>+ Provision Officer</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Officer / Mandal</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Circle / Jurisdiction</th>
                      <th className="py-3 px-4">Active Queue</th>
                      <th className="py-3 px-4">Live Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">
                        Biren Kalita <span className="text-slate-400 font-mono">(LM-04)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">Lat Mandal (Field Surveyor)</td>
                      <td className="py-3 px-4 text-slate-300">Dispur (Jatia & Beltola)</td>
                      <td className="py-3 px-4 font-mono text-amber-400">3 Dags</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          Active In-Field
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-amber-400 hover:text-amber-300 font-medium">Rebalance</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">
                        Hemen Saikia <span className="text-slate-400 font-mono">(LM-09)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">Lat Mandal (Field Surveyor)</td>
                      <td className="py-3 px-4 text-slate-300">Sonapur (Tribal Belt)</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">1 Dag</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          Active In-Field
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-amber-400 hover:text-amber-300 font-medium">Rebalance</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">
                        Dipankar Bora <span className="text-slate-400 font-mono">(LM-12)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">Lat Mandal (Field Surveyor)</td>
                      <td className="py-3 px-4 text-slate-300">Kaliabor (Kuwaritol)</td>
                      <td className="py-3 px-4 font-mono text-slate-400">0 Dags</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          Standby
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-emerald-400 hover:text-emerald-300 font-medium">Assign</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-white">
                        Dr. N. Goswami, ACS
                      </td>
                      <td className="py-3 px-4 text-slate-300">Circle Officer (Dispur)</td>
                      <td className="py-3 px-4 text-slate-300">Dispur Circle HQ</td>
                      <td className="py-3 px-4 font-mono text-purple-400">7 Approvals Pending</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          HQ Online
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-slate-400 hover:text-white font-medium">Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DATA INGESTION & DUAL-SYSTEM SYNC SENTRY */}
          {activeTab === 'ingestion' && (
            <div className="space-y-6">
              {/* Connector Heartbeats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="font-semibold text-white text-xs">Dharitree RoR Database (Textual)</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PostgreSQL 16 Multi-AZ Replica • State Data Centre (ASDC)
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-[11px] text-slate-300 font-mono">
                      <span>Latency: <strong className="text-emerald-400">14 ms</strong></span>
                      <span>Throughput: <strong className="text-emerald-400">4,200 rec/s</strong></span>
                      <span>Sync: <strong className="text-emerald-400">Live CDC</strong></span>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    CONNECTED
                  </span>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="font-semibold text-white text-xs">Bhudakshya Cadastral GIS (Spatial)</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      GeoServer & PostGIS Spatial Cluster • EPSG:3857 & WGS84
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-[11px] text-slate-300 font-mono">
                      <span>Latency: <strong className="text-emerald-400">22 ms</strong></span>
                      <span>Polygons: <strong className="text-emerald-400">1,250,420</strong></span>
                      <span>WFS 2.0: <strong className="text-emerald-400">Healthy</strong></span>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    CONNECTED
                  </span>
                </div>
              </div>

              {/* Batch Cadastral Audit Runner */}
              <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/60">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      Continuous Cadastral Batch Audit Engine
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Executes 7-point consistency scan across entire revenue circle at rest.
                    </p>
                  </div>
                  <button
                    disabled={isAuditing}
                    onClick={handleRunBatchAudit}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all ${
                      isAuditing
                        ? 'bg-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/40'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                    <span>{isAuditing ? 'Auditing Parcels...' : 'Run Audit: Dispur Circle (30,000 Dags)'}</span>
                  </button>
                </div>

                {isAuditing && (
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Reconciling Dharitree Jamabandis with Bhudakshya Vectors...</span>
                      <span className="text-emerald-400 font-bold">{batchProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${batchProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {auditStats && (
                  <div className="mt-4 bg-slate-950/80 p-3.5 rounded-xl border border-emerald-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Batch Completed: <strong>{auditStats.processed.toLocaleString()}</strong> dags audited.</span>
                    </div>
                    <div className="text-amber-400 font-semibold font-mono">
                      {auditStats.anomalies} anomalies flagged for Mandal field verification.
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Cadastral File Upload */}
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-6 text-center bg-slate-950/40 transition-colors">
                <UploadCloud className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-200">
                  Ingest Village Cadastral Sheet (GeoJSON / TopoJSON / Shapefile ZIP)
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Drag and drop digitized village maps or select file to run automated pre-onboarding schema check.
                </p>
                <button className="mt-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-medium">
                  Select Cadastral File
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: WORK-ORDER SLA OVERSIGHT */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Field Verification SLA Command & Overdue Monitor
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Statutory 7-Day Target under Assam Right to Public Services Act (ARTPS)
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono font-semibold">
                    1 Overdue SLA
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                    {tasks.length} Active Orders
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-slate-400 font-semibold">{task.id}</span>
                        <span className="text-white font-bold text-xs">
                          Dag {task.dagNumber} • Patta {task.pattaNumber} ({task.village}, {task.circle})
                        </span>
                        {idx === 0 && (
                          <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Overdue (9 Days)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 flex flex-wrap gap-2">
                        <span>Assigned to: <strong className="text-white">{task.assignedMandal}</strong></span>
                        <span>•</span>
                        <span>Anomalies: <span className="text-amber-300">{task.anomaliesSummary.join(', ')}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {task.status}
                      </span>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2.5 py-1 rounded-lg">
                        Reassign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CRYPTOGRAPHIC AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Immutable SHA-256 Audit Trail
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tamper-proof event logs formatted for CERT-In & Comptroller and Auditor General (CAG) compliance
                  </p>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Logs (.CSV)</span>
                </button>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">2026-11-21 01:20:14</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-amber-300 font-bold">RULE_CALIBRATION</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-300">Tuned Area Variance Discrepancy Tolerance to 5.0%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    Hash: 9f8e7d6c5b4a3f2e1d0c...
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">2026-11-21 00:54:32</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-blue-300 font-bold">TASK_DISPATCH</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-300">Dispatched Dag 104 (Dispur) to Mandal Biren Kalita (LM-04)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    Hash: 7a8b9c0d1e2f3a4b5c6d...
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">2026-11-21 00:15:08</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-purple-300 font-bold">CERTIFICATE_ISSUED</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-300">Generated Land Health Certificate for Dag 78 (Beltola)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    Hash: 3c4d5e6f7a8b9c0d1e2f...
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">2026-11-20 23:45:19</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-teal-300 font-bold">SYNC_HEARTBEAT</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-300">Dharitree & Bhudakshya dual synchronization heartbeat OK</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    Hash: 1a2b3c4d5e6f7a8b9c0d...
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Assam State Data Centre (ASDC) Tier-III Certified Access Control</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg border border-slate-700 font-medium transition-colors"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
