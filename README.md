# Florian Noirbent Portfolio Site

Personal portfolio site for **Florian Noirbent**, also known as **Titan** built with Astro + Tailwind CSS, focused on real-time destruction systems and gameplay tooling.

## Local Development

```sh
npm install
npm run dev
```

## Build and Preview

```sh
npm run build
npm run preview
```

`npm run build` outputs static files to `dist/`.

## Cloudflare Pages Configuration

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: `Astro` (or `None` with the command/output above)

## Notes

- Site URL is configured as `https://florian-noirbent.nofl.uk` (canonical). The previous domain `https://titan.nofl.uk` stays attached as a custom domain of the same Cloudflare Worker (`site`).
- Theme: System (default, follows the OS/browser setting live), Light or Dark, chosen in the header. Only an explicit Light/Dark choice is stored in `localStorage` (see `THEME` in `src/config/site.ts`); dark mode is class-based.
- No tracking or analytics are enabled by default.
- Game placeholder generation workflow is documented in `docs/game-placeholders.md`.
- Blog posts, game links and game page groups are documented in `docs/blog-and-game-links.md`.
