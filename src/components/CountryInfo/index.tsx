import type { State } from '../../types';
import type { SelectedCountryData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../LoadingSpinner';
import { FiChevronRight } from 'react-icons/fi';
import './CountryInfo.css';

interface CountryInfoProps {
  data: SelectedCountryData | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onStateClick: (state: State) => void;
}

interface InfoRowProps {
  label: string;
  value: string | undefined;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  if (!value) return null;
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
};

const CountryInfo = ({ data, loading, error, onClose, onStateClick }: CountryInfoProps) => {
  const { t } = useLanguage();
  const isVisible = loading || !!data || !!error;

  if (!isVisible) return null;

  return (
    <aside className="country-info-panel">
      <button className="close-btn" onClick={onClose} aria-label={t.panelClose}>
        ✕
      </button>

      {loading && <LoadingSpinner message={t.loadingCountry} />}

      {error && <p className="info-error">{error}</p>}

      {data && !loading && (
        <>
          <header className="info-header">
            <span className="country-flag" role="img" aria-label={t.labelFlag}>
              {data.country.emoji}
            </span>
            <h2 className="country-name">{data.country.name}</h2>
          </header>

          <section className="info-section">
            <h3 className="section-title">{t.sectionGeneral}</h3>
            <InfoRow label={t.labelCapital} value={data.country.capital} />
            <InfoRow label={t.labelRegion} value={data.country.region} />
            <InfoRow label={t.labelSubregion} value={data.country.subregion} />
            <InfoRow label={t.labelNative} value={data.country.native} />
          </section>

          <section className="info-section">
            <h3 className="section-title">{t.sectionEconomy}</h3>
            <InfoRow
              label={t.labelCurrency}
              value={
                data.country.currency_name
                  ? `${data.country.currency_name} (${data.country.currency}) ${data.country.currency_symbol}`
                  : data.country.currency
              }
            />
            <InfoRow label={t.labelPhone} value={`+${data.country.phonecode}`} />
          </section>

          {data.states.length > 0 && (
            <section className="info-section">
              <h3 className="section-title">
                {t.sectionStates}
                <span className="state-count">{data.states.length}</span>
              </h3>
              <ul className="state-list">
                {data.states.map((state) => (
                  <li key={state.id} className="state-item state-item--clickable"
                    onClick={() => onStateClick(state)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onStateClick(state)}
                  >
                    <span className="state-item-name">{state.name}</span>
                    {state.iso2 && (
                      <span className="state-code">{state.iso2}</span>
                    )}
                    <span className="state-arrow" aria-hidden="true">
                      <FiChevronRight />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </aside>
  );
};

export default CountryInfo;
