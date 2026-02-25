import { useCallback, useState } from 'react';
import type { SelectedCountryData } from '../types';
import { getCountryByIso2, getStatesByCountry } from '../services/cscApi';

interface UseCountryDataReturn {
  selectedData: SelectedCountryData | null;
  loading: boolean;
  error: string | null;
  fetchCountry: (iso2: string) => Promise<void>;
  clearCountry: () => void;
}

/**
 * Manages all async state related to a selected country.
 * Components only depend on this hook's interface, not on the service directly (DIP).
 */
const useCountryData = (): UseCountryDataReturn => {
  const [selectedData, setSelectedData] = useState<SelectedCountryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCountry = useCallback(async (iso2: string) => {
    if (!iso2 || iso2 === '-99') return;

    setLoading(true);
    setError(null);

    try {
      const [country, states] = await Promise.all([
        getCountryByIso2(iso2),
        getStatesByCountry(iso2),
      ]);
      setSelectedData({ country, states });
    } catch {
      setError('Não foi possível carregar os dados do país.');
      setSelectedData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCountry = useCallback(() => {
    setSelectedData(null);
    setError(null);
  }, []);

  return { selectedData, loading, error, fetchCountry, clearCountry };
};

export default useCountryData;
