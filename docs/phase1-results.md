⏺ Phase 1 is complete and committed. Here's a summary of what was done this session:

Files written:
- src/components/EmulatorView.vue — orchestrator: loads ROMs, starts emulator, composes face.png + LCD canvas + keyboard overlay, handles F9 reset
- src/App.vue — replaced scaffold with <EmulatorView />

Build fixes applied:
- tsconfig.app.json — disabled noUncheckedIndexedAccess (the Vue base config enables it; impractical for typed-array-heavy emulator code)
- src/emulator/emulator.ts — moved lcdctrl import from def.js to lcd.js; removed unused imports; fixed memdef[RAM0_IDX] indexing and Uint8Array ?? 0 fallbacks
- src/emulator/def.ts — fixed r.buf[r.off] returns, added ! assertions on memdef[i] in loops, removed stale unused w0/w0hi/w1/w1hi declarations
- src/emulator/port.ts — removed unused ie/ib/setIb/setPrinterData/ga_wr6
- src/emulator/exec.ts — removed unused setKy import
- src/components/LcdCanvas.vue — removed dead COLOR_* constants and startY
- src/components/KeyboardOverlay.vue — removed unused ie/ky imports

Build result: Clean, 97.5 KB bundle. Dev server starts successfully.

To verify: Run npm run dev and open localhost:5173. You should see the CASIO fx-870P face plate with the green LCD. If the ROMs are correct the calculator should boot to the CASIO fx-870P startup
screen.
