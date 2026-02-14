# Secret Santa — Elegant Gift Exchange

A sophisticated, URL-based Secret Santa app with no login, no database, and no tracking. All state is managed through URL parameters for effortless sharing.

## ✨ Features

- **URL-Based State Management** — All data lives in the URL. Share links to sync participants and assignments without any backend.
- **Elegant Design** — Winter luxury editorial aesthetic with Playfair Display typography, jewel tones, and refined animations.
- **Privacy First** — No data storage, no tracking, no accounts. Everything happens client-side.
- **Easy Sharing** — Copy individual reveal links and distribute them via your preferred messaging platform.
- **Instant Setup** — Add participants, generate assignments, and distribute links in seconds.

## 🎁 How It Works

1. **Add Participants** — Enter names on the home page. The URL updates automatically to preserve your list.
2. **Generate Assignments** — Click "Generate Secret Santa Assignments" to create the matches.
3. **Share Links** — Each participant gets a unique reveal link. Copy and send these individually.
4. **Reveal** — Each person clicks their link to see who they're giving to. Assignments are private and unique.

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

Visit `http://localhost:3000` to start creating your Secret Santa exchange.

## 🎨 Design Philosophy

This app embraces a **Winter Luxury Editorial** aesthetic:

- **Typography**: Playfair Display (serif) for headings, Outfit (sans-serif) for body text
- **Color Palette**: Deep burgundy, forest green, champagne gold, cream backgrounds
- **Animations**: Subtle float effects, staggered reveals, elegant transitions
- **Details**: Soft glows, particle snowflakes, gradient meshes

No generic "AI slop" — every detail is intentional and contextual.

## 🔒 Privacy & Security

- All cryptographic operations happen client-side
- Assignments are encoded in reveal tokens
- No server-side storage or logging
- No external analytics or tracking scripts
- Share links freely — they contain no personal information

## 🛠 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React-based full-stack framework)
- **Styling**: Tailwind CSS v4
- **Routing**: TanStack Router
- **Icons**: Lucide React
- **Deployment**: Static hosting (Vercel, Netlify, etc.)

## 📝 License

MIT — use it, modify it, share it freely.

---

✦ Built with care. No servers, no surveillance, just simple gift exchange. ✦
