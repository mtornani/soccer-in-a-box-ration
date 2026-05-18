# BASE Mode — Design Spec
Date: 2026-05-18

## Scope
Introduce BASE as the primary home screen of the app. Replaces Logistics Mode.
Flow: BASE → FIELD → BASE.

## Out of Scope
- Ration creation from scratch (no form builder)
- Backend sync / export
- Multi-ration field sessions

## Flow Change
Before: Logistics → Field → Logistics
After:  BASE → Field → BASE

Briefing splash still appears on first launch, then drops to BASE.

## BASE Screen Layout (single scrollable view)

```
[ BASE — COMANDO ]
──────────────────────────────
RAZIONI DISPONIBILI
  RATION_test-001   [PRONTA]  [ENTRA →]
  RATION_foo        [PRONTA]  [ENTRA →]
  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  [CARICA RAZIONE TEST]
  [CARICA DA URL]
──────────────────────────────
DEBRIEFING — SESSIONI
  18/05/26  test-001  2/2  ██████ 100%
  17/05/26  test-001  1/2  ███░░░  50%
  ▼ (tap expands phase detail)
    > FASE 1: POSITIONING  — SUCCESSO  14:32
    > FASE 2: EXECUTION    — FALLITO   14:41
──────────────────────────────
```

## Components

### BaseManager (new: js/base.js)
Responsibilities:
- Render ration list from StorageService
- Render debriefing log list from StorageService
- Handle "ENTRA" per-ration (passes selected ration to App for field transition)
- Handle "CARICA RAZIONE TEST" 
- Handle "CARICA DA URL" (fetch + validate + save)
- Expand/collapse session detail rows

### StorageService additions
- `getAllLogs()` — returns all `log_*` keys with their session data
- `deleteRation(id)` — remove ration and its log from storage

### App changes
- Remove `#logistics-mode` div and all logistics logic
- Add `#base-mode` div
- `enterFieldMode(rationId)` now accepts specific rationId from BaseManager
- `exitFieldMode()` returns to base, calls `BaseManager.render()`

### i18n additions
- baseTitle, rationsSectionTitle, debriefSectionTitle
- loadFromUrlBtn, loadFromUrlPrompt, enterBtn
- sessionLabel, noSessions, phaseResult
- deleteBtn, confirmDelete

## "Carica da URL" flow
1. User taps [CARICA DA URL]
2. `prompt()` asks for URL (military style label in i18n)
3. Fetch → validate (title + phases array) → StorageService.saveRation()
4. Re-render ration list

## Debriefing display
- One row per log_* key in storage
- Shows: date (from first log timestamp), ration id, phases completed / total phases, % success bar (ASCII blocks)
- Tap row → expands inline to show per-phase results with timestamps
- Most recent first

## ASCII progress bar
```js
function progressBar(successCount, total) {
  const filled = Math.round((successCount / total) * 6);
  return '█'.repeat(filled) + '░'.repeat(6 - filled);
}
```

## Styling
- Two section headers styled like `h2` (yellow, uppercase, monospace)
- Ration rows: flex, ration name left, [ENTRA →] button right (small, brutal style)
- Session rows: monospace, collapsible, phase detail indented with `>`
- Consistent with existing tactical-dark theme

## File changes summary
| File | Change |
|------|--------|
| js/base.js | NEW — BaseManager |
| js/app.js | Remove logistics refs, wire BaseManager |
| js/storage.js | Add getAllLogs(), deleteRation() |
| js/i18n.js | Add base/debrief strings EN+IT |
| index.html | Replace #logistics-mode with #base-mode |
| css/style.css | Add base section styles |

## Testing
- Load app → BASE shown with no rations, no sessions
- Load test ration → appears in ration list
- Enter field → complete 2 phases → return to base
- Debriefing shows session with correct % and phase results
- Expand row → see per-phase timestamps
- Load from URL → valid JSON → appears in list
- Load from URL → invalid JSON → error shown
- Switch language → all BASE strings update
