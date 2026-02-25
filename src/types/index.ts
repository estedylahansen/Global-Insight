// ─────────────────────────────────────────────
// CountryStateCity API response types
// ─────────────────────────────────────────────

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  native: string;
  region: string;
  subregion: string;
  emoji: string;
  emojiU: string;
  tld: string;
  latitude: string;
  longitude: string;
}

export interface State {
  id: number | string;
  name: string;
  iso2: string;
  latitude: string;
  longitude: string;
  country_code: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  country_id: number;
  country_code: string;
  latitude: string;
  longitude: string;
}

// ─────────────────────────────────────────────
// GeoJSON types for the 3D Globe polygons
// ─────────────────────────────────────────────

export interface GeoProperties {
  ADMIN: string;
  ISO_A2: string;
  ISO_A3: string;
  [key: string]: unknown;
}

export interface GeoFeature {
  type: 'Feature';
  properties: GeoProperties;
  geometry: {
    type: string;
    coordinates: unknown[];
  };
}

export interface GeoData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

// ─────────────────────────────────────────────
// Application state types
// ─────────────────────────────────────────────

export interface SelectedCountryData {
  country: Country;
  states: State[];
}
