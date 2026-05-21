import type { Handler, HandlerEvent } from '@netlify/functions';

const CSC_BASE_URL = 'https://api.countrystatecity.in/v1';

export const handler: Handler = async (event: HandlerEvent) => {
  // Strip the /api prefix that the client uses
  const downstreamPath = event.path.replace(/^\/api/, '');
  const query = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = `${CSC_BASE_URL}${downstreamPath}${query}`;

  const apiKey = process.env.CSC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'CSC_API_KEY is not configured.' };
  }

  const response = await fetch(url, {
    headers: { 'X-CSCAPI-KEY': apiKey },
  });

  const body = await response.text();

  return {
    statusCode: response.status,
    headers: { 'Content-Type': 'application/json' },
    body,
  };
};
