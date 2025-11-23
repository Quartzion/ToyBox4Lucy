import { isProd, getApiBaseUrl } from '../utils/env';

if (isProd()) {
  console.log('Running in production mode');
}

const API_BASE_URL = getApiBaseUrl();

export const createFollowUpRequest = async (furData) => {
  return await fetch(`${API_BASE_URL}/api/cwu`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(furData),
  });
};
