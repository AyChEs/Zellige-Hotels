# DESIGN.md

Notes on the visual system. Tokens live in `frontend/src/styles/theme.css`
(Tailwind 4 CSS-first `@theme`).

## Theme

"Limewash and green tile" ("cal y azulejo verde"): warm whitewashed walls, a Fez tile
green and a garnet taken from carved lattice screens. Warm because of the off-white,
calm because there is only one strong colour per screen. The full direction, with the
reason for each decision, is in [`plan/DISENO.md`](../plan/DISENO.md).

The motif is a tile lattice (squares turned 45 degrees with a small lozenge at each
crossing): `.reticula` on light shell surfaces (landing, auth) and `.reticula-noche` on
the staff sidebar. Never behind tables, long forms or paragraphs. The brand separator
(`.separador`) is a line, a garnet lozenge and a line.

## Palette

| Token (`--color-*`) | Value | Used for |
|---|---|---|
| `cal-50` | `#FAF8F4` | page background |
| `cal-100` | `#F1EDE6` | soft fills, hover rows, skeletons |
| `cal-200` | `#E3DDD3` | borders and dividers |
| `cal-400` | `#8E877C` | form control borders (3.4:1) |
| `tinta-900` | `#1C211F` | body text (15.4:1 on `cal-50`) |
| `tinta-600` | `#555C58` | secondary text (6.5:1) |
| `fez-700` / `fez-800` | `#1E5B46` / `#17483A` | primary buttons, links, focus, active state |
| `fez-50` | `#E4F0EA` | selected and success fills |
| `granate-700` / `granate-50` | `#8B2E3C` / `#F6E7E9` | brand accent: card keyline, ornament, highlighted price |
| `noche-900` / `noche-800` | `#18231F` / `#2A3B34` | staff sidebar and its active item |
| `noche-ink` / `noche-muted` | `#EDEAE3` / `#A9B5AF` | text on `noche-900` |
| `error-700`, `error-ink` / `error-50` | `#B3261E`, `#8F1D17` / `#FCEBEA` | destructive actions, errors |
| `aviso-ink` / `aviso-50` | `#6B4E00` / `#FBF0D2` | pending, cleaning |
| `info-ink` / `info-50` | `#1F4B73` / `#E6EEF6` | confirmed, in progress |

Rules I hold to:
- One strong green (`fez-700`) for everything you can press, so a screen teaches what is
  interactive.
- Status colours are dark ink on a light tint and always come with text.
- No orange or terracotta anywhere: errors are a true red.

## Typography

| Role | Font | Notes |
|---|---|---|
| Brand titles (landing, hotel name, auth titles) | Marcellus 400, self-hosted (`@fontsource/marcellus`) | the hotel's voice |
| Interface and text | Source Sans 3 Variable, self-hosted (`@fontsource-variable/source-sans-3`) | legible in small tables, tabular figures |

Scale (1.2 ratio, rem): `xs` 13px, `sm` 14px (staff UI, buttons), `base` 16px (text and
inputs, avoids the iOS zoom), `lg` 19px, `xl` 23px, `2xl` 28px, `4xl` 40px, `6xl` 56px.
Prices, dates and tables use `.cifras` (`tabular-nums`). Field labels are 14px semibold,
no forced uppercase.

Radii: `--radius-control` 6px (buttons, inputs), `--radius-card` 10px (cards, modal,
toasts), `--radius-pill` for status badges. One shadow, `--shadow-card`. Focus is the
same everywhere: 2px `fez-700` outline with 2px offset (`noche-ink` on the sidebar).

## Components

The grammar — the same on every screen, the same states every time.

- `card-tile`: white surface, 1px `cal-200` border, 10px radius, `--shadow-card`.
- `card-tile-accent`: adds a 2px garnet top keyline. Brand moments only.
- `btn-primary` (fez), `btn-ghost`, `btn-danger`. All: global focus ring, disabled at
  50%, no size jumps on hover. (`btn-gold` is a temporary alias of `btn-primary`.)
- `field-label` / `field-input` / `field-error`: 14px labels, `cal-400` borders, red
  errors.
- `badge` + per-status colour maps (booking, invoice, room, task, priority).
- `.reticula`, `.reticula-noche`, `.separador`.

## Layout

- **Public**: max-w-6xl centered; editorial serif titles.
- **ERP**: fixed 240px `noche-900` sidebar (lattice), `cal-50` canvas,
  content full-width, density welcome. Tables full-width, sticky header
  at ≥lg.
- Spacing: Tailwind scale. Section rhythm 8/12 on public, 6/8 in the ERP.

## Motion

State-conveying only, 150–250ms, `ease-out`. Skeletons for loading
(`animate-pulse` on `cal-100` blocks), no spinners mid-content, no
page-load choreography. Under `prefers-reduced-motion`, transitions
drop to 0ms but the layout and the pattern don't change.
