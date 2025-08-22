// app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type TelegramBackButton = { hide: () => void; show: () => void }
type TelegramWebApp = { initData?: string; ready: () => void; BackButton: TelegramBackButton }
type TelegramNamespace = { WebApp?: TelegramWebApp }

declare global {
  interface Window { Telegram?: TelegramNamespace }
}

export default function Home() {
  const [mode, setMode] = useState<'home' | 'gym'>('home')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return
    tg.ready()
    tg.BackButton.hide()
    setReady(true)

    // опционально: проверка initData (серверный роут уже есть)
    if (tg.initData) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: tg.initData })
      }).then(r => r.json()).then(res => {
        if (!res.ok) console.warn('initData invalid')
      })
    }
  }, [])

  if (!ready) return <div style={{ padding: 16 }}>Загрузка…</div>

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>RepMate</h1>
      <p>Выбери режим занятий:</p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setMode('home')}>Дом (без инвентаря)</button>
        <button onClick={() => setMode('gym')}>Зал</button>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <Link href={`/muscles?mode=${mode}`}>Группы мышц →</Link>
        <Link href={`/programs?mode=${mode}`}>Готовые тренировки →</Link>
      </div>
    </div>
  )
}
