import React, { useState, useMemo } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CadastralMapViewer } from './components/CadastralMapViewer';
import { FieldVerificationPortal } from './components/FieldVerificationPortal';
import { CitizenHealthPortal } from './components/CitizenHealthPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { RecordDetailModal } from './components/RecordDetailModal';
import { TutorialModal } from './components/TutorialModal';
import { initialLandRecords, initialVerificationTasks } from './data/mockAssamLandData';
import { LandRecord, VerificationTask } from './types/landRecords';
import { RuleEngineConfig, DEFAULT_RULE_CONFIG, auditLandRecord } from './services/healthCheckEngine';
import { Mail } from 'lucide-react';

export function App() {
  const [records, setRecords] = useState<LandRecord[]>(initialLandRecords);
  const [tasks, setTasks] = useState<VerificationTask[]>(initialVerificationTasks);
  const [ruleConfig, setRuleConfig] = useState<RuleEngineConfig>(DEFAULT_RULE_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCircle, setSelectedCircle] = useState<string>('ALL');
  const [inspectingRecord, setInspectingRecord] = useState<LandRecord | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Synchronize hash with activeTab for SEO, deep-linking and browser navigation
  React.useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'dashboard') setActiveTab('dashboard');
      else if (hash === 'gis-map' || hash === 'cadastral-map') setActiveTab('gis-map');
      else if (hash === 'field-verification' || hash === 'lat-mandal') setActiveTab('field-verification');
      else if (hash === 'citizen-portal' || hash === 'citizen-health') setActiveTab('citizen-portal');
      else if (hash === 'admin' || hash === 'admin-console') setActiveTab('admin');
      else if (hash === 'tutorial') setIsTutorialOpen(true);
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const handleTabSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.location.hash !== `#${tab}`) {
      window.history.pushState(null, '', `#${tab}`);
    }
  };

  // Filter records by selected circle
  const filteredRecords = useMemo(() => {
    if (selectedCircle === 'ALL') return records;
    return records.filter(r => r.circle.toLowerCase() === selectedCircle.toLowerCase());
  }, [records, selectedCircle]);

  // Critical counts
  const criticalCount = useMemo(() => {
    return records.filter(r => r.healthReport.grade === 'GRADE_D').length;
  }, [records]);

  // Dispatch a record to Lat Mandal for field inspection
  const handleDispatchToMandal = (record: LandRecord) => {
    const existingTask = tasks.find(t => t.dagId === record.id);
    if (existingTask) {
      alert(`Task already assigned to Lat Mandal for Dag ${record.dagNumber}.`);
      setActiveTab('field-verification');
      return;
    }

    const newTask: VerificationTask = {
      id: `TASK-2026-${String(tasks.length + 1).padStart(3, '0')}`,
      dagId: record.id,
      dagNumber: record.dagNumber,
      pattaNumber: record.pattaNumber,
      village: record.village,
      circle: record.circle,
      priority: record.healthReport.grade === 'GRADE_D' ? 'CRITICAL' : 'HIGH',
      assignedMandal: record.circle === 'Sonapur' ? 'Hemen Saikia (LM-09)' : 'Biren Kalita (LM-04)',
      anomaliesSummary: record.healthReport.anomalies.map(a => a.title),
      status: 'ASSIGNED',
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    };

    setTasks(prev => [newTask, ...prev]);
    setRecords(prev => prev.map(r => r.id === record.id ? { ...r, verificationStatus: 'ASSIGNED_TO_MANDAL' } : r));
    alert(`Survey order generated! Dag ${record.dagNumber} dispatched to ${newTask.assignedMandal}.`);
    setActiveTab('field-verification');
  };

  // Complete a verification task
  const handleCompleteTask = (taskId: string, findings: any) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'COMPLETED', findings };
      }
      return t;
    }));

    // Update corresponding record
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setRecords(prev => prev.map(r => {
        if (r.id === task.dagId || r.dagNumber === task.dagNumber) {
          return {
            ...r,
            verificationStatus: 'FIELD_INSPECTION_COMPLETED',
            fieldNotes: findings.remarks
          };
        }
        return r;
      }));
    }
  };

  // Recalibrate statutory rules and recalculate LHS across all parcels dynamically
  const handleUpdateRuleConfig = (newConfig: RuleEngineConfig) => {
    setRuleConfig(newConfig);
    setRecords(prev => prev.map(rec => ({
      ...rec,
      healthReport: auditLandRecord(rec, newConfig)
    })));
  };

  // Reassign task between Lat Mandals
  const handleReassignTask = (taskId: string, newMandal: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignedMandal: newMandal } : t));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setRecords(prev => prev.map(r => (r.id === task.dagId || r.dagNumber === task.dagNumber) ? { ...r, assignedMandal: newMandal } : r));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        selectedCircle={selectedCircle}
        setSelectedCircle={setSelectedCircle}
        totalRecords={records.length}
        criticalCount={criticalCount}
        onOpenTutorial={() => {
          setIsTutorialOpen(true);
          window.history.pushState(null, '', '#tutorial');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            records={filteredRecords}
            onSelectRecord={(r) => setInspectingRecord(r)}
            onDispatchToMandal={handleDispatchToMandal}
          />
        )}

        {activeTab === 'gis-map' && (
          <CadastralMapViewer
            records={filteredRecords}
            onSelectRecord={(r) => setInspectingRecord(r)}
            selectedRecordId={inspectingRecord?.id}
          />
        )}

        {activeTab === 'field-verification' && (
          <FieldVerificationPortal
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            records={records}
          />
        )}

        {activeTab === 'citizen-portal' && (
          <CitizenHealthPortal
            records={records}
            onSelectRecord={(r) => setInspectingRecord(r)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            records={records}
            tasks={tasks}
            ruleConfig={ruleConfig}
            onUpdateRuleConfig={handleUpdateRuleConfig}
            onReassignTask={handleReassignTask}
          />
        )}

      </main>

      {/* Detail Inspection Modal */}
      <RecordDetailModal
        record={inspectingRecord}
        onClose={() => setInspectingRecord(null)}
        onDispatchToMandal={handleDispatchToMandal}
      />

      {/* User Tutorial & Walkthrough Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsTutorialOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-5 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-semibold text-slate-200">
              BhumiSwasthya (ভূমি স্বাস্থ্য) • Assam Land Records Health Check & Anomaly Detection System
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              NESFIC 2026 Problem Statement NESFIC-D-50 | Revenue & Disaster Management Department, Assam
            </div>
          </div>
          
          <div className="text-center sm:text-right flex flex-col sm:items-end">
            <div className="font-semibold text-slate-200">
              Copyright © 2026 Ron Hatibaruah. All Rights Reserved.
            </div>
            <div className="text-[11px] text-slate-300 mt-1 flex items-center justify-center sm:justify-end gap-1.5">
              <span className="text-slate-400">Visitor Contact & Feedback:</span>
              <a
                href="mailto:ron.hatibaruah@gmail.com"
                className="text-emerald-400 hover:text-emerald-300 font-medium underline decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors inline-flex items-center gap-1 font-mono"
                title="Send email to Ron Hatibaruah (ron.hatibaruah@gmail.com)"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>ron.hatibaruah@gmail.com</span>
              </a>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Assam Innovation & Startup Foundation (AISF) Initiative
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;

