'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ModeSwitch from './ModeSwitch'

export default function ModeSwitchController({ value }: { value: 'home' | 'gym' }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  return (
    <ModeSwitch
      value={value}
      onChange={(nv) => {
        const params = new URLSearchParams(sp.toString())
        params.set('mode', nv)
        router.replace(`${pathname}?${params.toString()}`)
      }}
    />
  )
}
