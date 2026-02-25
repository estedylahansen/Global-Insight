import { useCallback, useState } from 'react';
import GlobeComponent from './components/GlobeComponent';
import CountryInfo from './components/CountryInfo';
import StateView from './components/StateView';
import Starfield from './components/Starfield';
import useCountryData from './hooks/useCountryData';
import useStateData from './hooks/useStateData';
import { useLanguage } from './contexts/LanguageContext';
import type { State } from './types';
import './App.css';

type ViewMode = 'globe' | 'stateView';

/**
 * App — composition root.
 *
 * Orchestrates state lifting between GlobeComponent, CountryInfo and
 * StateView without coupling any two of them directly (DIP / ISP).
 */
const App = () => {
    const { t, toggleLanguage, language } = useLanguage();
    const [viewMode, setViewMode] = useState<ViewMode>('globe');
    const [selectedIso2, setSelectedIso2] = useState<string | null>(null);

    const { selectedData, loading: countryLoading, error: countryError, fetchCountry, clearCountry } =
        useCountryData();
    const { stateData, loading: stateLoading, error: stateError, fetchState, clearState } =
        useStateData();

    // ── Country selection ──────────────────────────────────────────────────────
    const handleCountryClick = useCallback(
        (iso2: string) => {
            setSelectedIso2(iso2);
            fetchCountry(iso2);
        },
        [fetchCountry],
    );

    const handleCountryClose = useCallback(() => {
        setSelectedIso2(null);
        clearCountry();
    }, [clearCountry]);

    // ── State selection ────────────────────────────────────────────────────────
    const handleStateClick = useCallback(
        (state: State) => {
            if (!selectedData) return;
            const { country } = selectedData;
            fetchState(state, country.iso2, country.name, country.emoji);
            setViewMode('stateView');
        },
        [selectedData, fetchState],
    );

    const handleBackToGlobe = useCallback(() => {
        clearState();
        setViewMode('globe');
    }, [clearState]);

    return (
        <div className="app">
            <Starfield />

            {/* ── Header ── */}
            <header className="app-header">
                <div className="app-header-inner">
                    <div className="app-title-group">
                        <h1 className="app-title">
                            <span className="app-title-icon">🌍</span>
                            {t.appTitle}
                        </h1>
                        <p className="app-subtitle">{t.appSubtitle}</p>
                    </div>

                    <button
                        className="lang-toggle"
                        onClick={toggleLanguage}
                        aria-label="Toggle language"
                        title={t.langTooltip}
                    >
                        <img
                            src={language === 'pt' ? flagBR : flagUS}
                            alt={language === 'pt' ? 'Bandeira do Brasil' : 'US flag'}
                            className="lang-flag"
                            width={24}
                            height={24}
                            style={{ marginRight: 8, verticalAlign: 'middle' }}
                        />
                        {language === 'pt' ? 'PT' : 'EN'}
                    </button>
                </div>
            </header>

            {/* ── Globe view ── */}
            <main className="globe-container" aria-hidden={viewMode !== 'globe'}>
                <GlobeComponent
                    selectedIso2={selectedIso2}
                    onCountryClick={handleCountryClick}
                />
            </main>

            <CountryInfo
                data={selectedData}
                loading={countryLoading}
                error={countryError}
                onClose={handleCountryClose}
                onStateClick={handleStateClick}
            />

            {/* ── State view (replaces globe) ── */}
            {viewMode === 'stateView' && (
                <StateView
                    stateData={stateData}
                    loading={stateLoading}
                    error={stateError}
                    onBack={handleBackToGlobe}
                />
            )}
        </div>
    );
};
import flagUS from './assets/flags/us.png';
import flagBR from './assets/flags/br.png';
export default App;
