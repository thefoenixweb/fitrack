    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
     import tailwindcss from 'tailwindcss';

    export default defineConfig({
      plugins: [react()],
      // Remove the inline PostCSS config and use a postcss.config.js file instead
    });