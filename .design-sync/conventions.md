## Setup

No provider wrapper is required — every component reads styling purely from CSS custom properties and utility classes already shipped in `styles.css`. Just import and render.

This DS's signature look is a **airport split-flap ("Solari") departure board**, amber-on-black, monospace. Two components are full-viewport overlays by real CSS design (`position:fixed`):
- `SplashScreen` — fullscreen boot animation (`inset:0`, z-index 1000). Render it as the app's outermost screen, not inline.
- `SettingsPanel` — right-edge slide-in drawer (`position:fixed; right:0`). Render it as a sibling of your page root, controlled by `isOpen`; it renders its own scrim (`.settings-overlay`).

`SplitFlapBoard` and `TimeScopeBar` are normal in-flow block components.

## Styling idiom

Two layers, both real and shipped:
1. **Tailwind v4 utility classes** (compiled) — standard utilities like `flex`, `gap-2`, `px-4`, `text-[0.7rem]`, `tracking-wider` are used throughout for layout/spacing/type-size.
2. **Hand-authored board classes + CSS variables** carry the actual brand look — always prefer these over inventing new colors/shapes:

| Class | Use |
|---|---|
| `.board-header` / `.board-title` / `.board-subtitle` | App header bar and titles |
| `.board-clock` / `.board-date-small` | Header clock/date readouts |
| `.life-status-bar` / `.life-stat` / `.life-stat-label` / `.life-stat-value` | Summary stat row (age, elapsed days, compare mode) |
| `.board-container` | Wraps a list of `.flap-row` — the departure-board body |
| `.flap-row` / `.flap-row-section` / `.flap-row-empty` | One data row / section-header row / empty-state row |
| `.flap-cell` `.flap-cell-date` `.flap-cell-title` `.flap-cell-person` | The 3 columns inside a `.flap-row` |
| `.flap-accent-bar` | Left accent stripe on a row (set `style={{background: person.accentColor}}`) |
| `.flap-animate-in` | Staggered flip-in entrance (paired with inline `animationDelay`) |
| `.scope-bar` / `.scope-btn` (`.active`) | Segmented control (day/week/month/year/lifetime) |
| `.compare-toggle` / `.dot` (`.active`) | Toggle pill with a status dot |
| `.board-btn` / `.board-btn-primary` | Buttons — primary is filled amber |
| `.settings-panel` / `.settings-overlay` | Slide-in drawer + its scrim |
| `.setup-screen` / `.setup-card` | Centered onboarding card |
| `.splash-screen` / `.splash-icon` / `.splash-title` / `.splash-sub` / `.splash-dot` | Boot splash pieces |

Theme tokens (CSS vars, already defined in `styles.css`'s import closure — reference them, don't hardcode hex):

`--board-bg`, `--board-panel`, `--board-flap-top`, `--board-flap-bot`, `--board-border`, `--board-divider`, `--board-amber`, `--board-amber-dim`, `--board-amber-glow`, `--board-section`, `--board-empty`.

Per-item accent colors (e.g. distinguishing rows/people) are plain hex strings passed as `accentColor` props / inline `style`, not tokens — pick readable colors against the near-black background, as the preset data does (`#60a5fa`, `#f87171`, `#4ade80`, `#c084fc`, `#fbbf24`…).

## Where the truth lives

- `styles.css` → tokens + `_ds_bundle.css` (all real compiled Tailwind output + the classes above). Read this before styling anything new.
- Each component's `.prompt.md` documents its exact prop shape; `.d.ts` is the authoritative contract.

## Build snippet

```tsx
<div className="board-header">
  <div>
    <div className="board-title">RELATIVE TIMELINE</div>
    <div className="board-subtitle">DEPARTURE BOARD</div>
  </div>
</div>

<TimeScopeBar
  scope={scope}
  onScopeChange={setScope}
  compareMode={compareMode}
  onCompareModeChange={setCompareMode}
/>

<SplitFlapBoard items={items} animKey={`${scope}-${compareMode}`} quickMode={false} />
```
