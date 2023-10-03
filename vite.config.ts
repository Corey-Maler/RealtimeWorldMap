import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'RWM',
      fileName: (format) => `rwm.${format}.js`,
    },
  },
});