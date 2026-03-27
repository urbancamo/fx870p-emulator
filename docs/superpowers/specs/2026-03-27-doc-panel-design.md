# DOC Panel: Integrated Manual with Context-Sensitive Help

## Problem

The emulator has a comprehensive Casio JIS Standard BASIC manual (`public/docs/casio-jis-basic/`, 136 markdown files) but no way to view it from within the emulator UI. Users currently have no in-app documentation, and no way to look up a BASIC keyword while writing or reading programs.

## Solution

Add an integrated DOC panel that displays manual pages within the emulator, with context-sensitive help that lets users click any BASIC keyword in a program listing to jump directly to its documentation.

## Components

### 1. DocPanel.vue

A new Vue component that renders markdown documentation pages. It is a sibling to BasicListPanel and DebugPanel, managed by EmulatorView.

**Header bar:**
- `DOC` label (green, matching theme)
- `←` Back button (navigates history stack)
- Breadcrumb trail: `Index › Commands › INPUT`
- Layout toggle icon (`⬒`/`⬓`) — switches between side-by-side and stacked when BASIC panel is also open
- `✕` Close button

**Content area:**
- Scrollable div rendering markdown via the `marked` library (already a project dependency)
- Dark theme styling matching the existing AboutPopup/LibraryPopup markdown styles
- BASIC code blocks within docs get syntax highlighting via `basic-highlight.ts`
- Cross-reference links (e.g., `[PRINT](PRINT.md)`) are intercepted and navigate within the panel rather than triggering browser navigation
- Model badges (`[All Models]`, `[FX-870P/VX-4]`) rendered as styled inline tags

**Navigation:**
- Maintains a history stack (array of page paths)
- Back button pops the stack
- Opening a page pushes to the stack
- Index page (`index.md`) is the home/root page

**Props/events:**
- `v-model:visible` — controls panel visibility
- `commandPage` prop — when set, navigates to that command page (used by keyword click)
- Emits `close` event

### 2. command-index.json

A build-time generated JSON file at `public/docs/casio-jis-basic/command-index.json` that maps BASIC keywords to their documentation files and provides a one-line summary.

```json
{
  "keywords": {
    "ABS": { "file": "commands/ABS.md", "purpose": "Returns the absolute value of the argument." },
    "ACS": { "file": "commands/ASN_ACS_ATN.md", "purpose": "Returns the arc cosine." },
    "INPUT": { "file": "commands/INPUT.md", "purpose": "Assigns input from the keyboard to a specified variable." },
    "PRINT": { "file": "commands/PRINT.md", "purpose": "Displays data on the screen." },
    "SIN": { "file": "commands/SIN_COS_TAN.md", "purpose": "Returns the sine of the argument." }
  }
}
```

The `purpose` field is extracted from the `### Purpose` section of each command markdown file. This enables hover previews without loading the full markdown.

### 3. tools/build-command-index.ts

A TypeScript script (run with `npx tsx`) that:
1. Scans all `.md` files in `public/docs/casio-jis-basic/commands/`
2. Extracts the command name(s) from the `## HEADING` (some files cover multiple commands, e.g., `SIN_COS_TAN.md` maps SIN, COS, and TAN)
3. Extracts the `### Purpose` text
4. Extracts the model badge (e.g., `[All Models]`, `[FX-870P/VX-4]`)
5. Writes `public/docs/casio-jis-basic/command-index.json`

The generated file is checked into the repo. The script is run manually when command files change (not part of the build pipeline).

### 4. Keyword Click Integration

**basic-highlight.ts changes:**
- When rendering keyword spans, add a `data-cmd` attribute with the keyword name
- Output: `<span class="kw" data-cmd="INPUT">INPUT</span>`
- Also add a `data-fn` attribute for function names: `<span class="fn" data-cmd="SIN">SIN</span>`
- The highlight function needs access to the keyword list from `command-index.json` (or hardcoded from `cm-basic-lang.ts`) to know which tokens are documentable

**BasicListPanel.vue changes:**
- Add a delegated click handler on the listing container: `@click="onKeywordClick"`
- Handler checks if `event.target` has a `data-cmd` attribute
- If so, emits `open-doc` event with the keyword name
- CSS: keyword spans with `data-cmd` get `cursor: pointer` and dotted underline on hover

**EmulatorView.vue changes:**
- Receives `open-doc` event from BasicListPanel
- Looks up the keyword in `command-index.json` to get the file path
- Sets `docPage` prop on DocPanel and makes it visible
- Manages the layout arrangement (side-by-side vs stacked)

## Layout

### Panel Positioning

The DOC panel occupies the area **below the calculator** (same zone as BASIC and Debug panels). It never reduces the calculator's horizontal width.

### Layout Modes When BASIC Panel Is Also Open

