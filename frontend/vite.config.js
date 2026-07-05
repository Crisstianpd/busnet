import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
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
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        fleet: fileURLToPath(new URL('./fleet.html', import.meta.url)),
      },
    },
  },
})
