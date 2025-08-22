'use client'
import { useEffect, useState } from 'react'

type Props = { value: 'home' | 'gym'; onChange: (v: 'home' | 'gym') => void }

export default function ModeSwitch({ value, onChange }: Props) {
  const [v, setV] = useState<'home' | 'gym'>(value)
  useEffect(() => setV(value), [value])

  const toggle = () => {
    const nv = v === 'home' ? 'gym' : 'home'
    setV(nv)
    onChange(nv)
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm ${v === 'home' ? 'font-semibold' : 'opacity-70'}`}>Дом</span>
      <button
        type="button"
        onClick={toggle}
        aria-label="Переключить режим"
        className="relative inline-flex h-7 w-14 items-center rounded-full bg-neutral-300 dark:bg-neutral-700 transition"
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition
          ${v === 'gym' ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </button>
      <span className={`text-sm ${v === 'gym' ? 'font-semibold' : 'opacity-70'}`}>Зал</span>
    </div>
  )
}