| Mode | Arrangement | When |
|------|-------------|------|
| Side-by-side (default) | BASIC left (~40%), DOC right (~60%) | User preference or default |
| Stacked | BASIC above, DOC below (full width) | User toggles, or screen < 600px |

The toggle icon in the DOC header switches between these. Preference is saved to `localStorage` key `docLayout` with values `"side"` or `"stack"`.

### Layout Rules

| Scenario | Layout |
|----------|--------|
| DOC opened standalone (DOC button, no BASIC panel) | Full width below calculator |
| DOC opened via keyword click (BASIC panel open) | Side-by-side (or stacked per preference) |
| Screen width < 600px | Forced stacked regardless of preference |
| DOC open + Debug panel open | DOC and Debug stack vertically (Debug is independent) |

### Implementation in EmulatorView

The existing panel area below the calculator uses flexbox. When both BASIC and DOC are visible:

```html
<div class="panels-below">
  <!-- When side-by-side -->
  <div class="panel-row" v-if="showBasic && showDoc && docLayout === 'side'">
    <BasicListPanel class="panel-left" />
    <DocPanel class="panel-right" />
  </div>
  <!-- When stacked -->
  <template v-else>
    <BasicListPanel v-if="showBasic" />
    <DocPanel v-if="showDoc" />
  </template>
  <DebugPanel v-if="showDebug" />
</div>
```

## Toolbar

A new **DOC** button is added to the CommPanel toolbar, positioned between BAS and CHR:

```
[LOAD] [LIB] [STOP] [TURBO] [SNAP] [↑] [↓] [COM▼] [DBG▼] [BAS▼] [DOC] [870P/VX-4] [CHR] [?] [→/←/↓]
```

- Appearance: same style as other toolbar buttons (`#2a2a2a` background, `#ccc` text)
- Active state: green background (`#8bc34a`) when DOC panel is visible
- Click: toggles DocPanel visibility. When opening, shows the manual index page.
- State managed via `v-model:showDoc` between EmulatorView and CommPanel

## Markdown Rendering

DocPanel uses the `marked` library (already in the project) with a custom renderer:

**Link handling:**
- Internal links (e.g., `[PRINT](PRINT.md)`, `[Error Messages](../07-error-messages.md)`) are intercepted
- Click navigates within the DocPanel (push to history stack, fetch and render new page)
- External links open in a new browser tab

**Code blocks:**
- Fenced code blocks with ` ```basic ` language tag are rendered with syntax highlighting via `basic-highlight.ts`
- Keywords within code examples are clickable (same `data-cmd` attribute)

**Styling:**
- Reuses/extends the existing markdown CSS from `AboutPopup.vue`
- Headings: `#e5c07b` (matching the BASIC variable color)
- Code: `#141414` background, monospace font
- Links: `#7eb8f7` (existing blue accent)
- Model badges: inline `<span>` with green background for All Models, different colors per model group

## Files to Create

| File | Description |
|------|-------------|
| `src/components/DocPanel.vue` | Documentation viewer component |
| `public/docs/casio-jis-basic/command-index.json` | Keyword-to-file mapping with purpose summaries |
| `tools/build-command-index.ts` | Script to generate command-index.json |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/EmulatorView.vue` | Import DocPanel, add showDoc state, layout logic for side-by-side/stacked, handle open-doc events |
| `src/components/CommPanel.vue` | Add DOC toolbar button with v-model:showDoc |
| `src/components/BasicListPanel.vue` | Add delegated click handler for `[data-cmd]` elements, emit open-doc event |
| `src/editor/basic-highlight.ts` | Add `data-cmd` attribute to keyword/function spans |

## Verification

1. **DOC button**: Click DOC in toolbar → panel opens below calculator showing manual index. Click again → panel closes.
2. **Manual browsing**: From index, click a section link (e.g., "Grammar Overview") → section page renders. Click back → returns to index. Click a command in the alphabetical list → command page renders.
3. **Keyword click**: Open BASIC panel with a program loaded. Click a keyword (e.g., INPUT) → DOC panel opens beside it showing the INPUT command page.
4. **Layout toggle**: With both BASIC and DOC open, click the ⬒ icon → layout switches to stacked. Click ⬓ → back to side-by-side. Close and reopen → preference remembered.
5. **Cross-references**: On a command page, click a "See" link (e.g., INPUT$ from the INPUT page) → navigates to that command within the DOC panel.
6. **Mobile**: Resize browser to < 600px → panels stack vertically regardless of toggle preference.
7. **Standalone DOC**: Close BASIC panel, keep DOC open → DOC takes full width.
8. **Build script**: Run `npx tsx tools/build-command-index.ts` → generates `command-index.json` with all keywords mapped correctly.
