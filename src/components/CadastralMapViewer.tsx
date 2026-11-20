import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Compass, 
  SlidersHorizontal,
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Grid
} from 'lucide-react';
import { LandRecord } from '../types/landRecords';
import { formatBKL } from '../services/healthCheckEngine';

interface CadastralMapViewerProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
  selectedRecordId?: string;
}

export const CadastralMapViewer: React.FC<CadastralMapViewerProps> = ({
  records,
  onSelectRecord,
  selectedRecordId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'OVERLAPS' | 'HEALTHY'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(
    records.find(r => r.id === selectedRecordId) || records[0] || null
  );
  const [activeCircleView, setActiveCircleView] = useState<'Dispur' | 'Sonapur' | 'Kaliabor'>('Dispur');
  const [mapMode, setMapMode] = useState<'LEAFLET' | 'VECTOR'>('LEAFLET');

  // Filter records based on selected circle and status filter
  const displayedRecords = records.filter(r => {
    // Circle filter for map focus
    if (activeCircleView && r.circle !== activeCircleView) return false;

    if (activeFilter === 'CRITICAL') return r.healthReport.grade === 'GRADE_D';
    if (activeFilter === 'OVERLAPS') return !!r.overlapsWithDag;
    if (activeFilter === 'HEALTHY') return r.healthReport.grade === 'GRADE_A';
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapMode !== 'LEAFLET') return;
    if (!mapContainerRef.current) return;

    // Destroy existing map if already exists on re-render to avoid "Map container is already initialized"
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter: [number, number] = activeCircleView === 'Sonapur' 
      ? [26.1150, 91.9530] 
      : activeCircleView === 'Kaliabor' 
      ? [26.5825, 93.0030] 
      : [26.1384, 91.7925]; // Dispur default

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 16,
      zoomControl: true,
      preferCanvas: true
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Bhudakshya Cadastral Overlay',
      maxZoom: 19,
      minZoom: 11
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    polygonLayerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Force map to adapt to parent DOM dimensions after mount
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode, activeCircleView]);

  // Update Polygons when displayedRecords or selectedRecord changes
  useEffect(() => {
    if (mapMode !== 'LEAFLET') return;
    const map = mapInstanceRef.current;
    const layerGroup = polygonLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const bounds: L.LatLngBounds = L.latLngBounds([]);

    displayedRecords.forEach(record => {
      const isSelected = record.id === selectedRecordId || record.id === selectedRecord?.id;
      const grade = record.healthReport.grade;
      const hasOverlap = !!record.overlapsWithDag;

      let fillColor = '#10b981'; // Grade A - Emerald
      let borderColor = '#047857';

      if (grade === 'GRADE_B') {
        fillColor = '#f59e0b';
        borderColor = '#b45309';
      } else if (grade === 'GRADE_C') {
        fillColor = '#f97316';
        borderColor = '#c2410c';
      } else if (grade === 'GRADE_D') {
        fillColor = '#ef4444';
        borderColor = '#b91c1c';
      }

      const polygon = L.polygon(record.coordinates, {
        color: borderColor,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.75 : 0.45,
        weight: isSelected ? 4 : hasOverlap ? 3 : 2,
        dashArray: hasOverlap ? '6, 6' : undefined
      });

      // Bind interactive tooltip and popup
      polygon.bindTooltip(
        `<strong>Dag ${record.dagNumber}</strong> (${formatBKL(record.cadastralAreaBKL)})<br/>Score: ${record.healthReport.score}/100`,
        { sticky: true, className: 'cadastral-tooltip' }
      );

      const popupContent = document.createElement('div');
      popupContent.className = 'text-xs p-1 min-w-[210px] font-sans';
      popupContent.innerHTML = `
        <div class="font-bold text-slate-900 text-sm border-b pb-1 mb-1.5 flex justify-between items-center">
          <span>Dag No. ${record.dagNumber}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${
            grade === 'GRADE_A' ? 'bg-emerald-100 text-emerald-800' :
            grade === 'GRADE_D' ? 'bg-rose-100 text-rose-800' :
            'bg-amber-100 text-amber-800'
          }">
            Score: ${record.healthReport.score}/100
          </span>
        </div>
        <div class="space-y-0.5 text-slate-600 text-[11px]">
          <div><strong>Village:</strong> ${record.village} (${record.circle})</div>
          <div><strong>Patta:</strong> ${record.pattaNumber} (${record.pattaType})</div>
          <div><strong>Jamabandi Area:</strong> ${formatBKL(record.jamabandiArea)}</div>
          <div><strong>Cadastral GIS Area:</strong> ${formatBKL(record.cadastralAreaBKL)}</div>
          ${hasOverlap ? `<div class="text-rose-600 font-bold mt-1">⚠️ Boundary Overlaps with Dag ${record.overlapsWithDag}!</div>` : ''}
        </div>
        <button id="inspect-btn-${record.id}" class="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-2 rounded text-[11px] font-medium text-center">
          Open Technical Audit
        </button>
      `;

      polygon.bindPopup(popupContent);

      polygon.on('popupopen', () => {
        const btn = document.getElementById(`inspect-btn-${record.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectRecord(record);
            setSelectedRecord(record);
          };
        }
      });

      polygon.on('click', () => {
        setSelectedRecord(record);
      });

      polygon.addTo(layerGroup);
      record.coordinates.forEach(c => bounds.extend(c));
    });

    if (displayedRecords.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    }
  }, [displayedRecords, selectedRecord, selectedRecordId, mapMode]);

  const handleZoomToRecord = (record: LandRecord) => {
    setSelectedRecord(record);
    if (record.circle !== activeCircleView) {
      setActiveCircleView(record.circle as any);
    }
    if (mapMode === 'LEAFLET' && mapInstanceRef.current) {
      const bounds = L.latLngBounds(record.coordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[700px] w-full items-start">
      
      {/* Map Display Panel */}
      <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative min-h-[580px] h-[640px]">
        
        {/* Map Header / Controls */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-10 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                Bhudakshya Cadastral GIS Overlay
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded font-normal">
                  {displayedRecords.length} Dags Mapped
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Spatial Boundary Reconciliation & Overlap Detection (ALRR 1886)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Circle Focus Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
              <span className="text-slate-400 px-2 text-[11px]">Focus:</span>
              {(['Dispur', 'Sonapur', 'Kaliabor'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCircleView(c)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    activeCircleView === c 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Mode Switcher: Leaflet vs Vector Chitha */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setMapMode('LEAFLET')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  mapMode === 'LEAFLET' ? 'bg-slate-700 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Geographic OpenStreetMap layer"
              >
                Satellite / GIS
              </button>
              <button
                onClick={() => setMapMode('VECTOR')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  mapMode === 'VECTOR' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Vector Cadastral Sheet (Bhu-Naksha)"
              >
                Cadastral Sheet
              </button>
            </div>

            {/* Anomaly Filters */}
            <div className="flex items-center space-x-1 text-xs bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  activeFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('CRITICAL')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  activeFilter === 'CRITICAL' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setActiveFilter('OVERLAPS')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  activeFilter === 'OVERLAPS' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overlaps
              </button>
              <button
                onClick={() => setActiveFilter('HEALTHY')}
                className={`px-2 py-1 rounded text-[11px] font-medium ${
                  activeFilter === 'HEALTHY' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clean
              </button>
            </div>

          </div>
        </div>

        {/* Map View Body */}
        {mapMode === 'LEAFLET' ? (
          <div className="flex-1 w-full h-[520px] lg:h-[640px] relative z-0">
            <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />
          </div>
        ) : (
          /* High-Resolution Cadastral Vector Chitha View */
          <div className="flex-1 w-full h-[520px] lg:h-[640px] bg-amber-50/40 p-4 sm:p-6 flex flex-col justify-between relative overflow-auto">
            <div className="bg-white/90 backdrop-blur-xs p-3 rounded-lg border border-amber-200 text-xs text-amber-950 inline-block max-w-lg mb-2 shadow-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-amber-700" />
                Cadastral Sheet Projection: {activeCircleView} Revenue Circle
              </span>
              <p className="text-[11px] text-amber-900/80 mt-0.5">
                Scaled cadastral geometry directly projected from Bhudakshya polygon vertices. Click any parcel to inspect or trigger Lat Mandal ground audit.
              </p>
            </div>

            {/* SVG Cadastral Grid */}
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/60 p-4 relative min-h-[420px]">
              <svg viewBox="0 0 800 500" className="w-full h-full max-h-[460px]">
                <defs>
                  <pattern id="overlap-pattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="3" />
                  </pattern>
                </defs>

                {/* Grid guidelines */}
                <line x1="50" y1="50" x2="750" y2="50" stroke="#cbd5e1" strokeDasharray="4 4" />
                <line x1="50" y1="250" x2="750" y2="250" stroke="#cbd5e1" strokeDasharray="4 4" />
                <line x1="50" y1="450" x2="750" y2="450" stroke="#cbd5e1" strokeDasharray="4 4" />
                <line x1="200" y1="20" x2="200" y2="480" stroke="#cbd5e1" strokeDasharray="4 4" />
                <line x1="400" y1="20" x2="400" y2="480" stroke="#cbd5e1" strokeDasharray="4 4" />
                <line x1="600" y1="20" x2="600" y2="480" stroke="#cbd5e1" strokeDasharray="4 4" />

                {activeCircleView === 'Dispur' ? (
                  <>
                    {/* Dag 101 - Clean */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '101')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="120,100 240,110 230,220 110,210" fill="#10b981" fillOpacity="0.65" stroke="#047857" strokeWidth="2.5" />
                      <text x="170" y="155" textAnchor="middle" fill="#064e3b" fontWeight="bold" fontSize="14">Dag 101</text>
                      <text x="170" y="175" textAnchor="middle" fill="#064e3b" fontSize="11">0B-2K-10L (Clean)</text>
                    </g>

                    {/* Dag 102 - Area Shortfall */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '102')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="250,110 400,120 380,240 240,225" fill="#f59e0b" fillOpacity="0.6" stroke="#b45309" strokeWidth="2.5" />
                      <text x="315" y="165" textAnchor="middle" fill="#78350f" fontWeight="bold" fontSize="14">Dag 102</text>
                      <text x="315" y="185" textAnchor="middle" fill="#78350f" fontSize="11">Area Gap (-19.6%)</text>
                    </g>

                    {/* Dag 103 - Commercial Overlapping */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '103')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="390,120 540,130 520,270 370,250" fill="#f97316" fillOpacity="0.55" stroke="#c2410c" strokeWidth="2.5" />
                      <text x="450" y="175" textAnchor="middle" fill="#7c2d12" fontWeight="bold" fontSize="14">Dag 103</text>
                      <text x="450" y="195" textAnchor="middle" fill="#7c2d12" fontSize="11">KP-454 (0B-3K-15L)</text>
                    </g>

                    {/* Dag 104 - Residential Overlapping with 103 */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '104')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="500,125 660,135 640,285 480,265" fill="#ef4444" fillOpacity="0.55" stroke="#b91c1c" strokeWidth="3" strokeDasharray="6,4" />
                      <text x="580" y="190" textAnchor="middle" fill="#881337" fontWeight="bold" fontSize="14">Dag 104</text>
                      <text x="580" y="210" textAnchor="middle" fill="#881337" fontSize="11">KP-455 (Overlaps)</text>
                    </g>

                    {/* Overlap intersection indicator */}
                    <rect x="500" y="125" width="40" height="140" fill="url(#overlap-pattern)" fillOpacity="0.8" />
                    <text x="520" y="295" textAnchor="middle" fill="#b91c1c" fontWeight="bold" fontSize="12">⚠️ Conflict Zone</text>
                  </>
                ) : activeCircleView === 'Sonapur' ? (
                  <>
                    {/* Dag 310 - Tribal Belt Violation */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '310')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="150,140 380,150 360,320 130,300" fill="#ef4444" fillOpacity="0.6" stroke="#b91c1c" strokeWidth="3" />
                      <text x="255" y="220" textAnchor="middle" fill="#881337" fontWeight="bold" fontSize="16">Dag 310 (Sonapur)</text>
                      <text x="255" y="245" textAnchor="middle" fill="#881337" fontSize="12">Chapter X Tribal Belt Violation</text>
                    </g>

                    {/* Dag 402 - VGR */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '402')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="420,130 680,145 660,350 400,330" fill="#ef4444" fillOpacity="0.6" stroke="#b91c1c" strokeWidth="3" />
                      <text x="540" y="225" textAnchor="middle" fill="#881337" fontWeight="bold" fontSize="16">Dag 402 (Dimoria)</text>
                      <text x="540" y="250" textAnchor="middle" fill="#881337" fontSize="12">Village Grazing Reserve (VGR) Encroachment</text>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Kaliabor dags */}
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '501')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="180,120 440,130 420,330 160,310" fill="#10b981" fillOpacity="0.6" stroke="#047857" strokeWidth="2.5" />
                      <text x="300" y="210" textAnchor="middle" fill="#064e3b" fontWeight="bold" fontSize="15">Dag 501 (Jakhalabandha)</text>
                      <text x="300" y="235" textAnchor="middle" fill="#064e3b" fontSize="12">3B-2K-10L (Agricultural Clean)</text>
                    </g>
                    <g 
                      onClick={() => handleZoomToRecord(records.find(r => r.dagNumber === '502')!)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <polygon points="460,135 680,145 660,320 440,305" fill="#f59e0b" fillOpacity="0.6" stroke="#b45309" strokeWidth="2.5" />
                      <text x="560" y="210" textAnchor="middle" fill="#78350f" fontWeight="bold" fontSize="15">Dag 502</text>
                      <text x="560" y="235" textAnchor="middle" fill="#78350f" fontSize="12">Unresolved AGVB Mortgage</text>
                    </g>
                  </>
                )}
              </svg>
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white border border-slate-700 p-3 rounded-lg text-xs space-y-1.5 shadow-lg pointer-events-auto">
          <div className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Cadastral Health Legend
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600" />
            <span>Grade A: Clean Geometry (&gt;85)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600" />
            <span>Grade B: Minor Area Drift (65-84)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded bg-orange-500 border border-orange-600" />
            <span>Grade C: Moderate Variance (40-64)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600 border-dashed" />
            <span>Grade D / Dashed: Overlap / Critical</span>
          </div>
        </div>

      </div>

      {/* Side Inspector Panel */}
      <div className="w-full md:w-80 lg:w-96 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[640px] shrink-0 overflow-hidden">
        
        <div className="border-b border-slate-200 pb-3 mb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            Cadastral Quick Inspector
          </h4>
          <p className="text-xs text-slate-500">
            Click any parcel to inspect or zoom on map
          </p>
        </div>

        {selectedRecord ? (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selected Dag</span>
                  <h5 className="text-lg font-bold text-slate-900">Dag {selectedRecord.dagNumber}</h5>
                  <p className="text-xs text-slate-600">{selectedRecord.village}, {selectedRecord.circle}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  selectedRecord.healthReport.grade === 'GRADE_A' ? 'bg-emerald-100 text-emerald-800' :
                  selectedRecord.healthReport.grade === 'GRADE_D' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  Score: {selectedRecord.healthReport.score}/100
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Jamabandi Area</span>
                  <span className="font-semibold text-slate-800">{formatBKL(selectedRecord.jamabandiArea)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Cadastral Area</span>
                  <span className="font-semibold text-slate-800">{formatBKL(selectedRecord.cadastralAreaBKL)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Patta Number</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.pattaNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Land Class</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.landClass}</span>
                </div>
              </div>
            </div>

            {/* Active Anomalies in Selected */}
            <div>
              <h6 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Detected Defect(s) ({selectedRecord.healthReport.anomalies.length})
              </h6>
              {selectedRecord.healthReport.anomalies.length === 0 ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cadastral geometry matches Jamabandi perfectly without defects.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedRecord.healthReport.anomalies.map((a) => (
                    <div key={a.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{a.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          a.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          a.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{a.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectRecord(selectedRecord)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Open Full Technical RoR Audit
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <p className="text-xs text-slate-500 mb-2">
              Select any parcel to inspect:
            </p>
            {displayedRecords.map((r) => (
              <div
                key={r.id}
                onClick={() => handleZoomToRecord(r)}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">Dag {r.dagNumber} - {r.village}</div>
                  <div className="text-[11px] text-slate-500">{r.pattaNumber} • {formatBKL(r.cadastralAreaBKL)}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  r.healthReport.grade === 'GRADE_A' ? 'bg-emerald-100 text-emerald-800' :
                  r.healthReport.grade === 'GRADE_D' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {r.healthReport.score}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
