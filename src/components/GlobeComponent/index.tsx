import { useCallback, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';
import type { GeoFeature, GeoData } from '../../types';
import useGeoData from '../../hooks/useGeoData';
import LoadingSpinner from '../LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

// ─── Geometry helpers ─────────────────────────────────────────────────────────

interface Geometry {
  type: string;
  coordinates: unknown[];
}

interface Centroid {
  lat: number;
  lng: number;
}

/**
 * Compute the rough centroid of a GeoJSON Polygon or MultiPolygon.
 * Handles both geometry types without crashing on nested arrays.
 */
const computeCentroid = (geometry: Geometry): Centroid | null => {
  let pairs: number[][] = [];

  if (geometry.type === 'Polygon') {
    // coordinates: number[][][]  =>  flat(1) => [[lng,lat], ...]
    pairs = (geometry.coordinates as number[][][]).flat(1);
  } else if (geometry.type === 'MultiPolygon') {
    // coordinates: number[][][][]  =>  flat(2) => [[lng,lat], ...]
    pairs = (geometry.coordinates as number[][][][]).flat(2);
  }

  if (pairs.length === 0) return null;

  const lng = pairs.reduce((s, p) => s + p[0], 0) / pairs.length;
  const lat = pairs.reduce((s, p) => s + p[1], 0) / pairs.length;
  return { lat, lng };
};

interface GlobeComponentProps {
  selectedIso2: string | null;
  onCountryClick: (iso2: string, countryName: string) => void;
}

const GLOBE_IMAGE_URL = '//unpkg.com/three-globe/example/img/earth-night.jpg';
const AUTO_ROTATE_SPEED = 0.35;

const DEFAULT_ALTITUDE = 0.01;
const SELECTED_ALTITUDE = 0.12;
const HOVER_ALTITUDE = 0.04;

const DEFAULT_COLOR = 'rgba(255, 255, 255, 0.05)';
const HOVER_COLOR = 'rgba(255, 165, 0, 0.4)';
const SELECTED_COLOR = '#f59e0b';

const SIDE_COLOR = 'rgba(0, 120, 255, 0.15)';
const STROKE_COLOR = 'rgba(255,255,255,0.3)';

/**
 * GlobeComponent — owns the 3D globe rendering.
 *
 * Single responsibility: visualise geographic polygons and delegate
 * the click event upward (open/closed principle).
 */
const GlobeComponent = ({ selectedIso2, onCountryClick }: GlobeComponentProps) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { geoData, loading, error } = useGeoData();
  const { t } = useLanguage();
  const [hoveredIso2, setHoveredIso2] = useState<string | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enable auto-rotation as soon as the globe is initialised
  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
  }, []);

  const getAltitude = useCallback(
    (feature: object) => {
      const f = feature as GeoFeature;
      const iso2 = f.properties.ISO_A2;
      if (iso2 === selectedIso2) return SELECTED_ALTITUDE;
      if (iso2 === hoveredIso2) return HOVER_ALTITUDE;
      return DEFAULT_ALTITUDE;
    },
    [selectedIso2, hoveredIso2],
  );

  const getCapColor = useCallback(
    (feature: object) => {
      const f = feature as GeoFeature;
      const iso2 = f.properties.ISO_A2;
      if (iso2 === selectedIso2) return SELECTED_COLOR;
      if (iso2 === hoveredIso2) return HOVER_COLOR;
      return DEFAULT_COLOR;
    },
    [selectedIso2, hoveredIso2],
  );

  const handlePolygonClick = useCallback(
    (polygon: object) => {
      const feature = polygon as GeoFeature;
      const iso2 = feature.properties.ISO_A2;
      const name = feature.properties.ADMIN;

      if (!iso2 || iso2 === '-99') return;

      onCountryClick(iso2, name);

      if (!globeRef.current || !feature.geometry) return;

      const centroid = computeCentroid(feature.geometry);
      if (!centroid) return;

      // Temporarily pause auto-rotation while the camera flies to the country
      const controls = globeRef.current.controls();
      controls.autoRotate = false;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        if (globeRef.current) globeRef.current.controls().autoRotate = true;
      }, 2400);

      globeRef.current.pointOfView({ lat: centroid.lat, lng: centroid.lng, altitude: 1.6 }, 1200);
    },
    [onCountryClick],
  );

  const handlePolygonHover = useCallback((polygon: object | null) => {
    if (!polygon) {
      setHoveredIso2(null);
      return;
    }
    const feature = polygon as GeoFeature;
    setHoveredIso2(feature.properties.ISO_A2 ?? null);
  }, []);

  const buildLabel = useCallback((feature: object) => {
    const f = feature as GeoFeature;
    return `<span style="color:#fff;font-weight:600;font-size:13px;">${f.properties.ADMIN}</span>`;
  }, []);

  if (loading) return <LoadingSpinner message={t.loadingGlobe} />;
  if (error) return <p className="globe-error">{t.errorGeo}</p>;

  return (
    <Globe
      ref={globeRef}
      globeImageUrl={GLOBE_IMAGE_URL}
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere
      atmosphereColor="rgba(100,160,255,0.8)"
      atmosphereAltitude={0.15}
      onGlobeReady={handleGlobeReady}
      polygonsData={(geoData as GeoData).features}
      polygonAltitude={getAltitude}
      polygonCapColor={getCapColor}
      polygonSideColor={() => SIDE_COLOR}
      polygonStrokeColor={() => STROKE_COLOR}
      polygonLabel={buildLabel}
      onPolygonClick={handlePolygonClick}
      onPolygonHover={handlePolygonHover}
    />
  );
};

export default GlobeComponent;
