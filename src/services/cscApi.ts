import type { Country, State, City } from '../types';
import httpClient from './httpClient';

/**
 * CountryStateCity API façade.
 *
 * Each function has a single responsibility (SRP) and depends on the
 * abstract httpClient rather than on Axios directly (DIP).
 */

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await httpClient.get<Country[]>('/countries');
  return data;
};

export const getCountryByIso2 = async (iso2: string): Promise<Country> => {
  const { data } = await httpClient.get<Country>(`/countries/${iso2}`);
  return data;
};

export const getStatesByCountry = async (iso2: string): Promise<State[]> => {
  const { data } = await httpClient.get<State[]>(`/countries/${iso2}/states`);
  return data;
};

export const getCitiesByState = async (countryIso2: string, stateIso2: string): Promise<City[]> => {
  const url = `/countries/${countryIso2}/states/${stateIso2}/cities`;
  console.debug('[cscApi] GET', url);
  const { data } = await httpClient.get<City[]>(url);
  return Array.isArray(data) ? data : [];
};
