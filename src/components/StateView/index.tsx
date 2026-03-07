import { useEffect, useRef, useState } from 'react';
import type { City } from '../../types';
import type { SelectedStateData } from '../../hooks/useStateData';
import LoadingSpinner from '../LoadingSpinner';
import { FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './StateView.css';

interface StateViewProps {
  stateData: SelectedStateData | null;
  loading: boolean;
  error: string | null;
  onBack: () => void;
}


interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

const computeBounds = (cities: City[]): Bounds | null => {
  const lats = cities.map((c) => parseFloat(c.latitude)).filter(isFinite);
  const lngs = cities.map((c) => parseFloat(c.longitude)).filter(isFinite);
  if (lats.length === 0) return null;
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
};

const project = (
  lat: number,
  lng: number,
  bounds: Bounds,
  w: number,
  h: number,
  pad = 60,
): [number, number] => {
  const rangeX = bounds.maxLng - bounds.minLng || 0.01;
  const rangeY = bounds.maxLat - bounds.minLat || 0.01;
  const x = pad + ((lng - bounds.minLng) / rangeX) * (w - pad * 2);
  const y = h - pad - ((lat - bounds.minLat) / rangeY) * (h - pad * 2);
  return [x, y];
};

const drawMap = (
  canvas: HTMLCanvasElement,
  cities: City[],
  selectedCityId?: string | number,
  zoom: number = 1,
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const bounds = computeBounds(cities);
  if (!bounds) return;

  // Apply zoom (centered)
  ctx.save();
  if (zoom !== 1) {
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-W / 2, -H / 2);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) {
    const x = 60 + (i / 6) * (W - 120);
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, H - 40);
    ctx.stroke();

    const y = 40 + (i / 6) * (H - 80);
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(W - 60, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(58, 38, W - 116, H - 76);

  const toDraw = selectedCityId
    ? cities.filter((c) => c.id === selectedCityId)
    : cities;
  for (const city of toDraw) {
    const lat = parseFloat(city.latitude);
    const lng = parseFloat(city.longitude);
    if (!isFinite(lat) || !isFinite(lng)) continue;

    const [x, y] = project(lat, lng, bounds, W, H);

    // Destaque se selecionada
    if (selectedCityId && city.id === selectedCityId) {
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#1e293b';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x, y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.font = 'bold 13px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.fillText(city.name, x + 16, y + 7);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fill();

      ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.fillText(city.name, x + 8, y + 4);
    }
  }
  ctx.restore();
};


const StateView = ({ stateData, loading, error, onBack }: StateViewProps) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | number | null>(null);
  const [zoom, setZoom] = useState(1);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || !stateData) return;

    const redraw = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);
      drawMap(canvas, stateData.cities, selectedCityId ?? undefined, zoom);
    };

    const raf = requestAnimationFrame(redraw);

    const ro = new ResizeObserver(redraw);
    ro.observe(wrapper);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [stateData, selectedCityId, zoom]);

  const filteredCities =
    stateData?.cities.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()),
    ) ?? [];


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setZoom((z) => {
          const next = e.deltaY < 0 ? Math.min(z + 0.2, 4) : Math.max(z - 0.2, 1);
          return Math.round(next * 100) / 100;
        });
      }
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (!selectedCityId) return;
    const el = document.getElementById(`city-item-${selectedCityId}`);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [selectedCityId]);

  return (
    <div className="state-view">
      <div className="state-topbar">
        <button className="back-btn" onClick={onBack}>
          <FiArrowLeft style={{ marginRight: 8, verticalAlign: 'middle' }} />
          {t.backToGlobe}
        </button>

        {stateData && (
          <div className="state-topbar-title">
            <span className="state-name">{stateData.state.name}</span>
            <span className="state-sep">›</span>
            <span className="state-country">{stateData.countryName}</span>
          </div>
        )}
      </div>

      <div className="state-body">
        {loading && (
          <div className="state-loading">
            <LoadingSpinner message={t.loadingCities} />
          </div>
        )}

        {error && <p className="state-error">{t.errorState}</p>}

        {stateData && !loading && (
          <>

            <div className="state-map-wrap">
              <p className="map-hint-label">{t.mapHint}</p>

              <div ref={wrapperRef} className="state-canvas-wrapper" style={{ cursor: 'pointer' }}>
                <canvas ref={canvasRef} className="state-canvas" style={{ cursor: 'pointer' }} />
              </div>
            </div>

            <aside className="state-city-panel">
              <div className="city-panel-header">
                <h3 className="city-panel-title">
                  {t.stateCities}
                  <span className="city-count">{stateData.cities.length}</span>
                </h3>
                <input
                  className="city-search"
                  type="search"
                  placeholder={t.search}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              {filteredCities.length === 0 ? (
                <p className="no-cities">{t.noCities}</p>
              ) : (
                <ul className="city-list">
                  {filteredCities.map((city) => (
                    <li
                      key={city.id}
                      id={`city-item-${city.id}`}
                      className="city-item"
                      style={{
                        ...(city.id === selectedCityId ? { background: 'rgba(245, 158, 11, 0.13)' } : {}),
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedCityId(selectedCityId === city.id ? null : city.id)}
                    >
                      <span className="city-name">{city.name}</span>
                      <span className="city-coords">
                        {parseFloat(city.latitude).toFixed(2)},{' '}
                        {parseFloat(city.longitude).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default StateView;
