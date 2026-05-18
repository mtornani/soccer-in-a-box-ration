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
    document.getElementById('load-test-btn')
      ?.addEventListener('click', () => this.loadTestRation());

    document.getElementById('enter-field-btn')
      ?.addEventListener('click', () => this.enterFieldMode());

    document.getElementById('next-phase-btn')
      ?.addEventListener('click', () => FieldManager.nextPhase());

    document.getElementById('back-to-base-btn')
      ?.addEventListener('click', () => this.exitFieldMode());
  },

  async loadTestRation() {
    try {
      await LogisticsManager.loadTestRation();
      this.setupLogisticsUI();
    } catch (e) {
      console.error('Failed to load test ration:', e);
      alert('LOAD FAILURE: ' + e.message);
    }
  },

  async setupLogisticsUI() {
    const rationListEl = document.getElementById('ration-list');
    if (!rationListEl) return;

    try {
      const rations = await LogisticsManager.listLocalRations();
      if (rations.length === 0) {
        rationListEl.innerHTML = '<div class="ration-item"><span>NO RATIONS LOADED</span><span>[EMPTY]</span></div>';
        return;
      }

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
    try {
      const rations = await LogisticsManager.listLocalRations();
      if (rations.length === 0) {
        alert('NO RATIONS LOADED. Use LOAD TEST RATION first.');
        return;
      }

      const activeRationId = rations[0];
      const activeRation = await StorageService.getRation(activeRationId);

      if (!activeRation) {
        throw new Error('Ration data corrupted or missing.');
      }

      await FieldManager.initSession(activeRation);
      document.getElementById('logistics-mode').classList.add('hidden');
      document.getElementById('field-mode').classList.remove('hidden');
    } catch (error) {
      console.error('Transition failed:', error);
      alert('TRANSITION FAILURE: ' + error.message);
    }
  },

  exitFieldMode() {
    FieldManager.stopTimer();
    document.getElementById('field-mode').classList.add('hidden');
    document.getElementById('logistics-mode').classList.remove('hidden');
    this.setupLogisticsUI();
  }
}

App.init();
