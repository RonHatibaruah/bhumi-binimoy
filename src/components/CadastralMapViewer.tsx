import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Tag,
  Building,
  Globe,
  Satellite,
  Compass,
  Grid,
  Eye,
  EyeOff
} from 'lucide-react';
import { LandMarketplaceListing } from '../types/landRecords';
import { formatBKL, formatINR } from '../services/marketplaceEngine';

interface CadastralMapViewerProps {
  listings: LandMarketplaceListing[];
  onSelectListing: (listing: LandMarketplaceListing) => void;
  onOpenDealRoom: (listing: LandMarketplaceListing) => void;
  selectedListingId?: string;
}

// Recommended Free Map Layer Configurations
type BaseMapMode = 'blueprint' | 'satellite' | 'street' | 'dark';

const BASE_MAP_PROVIDERS: Record<BaseMapMode, { name: string; url: string; attribution: string; maxZoom: number; icon: any }> = {
  blueprint: {
    name: 'CartoDB Positron (Blueprint)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    icon: Compass
  },
  satellite: {
    name: 'Esri World Satellite (High-Res)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    icon: Satellite
  },
  street: {
    name: 'OpenStreetMap (Streets)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    icon: Globe
  },
  dark: {
    name: 'CartoDB Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    icon: Layers
  }
};

