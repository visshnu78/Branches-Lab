# Branches Lab — Design Notes & Developer Handoff

## Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FAFAF9` | Page background — warm off-white to reduce eye strain |
| Surface | `#FFFFFF` | Cards, navbar, elevated containers |
| Primary Text | `#1A1A1A` | Headlines, body copy |
| Secondary Text | `#5C5C5C` | Descriptions, supporting text |
| Accent (Blue) | `#1D4ED8` | CTAs, links, interactive elements |
| Accent Hover | `#1E40AF` | Hover state for primary accent |
| Accent Light | `#EFF6FF` | Badges, tag backgrounds, value cards |
| Gradient Start | `#1D4ED8` → End `#7C3AED` | Gradient text, hero visual, avatars |
| Dark BG | `#0F172A` | CTA section, footer |
| Border | `#E5E5E5` | Card borders, dividers |

> [!TIP]
> The blue-to-purple gradient signals innovation and forward-thinking energy without veering into "startup cliché." The warm off-white background keeps the page feeling approachable rather than clinical.

---

## Typography

| Element | Font | Weight | Size (Desktop) |
|---------|------|--------|-----------------|
| Display Headings | **Space Grotesk** | 700–800 | `clamp(2rem, 5.5vw, 4.2rem)` |
| Section Titles | **Space Grotesk** | 700 | `clamp(2rem, 4vw, 3rem)` |
| Body Copy | **Inter** | 400 | `1rem – 1.15rem` |
| Labels / Tags | **Inter** | 600 | `0.8rem`, `letter-spacing: 0.12em` |
| Buttons | **Inter** | 600 | `0.85rem – 0.95rem` |

**Why these fonts:**
- **Space Grotesk** — geometric, tech-forward display font that communicates precision and modernity
- **Inter** — optimized for screens, highly legible at small sizes, pairs cleanly with Space Grotesk

Both are available via Google Fonts at zero cost.

---

## Layout Architecture

```
┌─────────────────────────────────────────┐
│  NAVBAR (fixed, glassmorphism on scroll)│
├─────────────────────────────────────────┤
│  HERO (2-column: copy + interactive card│
│        badge • h1 • description • CTAs  │
│        stats bar at bottom)             │
├─────────────────────────────────────────┤
│  ABOUT US (2-column: gradient visual +  │
│           narrative + 2×2 value grid)   │
├─────────────────────────────────────────┤
│  SERVICES (3-column card grid, centered │
│            header, 6 service cards)     │
├─────────────────────────────────────────┤
│  TRUST SIGNALS (partner logos row +     │
│                 3-column testimonials)  │
├─────────────────────────────────────────┤
│  CTA SECTION (dark bg, centered copy,  │
│               dual buttons)            │
├─────────────────────────────────────────┤
│  FOOTER (4-column grid, social links)  │
└─────────────────────────────────────────┘
```

---

## Interactive Elements

### 1. Scroll Reveal Animations
Every content block uses `IntersectionObserver` with staggered delays (`reveal-delay-1` through `reveal-delay-5`). Elements fade in and slide up as the user scrolls. **One-shot** — once visible, stays visible.

### 2. Navbar Glassmorphism
On scroll past 40px, the navbar gains:
- Semi-transparent white background (`rgba(255,255,255,.92)`)
- `backdrop-filter: blur(16px)`
- Subtle drop shadow
- Reduced padding for a compact feel

### 3. Service Card Hover
- Card lifts (`translateY(-6px)`) with enhanced shadow
- A gradient accent bar animates in (`scaleX(0) → scaleX(1)`) at the top edge
- Border fades out, replaced by shadow depth

### 4. Floating Tags (Hero)
Two tags float around the hero card using a CSS `@keyframes float` animation with offset delays, creating a "live workspace" feel.

### 5. Hover Micro-interactions
- Buttons lift 2px and deepen shadows
- Arrow icons translate right 4px on hover
- "Learn More" links expand their gap
- Partner logos increase opacity
- Testimonial cards lift subtly
- Nav links grow an underline via `::after` width animation

### 6. Mobile Navigation
- Hamburger icon morphs to an × using CSS transforms
- Side drawer slides in from the right
- Dark overlay fades in behind
- Scroll is locked on `body` when open

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| `> 1024px` | Full layout — 2-col hero, 3-col services, 3-col testimonials, 4-col footer |
| `≤ 1024px` | Hero stacks (visual on top), services → 2-col, testimonials → 2-col, footer → 2-col |
| `≤ 768px` | Desktop nav hidden → hamburger + drawer, all grids → 1-col, floating tags hidden |

---

## Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| **Pill-shaped CTAs** | Softer, more approachable than sharp rectangles — matches the human-centric tone |
| **Gradient accent** | Blue → purple signals innovation without being aggressive; adds visual depth to an otherwise minimalist palette |
| **Off-white background** | Warmer than pure white, reduces harshness, signals craft and intentionality |
| **Section labels with dash** | The `::before` dash creates a consistent visual rhythm — subtle but structured |
| **Stats in hero** | Social proof immediately below the fold, before users scroll — builds trust within 3 seconds |
| **Dark CTA section** | High contrast breaks the pattern and creates urgency — the final "ask" stands out from the rest of the page |
| **Emoji icons** | Lightweight, universally rendered, no icon library dependency. For production, consider replacing with custom SVGs or [Lucide Icons](https://lucide.dev/) |

---

## Production Recommendations

> [!IMPORTANT]
> **Before going live**, consider these enhancements:

1. **Replace emoji icons** with SVG icon set (Lucide, Phosphor, or custom) for sharper rendering and brand consistency
2. **Add Open Graph meta tags** and a preview image for social sharing
3. **Implement a real contact form** (e.g., Formspree, Resend, or custom API) behind the "Start a Project" CTA
4. **Add `loading="lazy"`** to any images added later
5. **Replace placeholder partner logos** with actual SVG logos of real partners
6. **Consider a CMS** (Sanity, Contentful) for testimonials and service descriptions
7. **Add a favicon** — use the gradient square from the navbar logo as a starting point
8. **Performance**: The page is currently ~15KB total (HTML + CSS + JS, no external assets beyond fonts) — extremely fast. Keep it lean.

---

## File Structure (Current)

```
branches-lab/
└── index.html    ← Single self-contained file (HTML + CSS + JS)
```

For production, split into:
```
branches-lab/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
└── favicon.ico
```
