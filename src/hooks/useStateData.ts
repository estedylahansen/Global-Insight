import { useCallback, useState } from 'react';
import type { City, State } from '../types';
import { getCitiesByState } from '../services/cscApi';

export interface SelectedStateData {
  state: State;
  countryIso2: string;
  countryName: string;
  countryEmoji: string;
  cities: City[];
}
interface UseStateDataReturn {
  stateData: SelectedStateData | null;
  loading: boolean;
  error: string | null;
  fetchState: (state: State, countryIso2: string, countryName: string, countryEmoji: string) => Promise<void>;
  clearState: () => void;
}

const useStateData = (): UseStateDataReturn => {
  const [stateData, setStateData] = useState<SelectedStateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(
    async (state: State, countryIso2: string, countryName: string, countryEmoji: string) => {
      setLoading(true);
      setError(null);
      try {
        const cities = await getCitiesByState(countryIso2, state.iso2);
        setStateData({ state, countryIso2, countryName, countryEmoji, cities });
      } catch (err) {
        console.error('[useStateData] fetchState error:', err);
        setError('Não foi possível carregar as cidades deste estado.');
        setStateData(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearState = useCallback(() => {
    setStateData(null);
    setError(null);
  }, []);

  return { stateData, loading, error, fetchState, clearState };
};

export default useStateData;