export const CadastralMapViewer: React.FC<CadastralMapViewerProps> = ({
  listings,
  onSelectListing,
  onOpenDealRoom,
  selectedListingId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const labelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const gridLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // States
  const [activeBaseMap, setActiveBaseMap] = useState<BaseMapMode>('blueprint');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showParcels, setShowParcels] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showSurveyGrid, setShowSurveyGrid] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'GOLD' | 'COMMERCIAL' | 'RESIDENTIAL'>('ALL');
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [selectedListing, setSelectedListing] = useState<LandMarketplaceListing | null>(
    listings.find(l => l.id === selectedListingId) || listings[0] || null
  );

  // Filter listings
  const filteredListings = listings.filter(l => {
    if (activeFilter === 'GOLD') return l.governmentVerified.titleClearanceBadge === 'GOLD_VERIFIED';
    if (activeFilter === 'COMMERCIAL') return l.governmentVerified.landClass.includes('Commercial');
    if (activeFilter === 'RESIDENTIAL') return l.governmentVerified.landClass.includes('Residential');
    return true;
  });

  // Color mapper based on title badge
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'GOLD_VERIFIED':
        return { fill: '#10b981', stroke: '#047857', glow: 'rgba(16, 185, 129, 0.4)' };
      case 'SILVER_VERIFIED':
        return { fill: '#06b6d4', stroke: '#0e7490', glow: 'rgba(6, 182, 212, 0.4)' };
      case 'CONDITIONAL':
        return { fill: '#f59e0b', stroke: '#b45309', glow: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { fill: '#f43f5e', stroke: '#be123c', glow: 'rgba(244, 63, 94, 0.4)' };
    }
  };

  // Switch Base Map Tiles Dynamically
  const switchBaseMap = useCallback((mode: BaseMapMode) => {
    if (!mapInstanceRef.current) return;
    const provider = BASE_MAP_PROVIDERS[mode];

    if (baseTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseTileLayerRef.current);
    }

    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom
    });

    newLayer.addTo(mapInstanceRef.current);
    baseTileLayerRef.current = newLayer;
    setActiveBaseMap(mode);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center at Dispur, Guwahati
    const defaultCenter: [number, number] = [26.1384, 91.7918];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      zoomControl: false
    });

    // Initial Base Map: CartoDB Positron
    const initialProvider = BASE_MAP_PROVIDERS['blueprint'];
    const baseLayer = L.tileLayer(initialProvider.url, {
      attribution: initialProvider.attribution,
      maxZoom: initialProvider.maxZoom
    }).addTo(map);
    baseTileLayerRef.current = baseLayer;

    // Controls
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer Groups
    polygonLayerGroupRef.current = L.layerGroup().addTo(map);
    labelsLayerGroupRef.current = L.layerGroup().addTo(map);
    gridLayerGroupRef.current = L.layerGroup().addTo(map);

    // Mouse coordinates tracking
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setMouseCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Survey Grid Overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !gridLayerGroupRef.current) return;

    gridLayerGroupRef.current.clearLayers();

    if (!showSurveyGrid) return;

    // Dispur Circle Cadastral 500m Survey Grid Lines
    const minLat = 26.120;
    const maxLat = 26.160;
    const minLng = 91.760;
    const maxLng = 91.820;
    const step = 0.005; // ~500 meters

    const gridLines: L.Polyline[] = [];

    // Horizontal latitude lines
    for (let lat = minLat; lat <= maxLat; lat += step) {
      gridLines.push(
        L.polyline([[lat, minLng], [lat, maxLng]], {
          color: activeBaseMap === 'satellite' ? '#38bdf8' : '#94a3b8',
          weight: 0.7,
          dashArray: '3, 6',
          opacity: 0.5
        })
      );
    }

    // Vertical longitude lines
    for (let lng = minLng; lng <= maxLng; lng += step) {
      gridLines.push(
        L.polyline([[minLat, lng], [maxLat, lng]], {
          color: activeBaseMap === 'satellite' ? '#38bdf8' : '#94a3b8',
          weight: 0.7,
          dashArray: '3, 6',
          opacity: 0.5
        })
      );
    }

    gridLines.forEach(line => gridLayerGroupRef.current?.addLayer(line));
  }, [showSurveyGrid, activeBaseMap]);

  // Render Polygons & Labels on map
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonLayerGroupRef.current || !labelsLayerGroupRef.current) return;

    polygonLayerGroupRef.current.clearLayers();
    labelsLayerGroupRef.current.clearLayers();

    if (showParcels) {
      filteredListings.forEach(listing => {
        const colors = getBadgeColor(listing.governmentVerified.titleClearanceBadge);
        const isSelected = selectedListing?.id === listing.id;

        const polygon = L.polygon(listing.coordinates, {
          color: isSelected ? '#ffffff' : colors.stroke,
          weight: isSelected ? 3.5 : 2,
          fillColor: colors.fill,
          fillOpacity: isSelected ? 0.75 : 0.45,
          dashArray: listing.governmentVerified.chapterXTribalBeltStatus === 'NOTIFIED_BELT_PROTECTED_CLASS_ONLY' ? '5, 5' : undefined
        });

        // Tooltip
        polygon.bindTooltip(
          `<div class="p-1.5 font-sans bg-slate-950 text-white rounded shadow-xl border border-slate-700">
            <div class="font-bold text-xs text-emerald-400">Dag ${listing.governmentVerified.dagNumber} • Patta ${listing.governmentVerified.pattaNumber}</div>
            <div class="text-[11px] text-slate-300">${formatBKL(listing.governmentVerified.recordedAreaBKL)} • ${listing.governmentVerified.landClass}</div>
            <div class="font-semibold text-white text-xs mt-1">Asking: ${formatINR(listing.sellerRepresentations.askingPriceINR)}</div>
            <div class="text-[10px] text-slate-400">Zonal: ${formatINR(listing.governmentVerified.zonalRatePerBighaINR)}/Bigha</div>
          </div>`,
          { permanent: false, direction: 'top', className: 'custom-cadastral-tooltip' }
        );

        // Click handler
        polygon.on('click', () => {
          setSelectedListing(listing);
          onSelectListing(listing);
        });

        polygonLayerGroupRef.current?.addLayer(polygon);

        // Numerical Dag Centroid Label
        if (showLabels) {
          const labelIcon = L.divIcon({
            className: 'custom-dag-marker',
            html: `<div style="background-color: ${isSelected ? '#0f172a' : colors.fill}; color: ${isSelected ? '#38bdf8' : '#ffffff'}; border: 1.5px solid ${isSelected ? '#38bdf8' : '#ffffff'}; box-shadow: 0 2px 6px rgba(0,0,0,0.4);" class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold whitespace-nowrap cursor-pointer transition-transform hover:scale-110 flex items-center gap-1">
              <span>Dag ${listing.governmentVerified.dagNumber}</span>
            </div>`,
            iconSize: [60, 20],
            iconAnchor: [30, 10]
          });

          const marker = L.marker(listing.centerPoint, { icon: labelIcon });
          marker.on('click', () => {
            setSelectedListing(listing);
            onSelectListing(listing);
          });

          labelsLayerGroupRef.current?.addLayer(marker);
        }
      });
    }
  }, [filteredListings, selectedListing, showParcels, showLabels, onSelectListing]);

  // Sync selected listing from props
  useEffect(() => {
    if (selectedListingId) {
      const target = listings.find(l => l.id === selectedListingId);
      if (target) {
        setSelectedListing(target);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(target.centerPoint, 16, { duration: 1.2 });
        }
      }
    }
  }, [selectedListingId, listings]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar: Parcel Browser & Filters */}
      <div className="w-full lg:w-96 bg-slate-900/95 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-1/2 lg:h-full z-10 shrink-0 shadow-2xl backdrop-blur-md">
        
        {/* Header / Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                <Building className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Dispur Cadastral Map</h3>
                <p className="text-[11px] text-slate-400">Assam Land Exchange • Stream 1</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{filteredListings.length} Listed Dags</span>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-medium">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`py-1.5 rounded-lg transition-all ${
                activeFilter === 'ALL' 
                  ? 'bg-slate-800 text-white font-bold shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('GOLD')}
              className={`py-1.5 rounded-lg transition-all ${
                activeFilter === 'GOLD' 
                  ? 'bg-emerald-600 text-white font-bold shadow' 
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Gold
            </button>
            <button
              onClick={() => setActiveFilter('RESIDENTIAL')}
              className={`py-1.5 rounded-lg transition-all ${
                activeFilter === 'RESIDENTIAL' 
                  ? 'bg-cyan-600 text-white font-bold shadow' 
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setActiveFilter('COMMERCIAL')}
              className={`py-1.5 rounded-lg transition-all ${
                activeFilter === 'COMMERCIAL' 
                  ? 'bg-purple-600 text-white font-bold shadow' 
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              Comm.
            </button>
          </div>
        </div>

        {/* Scrollable Listings List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredListings.map(listing => {
            const isSelected = selectedListing?.id === listing.id;
            const badge = listing.governmentVerified.titleClearanceBadge;

            return (
              <div
                key={listing.id}
                onClick={() => {
                  setSelectedListing(listing);
                  onSelectListing(listing);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo(listing.centerPoint, 16, { duration: 1.0 });
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/50' 
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Dag {listing.governmentVerified.dagNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">Patta {listing.governmentVerified.pattaNumber}</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    badge === 'GOLD_VERIFIED' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : badge === 'SILVER_VERIFIED' 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : badge === 'CONDITIONAL' 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {badge.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-semibold text-xs text-slate-200 line-clamp-1 mb-1">
                  {listing.title}
                </h4>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {listing.mouza}, {listing.circle}
                  </span>
                  <span className="font-medium text-slate-300">
                    {formatBKL(listing.governmentVerified.recordedAreaBKL)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs mb-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Asking Price</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {formatINR(listing.sellerRepresentations.askingPriceINR)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Zonal Benchmark</span>
                    <span className="font-mono text-slate-400">
                      {formatINR(listing.governmentVerified.totalZonalValuationINR)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Title Score: <strong className="text-emerald-300">{listing.governmentVerified.titleScore}/100</strong>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDealRoom(listing);
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
                  >
                    <span>Inspect Deal Room</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative h-1/2 lg:h-full">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Top-Left: Map Header & Statutory Banner */}
        <div className="absolute top-4 left-4 z-[400] max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-2xl text-xs pointer-events-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Assam Cadastral Vector Map Layer</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Parcels mapped via <strong>Bhudakshya WebGIS</strong> & reconciled with <strong>Dharitree Jamabandi</strong> records.
          </p>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Layer: {BASE_MAP_PROVIDERS[activeBaseMap].name}</span>
          </div>
        </div>

        {/* Top-Right: Floating Layer Switcher & Cadastral Overlays */}
        <div className="absolute top-4 right-14 z-[400] flex flex-col items-end pointer-events-auto">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md text-xs font-semibold transition-all"
            title="Configure Map & Cadastral Layers"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Layers & Styling</span>
          </button>

          {showLayerMenu && (
            <div className="mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-3.5 space-y-3.5 animate-in fade-in slide-in-from-top-2 text-xs">
              
              {/* Base Map Selection */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Base Map Provider
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(BASE_MAP_PROVIDERS) as BaseMapMode[]).map(mode => {
                    const provider = BASE_MAP_PROVIDERS[mode];
                    const Icon = provider.icon;
                    const isActive = activeBaseMap === mode;

                    return (
                      <button
                        key={mode}
                        onClick={() => switchBaseMap(mode)}
                        className={`p-2 rounded-xl flex items-center gap-2 border text-left transition-all ${
                          isActive 
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span className="text-[11px] truncate">{provider.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cadastral Overlays Toggles */}
              <div className="border-t border-slate-800 pt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Cadastral Overlays
                </span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/60">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Cadastral Dag Parcels</span>
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showParcels} 
                      onChange={(e) => setShowParcels(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/60">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Numerical Dag Badges</span>
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showLabels} 
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-slate-800/60">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Grid className="w-3.5 h-3.5 text-blue-400" />
                      <span>500m Survey Grid Lines</span>
                    </span>
                    <input 
                      type="checkbox" 
                      checked={showSurveyGrid} 
                      onChange={(e) => setShowSurveyGrid(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                  </label>
                </div>
              </div>

              {/* Legend Summary */}
              <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Title Clearance Legend:</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Gold Verified (90-100 pts)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Silver Verified (75-89 pts)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Conditional Transfer (50-74 pts)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Restricted / Chapter X</div>
              </div>

            </div>
          )}
        </div>

        {/* Live Coordinate & Scale Indicator (Bottom-Left) */}
        <div className="absolute bottom-24 lg:bottom-24 left-4 z-[400] bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg text-[10px] font-mono text-slate-300 pointer-events-none flex items-center gap-3">
          <span>Lat: {mouseCoords ? mouseCoords.lat.toFixed(5) : '26.13840'}°N</span>
          <span>Lng: {mouseCoords ? mouseCoords.lng.toFixed(5) : '91.79180'}°E</span>
          <span className="text-emerald-400 font-semibold">EPSG:32646 (UTM 46N)</span>
        </div>

        {/* Floating Selected Parcel Quick Action Bar */}
        {selectedListing && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-6 lg:right-6 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 pointer-events-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Building className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Dag {selectedListing.governmentVerified.dagNumber} • Patta {selectedListing.governmentVerified.pattaNumber}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">{selectedListing.governmentVerified.landClass}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mt-0.5">{selectedListing.title}</h4>
                <p className="text-xs text-slate-400">
                  {selectedListing.village}, {selectedListing.circle} • Area: {formatBKL(selectedListing.governmentVerified.recordedAreaBKL)} ({selectedListing.governmentVerified.recordedAreaSqM} sq.m)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Asking Price</div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {formatINR(selectedListing.sellerRepresentations.askingPriceINR)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Zonal Rate: {formatINR(selectedListing.governmentVerified.zonalRatePerBighaINR)}/Bigha
                </div>
              </div>

              <button
                onClick={() => onOpenDealRoom(selectedListing)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Open Buyer Deal Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
