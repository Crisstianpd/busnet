import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      include: /[\\/]src[\\/].*\.[jt]sx?$/,
      presets: [reactCompilerPreset()],
    })
  ],
  resolve: {
    alias: [
      {
        find: '@ds',
        replacement: fileURLToPath(new URL('../design-system', import.meta.url)),
      },
      {
        find: 'react/jsx-runtime',
        replacement: fileURLToPath(new URL('./node_modules/react/jsx-runtime.js', import.meta.url)),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: fileURLToPath(new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url)),
      },
      {
        find: 'react/compiler-runtime',
        replacement: fileURLToPath(new URL('./node_modules/react/compiler-runtime.js', import.meta.url)),
      },
      {
        find: 'react-dom/client',
        replacement: fileURLToPath(new URL('./node_modules/react-dom/client.js', import.meta.url)),
      },
      {
        find: 'react-dom',
        replacement: fileURLToPath(new URL('./node_modules/react-dom/index.js', import.meta.url)),
      },
      {
        find: 'react',
        replacement: fileURLToPath(new URL('./node_modules/react/index.js', import.meta.url)),
      },
    ],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
