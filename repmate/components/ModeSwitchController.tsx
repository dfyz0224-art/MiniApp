// repmate/components/ModeSwitchController.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ModeSwitchController({ value }: { value: 'home' | 'gym' }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const toggle = () => {
    const next = value === 'home' ? 'gym' : 'home'
    const params = new URLSearchParams(sp.toString())
    params.set('mode', next)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm ${value === 'home' ? 'font-semibold' : 'opacity-70'}`}>Дом</span>
      <button
        type="button"
        onClick={toggle}
        aria-label="Переключить режим"
        className="relative inline-flex h-7 w-14 items-center rounded-full bg-neutral-300 dark:bg-neutral-700 transition"
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition
          ${value === 'gym' ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </button>
      <span className={`text-sm ${value === 'gym' ? 'font-semibold' : 'opacity-70'}`}>Зал</span>
    </div>
  )
}
