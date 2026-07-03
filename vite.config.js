import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is the modern build tool for React apps (replaces CRA / webpack for most teams).
// Angular analogy: this file is roughly your angular.json + a much faster ng serve.
export default defineConfig({
  plugins: [react()],
  test: {
    // Vitest config (Vite-native test runner, Jest-compatible API).
    globals: true,            // lets tests use describe/it/expect without imports
    environment: 'jsdom',     // simulates a browser DOM in Node, like Karma-less Angular tests
    setupFiles: './src/setupTests.js',
  },
});
