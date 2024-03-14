import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'my-element',
      entry: 'src/my-element.js',
      formats: ['es'],
    },
  },
});