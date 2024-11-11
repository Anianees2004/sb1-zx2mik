/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_EMAIL_SERVICE: string
  readonly VITE_EMAIL_FROM: string
  readonly VITE_SMS_SERVICE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}