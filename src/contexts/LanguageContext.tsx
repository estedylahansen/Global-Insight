import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language, type Translations } from '../i18n/translations';

interface LanguageContextValue {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * LanguageProvider — wraps the app tree and supplies the current language
 * and its translation object. Single responsibility: i18n state only.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage — consume the language context anywhere in the tree.
 * Throws if used outside a LanguageProvider (fail-fast principle).
 */
export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
