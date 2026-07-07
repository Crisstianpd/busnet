import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { fileURLToPath, URL } from 'node:url'
import { renameSync, existsSync } from 'node:fs'

// BUILD_TARGET=fleet builds ONLY the Fleet dashboard as a standalone site and
// emits it as dist/index.html, so a separate Vercel project can serve it at `/`
// with nothing but a build-command override — no committed vercel.json, so the
// passenger app's own deploy from this same folder is never affected. The
// default build (unset) is unchanged: both entries, index.html = passenger app.
const fleetOnly = process.env.BUILD_TARGET === 'fleet'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    fleetOnly && {
      name: 'fleet-html-as-index',
      closeBundle() {
        const dist = fileURLToPath(new URL('./dist', import.meta.url))
        if (existsSync(`${dist}/fleet.html`)) {
          renameSync(`${dist}/fleet.html`, `${dist}/index.html`)
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      // Vendored Claude Design export (read-only). Fleet dashboard consumes it.
      '@ds': fileURLToPath(new URL('../design-system', import.meta.url)),
    },
    // The design-system/ sources live outside frontend/, so bare `react` imports
    // from them must resolve to this app's single copy. dedupe forces that.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    // Allow serving the sibling design-system/ dir (outside frontend root).
    fs: { allow: ['..'] },
  },
  build: {
    rollupOptions: {
      input: fleetOnly
        ? { fleet: fileURLToPath(new URL('./fleet.html', import.meta.url)) }
        : {
            main: fileURLToPath(new URL('./index.html', import.meta.url)),
            fleet: fileURLToPath(new URL('./fleet.html', import.meta.url)),
          },
    },
  },
})
