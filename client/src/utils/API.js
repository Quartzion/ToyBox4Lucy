import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

/**
 * -----------------------------
 * FOLLOW-UP REQUESTS (CWU)
 * -----------------------------
 */

// Create a new follow-up request (no admin password required)
export const createFollowUpRequest = async (furData) => {
  return await fetch(`${API_BASE_URL}/api/cwu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(furData),
  });
};

// Get all follow-up requests (admin only)
export const getFollowUpRecords = async (adminPassword) => {
  if (!adminPassword) throw new Error("Admin password required");

  return await fetch(`${API_BASE_URL}/api/cwu`, {
    method: 'GET',
    headers: {
      'x-api-secret': adminPassword,
    },
    credentials: 'include',
  });
};

// Delete a single follow-up request (admin only)
export const deleteFollowUpRecord = async (id, adminPassword) => {
  if (!adminPassword) throw new Error("Admin password required");

  return await fetch(`${API_BASE_URL}/api/cwu/${id}`, {
    method: 'DELETE',
    headers: {
      'x-api-secret': adminPassword,
    },
    credentials: 'include',
  });
};

// Delete all follow-up requests (admin only)
export const deleteAllFollowUpRecords = async (adminPassword) => {
  if (!adminPassword) throw new Error("Admin password required");

  return await fetch(`${API_BASE_URL}/api/cwu`, {
    method: 'DELETE',
    headers: {
      'x-api-secret': adminPassword,
    },
    credentials: 'include',
  });
};

/**
 * -----------------------------
 * TOY BOX SETTINGS
 * -----------------------------
 */

// Decrement a gift count (no admin password required)
export const decrementToyBoxGiftCount = async (giftType) => {
  return await fetch(`${API_BASE_URL}/api/toyBoxSettings/decrement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ giftType }),
  });
};

// Update toy box settings (admin only)
export const updateToyBoxSettings = async (settingsData) => {
  if (!settingsData.adminPassword) {
    throw new Error("Admin password required");
  }

  return await fetch(`${API_BASE_URL}/api/toyBoxSettings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settingsData),
  });
};

/**
 * -----------------------------
 * ADMIN LOGIN / LOGOUT
 * -----------------------------
 */

// Log in admin (if you want session-based login)
export const adminLogin = async (adminPassword) => {
  if (!adminPassword) throw new Error("Admin password required");

  return await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password: adminPassword }),
  });
};

// Log out admin
export const adminLogout = async () => {
  return await fetch(`${API_BASE_URL}/api/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};
