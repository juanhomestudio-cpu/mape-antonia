---
name: Sanctuary of the Self
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d9d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece8'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e8e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#4f453d'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#80756c'
  outline-variant: '#d2c4ba'
  surface-tint: '#735941'
  primary: '#71573f'
  on-primary: '#ffffff'
  primary-container: '#8b6f56'
  on-primary-container: '#fffbff'
  inverse-primary: '#e2c0a3'
  secondary: '#5e5f5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#4c5e6c'
  on-tertiary: '#ffffff'
  tertiary-container: '#647786'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbf'
  primary-fixed-dim: '#e2c0a3'
  on-primary-fixed: '#291805'
  on-primary-fixed-variant: '#5a422c'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1a1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#d1e5f6'
  tertiary-fixed-dim: '#b5c9d9'
  on-tertiary-fixed: '#091d2a'
  on-tertiary-fixed-variant: '#374956'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e8e1dd'
  antonia-terracotta: '#C17B5E'
  mape-eucalyptus: '#5F7464'
  charcoal-text: '#333333'
  sand-neutral: '#F5F2ED'
typography:
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 42px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  safe-margin: 2rem
  gutter: 1.5rem
  section-gap: 4rem
  stack-sm: 0.75rem
  stack-md: 1.5rem
---

## Brand & Style

The design system is rooted in the concept of a **Digital Sanctuary**—a private, breathable space for women to transition from "surviving" to "inhabiting" themselves. The brand personality is **Intimate, Sophisticated, and Deeply Human**, prioritizing emotional resonance over clinical efficiency.

### Visual Style: Organic Minimalism
We employ a "Cinematic Minimalist" approach. This is characterized by:
*   **High Whitespace:** Generous "air" around every element to lower cognitive load and encourage deep breathing.
*   **Tactile Textures:** Subtle integration of natural elements—the grain of linen, the warmth of sun-drenched wood, and organic paper textures.
*   **One Primary Action:** Each screen focuses on a single "Path of Least Resistance," removing the anxiety of "pending tasks."
*   **Emotional Immersion:** Using soft vignettes and natural light filters to create a sense of presence, rather than a standard app interface.

## Colors

The palette is anchored in **earthy neutrals** that evoke nature and calm.

### Voice Accents
The system utilizes **Dynamic Theming** to shift the user's emotional environment based on who is speaking:
*   **Antonia (Body):** Uses `antonia-terracotta`. This color is applied to borders, badges, and video filters when the content focuses on biological health and physical presence.
*   **Mape (Mind):** Uses `mape-eucalyptus`. This color is applied when the focus shifts to mental regulation, breathwork, and clinical psychology.

### Surface & Text
*   **Background:** Always use `#FDFCF9` (Base Surface) to maintain a warm, non-clinical glow.
*   **Typography:** Never use pure black. Use `#333333` (Charcoal) for all primary text to keep the reading experience soft and high-contrast yet approachable.

## Typography

The typography strategy balances **Emotional Connection** with **Functional Clarity**.

*   **Headlines (Playfair Display):** Used for "Anchor Phrases" and screen titles. The high-contrast serif evokes the feel of a premium journal and creates an immediate emotional hook.
*   **Body (Work Sans):** Chosen for its grounded, neutral, and highly legible nature. We use large sizes and generous line heights (1.6x - 1.7x) to ensure the text never feels cramped.
*   **Micro-copy:** All-caps are strictly reserved for `label-caps` (tags/badges). Avoid all-caps for any narrative or instructional text to maintain an intimate, conversational tone.

## Layout & Spacing

The layout follows a **Fluid Grid** model with an emphasis on vertical storytelling.

### Principles
*   **The Breath Rule:** Every text block or component must have a minimum of `section-gap` vertical space between it and the next unrelated element.
*   **Center-Stage Content:** Primary content (video/reflections) is centered with wide margins to create focus.
*   **Mobile-First Paths:** The "Mi Camino" (My Path) screen uses a non-linear "Constellation" layout where nodes are connected by organic, hand-drawn lines rather than a rigid list.

### Responsiveness
*   **Desktop:** Content max-width is constrained to 1100px to maintain readability and "whitespace margins."
*   **Tablet/Mobile:** Margins shift to `safe-margin` (2rem) to ensure touch targets are isolated and the screen feels uncrowded.

## Elevation & Depth

To avoid a "flat" or "app-like" feeling, this design system uses **Atmospheric Layering**.

*   **Low-Opacity Shadows:** Shadows are extremely diffused (Blur: 30px+) and tinted with the `primary_color_hex` or Voice Accents, rather than gray. They should feel like an object resting on a soft surface.
*   **Tonal Surfaces:** We use `sand-neutral` to create subtle "containers" for secondary information, distinguishing them from the main `Base Surface` without using hard lines.
*   **Glassmorphism:** Modals (like "Memories" or "Muros") use a high-radius backdrop blur (20px) to maintain a visual connection to the sanctuary background while focusing the user's attention.

## Shapes

The shape language is **Organic and Soft**.

*   **Components:** All buttons and cards use `rounded-xl` (1.5rem) or higher to remove visual "sharpness."
*   **Path Nodes:** "Mundos" (Worlds) are represented by large, soft circles, while "Clases" are smaller, slightly irregular circular nodes.
*   **Borders:** Borders are used sparingly. When present, they are 1px thick and colored with the neutral `primary_color_hex` or a Voice Accent.

## Components

### Buttons
*   **Primary:** High-emphasis, fully rounded (pill), using the active Voice Accent.
*   **Secondary:** Ghost-style with a 1px `primary_color_hex` border.
*   **Transition Buttons:** Large, centered buttons like "Continuar mi camino" appear with a soft fade-in after a video ends.

### Cards
*   **Sanctuary Cards:** Used for Worlds. Large imagery, subtle shadow, and `rounded-xl` corners.
*   **Reflection Inputs:** Minimalist text areas with a subtle `sand-neutral` background and no heavy borders.

### Check-in & Progress
*   **Mood Check-in:** Set of 5 custom, organic-weight line icons representing internal states. 
*   **Progress Bars:** Thin, elegant lines that fill with a soft gradient of the active Voice Accent.
*   **Micro-Padlocks:** Used for locked content; discrete and low-contrast to avoid a "punishment" feel.

### Navigation
*   **Bottom Bar:** A fixed, translucent frosted-glass bar with organic line icons.
*   **Path View:** A constellation-style map where the user's current position is highlighted with a soft "glow" or pulse.