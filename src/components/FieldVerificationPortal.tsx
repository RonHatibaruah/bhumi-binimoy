import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Send, 
  Upload, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { VerificationTask, BKL, LandRecord } from '../types/landRecords';
import { formatBKL } from '../services/healthCheckEngine';

interface FieldVerificationPortalProps {
  tasks: VerificationTask[];
  onCompleteTask: (taskId: string, findings: any) => void;
  records: LandRecord[];
}

export const FieldVerificationPortal: React.FC<FieldVerificationPortalProps> = ({
  tasks,
  onCompleteTask,
  records
}) => {
  const [selectedTask, setSelectedTask] = useState<VerificationTask>(tasks[0]);
  const [bigha, setBigha] = useState<number>(0);
  const [katha, setKatha] = useState<number>(0);
  const [lesa, setLesa] = useState<number>(0);
  const [boundaryStatus, setBoundaryStatus] = useState<string>('Displaced / Disputed');
  const [possessionStatus, setPossessionStatus] = useState<string>('Pattadar in Actual Possession');
  const [gpsLocation, setGpsLocation] = useState<string>('26.1384° N, 91.7925° E (Accuracy: ±1.8m)');
  const [remarks, setRemarks] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string>('Recommend Cadastral Boundary Rectification under Rule 48');
  const [hasPhoto, setHasPhoto] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync initial bkl when switching task
  const handleSelectTask = (task: VerificationTask) => {
    setSelectedTask(task);
    setIsSubmitted(task.status === 'COMPLETED');
    const matchedRecord = records.find(r => r.dagNumber === task.dagNumber || r.id === task.dagId);
    if (matchedRecord) {
      setBigha(matchedRecord.cadastralAreaBKL.bigha);
      setKatha(matchedRecord.cadastralAreaBKL.katha);
      setLesa(matchedRecord.cadastralAreaBKL.lesa);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const findings = {
      onGroundAreaBKL: { bigha, katha, lesa },
      boundaryMarkersIntact: boundaryStatus === 'Intact',
      possessionVerified: possessionStatus === 'Pattadar in Actual Possession',
      remarks: `${recommendation}. Lat Mandal Notes: ${remarks || 'Field ground survey completed.'}`,
      verifiedAt: new Date().toISOString().split('T')[0],
      gpsCoordinates: gpsLocation
    };

    onCompleteTask(selectedTask.id, findings);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Header */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              Field Officer Roster
            </span>
            <span className="text-xs text-slate-400">Kamrup Metro & Nagaon Division</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            Lat Mandal Field Verification Queue
          </h2>
          <p className="text-xs text-slate-300">
            Ground audit, boundary verification, and adverse possession reporting for flagged parcels.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700 text-xs">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white">
            BK
          </div>
          <div>
            <div className="font-bold text-slate-200">Biren Kalita (LM-04)</div>
            <div className="text-[11px] text-slate-400">Lat Mandal, Beltola Mouza, Dispur</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task List Column */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Field Verification Tasks ({tasks.length})
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">Sorted by Risk</span>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => {
              const isSelected = selectedTask.id === task.id;
              const isCritical = task.priority === 'CRITICAL';

              return (
                <div
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      Dag No. {task.dagNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.priority} PRIORITY
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.village}, {task.circle} Circle (Patta: {task.pattaNumber})</span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px] text-slate-700 space-y-1 mb-2">
                    {task.anomaliesSummary.map((a, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Target: {task.scheduledDate}
                    </span>
                    <span className={`font-semibold ${task.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {task.status === 'COMPLETED' ? '✓ Verified' : '● Needs Survey'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Form Column */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          
          <div className="border-b border-slate-200 pb-4 mb-5 flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Ground Verification Sheet
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Inspection Report for Dag {selectedTask.dagNumber} ({selectedTask.village})
              </h3>
              <p className="text-xs text-slate-500">
                Record on-ground survey findings to reconcile discrepancies before the Circle Officer.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Assigned Lat Mandal</span>
              <span className="text-xs font-bold text-slate-800">{selectedTask.assignedMandal}</span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-emerald-950">
                Field Verification Report Submitted Successfully!
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                The findings and GPS boundary coordinates have been forwarded to the Circle Officer for approval and entry into Dharitree/Bhudakshya.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-700 underline"
              >
                Modify Survey Findings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Field 1: Measured Area in Assam Units */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Measured Ground Area (Bigha - Katha - Lesa)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Bigha (B)</label>
                    <input
                      type="number"
                      min="0"
                      value={bigha}
                      onChange={(e) => setBigha(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Katha (K) [0-4]</label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={katha}
                      onChange={(e) => setKatha(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Lesa (L) [0-19.9]</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="19.9"
                      value={lesa}
                      onChange={(e) => setLesa(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Recorded in Jamabandi: <span className="font-semibold">{formatBKL({ bigha: 1, katha: 1, lesa: 0 })}</span>
                </p>
              </div>

              {/* Field 2 & 3: Boundary & Possession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Cadastral Boundary Stones
                  </label>
                  <select
                    value={boundaryStatus}
                    onChange={(e) => setBoundaryStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Intact">All Boundary Stones Intact & Undisputed</option>
                    <option value="Displaced / Disputed">Displaced / Disputed on Ground</option>
                    <option value="Missing">Boundary Stones Missing / Obliterated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Ground Possession Status
                  </label>
                  <select
                    value={possessionStatus}
                    onChange={(e) => setPossessionStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pattadar in Actual Possession">Recorded Pattadar in Actual Possession</option>
                    <option value="Partial Encroachment">Partial Encroachment by Neighbor</option>
                    <option value="Third-Party Encroachment">Third-Party Encroachment / Adverse</option>
                    <option value="Vacant / Abandoned">Vacant / Abandoned Plot</option>
                  </select>
                </div>
              </div>

              {/* Field 4: GPS Geo-location Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  4. Field GPS Geotag Coordinates
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg text-xs font-mono text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{gpsLocation}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGpsLocation(`26.${Math.floor(Math.random() * 900 + 100)}° N, 91.${Math.floor(Math.random() * 900 + 100)}° E (GPS Locked ±1.2m)`)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium"
                  >
                    Refresh GPS
                  </button>
                </div>
              </div>

              {/* Field 5: Photo Verification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Geo-Tagged Field Photographs
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <p className="text-xs font-medium text-slate-700">
                      boundary_demarcation_dag{selectedTask.dagNumber}_nov2026.jpg
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Geo-tagged • Timestamp: 2026-11-20 16:45 IST
                    </p>
                  </div>
                </div>
              </div>

              {/* Field 6: Recommendation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  6. Lat Mandal Recommendation for Circle Officer
                </label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 mb-2"
                >
                  <option value="Recommend Cadastral Boundary Rectification under Rule 48">
                    Recommend Cadastral Boundary Rectification under Rule 48 (Map Correction)
                  </option>
                  <option value="Notice to Neighbor for Joint Boundary Settlement">
                    Notice to Neighboring Dag Pattadar for Joint Demarcation Hearing
                  </option>
                  <option value="Initiate Mutation Partition Case for Heir Shares">
                    Initiate Suo-Motu Field Partition Case for Heir Shares
                  </option>
                  <option value="Submit Case to Deputy Commissioner under Chapter X">
                    Submit Case to Deputy Commissioner under Chapter X (Tribal Belt Inquiry)
                  </option>
                </select>

                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="Additional survey observations, witness statements, or field notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Field Report & Forward to CO</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
