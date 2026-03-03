# TAKATHON Design System: Single Source of Truth (SSOT)

This document serves as the absolute reference for the TAKATHON UI/UX ecosystem. It bridges the gap between the high-energy, marketing-focused **Landing Page** and the tactical, gamified **Student Dashboard/Auth Pages**. 

The overall vibe is **"Cyber-Tactical & High-Energy Gamified"**. It leans heavily into dark mode, neon glowing accents, sharp geometry (clip-paths), and brutalist/cartoonish drop-shadows on the marketing side.

---

## 1. Visual Foundation (Design Tokens)

### Color Palette

The color system is heavily anchored in Deep Black and Vibrant Orange, with functional colors used for specific semantic feedback.

**Primary (Vibrant Orange)**
- `surface-primary` (`DEFAULT` / `500`): `#FF5C00` (Used on Landing Page & Global)
  - *Note: Auth pages use a slightly shifted `#FF6B00` and Dashboard uses `#EA580C`, but `#FF5C00` is the canonical brand primary.*
- `primary-hover`: `#FF6D1F` (or `#FF8A3D` / `400`)
- `primary-dark` (`600`): `#CC4A00`
- `primary-glow`: `rgba(255, 92, 0, 0.35)` to `0.5`

**Neutral Base (The Void/Dark Mode)**
- `background-dark`: `#030303` to `#050505` (The absolute base background)
- `background-light`: `#0A0A0A` (Used for slightly elevated sections)
- `surface-charcoal` / `card-bg`: `#111111` to `#121212` (Card surface base)
- `sidebar-black`: `#000000`
- `border-subtle` / `border-glass`: `rgba(255, 255, 255, 0.08)` to `0.1`

**Semantic (Feedback & Tactical Flags)**
- `success` (Green): `#22C55E` (Used for "System Online", active states, full squads)
- `error` (Red): `#EF4444` to `#DC2626` (Used for challenges, destructible actions)
- `warning` (Yellow): `#EAB308` (Used for missing teammates, alerts)
- `info` (Blue): `#3B82F6` (Used for sponsor flags, Web3 event distinctions)

### Typography Hierarchy

The typographic system contrasts highly legible sans-serifs with aggressive, technical display fonts to reinforce the gamified feel.

- **Brand Display (Huge Titles):** `Archivo Black`, sans-serif
  - *Usage:* Landing page hero text, section headers.
  - *Styling:* `uppercase`, very tight letter-spacing (`-0.04em` to `-0.06em`), tight line-height (`0.85` to `0.9`).
- **Dashboard Display / Gaming Font:** `Chakra Petch`, sans-serif
  - *Usage:* Dashboard headers, stats numbers, "QUICK ACTIONS", user leveling.
  - *Styling:* Usually `font-bold` to `font-black`, `uppercase`, tracking-wider.
- **Body & Functional:** `Inter`, sans-serif
  - *Usage:* Standard paragraphs, descriptions, subtitles.
- **System/Monospace:** `Courier New` / `font-mono`
  - *Usage:* Terminal inputs, transmission logs, technical data specs.

### Elevation & Geometry

Geometry is harsh and sharp. **Soft curves are avoided.**

- **Border Radius Constraints:** 
  - Standard components (Auth, Dashboards): `0px` (Strict sharp corners).
  - Selected marketing cards: `4px`.
- **Tactical Cutouts (The "Clip"):** 
  - Buttons and avatars heavily use `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)` to slice off the bottom-right corner by `12px`.
- **HUD Reticles:**
  - Panels use `.hud-corner` pseudo-elements (a `12px` by `12px`, `2px` thick border elbow on top-left and bottom-right edges).

**Box Shadows (Depth & Glow)**
- `glow-orange`: `0 0 25px rgba(234, 88, 12, 0.35)`
- `button-bevel`: `0px 4px 0px 0px #CC5500` (Simulates physical key depth)
- `button-bevel-active`: `0px 2px 0px 0px #CC5500`
- `depth-heavy`: `0 10px 40px rgba(0,0,0,0.9)`
- `hard-shadow` (Marketing): `8px 8px 0px #1a1a1a` (Brutalist blocks)

### Spacing System

- Base unit: `4px` (Tailwind scale).
- Standard block padding: `p-8` (32px) to `p-10` (40px) inside dashboard cards.
- Section gaps: `gap-6` (24px) for data grids, `gap-8` (32px) for auth inputs.

---

## 2. Atomic Components

### Buttons
Buttons must feel inherently tactile and responsive.
- **Primary (Call to Action):** 
  - Background: `bg-primary`
  - Text: `text-white font-black uppercase tracking-widest text-sm or text-xs`
  - Styling: `shadow-button-bevel` (`0px 4px 0px 0px #CC5500`). 
  - Hover: Background lightens to `#ff7b1a` or white with black text.
  - Active: `transform: translateY(2px)`, shadow reduces to `0px 2px 0px 0px`.
  - Shape: Often applies `.clip-corner-button`.
