// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://florian-noirbent.nofl.uk',
  output: 'static',
  // Contact moved into the About page.
  redirects: {
    '/contact': '/about#contact'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
