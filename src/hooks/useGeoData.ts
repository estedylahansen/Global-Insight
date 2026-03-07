import { useEffect, useState } from 'react';
import axios from 'axios';
import type { GeoData } from '../types';

const GEO_JSON_URL =
  'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

interface UseGeoDataReturn {
  geoData: GeoData | null;
  loading: boolean;
  error: string | null;
}

const useGeoData = (): UseGeoDataReturn => {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<GeoData>(GEO_JSON_URL)
      .then(({ data }) => {
        if (!cancelled) setGeoData(data);
      })
      .catch(() => {
        if (!cancelled) setError('Falha ao carregar dados geográficos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { geoData, loading, error };
};

export default useGeoData;
