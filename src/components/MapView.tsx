import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { circular } from 'ol/geom/Polygon';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Icon, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { CrimeEvent, SeverityLevel } from '@/types/crime';
import { Crosshair } from 'lucide-react';
import 'ol/ol.css';

interface MapViewProps {
  events: CrimeEvent[];
  onMapClick: (coords: { lat: number; lng: number }) => void;
  focusedEvent: CrimeEvent | null;
}

const severityColors: Record<SeverityLevel, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#0ea5e9',
};

// Tactical SVG icons for different crime types
const createTacticalIcon = (type: string, color: string): string => {
  const icons: Record<string, string> = {
    // Crosshair target for theft
    theft: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="rgba(10,14,20,0.9)" stroke="${color}" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="none" stroke="${color}" stroke-width="1.5"/>
      <line x1="16" y1="4" x2="16" y2="10" stroke="${color}" stroke-width="1.5"/>
      <line x1="16" y1="22" x2="16" y2="28" stroke="${color}" stroke-width="1.5"/>
      <line x1="4" y1="16" x2="10" y2="16" stroke="${color}" stroke-width="1.5"/>
      <line x1="22" y1="16" x2="28" y2="16" stroke="${color}" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="2" fill="${color}"/>
    </svg>`,
    
    // Warning triangle for assault
    assault: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="rgba(10,14,20,0.9)" stroke="${color}" stroke-width="2"/>
      <path d="M16 8 L24 24 L8 24 Z" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
      <line x1="16" y1="13" x2="16" y2="18" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="21" r="1.5" fill="${color}"/>
    </svg>`,
    
    // Shield/lock for burglary
    burglary: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="rgba(10,14,20,0.9)" stroke="${color}" stroke-width="2"/>
      <path d="M16 6 L24 10 L24 16 C24 21 20 25 16 26 C12 25 8 21 8 16 L8 10 Z" fill="none" stroke="${color}" stroke-width="1.5"/>
      <line x1="12" y1="16" x2="20" y2="16" stroke="${color}" stroke-width="2"/>
      <line x1="16" y1="12" x2="16" y2="20" stroke="${color}" stroke-width="2"/>
    </svg>`,
    
    // Spray can for vandalism
    vandalism: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="rgba(10,14,20,0.9)" stroke="${color}" stroke-width="2"/>
      <rect x="12" y="12" width="8" height="14" rx="1" fill="none" stroke="${color}" stroke-width="1.5"/>
      <rect x="14" y="8" width="4" height="4" fill="none" stroke="${color}" stroke-width="1.5"/>
      <circle cx="9" cy="9" r="1" fill="${color}"/>
      <circle cx="7" cy="12" r="1" fill="${color}"/>
      <circle cx="11" cy="7" r="1" fill="${color}"/>
    </svg>`,
    
    // Gun/danger for robbery
    robbery: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="rgba(10,14,20,0.9)" stroke="${color}" stroke-width="2"/>
      <circle cx="16" cy="16" r="8" fill="none" stroke="${color}" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="4" fill="none" stroke="${color}" stroke-width="1.5"/>
      <line x1="16" y1="4" x2="16" y2="8" stroke="${color}" stroke-width="2"/>
      <line x1="16" y1="24" x2="16" y2="28" stroke="${color}" stroke-width="2"/>
      <line x1="4" y1="16" x2="8" y2="16" stroke="${color}" stroke-width="2"/>
      <line x1="24" y1="16" x2="28" y2="16" stroke="${color}" stroke-width="2"/>
    </svg>`,
  };

  return icons[type] || icons.theft;
};

const createIconStyle = (event: CrimeEvent): Style[] => {
  const color = severityColors[event.severity];
  const svg = createTacticalIcon(event.type, color);
  const encodedSvg = encodeURIComponent(svg);
  const isPulsing = event.severity === 'critical' || event.severity === 'high';

  const styles: Style[] = [];

  // Add glow effect for high severity
  if (isPulsing) {
    styles.push(
      new Style({
        image: new CircleStyle({
          radius: 24,
          fill: new Fill({ color: `${color}33` }),
        }),
      })
    );
  }

  // Main icon
  styles.push(
    new Style({
      image: new Icon({
        src: `data:image/svg+xml,${encodedSvg}`,
        scale: 1,
        anchor: [0.5, 0.5],
      }),
    })
  );

  return styles;
};

// Create glowing radius circle styles
const createRadiusStyles = (): Style[] => {
  const primaryColor = 'hsl(190, 95%, 45%)';
  
  return [
    // Outer glow layer
    new Style({
      stroke: new Stroke({
        color: 'rgba(14, 165, 233, 0.1)',
        width: 20,
      }),
      fill: new Fill({
        color: 'rgba(14, 165, 233, 0.03)',
      }),
    }),
    // Mid glow layer
    new Style({
      stroke: new Stroke({
        color: 'rgba(14, 165, 233, 0.2)',
        width: 10,
      }),
    }),
    // Inner glow layer
    new Style({
      stroke: new Stroke({
        color: 'rgba(14, 165, 233, 0.4)',
        width: 4,
      }),
    }),
    // Core stroke
    new Style({
      stroke: new Stroke({
        color: primaryColor,
        width: 2,
        lineDash: [10, 5],
      }),
    }),
  ];
};

export function MapView({ events, onMapClick, focusedEvent }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef<VectorSource>(new VectorSource());
  const radiusSource = useRef<VectorSource>(new VectorSource());
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [targetingPosition, setTargetingPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attributions: '© OpenStreetMap contributors © CARTO',
          }),
        }),
        new VectorLayer({
          source: radiusSource.current,
          zIndex: 1,
        }),
        new VectorLayer({
          source: vectorSource.current,
          zIndex: 2,
        }),
      ],
      view: new View({
        center: fromLonLat([-122.4194, 37.7749]),
        zoom: 13,
      }),
      controls: [],
    });

    map.on('click', (e) => {
      const coords = toLonLat(e.coordinate);
      const pixel = map.getPixelFromCoordinate(e.coordinate);
      
      // Set selected coordinates for radius circle
      setSelectedCoords({ lat: coords[1], lng: coords[0] });
      setClickPosition({ x: pixel[0], y: pixel[1] });
      setTimeout(() => setClickPosition(null), 600);
      
      onMapClick({ lat: coords[1], lng: coords[0] });
    });

    map.on('pointermove', (e) => {
      const pixel = map.getPixelFromCoordinate(e.coordinate);
      setTargetingPosition({ x: pixel[0], y: pixel[1] });
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, [onMapClick]);

  // Update radius circle when coordinates change
  useEffect(() => {
    radiusSource.current.clear();

    if (selectedCoords) {
      // Create a 500m radius circle
      const circle = circular([selectedCoords.lng, selectedCoords.lat], 500, 64);
      circle.transform('EPSG:4326', 'EPSG:3857');
      
      const feature = new Feature({
        geometry: circle,
      });
      
      feature.setStyle(createRadiusStyles());
      radiusSource.current.addFeature(feature);

      // Add center point marker
      const centerFeature = new Feature({
        geometry: new Point(fromLonLat([selectedCoords.lng, selectedCoords.lat])),
      });
      
      centerFeature.setStyle([
        new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: 'rgba(14, 165, 233, 0.3)' }),
            stroke: new Stroke({ color: 'hsl(190, 95%, 45%)', width: 2 }),
          }),
        }),
        new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({ color: 'hsl(190, 95%, 45%)' }),
          }),
        }),
      ]);
      
      radiusSource.current.addFeature(centerFeature);
    }
  }, [selectedCoords]);

  // Update markers
  useEffect(() => {
    vectorSource.current.clear();

    events.forEach((event) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([event.location.lng, event.location.lat])),
        event,
      });

      feature.setStyle(createIconStyle(event));
      vectorSource.current.addFeature(feature);
    });
  }, [events]);

  // Focus on event
  useEffect(() => {
    if (focusedEvent && mapInstance.current) {
      const view = mapInstance.current.getView();
      view.animate({
        center: fromLonLat([focusedEvent.location.lng, focusedEvent.location.lat]),
        zoom: 15,
        duration: 500,
      });
    }
  }, [focusedEvent]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />

      {/* Targeting crosshair */}
      {targetingPosition && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: targetingPosition.x - 20,
            top: targetingPosition.y - 20,
          }}
        >
          <Crosshair className="w-10 h-10 text-primary opacity-50" strokeWidth={1} />
        </div>
      )}

      {/* Click ripple effect */}
      <AnimatePresence>
        {clickPosition && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute pointer-events-none w-20 h-20 border-2 border-primary rounded-full"
            style={{
              left: clickPosition.x - 40,
              top: clickPosition.y - 40,
            }}
          />
        )}
      </AnimatePresence>

      {/* Map overlay gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-tactical opacity-20" />

      {/* Legend */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 p-3 bg-card/90 border border-border backdrop-blur-sm">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Legend</span>
        {[
          { type: 'theft', label: 'Theft', icon: '⊕' },
          { type: 'assault', label: 'Assault', icon: '⚠' },
          { type: 'burglary', label: 'Burglary', icon: '⛨' },
          { type: 'vandalism', label: 'Vandalism', icon: '◎' },
          { type: 'robbery', label: 'Robbery', icon: '◉' },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary">{item.icon}</span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-card/90 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">TACTICAL VIEW</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <span className="font-mono text-xs text-primary">{events.length} TARGETS</span>
      </div>
    </div>
  );
}
