// repmate/app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    tg?.ready?.()
    tg?.BackButton?.hide?.()
    setReady(true)
  }, [])

  if (!ready) return <div className="p-4">Загрузка…</div>

  return (
    <div className="p-4">
      <h1 className="mt-0">RepMate</h1>
      <p>Выбери режим занятий:</p>
      <div className="flex gap-3 mb-4">
        <Link href="/muscles?mode=home" className="px-3 py-2 rounded-xl border">Дом (без инвентаря)</Link>
        <Link href="/muscles?mode=gym" className="px-3 py-2 rounded-xl border">Зал</Link>
      </div>
      <div className="grid gap-2">
        <Link href="/muscles?mode=gym" className="underline">Группы мышц →</Link>
        <Link href="/programs?mode=gym" className="underline">Готовые тренировки →</Link>
      </div>
    </div>
  )
}
