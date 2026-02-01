
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Asegura que los archivos se encuentren sin importar la URL base
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
