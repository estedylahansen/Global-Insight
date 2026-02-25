import axios from 'axios';

const CSC_BASE_URL = 'https://api.countrystatecity.in/v1';
const API_KEY = import.meta.env.VITE_CSC_API_KEY as string;

/**
 * Pre-configured Axios instance for the CountryStateCity API.
 * Centralises base URL and auth header — open for extension via interceptors.
 */
const httpClient = axios.create({
  baseURL: CSC_BASE_URL,
  headers: {
    'X-CSCAPI-KEY': API_KEY,
  },
});

export default httpClient;
