import React, { useEffect, useRef, useState } from 'react';
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
  Building
} from 'lucide-react';
import { LandMarketplaceListing } from '../types/landRecords';
import { formatBKL, formatINR } from '../services/marketplaceEngine';

interface CadastralMapViewerProps {
  listings: LandMarketplaceListing[];
  onSelectListing: (listing: LandMarketplaceListing) => void;
  onOpenDealRoom: (listing: LandMarketplaceListing) => void;
  selectedListingId?: string;
}

export const CadastralMapViewer: React.FC<CadastralMapViewerProps> = ({
  listings,
  onSelectListing,
  onOpenDealRoom,
  selectedListingId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'GOLD' | 'COMMERCIAL' | 'RESIDENTIAL'>('ALL');
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
        return { fill: '#10b981', stroke: '#047857' };
      case 'SILVER_VERIFIED':
        return { fill: '#06b6d4', stroke: '#0e7490' };
      case 'CONDITIONAL':
        return { fill: '#f59e0b', stroke: '#b45309' };
      default:
        return { fill: '#f43f5e', stroke: '#be123c' };
    }
  };

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

    // Basemap: CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; Bhudakshya Cadastral GIS',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    polygonLayerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Polygons on map
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonLayerGroupRef.current) return;

    polygonLayerGroupRef.current.clearLayers();

    filteredListings.forEach(listing => {
      const colors = getBadgeColor(listing.governmentVerified.titleClearanceBadge);
      const isSelected = selectedListing?.id === listing.id;

      const polygon = L.polygon(listing.coordinates, {
        color: isSelected ? '#1e293b' : colors.stroke,
        weight: isSelected ? 4 : 2,
        fillColor: colors.fill,
        fillOpacity: isSelected ? 0.75 : 0.45,
        dashArray: listing.governmentVerified.chapterXTribalBeltStatus === 'NOTIFIED_BELT_PROTECTED_CLASS_ONLY' ? '5, 5' : undefined
      });

      // Tooltip
      polygon.bindTooltip(
        `<div class="p-1 font-sans">
          <div class="font-bold text-xs text-slate-900">Dag ${listing.governmentVerified.dagNumber} • Patta ${listing.governmentVerified.pattaNumber}</div>
          <div class="text-[11px] text-slate-600">${formatBKL(listing.governmentVerified.recordedAreaBKL)} • ${listing.governmentVerified.landClass}</div>
          <div class="font-semibold text-emerald-700 text-xs mt-0.5">${formatINR(listing.sellerRepresentations.askingPriceINR)}</div>
        </div>`,
        { permanent: false, direction: 'top', className: 'rounded shadow-md' }
      );

      // Marker at center
      const labelIcon = L.divIcon({
        className: 'custom-dag-marker',
        html: `<div style="background-color: ${colors.fill}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); white-space: nowrap;">
          Dag ${listing.governmentVerified.dagNumber}
        </div>`,
        iconSize: [50, 20],
        iconAnchor: [25, 10]
      });

      const marker = L.marker(listing.centerPoint, { icon: labelIcon });

      polygon.on('click', () => {
        setSelectedListing(listing);
        onSelectListing(listing);
        mapInstanceRef.current?.panTo(listing.centerPoint);
      });

      marker.on('click', () => {
        setSelectedListing(listing);
        onSelectListing(listing);
        mapInstanceRef.current?.panTo(listing.centerPoint);
      });

      polygon.addTo(polygonLayerGroupRef.current!);
      marker.addTo(polygonLayerGroupRef.current!);
    });
  }, [filteredListings, selectedListing]);

  // Pan to selected listing if changes
  const handleSelectListingCard = (listing: LandMarketplaceListing) => {
    setSelectedListing(listing);
    onSelectListing(listing);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(listing.centerPoint, 15, { duration: 1 });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-125px)] bg-slate-950 text-white overflow-hidden">
      
      {/* Sidebar: Parcel Listings Filter & Cards */}
      <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-1/2 lg:h-full z-10">
        
        {/* Header & Filter Controls */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Cadastral Marketplace
              </h2>
              <p className="text-xs text-slate-400">Government-verified parcels on cadastral maps</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              {filteredListings.length} Listed
            </span>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeFilter === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setActiveFilter('GOLD')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeFilter === 'GOLD' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ✨ Gold Verified
            </button>
            <button
              onClick={() => setActiveFilter('COMMERCIAL')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeFilter === 'COMMERCIAL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏢 Commercial
            </button>
            <button
              onClick={() => setActiveFilter('RESIDENTIAL')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeFilter === 'RESIDENTIAL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏡 Residential
            </button>
          </div>
        </div>

        {/* Scrollable Listing Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredListings.map(listing => {
            const isSelected = selectedListing?.id === listing.id;
            const badge = listing.governmentVerified.titleClearanceBadge;

            return (
              <div
                key={listing.id}
                onClick={() => handleSelectListingCard(listing)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Dag {listing.governmentVerified.dagNumber}
                    </span>
                    <span className="text-xs text-slate-400">Patta {listing.governmentVerified.pattaNumber}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    badge === 'GOLD_VERIFIED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : badge === 'SILVER_VERIFIED'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {badge === 'GOLD_VERIFIED' ? 'Gold Verified' : badge === 'SILVER_VERIFIED' ? 'Silver Verified' : 'Conditional'}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                  {listing.title}
                </h3>

                <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {listing.village}, Mouza {listing.mouza}, {listing.circle}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 mb-2.5">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Recorded Area</span>
                    <span className="font-mono font-bold text-slate-200">
                      {formatBKL(listing.governmentVerified.recordedAreaBKL)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Land Class</span>
                    <span className="font-medium text-slate-300 truncate block">
                      {listing.governmentVerified.landClass.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Asking Price</span>
                    <span className="font-mono font-bold text-emerald-400">
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
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Score: <strong className="text-emerald-300">{listing.governmentVerified.titleScore}/100</strong>
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

        {/* Map Header Overlay with Statutory Notice */}
        <div className="absolute top-4 left-4 z-[400] max-w-md bg-slate-900/95 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-xl text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Assam Cadastral Map Layer (Bhudakshya Integrated)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Parcels displayed are voluntarily offered by lawful Pattadars. Green polygons denote Grade A title clearance with matching Jamabandi BKL areas and zero encumbrances.
          </p>
        </div>

        {/* Floating Selected Parcel Quick Action Bar */}
        {selectedListing && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-6 lg:right-6 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all"
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
