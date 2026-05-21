import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({ value, onChange }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sensible default coordinate for Accra, Ghana
  const DEFAULT_LAT = 5.6037;
  const DEFAULT_LNG = -0.1870;

  // Ghana geographical boundaries
  const GHANA_BOUNDS = L.latLngBounds(
    L.latLng(4.5, -3.3), // South-West corner
    L.latLng(11.2, 1.2)  // North-East corner
  );

  const inGhana = (lat: number, lng: number) => {
    return lat >= 4.5 && lat <= 11.2 && lng >= -3.3 && lng <= 1.2;
  };

  // Custom SVG icon for Leaflet marker to avoid relative path image resolution errors in bundlers
  const pinIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="display: flex; justify-content: center; align-items: center; width: 38px; height: 38px; background: rgba(239, 68, 68, 0.2); border-radius: 50%; border: 1px solid rgba(239, 68, 68, 0.4);">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="#ef4444"/>
      </svg>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Ensure initial coordinates are within Ghana, otherwise default to Accra
    const initialLat = value && inGhana(value.lat, value.lng) ? value.lat : DEFAULT_LAT;
    const initialLng = value && inGhana(value.lat, value.lng) ? value.lng : DEFAULT_LNG;
    const zoomLevel = value ? 15 : 13;

    // Create Leaflet map instance restricted to Ghana
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: zoomLevel,
      zoomControl: true,
      maxBounds: GHANA_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
    });

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Save map reference
    mapRef.current = map;

    // Add marker
    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    // Listen to marker drag events
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onChange(position.lat, position.lng);
    });

    // Listen to map clicks to reposition pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange(lat, lng);
    });

    // Cleanup map on unmount
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position if value changes externally (e.g. current location clicked)
  useEffect(() => {
    if (mapRef.current && markerRef.current && value) {
      const { lat, lng } = value;
      const currentLatLng = markerRef.current.getLatLng();
      
      // Only update if map marker and state are out of sync to avoid loop
      if (currentLatLng.lat !== lat || currentLatLng.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], 16);
      }
    }
  }, [value]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (inGhana(latitude, longitude)) {
          onChange(latitude, longitude);
        } else {
          setError("Your current location is outside Ghana. Please manually pin your location inside Ghana on the map.");
        }
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permission denied. Please enable location access in your browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Precise Delivery Coordinates (Optional)
          </label>
          <p className="text-xs text-gray-500">
            Pinpoint your location on the map below or share your browser's GPS coordinate.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          variant="outline"
          className="flex items-center gap-1.5 text-xs h-9 px-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50"
        >
          {geoLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          {geoLoading ? 'Getting Location...' : 'Pin Current Location'}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded-md border border-red-100">
          {error}
        </p>
      )}

      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
        <div 
          ref={mapContainerRef} 
          className="w-full z-0 h-[280px]"
          style={{ minHeight: '280px' }}
        />
        {value && (
          <div className="absolute bottom-2 left-2 z-[1000] bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md text-[10px] font-mono text-gray-600 border border-gray-100 shadow-sm flex flex-col">
            <span>Latitude: {value.lat.toFixed(6)}</span>
            <span>Longitude: {value.lng.toFixed(6)}</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-gray-400 italic">
        * You can drag the red pin marker or click/tap anywhere on the map to change the delivery spot.
      </p>
    </div>
  );
};
