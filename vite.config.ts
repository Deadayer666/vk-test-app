import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Дополнительные опции для плагина React, если нужны.
      // Обычно для декораторов этого достаточно, так как Babel используется по умолчанию
      // для обработки JSX и трансформаций ESNext синтаксиса.
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { 'legacy': true }],
          ['@babel/plugin-proposal-class-properties', { 'loose': true }],
        ],
      },
    }),
  ],
});