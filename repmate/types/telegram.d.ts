// repmate/types/telegram.d.ts

export type TelegramBackButton = {
  show: () => void
  hide: () => void
  onClick: (cb: () => void) => void
  offClick: (cb: () => void) => void
}

export type TelegramWebApp = {
  BackButton?: TelegramBackButton
  ready?: () => void
  initData?: string
}

export type TelegramNamespace = {
  WebApp?: TelegramWebApp
}

// Глобально объявляем window.Telegram ОДИН раз
declare global {
  interface Window {
    Telegram?: TelegramNamespace
  }
}

export {}
