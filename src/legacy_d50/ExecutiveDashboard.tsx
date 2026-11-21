import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  IndianRupee, 
  Search, 
  Download, 
  Filter, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { LandRecord, HealthGrade, AnomalyType } from '../types/landRecords';
import { formatBKL } from '../services/healthCheckEngine';

interface ExecutiveDashboardProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
  onDispatchToMandal: (record: LandRecord) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  records,
  onSelectRecord,
  onDispatchToMandal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedAnomalyType, setSelectedAnomalyType] = useState<string>('ALL');

  // Compute Metrics
  const metrics = useMemo(() => {
    const total = records.length;
    const gradeA = records.filter(r => r.healthReport.grade === 'GRADE_A').length;
    const gradeB = records.filter(r => r.healthReport.grade === 'GRADE_B').length;
    const gradeC = records.filter(r => r.healthReport.grade === 'GRADE_C').length;
    const gradeD = records.filter(r => r.healthReport.grade === 'GRADE_D').length;
    
    const totalRevenue = records.reduce((sum, r) => sum + r.annualRevenueRs, 0);
    const revenueAtRisk = records
      .filter(r => r.healthReport.grade === 'GRADE_D' || r.annualRevenueRs === 0)
      .reduce((sum, r) => sum + (r.annualRevenueRs === 0 ? 500 : r.annualRevenueRs), 0);
    
    const avgScore = total > 0 
      ? Math.round(records.reduce((sum, r) => sum + r.healthReport.score, 0) / total)
      : 0;

    return { total, gradeA, gradeB, gradeC, gradeD, totalRevenue, revenueAtRisk, avgScore };
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // Search filter
      const matchesSearch = 
        record.dagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.pattaNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.circle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.pattadars.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Grade filter
      if (selectedGrade !== 'ALL' && record.healthReport.grade !== selectedGrade) {
        return false;
      }

      // Anomaly type filter
      if (selectedAnomalyType !== 'ALL') {
        const hasType = record.healthReport.anomalies.some(a => a.type === selectedAnomalyType);
        if (!hasType) return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedGrade, selectedAnomalyType]);

  const exportCSV = () => {
    const headers = ['Dag No', 'Patta No', 'Village', 'Circle', 'Land Class', 'Jamabandi Area', 'Cadastral Area', 'Health Score', 'Grade', 'Risk Status', 'Anomalies'];
    const rows = filteredRecords.map(r => [
      r.dagNumber,
      r.pattaNumber,
      r.village,
      r.circle,
      r.landClass,
      formatBKL(r.jamabandiArea),
      formatBKL(r.cadastralAreaBKL),
      r.healthReport.score,
      r.healthReport.grade,
      r.healthReport.riskStatus,
      r.healthReport.anomalies.map(a => a.title).join('; ')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(i => `"${i}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Assam_Land_Health_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Policy Advisory Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              NESFIC-D-50 Compliance
            </span>
            <span className="text-xs text-slate-400">Decision-Support Sandbox</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Assam Cadastral & RoR Pre-Emptive Health Audit
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Proactively identifying spatial overlaps, tenure share deficits, revenue leakage, and tribal belt inconsistencies across digitized rolls before citizen transactions trigger disputes.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Audited */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Audited Parcels</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</h3>
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Average Health Index: <span className="font-semibold text-slate-800">{metrics.avgScore}/100</span>
          </p>
        </div>

        {/* Grade A - Healthy */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Grade A (Clean)</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{metrics.gradeA}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">
            Straight-Through Ready ({Math.round((metrics.gradeA / (metrics.total || 1)) * 100)}%)
          </p>
        </div>

        {/* Grade B & C - Moderate Risk */}
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Grade B/C (Moderate)</p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1">{metrics.gradeB + metrics.gradeC}</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-amber-600 mt-2">
            Requires Desk Reconciliation
          </p>
        </div>

        {/* Grade D - Critical */}
        <div className="bg-white rounded-xl p-4 border border-rose-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-rose-700 uppercase tracking-wide">Grade D (Critical)</p>
              <h3 className="text-2xl font-bold text-rose-700 mt-1">{metrics.gradeD}</h3>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 mt-2 font-medium">
            Overlaps / Tribal Violations
          </p>
        </div>

        {/* Revenue at Risk */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Revenue Gap / Risk</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center">
                <IndianRupee className="w-4 h-4 mr-0.5 text-slate-700" />
                {metrics.revenueAtRisk.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            From zero/unassessed touzi
          </p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Dag No (e.g. 101, 103), Patta No, Village, or Pattadar..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Grade Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Health Grades</option>
                <option value="GRADE_A">Grade A (Healthy 85-100)</option>
                <option value="GRADE_B">Grade B (Minor 65-84)</option>
                <option value="GRADE_C">Grade C (Moderate 40-64)</option>
                <option value="GRADE_D">Grade D (Critical &lt; 40)</option>
              </select>
            </div>

            {/* Anomaly Category */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <select
                value={selectedAnomalyType}
                onChange={(e) => setSelectedAnomalyType(e.target.value)}
                className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Anomaly Types</option>
                <option value="SPATIAL_AREA_MISMATCH">Spatial Area Mismatch</option>
                <option value="SPATIAL_OVERLAP">Cadastral Boundary Overlap</option>
                <option value="SHARE_SUM_MISMATCH">Pattadar Share Drift</option>
                <option value="ZERO_OR_NULL_REVENUE">Zero Land Revenue</option>
                <option value="PROTECTED_LAND_ENCROACHMENT">Tribal / VGR Encroachment</option>
                <option value="UNRESOLVED_ENCUMBRANCE">Unresolved Mortgage / Stay</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Cadastral Parcel Health Register ({filteredRecords.length})
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across 7 legal & spatial consistency dimensions
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Click on any row to open full technical audit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/75 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Parcel Identity</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Land Class & Patta</th>
                <th className="py-3 px-4">Jamabandi Area</th>
                <th className="py-3 px-4">GIS Cadastral Area</th>
                <th className="py-3 px-4 text-center">Health Score</th>
                <th className="py-3 px-4">Detected Risk / Flags</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((record) => {
                const report = record.healthReport;
                const isGradeA = report.grade === 'GRADE_A';
                const isGradeD = report.grade === 'GRADE_D';
                const isGradeC = report.grade === 'GRADE_C';

                return (
                  <tr 
                    key={record.id}
                    onClick={() => onSelectRecord(record)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    {/* Parcel Identity */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">Dag {record.dagNumber}</div>
                      <div className="text-[11px] text-slate-500">Patta: {record.pattaNumber}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {record.village}
                      </div>
                      <div className="text-[11px] text-slate-500">{record.circle} Circle</div>
                    </td>

                    {/* Land Class & Patta */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{record.landClass}</div>
                      <div className="text-[11px] text-slate-500">{record.pattaType}</div>
                      {record.inTribalBelt && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">
                          Tribal Belt
                        </span>
                      )}
                    </td>

                    {/* Jamabandi Area */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-slate-900">
                        {formatBKL(record.jamabandiArea)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {record.jamabandiAreaSqM.toFixed(1)} sq.m
                      </div>
                    </td>

                    {/* GIS Cadastral Area */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-slate-900">
                        {formatBKL(record.cadastralAreaBKL)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {record.cadastralAreaSqM.toFixed(1)} sq.m
                      </div>
                    </td>

                    {/* Health Score */}
                    <td className="py-3 px-4 text-center">
                      <div className={`inline-flex flex-col items-center px-2.5 py-1 rounded-lg border font-bold ${
                        isGradeA ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        isGradeD ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' :
                        isGradeC ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className="text-sm leading-tight">{report.score}/100</span>
                        <span className="text-[10px] font-semibold">{report.grade.replace('_', ' ')}</span>
                      </div>
                    </td>

                    {/* Detected Risk / Flags */}
                    <td className="py-3 px-4 max-w-xs">
                      {report.anomalies.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Zero Discrepancies
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {report.anomalies.slice(0, 2).map((a) => (
                            <div key={a.id} className="text-xs flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                a.severity === 'CRITICAL' ? 'bg-rose-600' :
                                a.severity === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600'
                              }`} />
                              <span className="font-medium text-slate-800 truncate" title={a.title}>
                                {a.title}
                              </span>
                            </div>
                          ))}
                          {report.anomalies.length > 2 && (
                            <span className="text-[11px] text-slate-500">
                              +{report.anomalies.length - 2} more flag(s)
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectRecord(record)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Inspect Technical Audit"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {isGradeD && (
                          <button
                            onClick={() => onDispatchToMandal(record)}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold shadow-xs"
                            title="Dispatch Lat Mandal"
                          >
                            Dispatch Field
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
