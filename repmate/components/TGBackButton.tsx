// components/TGBackButton.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type TelegramBackButton = {
  show: () => void
  hide: () => void
  onClick: (cb: () => void) => void
  offClick: (cb: () => void) => void
}

type TelegramWebApp = {
  BackButton?: TelegramBackButton
}

type TelegramNamespace = {
  WebApp?: TelegramWebApp
}

declare global {
  interface Window {
    Telegram?: TelegramNamespace
  }
}

export default function TGBackButton({ className = '' }: { className?: string }) {
  const router = useRouter()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    const back = tg?.BackButton
    if (!back) return

    back.show()
    const handler = () => router.back()
    back.onClick(handler)

    return () => {
      try {
        back.offClick(handler)
        back.hide()
      } catch {}
    }
  }, [router])

  return (
    <button
      onClick={() => router.back()}
      aria-label="Назад"
      className={`inline-flex items-center gap-1 text-sm px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${className}`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
      <span>Назад</span>
    </button>
  )
}
