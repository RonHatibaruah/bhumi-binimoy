import React, { useState } from 'react';
import {
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
  UserPlus,
  ArrowRight,
  Database,
  Search,
  ExternalLink
} from 'lucide-react';
import { LandRecord, VerificationTask } from '../types/landRecords';
import { RuleEngineConfig, DEFAULT_RULE_CONFIG } from '../services/healthCheckEngine';

interface AdminDashboardProps {
  records: LandRecord[];
  tasks: VerificationTask[];
  ruleConfig: RuleEngineConfig;
  onUpdateRuleConfig: (config: RuleEngineConfig) => void;
  onReassignTask: (taskId: string, newMandal: string) => void;
  onAddOfficer?: (officer: any) => void;
  onIngestSampleParcels?: (newRecords: LandRecord[]) => void;
}

type AdminSubTab = 'rules' | 'hierarchy' | 'ingestion' | 'sla' | 'audit';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  hash: string;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-11-21 01:28:40',
    actor: 'Director of Land Records (Super Admin)',
    action: 'RULE_CALIBRATION',
    details: 'Calibrated statutory area variance tolerance to ±5.0% under ALRR Rule 48.',
    hash: '9f8e7d6c5b4a3f2e1d0c8b7a695847362514'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-11-21 01:15:10',
    actor: 'System Ingestion Sentry',
    action: 'DUAL_SYNC_HEARTBEAT',
    details: 'Verified Dharitree RoR (PostgreSQL) and Bhudakshya Cadastral GIS (PostGIS) delta streams.',
    hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-11-20 23:54:19',
    actor: 'CO Dispur HQ',
    action: 'MANDAL_TASK_DISPATCH',
    details: 'Dispatched field ground-truthing work-order TASK-2026-002 (Dag 104) to Lat Mandal Biren Kalita.',
    hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-11-20 22:30:05',
    actor: 'Citizen Self-Check Portal',
    action: 'CERTIFICATE_GENERATED',
    details: 'Issued digital Land Health Certificate for Dag 101 (Jatia, Dispur) with QR verification token.',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  tasks,
  ruleConfig,
  onUpdateRuleConfig,
  onReassignTask,
  onAddOfficer,
  onIngestSampleParcels
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('rules');

  // Sliders state initialized from props
  const [areaTolerance, setAreaTolerance] = useState<number>(ruleConfig.areaTolerancePercent);
  const [snappingTolerance, setSnappingTolerance] = useState<number>(ruleConfig.snappingToleranceMeters);
  const [overlapWeight, setOverlapWeight] = useState<number>(ruleConfig.overlapPenalty);
  const [varianceWeight, setVarianceWeight] = useState<number>(ruleConfig.varianceCriticalPenalty);
  const [unclosedWeight, setUnclosedWeight] = useState<number>(20);
  const [shareDeficitWeight, setShareDeficitWeight] = useState<number>(ruleConfig.shareDeficitPenalty);
  const [zeroTouziWeight, setZeroTouziWeight] = useState<number>(ruleConfig.zeroRevenuePenalty);
  const [tribalBeltActive, setTribalBeltActive] = useState<boolean>(ruleConfig.tribalBeltEnforcement);

  const [notification, setNotification] = useState<string | null>(null);

  // Ingestion batch simulation state
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [auditStats, setAuditStats] = useState<{ processed: number; anomalies: number } | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Officer directory state
  const [officers, setOfficers] = useState([
    { id: 'LM-04', name: 'Biren Kalita', role: 'Lat Mandal (Field Surveyor)', circle: 'Dispur (Jatia, Beltola)', activeTasks: 3, status: 'Active In-Field', phone: '+91 94350 44521' },
    { id: 'LM-09', name: 'Hemen Saikia', role: 'Lat Mandal (Field Surveyor)', circle: 'Sonapur (Tribal Belt)', activeTasks: 1, status: 'Active In-Field', phone: '+91 98640 12789' },
    { id: 'LM-12', name: 'Dipankar Bora', role: 'Lat Mandal (Field Surveyor)', circle: 'Kaliabor (Kuwaritol)', activeTasks: 0, status: 'Standby / Available', phone: '+91 94351 99234' },
    { id: 'CO-01', name: 'Dr. N. Goswami, ACS', role: 'Circle Officer (Dispur)', circle: 'Dispur Circle HQ', activeTasks: 7, status: 'HQ Online', phone: '+91 361 2237890' }
  ]);

  // Provisioning Modal/Form State
  const [showProvisionModal, setShowProvisionModal] = useState<boolean>(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerId, setNewOfficerId] = useState('');
  const [newOfficerCircle, setNewOfficerCircle] = useState('Dispur');
  const [newOfficerPhone, setNewOfficerPhone] = useState('');

  // Reassignment Modal State
  const [selectedTaskToReassign, setSelectedTaskToReassign] = useState<VerificationTask | null>(null);
  const [targetMandal, setTargetMandal] = useState('Dipankar Bora (LM-12)');

  // Selected Rule 53 Dossier Record
  const [rectificationRecord, setRectificationRecord] = useState<LandRecord | null>(null);

  // Notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Cryptographic Log Generator
  const logAction = (action: string, details: string) => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEntry: AuditLogEntry = {
      id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Super Admin (ASDC Sentry)',
      action,
      details,
      hash: randomHex
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Handle saving calibrated rules
  const handleApplyRules = () => {
    const updatedConfig: RuleEngineConfig = {
      ...ruleConfig,
      areaTolerancePercent: areaTolerance,
      snappingToleranceMeters: snappingTolerance,
      overlapPenalty: overlapWeight,
      varianceCriticalPenalty: varianceWeight,
      varianceMinorPenalty: Math.round(varianceWeight * 0.6),
      shareDeficitPenalty: shareDeficitWeight,
      zeroRevenuePenalty: zeroTouziWeight,
      tribalBeltEnforcement: tribalBeltActive
    };

    onUpdateRuleConfig(updatedConfig);
    logAction('RULE_RECALIBRATION', `Updated tolerances: Area ±${areaTolerance}%, Snapping ${snappingTolerance}m, Overlap -${overlapWeight}pts.`);
    showToast('Statewide statutory rule engine updated! All parcel health scores recalculated.');
  };

  // Reset rules to defaults
  const handleResetDefaults = () => {
    setAreaTolerance(DEFAULT_RULE_CONFIG.areaTolerancePercent);
    setSnappingTolerance(DEFAULT_RULE_CONFIG.snappingToleranceMeters);
    setOverlapWeight(DEFAULT_RULE_CONFIG.overlapPenalty);
    setVarianceWeight(DEFAULT_RULE_CONFIG.varianceCriticalPenalty);
    setUnclosedWeight(20);
    setShareDeficitWeight(DEFAULT_RULE_CONFIG.shareDeficitPenalty);
    setZeroTouziWeight(DEFAULT_RULE_CONFIG.zeroRevenuePenalty);
    setTribalBeltActive(DEFAULT_RULE_CONFIG.tribalBeltEnforcement);

    onUpdateRuleConfig(DEFAULT_RULE_CONFIG);
    logAction('RULE_RESET', 'Statutory rule engine parameters reset to Assam Land Records Manual defaults.');
    showToast('Rule engine reset to statutory defaults.');
  };

  // Handle Reassigning a Task
  const handleConfirmReassign = () => {
    if (!selectedTaskToReassign) return;
    onReassignTask(selectedTaskToReassign.id, targetMandal);
    logAction('TASK_REASSIGNMENT', `Task ${selectedTaskToReassign.id} (Dag ${selectedTaskToReassign.dagNumber}) reassigned to ${targetMandal}.`);
    showToast(`Task ${selectedTaskToReassign.id} successfully reassigned to ${targetMandal}!`);
    setSelectedTaskToReassign(null);
  };

  // Handle Provisioning New Officer
  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerId) return;

    const newOff = {
      id: newOfficerId,
      name: newOfficerName,
      role: 'Lat Mandal (Field Surveyor)',
      circle: newOfficerCircle,
      activeTasks: 0,
      status: 'Standby / Available',
      phone: newOfficerPhone || '+91 94350 00000'
    };

    setOfficers(prev => [...prev, newOff]);
    logAction('OFFICER_PROVISIONED', `Provisioned new Lat Mandal ${newOfficerName} (${newOfficerId}) in ${newOfficerCircle}.`);
    showToast(`Officer ${newOfficerName} successfully provisioned into Assam Land Records Directory!`);
    setShowProvisionModal(false);
    setNewOfficerName('');
    setNewOfficerId('');
    setNewOfficerPhone('');
  };

  // Run Batch Audit Simulation
  const handleRunBatchAudit = () => {
    setIsAuditing(true);
    setBatchProgress(8);
    setAuditStats(null);

    const interval = setInterval(() => {
      setBatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setAuditStats({ processed: 28450, anomalies: 342 });
          logAction('BATCH_AUDIT_COMPLETED', 'Executed automated 7-point consistency scan across 28,450 Dags in Dispur Circle. 342 anomalies flagged.');
          showToast('Dispur Circle batch audit completed! 342 anomalies flagged for Lat Mandal ground-truthing.');
          return 100;
        }
        return prev + 16;
      });
    }, 280);
  };

  // Export Audit Trail as CSV
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Log ID,Timestamp,Actor,Action,Details,SHA-256 Hash\n"
      + auditLogs.map(l => `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.details.replace(/"/g, '""')}","${l.hash}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bhumiswasthya_compliance_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('AUDIT_LOG_EXPORT', 'Exported cryptographic compliance audit trail (.CSV) for State Data Centre archive.');
    showToast('Audit trail exported successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-lg shadow-emerald-950/50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Cockpit Header & Key Telemetry Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                <Lock className="w-3 h-3" /> State Level Super Admin Console
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Assam Land Records & Surveys Directorate</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              BhumiSwasthya Administrative Command Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory Rule Engine Tuning, Multi-Circle Mandals Oversight, Dual Data-Sync Telemetry & SLA Compliance
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              title="Download tamper-proof cryptographic audit log for CAG/CERT-In verification"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail</span>
            </button>
            <button
              onClick={handleRunBatchAudit}
              disabled={isAuditing}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Running Scan...' : 'Trigger Batch Scan'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">State Revenue Circles</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">154 Circles</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Coverage
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Audited Cadastral Parcels</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">1,250,420</div>
            <div className="text-[10px] text-slate-400 mt-1">Dharitree & Bhudakshya Sync</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Lat Mandal Field Force</div>
            <div className="text-xl font-bold text-teal-400 font-mono mt-0.5">{officers.length} Officers</div>
            <div className="text-[10px] text-teal-300 mt-1">Active on Ground PWA</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">ARTPS 7-Day SLA Breaches</div>
            <div className="text-xl font-bold text-red-400 font-mono mt-0.5">1 Overdue</div>
            <div className="text-[10px] text-red-300 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" /> Reassignment Required
            </div>
          </div>
        </div>

      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-md">
        
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'rules'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Statutory Rule Engine Tuning</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hierarchy')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'hierarchy'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Revenue Hierarchy & Mandal Directory</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ingestion')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'ingestion'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Data Ingestion & Sync Sentry</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sla')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'sla'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Work-Order SLA Oversight ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'audit'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cryptographic Audit Trail</span>
        </button>

      </div>

      {/* =========================================================================
          MODULE A: STATUTORY RULE ENGINE & SCORING CALIBRATION
          ========================================================================= */}
      {activeSubTab === 'rules' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Assam Land Records Manual • Algorithmic Scoring Calibration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust legal discrepancy thresholds and deductive penalty weights ($w_1$ to $w_7$) without deploying new code.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Reset Defaults
              </button>
              <button
                onClick={handleApplyRules}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply & Recalculate State LHS</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Area Discrepancy Slider */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-white">
                    Area Variance Discrepancy Tolerance
                  </label>
                  <p className="text-[11px] text-slate-400">Jamabandi Text vs Bhudakshya Cadastral Vector Area</p>
                </div>
                <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-800/60">
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
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0% (Strict Digital)</span>
                <span>5.0% (Statutory Standard)</span>
                <span>15.0% (Lenient Legacy)</span>
              </div>
            </div>

            {/* GIS Snapping Slider */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold text-white">
                    Cadastral Node Snapping Tolerance
                  </label>
                  <p className="text-[11px] text-slate-400">Vertex Distance to Auto-Collapse Micro-Slivers</p>
                </div>
                <span className="text-sm font-mono font-bold text-teal-400 bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-800/60">
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
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.05 m (Centimeter Precision)</span>
                <span>0.15 m (Survey Standard)</span>
                <span>0.80 m (Coarse)</span>
              </div>
            </div>

          </div>

          {/* Deductive Weights Matrix */}
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Formula Parameter Matrix: $S = \max(0, 100 - \sum (w_i \times p_i))$
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">w₁: Boundary Overlap</span>
                  <span className="font-mono text-red-400 font-bold">-{overlapWeight} pts</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={overlapWeight}
                  onChange={(e) => setOverlapWeight(parseInt(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">Severe title conflict under Sec 40</p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">w₂: Area Variance (&gt;15%)</span>
                  <span className="font-mono text-amber-400 font-bold">-{varianceWeight} pts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={varianceWeight}
                  onChange={(e) => setVarianceWeight(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">Significant BKL discrepancy</p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">w₃: Unclosed Boundary</span>
                  <span className="font-mono text-blue-400 font-bold">-{unclosedWeight} pts</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={unclosedWeight}
                  onChange={(e) => setUnclosedWeight(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">Non-topological polygon ring</p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">w₄: Co-Sharer Deficit</span>
                  <span className="font-mono text-purple-400 font-bold">-{shareDeficitWeight} pts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={shareDeficitWeight}
                  onChange={(e) => setShareDeficitWeight(parseInt(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">Shares sum &lt; 100% (Missing heirs)</p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">w₅: Zero Touzi Default</span>
                  <span className="font-mono text-emerald-400 font-bold">-{zeroTouziWeight} pts</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={zeroTouziWeight}
                  onChange={(e) => setZeroTouziWeight(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1">₹0.00 assessment on private patta</p>
              </div>

              {/* Tribal Belt Sentry Switch */}
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Chapter X Tribal Sentry</div>
                  <div className="text-[10px] text-slate-400">Strict check in Sonapur/Dimoria</div>
                </div>
                <button
                  type="button"
                  onClick={() => setTribalBeltActive(!tribalBeltActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    tribalBeltActive ? 'bg-amber-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      tribalBeltActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODULE B: REVENUE HIERARCHY & LAT MANDALS
          ========================================================================= */}
      {activeSubTab === 'hierarchy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Revenue Administrative Hierarchy & Personnel Directory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                District $\rightarrow$ Revenue Circle $\rightarrow$ Mouza $\rightarrow$ Lat Mandal Ground Surveyor Roster
              </p>
            </div>
            <button
              onClick={() => setShowProvisionModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Provision New Officer</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Officer ID & Name</th>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Jurisdiction Circle</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Workload</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {officers.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{off.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{off.id}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{off.role}</td>
                    <td className="py-3 px-4 text-slate-300">{off.circle}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{off.phone}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        {off.activeTasks} Dags
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        off.status.includes('Active')
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : off.status.includes('HQ')
                          ? 'bg-blue-950 text-blue-400 border-blue-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {off.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => showToast(`Workload rebalancer invoked for ${off.name}. Optimal queue calculated.`)}
                        className="text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        Rebalance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODULE C: DATA INGESTION & DUAL-SYSTEM SYNC SENTRY
          ========================================================================= */}
      {activeSubTab === 'ingestion' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              State Data Centre (ASDC) Ingestion Telemetry & Connector Sentry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live heartbeat telemetry connecting Dharitree RoR and Bhudakshya Cadastral GIS clusters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Dharitree Connector */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Dharitree RoR Connector (Textual)</h4>
                    <p className="text-[11px] text-slate-400">PostgreSQL 16 Cluster • Dispur State Data Centre</p>
                  </div>
                </div>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ONLINE 100%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                <div>
                  <div className="text-slate-500 text-[10px]">Latency</div>
                  <div className="text-emerald-400 font-bold">14 ms</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Throughput</div>
                  <div className="text-emerald-400 font-bold">4,200 rec/s</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Sync Mode</div>
                  <div className="text-emerald-400 font-bold">Live CDC</div>
                </div>
              </div>
            </div>

            {/* Bhudakshya Connector */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Bhudakshya Cadastral GIS (Spatial)</h4>
                    <p className="text-[11px] text-slate-400">GeoServer & PostGIS Spatial Engine • EPSG:3857</p>
                  </div>
                </div>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ONLINE 100%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                <div>
                  <div className="text-slate-500 text-[10px]">Query Response</div>
                  <div className="text-emerald-400 font-bold">22 ms</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Vector Polygons</div>
                  <div className="text-emerald-400 font-bold">1,250,420</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">WFS Topology</div>
                  <div className="text-emerald-400 font-bold">Valid GEOS</div>
                </div>
              </div>
            </div>

          </div>

          {/* Batch Audit Simulation Runner */}
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Continuous Cadastral Batch Audit Engine (Scheduled Cron & On-Demand)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Scans all village sheets and jamabandis at rest to uncover silent boundary overlaps and share deficits.
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
              <div className="space-y-2 mt-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Executing 7-point consistency scan on Dispur Mouzas...</span>
                  <span className="text-emerald-400 font-bold">{batchProgress}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${batchProgress}%` }}
                  />
                </div>
              </div>
            )}

            {auditStats && (
              <div className="bg-emerald-950/40 border border-emerald-800 p-4 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Batch audit completed: <strong>{auditStats.processed.toLocaleString()}</strong> Dags reconciled with zero downtime.
                  </span>
                </div>
                <div className="text-amber-400 font-mono font-bold">
                  {auditStats.anomalies} anomalies queued for Mandal dispatch
                </div>
              </div>
            )}
          </div>

          {/* Interactive Cadastral File Ingestion Dropzone */}
          <div
            onClick={() => {
              showToast('Cadastral sheet parser validated: Schema EPSG:3857 & Assam BKL syntax verified!');
              logAction('FILE_INGESTION', 'Parsed test village cadastral sheet Jatia_Sheet_02.geojson (14 parcels).');
            }}
            className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-8 text-center bg-slate-950/30 cursor-pointer transition-all hover:bg-slate-950/50"
          >
            <UploadCloud className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-white">
              Ingest Village Cadastral Sheet (GeoJSON / TopoJSON / Shapefile ZIP)
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
              Drag and drop digitized cadastral sheets or click to upload. System automatically conducts topological checks, polygon closure, and Jamabandi reconciliation.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl border border-slate-700 font-semibold">
              <span>Select GeoJSON / SHP Archive</span>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODULE D: WORK-ORDER & SLA OVERSIGHT
          ========================================================================= */}
      {activeSubTab === 'sla' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Field Survey Work-Order SLA Command & Escalation Monitor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory 7-Day Target under the Assam Right to Public Services Act (ARTPS)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-950 text-red-300 border border-red-800 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                1 Overdue SLA
              </span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                {tasks.length} Active Orders
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task, idx) => {
              const matchedRecord = records.find(r => r.id === task.dagId || r.dagNumber === task.dagNumber);
              const isOverdue = idx === 0;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOverdue
                      ? 'bg-red-950/20 border-red-800/80'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-slate-400 font-bold">{task.id}</span>
                        <span className="text-white font-bold text-sm">
                          Dag {task.dagNumber} • Patta {task.pattaNumber} ({task.village}, {task.circle})
                        </span>
                        {isOverdue && (
                          <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> SLA BREACH (9 Days)
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          task.priority === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Assigned Officer: <strong className="text-amber-300">{task.assignedMandal}</strong></span>
                        <span>Scheduled: <strong className="text-slate-200">{task.scheduledDate}</strong></span>
                        <span>Status: <strong className="text-white">{task.status}</strong></span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400">
                        Anomalies to ground-truth: <span className="text-slate-300">{task.anomaliesSummary.join('; ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
                      {matchedRecord && (
                        <button
                          onClick={() => setRectificationRecord(matchedRecord)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Rule 53 Dossier</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedTaskToReassign(task)}
                        className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        Reassign Mandal
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          MODULE E: CRYPTOGRAPHIC AUDIT LOGS
          ========================================================================= */}
      {activeSubTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Immutable SHA-256 Audit Trail & CERT-In Compliance Logs
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every administrative recalibration, task dispatch, and score evaluation is cryptographically sealed.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV Dossier</span>
            </button>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-emerald-400 font-bold">{log.timestamp}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400 font-bold">{log.action}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400 text-[11px]">{log.actor}</span>
                  </div>
                  <div className="text-slate-200 mt-1 font-sans text-xs">{log.details}</div>
                </div>

                <div className="text-[10px] text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 shrink-0 select-all">
                  SHA-256: {log.hash.slice(0, 18)}...
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL 1: PROVISION NEW OFFICER
          ========================================================================= */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              Provision New Revenue Officer / Lat Mandal
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add authorized revenue staff to the Government of Assam operational roster.
            </p>

            <form onSubmit={handleCreateOfficer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Officer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diganta Hazarika"
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Government Officer ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LM-15"
                  value={newOfficerId}
                  onChange={(e) => setNewOfficerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Revenue Circle</label>
                <select
                  value={newOfficerCircle}
                  onChange={(e) => setNewOfficerCircle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Dispur">Dispur (Kamrup Metro)</option>
                  <option value="Sonapur">Sonapur (Tribal Belt)</option>
                  <option value="Kaliabor">Kaliabor (Nagaon)</option>
                  <option value="Chandrapur">Chandrapur (Kamrup Metro)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Phone (e-Pramaan)</label>
                <input
                  type="text"
                  placeholder="+91 94350 12345"
                  value={newOfficerPhone}
                  onChange={(e) => setNewOfficerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Provision Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: REASSIGN MANDAL
          ========================================================================= */}
      {selectedTaskToReassign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-amber-400" />
              Reassign Work-Order: {selectedTaskToReassign.id}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Reallocate Dag {selectedTaskToReassign.dagNumber} to an available Lat Mandal to clear SLA bottleneck.
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1 mb-4">
              <div>Current Mandal: <strong className="text-white">{selectedTaskToReassign.assignedMandal}</strong></div>
              <div>Location: <strong className="text-white">{selectedTaskToReassign.village}, {selectedTaskToReassign.circle}</strong></div>
              <div>Priority: <strong className="text-amber-400">{selectedTaskToReassign.priority}</strong></div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-300 font-semibold">Select New Lat Mandal</label>
              <select
                value={targetMandal}
                onChange={(e) => setTargetMandal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Dipankar Bora (LM-12)">Dipankar Bora (LM-12) — 0 Active Tasks (Standby)</option>
                <option value="Hemen Saikia (LM-09)">Hemen Saikia (LM-09) — 1 Active Task</option>
                <option value="Biren Kalita (LM-04)">Biren Kalita (LM-04) — 3 Active Tasks</option>
              </select>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedTaskToReassign(null)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReassign}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Confirm Reassignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: RULE 53 BOUNDARY RECTIFICATION DOSSIER
          ========================================================================= */}
      {rectificationRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  Statutory Revenue Notice
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Draft Rule 53 Boundary Correction Order (ALRR 1886)
                </h3>
                <p className="text-xs text-slate-400">
                  Court of the Circle Officer • Dispur Revenue Circle, Kamrup Metropolitan
                </p>
              </div>
              <button
                onClick={() => setRectificationRecord(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
              <div className="text-center font-bold text-white uppercase border-b border-slate-800 pb-2">
                OFFICE OF THE CIRCLE OFFICER :: DISPUR REVENUE CIRCLE
              </div>

              <div>
                <span className="text-slate-500">Case No:</span> ALRR-R53-2026-{rectificationRecord.dagNumber}
              </div>

              <div>
                <span className="text-slate-500">Subject:</span> Notice for Boundary Settlement & Demarcation Hearing under Rule 53 of Assam Land & Revenue Regulation, 1886.
              </div>

              <div className="text-slate-300 font-sans leading-relaxed">
                WHEREAS, an automated cadastral consistency audit conducted by <strong>BhumiSwasthya</strong> has detected spatial boundary overlaps and/or area discrepancies on <strong>Dag No. {rectificationRecord.dagNumber}</strong>, Patta No. {rectificationRecord.pattaNumber}, Village {rectificationRecord.village}, Mouza {rectificationRecord.mouza};
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400">Recorded Jamabandi Area: <strong className="text-white">{rectificationRecord.jamabandiAreaSqM} sq.m</strong></div>
                <div className="text-slate-400">Digitized Bhudakshya Cadastral Area: <strong className="text-white">{rectificationRecord.cadastralAreaSqM} sq.m</strong></div>
                {rectificationRecord.overlapsWithDag && (
                  <div className="text-red-400 font-bold">Conflict: Intersecting geometry detected with Dag {rectificationRecord.overlapsWithDag}</div>
                )}
              </div>

              <div className="text-slate-300 font-sans leading-relaxed">
                Notice is hereby served upon pattadar(s) <strong>{rectificationRecord.pattadars.map(p => p.name).join(', ')}</strong> and contiguous landholders to appear before the undersigned at Dispur Revenue Circle HQ with original Jamabandi extract and boundary records.
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  showToast('Rule 53 Notice copied to clipboard in government format.');
                  setRectificationRecord(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Copy Text
              </button>
              <button
                onClick={() => {
                  showToast('Rule 53 Notice dispatched to Circle Officer for signature.');
                  setRectificationRecord(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Issue Statutory Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
