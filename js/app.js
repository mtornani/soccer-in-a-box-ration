import { LogisticsManager } from './logistics.js';
import { FieldManager } from './field.js';
import { StorageService, ExerciseStorage } from './storage.js';

const CATEGORY_LABELS = {
  technical: 'Tecnica',
  athletic: 'Atletica',
  tactical: 'Tattica',
  psychological: 'Mentale'
};

/**
 * App coordinator for Soccer In A Box - Military Ration.
 * Manages high-level state transitions between Logistics and Field modes.
 */
const App = {
  exercises: [], // array of exercise objects

  async init() {
    this.bindEvents();
    this.bindExerciseEvents();
    this.watchNetwork();
    await LogisticsManager.loadBundledRations();
    await this.setupLogisticsUI();
    await this.loadExercises();
  },

  /**
   * Load exercises. The bundled file (cached by the service worker) wins,
   * so content updates reach devices; stored copy is the fallback.
   */
  async loadExercises() {
    try {
      const bundled = await fetch('./assets/data/exercises.json')
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null);
      if (bundled) {
        await ExerciseStorage.save(bundled);
        this.exercises = bundled;
      } else {
        this.exercises = await ExerciseStorage.load();
      }
    } catch (e) {
      console.error('Failed to load exercises:', e);
      this.exercises = [];
    }
    this.applyFilters();
  },

  watchNetwork() {
    const el = document.getElementById('net-state');
    const update = () => {
      el.textContent = navigator.onLine ? 'Offline pronto' : 'Senza rete: tutto disponibile';
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  },

  bindEvents() {
    document.getElementById('complete-op-btn')
      .addEventListener('click', () => this.returnToBase());
    document.getElementById('show-rations-btn')
      .addEventListener('click', () => this.showScreen('logistics-mode'));
    document.getElementById('show-exercises-btn')
      .addEventListener('click', () => this.showScreen('exercises-section'));
  },

  showScreen(id) {
    FieldManager.stopTimer();
    ['logistics-mode', 'field-mode', 'exercises-section'].forEach(s =>
      document.getElementById(s).classList.toggle('hidden', s !== id));
    document.getElementById('show-rations-btn').classList.toggle('is-active', id === 'logistics-mode');
    document.getElementById('show-exercises-btn').classList.toggle('is-active', id === 'exercises-section');
    document.querySelector('.tabbar').classList.toggle('hidden', id === 'field-mode');
    window.scrollTo(0, 0);
  },

  async setupLogisticsUI() {
    const rationListEl = document.getElementById('ration-list');
    try {
      const ids = await LogisticsManager.listLocalRations();
      const rations = (await Promise.all(ids.map(id => StorageService.getRation(id))))
        .filter(Boolean)
        .sort((a, b) => a.id.localeCompare(b.id));

      if (rations.length === 0) {
        rationListEl.innerHTML = '<p class="empty">Nessuna razione sul telefono. Apri l\'app una volta con la rete per scaricarle.</p>';
        return;
      }

      rationListEl.innerHTML = rations.map(r => `
        <article class="ration">
          <div class="ration-band">
            <span class="ration-code">${r.code}</span>
            <div>
              <h2 class="ration-title">${r.title}</h2>
              <p class="ration-meta">${r.players}, ${r.durationMin} minuti</p>
            </div>
          </div>
          <div class="ration-body">
            <p>${r.summary}</p>
            <h3>Contenuto</h3>
            <ol class="ration-phases">
              ${r.phases.map(p => `<li><span>${p.title}</span><span>${p.duration}′</span></li>`).join('')}
            </ol>
            <h3>Serve</h3>
            <p class="ration-kit">${r.equipment.join(', ')}. ${r.place}.</p>
            <button class="btn-primary" data-ration="${r.id}">Apri la razione</button>
          </div>
        </article>
      `).join('');

      rationListEl.querySelectorAll('[data-ration]').forEach(btn =>
        btn.addEventListener('click', () => this.enterFieldMode(btn.dataset.ration)));
    } catch (e) {
      console.error('Failed to setup logistics UI:', e);
    }
  },

  async enterFieldMode(rationId) {
    try {
      const ration = await StorageService.getRation(rationId);
      if (!ration) {
        throw new Error('Razione non trovata sul telefono.');
      }
      this.showScreen('field-mode');
      await FieldManager.initSession(ration);
    } catch (error) {
      console.error('Transition failed:', error);
      alert(error.message);
    }
  },

  /**
   * Returns the application to logistics mode.
   */
  returnToBase() {
    this.showScreen('logistics-mode');
  },

  /* ---------- Exercise UI ---------- */

  bindExerciseEvents() {
    document.getElementById('category-filter')
      .addEventListener('change', () => this.applyFilters());

    const ageFilter = document.getElementById('age-filter');
    const ageValueSpan = document.getElementById('age-value');
    ageFilter.addEventListener('input', () => {
      ageValueSpan.textContent = ageFilter.value;
      this.applyFilters();
    });

    document.getElementById('participants-filter')
      .addEventListener('input', () => this.applyFilters());
  },

  applyFilters() {
    const cat = document.getElementById('category-filter').value;
    const age = parseInt(document.getElementById('age-filter').value, 10);
    const players = parseInt(document.getElementById('participants-filter').value, 10) || 1;

    const filtered = this.exercises.filter(ex => {
      if (cat !== 'all' && ex.category !== cat) return false;
      // exercise suitable if the selected age is at or above its minimum age
      if (ex.ageMin > age) return false;
      // exercise suitable if the available players cover its minimum
      if (ex.participantsMin > players) return false;
      return true;
    });

    this.renderExercises(filtered);
  },

  /**
   * Render exercise cards into the grid.
   * @param {Array} list - array to render
   */
  renderExercises(list) {
    const grid = document.getElementById('exercises-grid');
    if (list.length === 0) {
      grid.innerHTML = '<p class="empty">Nessun esercizio con questi filtri. Aumenta età o giocatori disponibili.</p>';
      return;
    }
    grid.innerHTML = list.map(ex => `
      <details class="exercise-card">
        <summary>
          <span class="exercise-area">${CATEGORY_LABELS[ex.category] || ex.category}</span>
          <h3>${ex.title}</h3>
          <p>${ex.description}</p>
          <span class="exercise-meta">Da ${ex.ageMin} anni, ${ex.participantsMin === 1 ? 'anche da solo' : `almeno ${ex.participantsMin} giocatori`}</span>
        </summary>
        <div class="exercise-detail">
          <p>${ex.instructions}</p>
          ${ex.equipment.length ? `<p class="exercise-kit">Serve: ${ex.equipment.join(', ')}</p>` : '<p class="exercise-kit">Nessuna attrezzatura</p>'}
        </div>
      </details>
    `).join('');
  }
};

// Start the app
App.init();
