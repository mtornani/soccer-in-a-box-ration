import { StorageService } from './storage.js';

/**
 * LogisticsManager handles the fetching and validation of "Rations" (mission data).
 * Ensures that only valid rations are stored locally for offline use.
 */
export const LogisticsManager = {
  async downloadRation(rationId, url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ration: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.title || !data.phases || !Array.isArray(data.phases)) {
      throw new Error('Invalid Ration: Missing title or phases array.');
    }

    await StorageService.saveRation(rationId, data);
    return data;
  },

  async loadTestRation() {
    const response = await fetch('./assets/ration_test.json');
    if (!response.ok) {
      throw new Error(`Failed to load test ration: ${response.statusText}`);
    }
    const data = await response.json();
    const rationId = data.id || 'test-001';
    await StorageService.saveRation(rationId, data);
    return data;
  },

  async listLocalRations() {
    return await StorageService.getRationsList();
  }
};
