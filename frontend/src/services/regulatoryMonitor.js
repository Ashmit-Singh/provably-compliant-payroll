// regulatoryMonitor.js
// Service for monitoring regulatory APIs and parsing updates

import axios from 'axios';

const REGULATORY_API_ENDPOINTS = [
  'https://api.gov.example.com/payroll-regulations',
  'https://api.gov.example.com/tax-updates',
  // Add more endpoints as needed
];

/**
 * Fetch latest regulatory updates from all configured endpoints
 * @returns {Promise<Array>} Array of regulatory update objects
 */
export async function fetchRegulatoryUpdates() {
  const results = await Promise.all(
    REGULATORY_API_ENDPOINTS.map(async (url) => {
      try {
        const response = await axios.get(url);
        return { url, data: response.data };
      } catch (error) {
        return { url, error: error.message };
      }
    })
  );
  return results;
}

/**
 * Parse and normalize regulatory update data
 * @param {Array} updates Raw updates from fetchRegulatoryUpdates
 * @returns {Array} Normalized regulatory changes
 */
export function parseRegulatoryUpdates(updates) {
  // Example normalization logic
  return updates
    .filter(u => u.data)
    .flatMap(u => Array.isArray(u.data.updates) ? u.data.updates : [])
    .map(update => ({
      id: update.id || update.regulationId,
      title: update.title || update.summary,
      description: update.description || '',
      effectiveDate: update.effectiveDate || null,
      source: update.source || '',
      raw: update,
    }));
}
