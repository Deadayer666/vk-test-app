/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KINOPOISK_API_KEY: string;
  readonly VITE_KINOPOISK_BASE_URL: string;
  readonly VITE_USE_MOCK_DATA: string; 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}