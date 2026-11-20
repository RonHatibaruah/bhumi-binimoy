import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  MapPin, 
  User, 
  Scale, 
  FileText, 
  Send,
  Calendar,
  Layers,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';
import { formatBKL } from '../services/healthCheckEngine';

interface RecordDetailModalProps {
  record: LandRecord | null;
  onClose: () => void;
  onDispatchToMandal: (record: LandRecord) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
  onDispatchToMandal
}) => {
  if (!record) return null;

  const report = record.healthReport;
  const isGradeA = report.grade === 'GRADE_A';
  const isGradeD = report.grade === 'GRADE_D';
  const totalShares = record.pattadars.reduce((acc, p) => acc + p.sharePercentage, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              isGradeA ? 'bg-emerald-500/20 text-emerald-400' :
              isGradeD ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold">
                  Technical Audit: Dag No. {record.dagNumber}
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Patta: {record.pattaNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {record.village} Village • {record.mouza} Mouza • {record.circle} Circle
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${
              isGradeA ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
              isGradeD ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse' :
              'bg-amber-950 text-amber-300 border-amber-700'
            }`}>
              Score: {report.score}/100 ({report.riskStatus.replace('_', ' ')})
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Spatial vs Textual Comparison Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              Dual-System Reconciliation: Dharitree (Text) vs Bhudakshya (GIS)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Jamabandi Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Dharitree Jamabandi Record (Textual)
                </span>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {formatBKL(record.jamabandiArea)}
                </div>
                <div className="text-slate-600 space-y-0.5 text-[11px]">
                  <div>Metric Equivalent: <strong>{record.jamabandiAreaSqM.toFixed(1)} sq.m</strong></div>
                  <div>Patta Type: <strong>{record.pattaType}</strong></div>
                  <div>Classification: <strong>{record.landClass}</strong></div>
                  <div>Annual Touzi Revenue: <strong>₹{record.annualRevenueRs.toFixed(2)}</strong></div>
                </div>
              </div>

              {/* Bhudakshya Cadastral Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Bhudakshya Cadastral Geometry (Spatial GIS)
                </span>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {formatBKL(record.cadastralAreaBKL)}
                </div>
                <div className="text-slate-600 space-y-0.5 text-[11px]">
                  <div>Digitized Polygon Area: <strong>{record.cadastralAreaSqM.toFixed(1)} sq.m</strong></div>
                  <div>Area Variance: <strong>
                    {Math.abs(record.cadastralAreaSqM - record.jamabandiAreaSqM).toFixed(1)} sq.m (
                    {record.jamabandiAreaSqM > 0 
                      ? ((Math.abs(record.cadastralAreaSqM - record.jamabandiAreaSqM) / record.jamabandiAreaSqM) * 100).toFixed(1)
                      : 0}%)
                  </strong></div>
                  <div>Polygon Vertices: <strong>{record.coordinates.length} coordinates</strong></div>
                  <div>Overlaps: <strong>{record.overlapsWithDag ? `Dag ${record.overlapsWithDag} (Critical Conflict)` : 'None'}</strong></div>
                </div>
              </div>

            </div>
          </div>

          {/* Pattadar Tenure Integrity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                Landholder (Pattadar) Ownership Share Distribution
              </h4>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                Math.abs(totalShares - 100) < 0.01 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                Total Shares: {totalShares}% {Math.abs(totalShares - 100) < 0.01 ? '✓ Balanced' : '⚠️ Deficit/Excess'}
              </span>
            </div>

            <div className="space-y-2">
              {record.pattadars.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.relation} {p.guardianName}</div>
                    <div className="text-[11px] text-slate-400">Phone: {p.phone || 'Not linked'}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">{p.sharePercentage}%</span>
                    <div className="text-[10px] text-slate-500">
                      Aadhaar: <span className={p.aadhaarStatus === 'VERIFIED' ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>{p.aadhaarStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Anomaly Diagnostics */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Automated Anomaly Audit Flags ({report.anomalies.length})
            </h4>

            {report.anomalies.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 7 deterministic consistency rules passed. No discrepancies detected.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {report.anomalies.map((a) => (
                  <div key={a.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          a.severity === 'CRITICAL' ? 'bg-rose-600' :
                          a.severity === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600'
                        }`} />
                        <span>{a.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        a.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        a.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        -{a.penaltyPoints} Pts ({a.severity})
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{a.description}</p>
                    <div className="text-[11px] text-slate-800 font-medium bg-white p-2 rounded-lg border border-slate-200">
                      <strong>Recommended Departmental Action:</strong> {a.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Legacy Notes */}
          {record.legacyNotes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Remarks & Legacy Touzi Notations
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                {record.legacyNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-400">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close Audit
          </button>

          <div className="flex items-center space-x-2">
            {report.grade !== 'GRADE_A' && (
              <button
                onClick={() => {
                  onDispatchToMandal(record);
                  onClose();
                }}
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch to Lat Mandal Survey</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
