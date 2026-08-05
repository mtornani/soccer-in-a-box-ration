import { LogisticsManager } from './logistics.js';
import { FieldManager } from './field.js';
import { StorageService, ExerciseStorage } from './storage.js';

/**
 * App coordinator for Soccer In A Box - Military Ration.
 * Manages high-level state transitions between Logistics and Field modes.
 */
const App = {
  exercises: [], // array of exercise objects

  async init() {
    console.log('App: Initializing Tactical Interface...');
    this.bindEvents();
    this.setupLogisticsUI();
    await this.loadExercises();
    this.bindExerciseEvents();
  },

  /**
   * Load exercises from storage and sync if online.
   */
  async loadExercises() {
    try {
      const stored = await ExerciseStorage.load();
      if (stored.length === 0) {
        // No cached data, try to fetch from bundled JSON
        const bundled = await fetch('/assets/data/exercises.json')
          .then(r => r.json())
          .catch(() => null);
        if (bundled) {
          await ExerciseStorage.save(bundled);
          this.exercises = bundled;
          console.log('App: Loaded bundled exercises');
        } else {
          this.exercises = [];
          console.warn('App: No exercise data available');
        }
      } else {
        this.exercises = stored;
        console.log(`App: Loaded ${stored.length} exercises from storage`);
      }
    } catch (e) {
      console.error('Failed to load exercises:', e);
      this.exercises = [];
    }
    // initial render if exercise view is already visible (should be hidden)
    this.renderExercises();
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
    console.log('App: Requesting transition to FIELD MODE...');

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

      await this.transitionToFieldMode(activeRation);

    } catch (error) {
      console.error('Transition failed:', error);
      alert(`TRANSITION FAILURE: ${error.message}`);
    }
  },

  /**
   * Performs the UI and state transition into field mode.
   * @param {object} ration - The ration to activate for this session.
   */
  async transitionToFieldMode(ration) {
    console.log('App: Transitioning to FIELD MODE for ration:', ration.title);

    // Initialize Field Session
    await FieldManager.initSession(ration);

    // UI Transition
    document.getElementById('logistics-mode').classList.add('hidden');
    document.getElementById('field-mode').classList.remove('hidden');
  },

  exitFieldMode() {
    this.returnToBase();
  },

  /**
   * Returns the application to logistics mode and prepares for sync.
   */
  returnToBase() {
    console.log('App: Returning to LOGISTICS MODE...');

    // In a real app, we would trigger a sync process here for local logs
    console.log('App: Preparing local logs for sync...');

    document.getElementById('field-mode').classList.add('hidden');
    document.getElementById('logistics-mode').classList.remove('hidden');
    this.setupLogisticsUI();
  },

  /* ---------- Exercise UI ---------- */

  bindExerciseEvents() {
    const showExercisesBtn = document.getElementById('show-exercises-btn');
    if (showExercisesBtn) {
      showExercisesBtn.addEventListener('click', () => this.toggleExercisesView());
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.applyFilters());
    }

    const ageFilter = document.getElementById('age-filter');
    if (ageFilter) {
      const ageValueSpan = document.getElementById('age-value');
      if (ageValueSpan) {
        ageFilter.addEventListener('input', () => {
          ageValueSpan.textContent = ageFilter.value;
          this.applyFilters();
        });
      }
    }

    const participantsFilter = document.getElementById('participants-filter');
    if (participantsFilter) {
      participantsFilter.addEventListener('input', () => this.applyFilters());
    }
  },

  toggleExercisesView() {
    const logistics = document.getElementById('logistics-mode');
    const field = document.getElementById('field-mode');
    const exercisesSection = document.getElementById('exercises-section');

    // hide other modes
    if (logistics) logistics.classList.add('hidden');
    if (field)    field.classList.add('hidden');
    // show exercises
    if (exercisesSection) {
      exercisesSection.classList.remove('hidden');
      exercisesSection.classList.add('visible');
      this.renderExercises();
    }
  },

  applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const ageFilter = document.getElementById('age-filter');
    const participantsFilter = document.getElementById('participants-filter');

    const cat = categoryFilter ? categoryFilter.value : 'all';
    const maxAge = ageFilter ? parseInt(ageFilter.value, 10) : 45;
    const minParticipants = participantsFilter ? parseInt(participantsFilter.value, 10) : 1;

    const filtered = this.exercises.filter(ex => {
      if (cat !== 'all' && ex.category !== cat) return false;
      // age filter: user selects maximum age they want; exercise suitable if its min age <= maxAge
      if (ex.ageMin > maxAge) return false;
      // participants filter: user selects minimum participants they have; exercise suitable if its participantsMin <= participantsFilter? Actually we have participantsMin as minimum needed. If user says they have X participants, exercise needs participantsMin <= X.
      if (ex.participantsMin > minParticipants) return false;
      return true;
    });

    this.renderExercises(filtered);
  },

  /**
   * Render exercise cards into the grid.
   * @param {Array} list - optional array to render; if undefined, use this.exercises
   */
  renderExercises(list) {
    const grid = document.getElementById('exercises-grid');
    if (!grid) return;
    const data = Array.isArray(list) ? list : this.exercises;
    if (data.length === 0) {
      grid.innerHTML = '<p class="no-exercises">No exercises match the current filters.</p>';
      return;
    }
    grid.innerHTML = data.map(ex => `
      <div class="exercise-card">
        <h3>${ex.title}</h3>
        <div class="meta">
          <span>${ex.category}</span>
          <span>${ex.ageMin}+</span>
          <span>${ex.participantsMin}+ players</span>
        </div>
        <p>${ex.description}</p>
        <div class="source"><em>${ex.source}</em></div>
      </div>
    `).join('');
  }
};

// Start the app
App.init();