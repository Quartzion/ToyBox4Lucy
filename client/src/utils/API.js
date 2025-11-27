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

export const decrementToyBoxGiftCount = async (giftType) => {
  return await fetch(`${API_BASE_URL}/api/toyBoxSettings/decrement`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ giftType }),
  });
};

export const updateToyBoxSettings = async (settingsData) => {
  return await fetch(`${API_BASE_URL}/api/toyBoxSettings`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(settingsData),
  });
};

export const getFollowUpRecords = async () => {
  return await fetch(`${API_BASE_URL}/api/cwu`, {
    method: 'GET',
    headers: {
      'x-api-secret': ADMIN_PASSWORD
    },
    credentials: 'include'
  });
};

export const adminLogin = async (adminPassword) => {
  return await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password: adminPassword }),
  });
};

export const adminLogout = async () => {
  return await fetch(`${API_BASE_URL}/api/admin/logout`, {
    method: 'POST',
    credentials: 'include'
  });
};
