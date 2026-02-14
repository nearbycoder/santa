# Design System — Secret Santa

## Design Philosophy

**Winter Luxury Editorial** — A sophisticated take on holiday gift exchanges, eschewing traditional red/green clichés for a refined, magazine-quality aesthetic.

## Color Palette

### Primary Colors
- **Burgundy** `#5a1a1a` — Deep, rich primary for headings and emphasis
- **Wine** `#8b2f2f` — Warmer accent for interactive elements
- **Forest** `#1a4d2e` — Deep green for contrast and depth
- **Pine** `#2d6a4f` — Lighter green accent

### Accent Colors
- **Champagne** `#d4af37` — Luxurious gold for highlights and CTAs
- **Gold** `#f4e4c1` — Light gold for gradients and subtle accents
- **Cream** `#faf8f3` — Warm background, softer than pure white
- **Charcoal** `#1a1a1a` — Primary text color
- **Slate** `#2d2d2d` — Secondary text

## Typography

### Headings
**Playfair Display** — Elegant serif typeface
- 900: Extra bold for main titles
- 700: Bold for section headings
- 600: Semibold for cards
- Font sizes: 7xl-9xl for heroes, 4xl-6xl for sections

### Body
**Outfit** — Modern, refined sans-serif
- 700: Bold for buttons
- 600: Semibold for emphasis
- 400-500: Regular for body text
- 300: Light for subtle text

## Components

### Buttons

**Primary Button (Generate/CTA)**
```css
bg: gradient champagne → gold → champagne
text: burgundy
shadow: champagne glow
hover: scale + shadow increase
animation: shimmer effect
```

**Secondary Button (Add participant)**
```css
bg: gradient wine → burgundy
text: white
shadow: burgundy glow
hover: scale + shadow increase
```

**Tertiary Button (Copy link)**
```css
bg: white/transparent
border: champagne
text: charcoal
hover: champagne background tint
```

### Cards

**Main Card**
```css
bg: white/80 with backdrop blur
border: champagne/20
shadow: 2xl with burgundy tint
border-radius: 3xl (48px)
```

**Participant Card**
```css
bg: gradient cream → white
border: champagne/10
hover: border champagne/30 + shadow
border-radius: xl (16px)
```

### Inputs

**Text Input**
```css
border: 2px champagne/30
focus: border champagne + ring champagne/10
bg: white/50
padding: generous (px-6 py-4)
border-radius: 2xl (24px)
```

## Animations

### Float Effect
Subtle vertical movement for icons and decorative elements
- Duration: 4-6s
- Easing: ease-in-out
- Transform: translateY(-20px)

### Shimmer Effect
Gradient animation for primary buttons
- Background position animation
- Duration: 3s
- Creates premium, eye-catching effect

### Glow Effect
Pulsing shadow for emphasis
- Box-shadow opacity animation
- Duration: 3s
- Champagne glow color

### Staggered Reveals
List items animate in sequentially
- fade-in + slide-in-from-left
- 50-75ms delay between items
- Creates polished, editorial feel

### Snowfall Particles
Ambient background animation
- 15 particles with randomized properties
- Varied snowflake characters (❄, ❅, ❆, ✦, ✧)
- 15-30s duration
- Subtle champagne color

## Spatial Design

### Layout Principles
- **Generous Spacing** — Large padding and margins for breathing room
- **Centered Content** — Max-width containers (4xl-5xl) for readability
- **Asymmetric Accents** — Floating gradient orbs positioned asymmetrically
- **Card Elevation** — Layered shadows for depth hierarchy

### Responsive Breakpoints
- Mobile: Single column, reduced text sizes
- Tablet (md): Grid layouts where appropriate
- Desktop: Full experience with animations and effects

## Micro-interactions

1. **Hover States**
   - Scale transforms (1.05)
   - Shadow increases
   - Border color transitions
   - Smooth 300ms transitions

2. **Active States**
   - Scale down (0.95)
   - Tactile feedback on buttons

3. **Focus States**
   - Ring outline with champagne color
   - Border color change
   - Clear accessibility

4. **Loading States**
   - Smooth opacity changes
   - Graceful content reveals

## Accessibility

- **Color Contrast** — All text meets WCAG AA standards
- **Focus Indicators** — Clear focus rings on interactive elements
- **Semantic HTML** — Proper heading hierarchy, landmarks
- **Keyboard Navigation** — Full keyboard support
- **Screen Reader Support** — Descriptive labels and ARIA attributes

## Brand Voice

**Sophisticated yet approachable** — Refined language without being stuffy
- "Elegant gift exchange" not "Secret Santa generator"
- "Personalized link" not "Your URL"
- "Create an elegant gift exchange" not "Make a Secret Santa"
- Use "✦" symbol for decorative emphasis

## Technical Implementation

### CSS Strategy
- Tailwind utility classes for rapid development
- Custom CSS variables for theme colors
- Keyframe animations for complex effects
- CSS Grid and Flexbox for layouts

### Performance
- Minimal JavaScript for core functionality
- CSS-only animations where possible
- Lazy loading for non-critical elements
- Optimized font loading (Google Fonts with display=swap)

### State Management
- URL-based state (participants in ?p= param)
- No external state library needed
- React hooks for local UI state
- Encode/decode utilities for URL serialization

---

**Key Differentiator**: This design avoids "AI slop" by committing to a specific, intentional aesthetic direction — Winter Luxury Editorial — and executing every detail with precision and care.