- **Secondary / Outline:**
  - Background: Transparent
  - Border: `border border-white/20`
  - Hover: `border-white text-white`
- **Ghost (Navigation / Quick Actions):**
  - Text: `text-gray-500`
  - Hover: `text-white bg-white/5` (or `bg-primary/5`).

### Form Inputs
Form inputs simulate a terminal or command-line interface.
- **Base Style:** `bg-black border border-[#333] text-white`. Sharp corners (`rounded-none`).
- **Typography:** `font-mono` or `font-medium text-sm`, usually `tracking-widest`.
- **Focus State:** `border-color: #FF6B00`, glowing `box-shadow: 0 0 0 1px #FF6B00`, `outline: none`.
- **Labeling:** `text-[10px] font-bold text-neutral-500 uppercase`. Focus cascades to labels (`group-focus-within:text-primary`).
- **Tactical Accent:** A `1px` or thicker colored accent bar (`w-1 bg-neutral-800 ... group-focus-within:bg-primary`) sits on the inside-right or inside-left of the input.

### Icons
- **Type:** Google Material Symbols Outlined.
- **Sizing:** `text-2xl` inside cards/badges, `text-sm` or `text-lg` inline with text.
- **Fill/Stroke:** Rarely filled, kept outlined and stark. Active icons often get a `drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]` (glow).

---

## 3. Molecular Patterns (The "DNA")

### Navigation & Layout Architecture
- **Marketing Header:** Floating/fixed `bg-gradient-to-b from-black/90 to-transparent`, centered tracking-widest uppercase links, explicit login/signup buttons.
- **Dashboard Structure:**
  - **Sidebar:** `w-72 bg-sidebar-black border-r border-white/10`. Uses a stacked, heavy icon + text nav. Active states use `border-l-4 border-primary` and a gradient background (`bg-gradient-to-r from-primary/20 to-transparent`).
  - **Top Bar:** Blends into background (`bg-black/90 backdrop-blur-md`). Houses global search (input styling consistent with auth) and the User Profile flag. 
  - **User Flag:** Does not use circles. Uses a sharp `w-12 h-12 bg-surface-charcoal border border-primary/50` with `.clip-corner-button` to house initials.

### Cards (The "Tactical Module")
Cards define the layout. They are never just boxes; they are instrumental panels.
- **Base Tactical Card:**
  - Background: `#080808` or `#111111`.
  - Border: `border border-white/10`.
  - Hover: `border-primary/60`, translating up by `-2px`, and triggering `shadow-glow-orange`.
- **Inner Texture:** Many cards include an absolute positioned `bg-diag-lines` (diagonal stripes) set to `10%` to `20%` opacity to simulate caution tape or venting.
- **Data Headers:** Always feature an accent box (e.g., `<span class="w-3 h-3 bg-primary rotate-45 shadow-glow-orange"></span>`) next to uppercase `font-gaming` text.

### Data & Progress Display
- **Progress Bars:** Do not use rounded bars. Use a containing box skewed horizontally (`skew-x-[-10deg]`) with `bg-black border border-white/10 p-0.5`. The inner fill (`bg-primary`) also features a glow shadow and an inner digital SVG grit pattern.
- **Listings / Hackathon Items:** 
  - Segmented by stark, thin lines (`bg-gradient-to-r from-transparent via-white/10 to-transparent`).
  - Status badges use raw borders (`border-primary/40 bg-primary/10`) and very small tracking-spaced text (`text-[10px]`).

---

## 4. UX Logic & Transitions

### The Visual "Vibe"
- **"High-Energy Cyber-Tactical"**: The application does not feel like conventional corporate SaaS. It borrows heavily from video game UI paradigms (e.g., Valorant/Cyberpunk). Users are "Operatives", levels are "Current Rank", and missing teammates are flagged as "Looking for 1 more" with hazard tape motifs.

### Transitions & Animation Speeds
- **Standard Hovers:** Buttons, inputs, and text links use standard DOM speeds: `transition-all duration-300` or `duration-200` (`200ms` or `300ms ease-out`).
- **Physical "Click":** Deep interaction (buttons, selecting an archetype) utilizes extreme `0.1s` active transitions pushing the element down `2px`-`4px` Y-axis to consume the box-shadow bevel.
- **Ambient Movement (The "Pulse"):**
  - **Floating Objects:** The environment always has depth. Background logos, terminal windows, and abstract geometry use `@keyframes float` (`translateY(-15px) rotate(2deg)`) over `6s` to `8s` loops.
  - **Status Indicators:** "System Online" or "Active Squads" employ standard `animate-pulse` opacity scaling to replicate blinking server LEDs.
  - **Digital Dust:** A fixed `<div class="digital-dust"></div>` overlay uses radial gradients translated over a 30-60 second linear loop across the background z-index `0` to simulate floating particles or grid scanning.
