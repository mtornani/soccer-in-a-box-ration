import { LogisticsManager } from './logistics.js';
import { FieldManager } from './field.js';
import { StorageService } from './storage.js';

/**
 * App coordinator for Soccer In A Box - Military Ration.
 * Manages high-level state transitions between Logistics and Field modes.
 */
const App = {
  async init() {
    console.log('App: Initializing Tactical Interface...');
    this.bindEvents();
    this.setupLogisticsUI();
  },

  bindEvents() {
    const enterFieldBtn = document.getElementById('enter-field-btn');
    if (enterFieldBtn) {
      enterFieldBtn.addEventListener('click', () => this.enterFieldMode());
    }

    const nextPhaseBtn = document.getElementById('next-phase-btn');
    if (nextPhaseBtn) {
      nextPhaseBtn.addEventListener('click', () => FieldManager.nextPhase());
    }

    const completeOpBtn = document.getElementById('complete-op-btn');
    if (completeOpBtn) {
      completeOpBtn.addEventListener('click', () => this.exitFieldMode());
    }
  },

  async setupLogisticsUI() {
    const rationListEl = document.getElementById('ration-list');
    if (!rationListEl) return;

    try {
      const rations = await LogisticsManager.listLocalRations();
      if (rations.length === 0) {
        rationListEl.innerHTML = '<div class="ration-item">NO RATIONS LOADED</div>';
        return;
      }

      // Simple render of available rations
      rationListEl.innerHTML = rations.map(id => `
        <div class="ration-item">
          <span>RATION_${id}</span>
          <span>[READY]</span>
        </div>
      `).join('');
    } catch (e) {
      console.error('Failed to setup logistics UI:', e);
    }
  },

  async enterFieldMode() {
    console.log('App: Transitioning to FIELD MODE...');

    try {
      const rations = await LogisticsManager.listLocalRations();
      if (rations.length === 0) {
        alert('CRITICAL ERROR: No active rations found. Logistics failure.');
        return;
      }

      // Use the first available ration as the active one
      const activeRationId = rations[0];
      const activeRation = await StorageService.getRation(activeRationId);

      if (!activeRation) {
        throw new Error('Active ration data is corrupted or missing.');
      }

      // Initialize Field Session
      await FieldManager.initSession(activeRation);

      // UI Transition
      document.getElementById('logistics-mode').classList.add('hidden');
      document.getElementById('field-mode').classList.remove('hidden');

    } catch (error) {
      console.error('Transition failed:', error);
      alert(`TRANSITION FAILURE: ${error.message}`);
    }
  },

  exitFieldMode() {
    console.log('App: Returning to LOGISTICS MODE...');
    document.getElementById('field-mode').classList.add('hidden');
    document.getElementById('logistics-mode').classList.remove('hidden');
    this.setupLogisticsUI();
  }
}

// Start the app
App.init();
