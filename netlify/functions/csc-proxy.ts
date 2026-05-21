import type { Handler, HandlerEvent } from '@netlify/functions';

const CSC_BASE_URL = 'https://api.countrystatecity.in/v1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const downstreamPath = event.path.replace(/^.*\/api/, '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = `${CSC_BASE_URL}${downstreamPath}${query}`;

  const apiKey = process.env.CSC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: CORS_HEADERS, body: 'CSC_API_KEY is not configured.' };
  }

  const response = await fetch(url, {
    headers: { 'X-CSCAPI-KEY': apiKey },
  });

  const body = await response.text();

  return {
    statusCode: response.status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body,
  };
};
