/**
 * i18n — EN/IT UI string switcher.
 * Ration content (coaching points, phase titles) is author-controlled, not translated.
 */

export const STRINGS = {
  en: {
    logisticsTitle: 'LOGISTICS MODE',
    rationPack: 'RATION PACK: SOCCER-RATION-01',
    loadBtn: 'LOAD TEST RATION',
    enterFieldBtn: 'ENTER FIELD MODE',
    fieldTitle: 'FIELD MODE: OPERATIONAL',
    nextPhaseBtn: 'NEXT PHASE',
    returnBtn: 'RETURN TO BASE',
    noRations: 'NO RATIONS LOADED',
    rationReady: 'READY',
    rationEmpty: 'EMPTY',
    timeExpired: 'TIME EXPIRED',
    noTimer: 'NO TIMER',
    opComplete: 'OPERATION COMPLETE',
    opCompleteMsg: 'All phases executed. Return to base for debrief.',
    fail: 'FAIL',
    success: 'SUCCESS',
    noRationsAlert: 'NO RATIONS LOADED. Use LOAD TEST RATION first.',
    loadError: 'LOAD FAILURE: ',
    transitionError: 'TRANSITION FAILURE: ',
  },
  it: {
    logisticsTitle: 'MODALITÀ LOGISTICA',
    rationPack: 'RAZIONE: SOCCER-RATION-01',
    loadBtn: 'CARICA RAZIONE TEST',
    enterFieldBtn: 'ENTRA IN CAMPO',
    fieldTitle: 'MODALITÀ CAMPO: OPERATIVA',
    nextPhaseBtn: 'FASE SUCCESSIVA',
    returnBtn: 'TORNA ALLA BASE',
    noRations: 'NESSUNA RAZIONE CARICATA',
    rationReady: 'PRONTA',
    rationEmpty: 'VUOTA',
    timeExpired: 'TEMPO SCADUTO',
    noTimer: 'NESSUN TIMER',
    opComplete: 'OPERAZIONE COMPLETATA',
    opCompleteMsg: 'Tutte le fasi eseguite. Torna alla base.',
    fail: 'FALLITO',
    success: 'SUCCESSO',
    noRationsAlert: 'NESSUNA RAZIONE. Usa CARICA RAZIONE TEST prima.',
    loadError: 'ERRORE CARICAMENTO: ',
    transitionError: 'ERRORE TRANSIZIONE: ',
  }
};

const LANG_KEY = 'siab_lang';

let currentLang = localStorage.getItem(LANG_KEY) || 'it';

export function getCurrentLang() {
  return currentLang;
}

export function getSavedLang() {
  return currentLang;
}

export function saveLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

export function t(key) {
  return STRINGS[currentLang][key] || STRINGS.en[key] || key;
}

export function applyLang(lang) {
  saveLang(lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Update toggle button label
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = lang === 'it' ? 'EN' : 'IT';
}
