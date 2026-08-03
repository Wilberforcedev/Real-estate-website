import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property } from '../types';
import { Layers, Compass, ZoomIn, ZoomOut, Maximize2, MapPin, Eye, ExternalLink } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  hoveredPropertyId: string | null;
  onHoverProperty: (id: string | null) => void;
  onOpenDetailModal: (property: Property) => void;
}

type TileProvider = 'positron' | 'osm' | 'dark' | 'satellite';

const TILE_LAYERS: Record<TileProvider, { name: string; url: string; attribution: string }> = {
  positron: {
    name: 'Light Clean',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
  },
  osm: {
    name: 'Street Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  dark: {
    name: 'Night Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  },
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
};

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  hoveredPropertyId,
  onHoverProperty,
  onOpenDetailModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const [activeTile, setActiveTile] = useState<TileProvider>('positron');
  const [showTileMenu, setShowTileMenu] = useState(false);

  // Helper to format price for badge
  const formatPriceBadge = (price: number, listingType: string): string => {
    if (listingType === 'rent') {
      return `$${(price / 1000).toFixed(1)}k/mo`;
    }
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}k`;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center: San Francisco area or center of properties
    const initialLat = properties.length > 0 ? properties[0].lat : 37.7749;
    const initialLng = properties.length > 0 ? properties[0].lng : -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false
    });

    const tileInfo = TILE_LAYERS[activeTile];
    const tileLayer = L.tileLayer(tileInfo.url, {
      attribution: tileInfo.attribution,
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tile selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const info = TILE_LAYERS[activeTile];
    const newLayer = L.tileLayer(info.url, {
      attribution: info.attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [activeTile]);

  // Sync Markers with Properties list
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    if (properties.length === 0) return;

    const bounds = L.latLngBounds([]);

    properties.forEach((property) => {
      bounds.extend([property.lat, property.lng]);

      const isSelected = selectedProperty?.id === property.id;
      const isHovered = hoveredPropertyId === property.id;
      const priceText = formatPriceBadge(property.price, property.listingType);

      // Create Custom HTML Icon
      const customIcon = L.divIcon({
        className: `custom-price-pin ${isSelected ? 'selected' : ''} ${isHovered ? 'selected' : ''} ${property.isFeatured ? 'featured' : ''}`,
        html: `
          <div class="price-badge ${isSelected || isHovered ? 'ring-2 ring-[#8A9A5B] bg-[#5C6B4E] scale-110' : ''}">
            ${property.isHot ? '<span class="text-[#D98E73] font-black">🔥</span>' : ''}
            <span>${priceText}</span>
          </div>
        `,
        iconSize: [80, 32],
        iconAnchor: [40, 16]
      });

      const marker = L.marker([property.lat, property.lng], { icon: customIcon }).addTo(map);

      // Custom Popup HTML
      const popupContent = document.createElement('div');
      popupContent.className = 'w-64 bg-[#FAF9F6] rounded-2xl overflow-hidden shadow-lg border border-[#E8E6E1]';
      popupContent.innerHTML = `
        <div class="relative h-32 bg-[#F3F1ED] overflow-hidden group">
          <img src="${property.images[0]}" alt="${property.title}" class="w-full h-full object-cover" />
          <div class="absolute top-2 left-2 bg-[#3E3C38]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            ${property.propertyType}
          </div>
          <div class="absolute bottom-2 left-2 bg-[#5C6B4E] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
            ${priceText}
          </div>
        </div>
        <div class="p-3">
          <h4 class="font-bold text-xs text-[#3E3C38] truncate">${property.title}</h4>
          <p class="text-[11px] text-[#8C8A85] truncate mt-0.5">${property.address}, ${property.city}</p>
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E6E1] text-[11px] font-semibold text-[#3E3C38]/80">
            <span>🛏️ ${property.beds} bds</span>
            <span>🛁 ${property.baths} ba</span>
            <span>📐 ${property.sqft.toLocaleString()} sqft</span>
          </div>
          <button id="view-details-btn-${property.id}" class="mt-2.5 w-full bg-[#3E3C38] hover:bg-[#5C6B4E] text-white text-[11px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all">
            <span>View Full Listing</span>
          </button>
        </div>
      `;

      // Bind button click inside popup
      setTimeout(() => {
        const btn = popupContent.querySelector(`#view-details-btn-${property.id}`);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onOpenDetailModal(property);
          });
        }
      }, 50);

      marker.bindPopup(popupContent, { maxWidth: 280, closeButton: true });

      marker.on('click', () => {
        onSelectProperty(property);
      });

      marker.on('mouseover', () => {
        onHoverProperty(property.id);
      });

      marker.on('mouseout', () => {
        onHoverProperty(null);
      });

      markersRef.current.set(property.id, marker);
    });

    // Fit map to bounds if properties updated and map is visible
    if (properties.length > 0 && map) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties]);

  // Pan to selected property smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedProperty) return;

    map.flyTo([selectedProperty.lat, selectedProperty.lng], 14, {
      duration: 1.2
    });

    const marker = markersRef.current.get(selectedProperty.id);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedProperty]);

  // Center on current properties bounds
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || properties.length === 0) return;
    const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-[#E8E6E1] shadow-xs bg-[#F3F1ED]">
      
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-10" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        
        {/* Layer Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowTileMenu(!showTileMenu)}
            className="w-10 h-10 bg-white hover:bg-[#F3F1ED] text-[#3E3C38] rounded-xl shadow-md border border-[#E8E6E1] flex items-center justify-center transition-all"
            title="Switch Map Tiles"
          >
            <Layers className="w-5 h-5 text-[#5C6B4E]" />
          </button>

          {showTileMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-[#E8E6E1] p-2 w-44 z-30 animate-in fade-in zoom-in-95 duration-150">
              <p className="text-[10px] font-extrabold text-[#8C8A85] uppercase tracking-wider px-2 py-1">Map Style</p>
              {(Object.keys(TILE_LAYERS) as TileProvider[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTile(key);
                    setShowTileMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTile === key
                      ? 'bg-[#8A9A5B]/15 text-[#5C6B4E] font-extrabold'
                      : 'text-[#3E3C38] hover:bg-[#F3F1ED]'
                  }`}
                >
                  {TILE_LAYERS[key].name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recenter View */}
        <button
          onClick={handleRecenter}
          className="w-10 h-10 bg-white hover:bg-[#F3F1ED] text-[#3E3C38] rounded-xl shadow-md border border-[#E8E6E1] flex items-center justify-center transition-all"
          title="Recenter Map Bounds"
        >
          <Compass className="w-5 h-5 text-[#3E3C38]" />
        </button>

        {/* Zoom Controls */}
        <div className="bg-white rounded-xl shadow-md border border-[#E8E6E1] overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 hover:bg-[#F3F1ED] text-[#3E3C38] flex items-center justify-center border-b border-[#E8E6E1] transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 hover:bg-[#F3F1ED] text-[#3E3C38] flex items-center justify-center transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Floating Legend / Info Banner */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#3E3C38]/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-medium border border-[#3E3C38] shadow-xl flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8A9A5B] animate-pulse"></span>
          <span className="font-bold text-white">{properties.length} Properties on Map</span>
        </div>
        <span className="text-[#8C8A85]">|</span>
        <span className="text-[#E8E6E1] text-[11px] hidden sm:inline">Click pin to preview listing</span>
      </div>

    </div>
  );
};
