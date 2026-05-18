/**
 * FieldManager handles the operational phase of the mission.
 * Coordinates timers, phase transitions and logging.
 */
import { StorageService } from './storage.js';

export const FieldManager = {
  currentRation: null,
  phaseIndex: 0,
  timerInterval: null,

  async initSession(ration) {
    this.currentRation = ration;
    this.phaseIndex = 0;
    this.renderPhase();
  },

  renderPhase() {
    const content = document.getElementById('phase-content');
    const ration = this.currentRation;

    if (!ration || !ration.phases || this.phaseIndex >= ration.phases.length) {
      this.showOperationComplete();
      return;
    }

    const phase = ration.phases[this.phaseIndex];
    content.innerHTML = '';

    const title = document.createElement('h2');
    title.innerText = `PHASE ${this.phaseIndex + 1}: ${phase.title}`;
    content.appendChild(title);

    const mapDiv = document.createElement('div');
    mapDiv.className = 'tactical-map';
    mapDiv.innerHTML = phase.map || '<div style="border: 1px solid #FFFF00; height: 100px; text-align: center; line-height: 100px;">[TACTICAL MAP UNAVAILABLE]</div>';
    content.appendChild(mapDiv);

    const cpList = document.createElement('ul');
    cpList.style.listStyle = 'none';
    cpList.style.padding = '0';
    phase.coachingPoints.forEach(point => {
      const li = document.createElement('li');
      li.innerText = `> ${point}`;
      li.style.marginBottom = '5px';
      cpList.appendChild(li);
    });
    content.appendChild(cpList);

    const logContainer = document.createElement('div');
    logContainer.style.display = 'flex';
    logContainer.style.gap = '10px';
    logContainer.style.marginTop = '20px';

    const btnFail = document.createElement('button');
    btnFail.className = 'btn-brutal';
    btnFail.innerText = 'FAIL';
    btnFail.style.flex = '1';
    btnFail.onclick = () => this.nextPhase('FAIL');

    const btnSuccess = document.createElement('button');
    btnSuccess.className = 'btn-brutal';
    btnSuccess.innerText = 'SUCCESS';
    btnSuccess.style.flex = '1';
    btnSuccess.onclick = () => this.nextPhase('SUCCESS');

    logContainer.appendChild(btnFail);
    logContainer.appendChild(btnSuccess);
    content.appendChild(logContainer);

    if (phase.duration) {
      this.startTimer(phase.duration);
    } else {
      this.stopTimer();
      document.getElementById('phase-timer').innerText = 'NO TIMER';
    }
  },

  startTimer(durationMinutes) {
    this.stopTimer();
    let seconds = durationMinutes * 60;
    const timerEl = document.getElementById('phase-timer');

    this.timerInterval = setInterval(() => {
      seconds--;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      if (seconds <= 0) {
        this.stopTimer();
        timerEl.innerText = 'TIME EXPIRED';
        timerEl.style.color = 'var(--danger-color)';
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const timerEl = document.getElementById('phase-timer');
    if (timerEl) timerEl.style.color = 'var(--accent-color)';
  },

  async nextPhase(result = null) {
    const ration = this.currentRation;
    if (!ration) return;

    if (result && ration.phases[this.phaseIndex]) {
      await StorageService.saveLog(ration.id, {
        phaseIndex: this.phaseIndex,
        phaseTitle: ration.phases[this.phaseIndex].title,
        result: result,
        timestamp: Date.now()
      });
    }

    this.phaseIndex++;
    this.renderPhase();
  },

  showOperationComplete() {
    const content = document.getElementById('phase-content');
    content.innerHTML = '<h2>OPERATION COMPLETE</h2><p>All phases executed. Return to base for debrief.</p>';
    this.stopTimer();
    document.getElementById('phase-timer').innerText = '00:00';
  }
};
