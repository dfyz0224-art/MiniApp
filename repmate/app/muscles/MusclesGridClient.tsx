'use client'
import Image from 'next/image'
import Link from 'next/link'
import TGBackButton from '@/components/TGBackButton'
import ModeSwitchController from '@/components/ModeSwitchController'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Muscle = { id: string; name: string; group: string; subregion: string | null }

const ICONS: Record<string, string> = {
  chest_upper: '/icons/muscles/chest.png',
  chest_mid:   '/icons/muscles/chest.png',
  chest_lower: '/icons/muscles/chest.png',
  back:        '/icons/muscles/back.png',
  legs:        '/icons/muscles/legs.png',
  shoulders:   '/icons/muscles/shoulders.png',
  arms:        '/icons/muscles/arms.png',
  core:        '/icons/muscles/core.png',
}

export default function MusclesGridClient({ muscles, initialMode }: { muscles: Muscle[]; initialMode: 'home'|'gym' }) {
  const sp = useSearchParams()
  const mode = (sp.get('mode') as 'home'|'gym') || initialMode

  // Хотим стабильный порядок: грудь, спина, плечи, руки, ноги, кор
  const order = ['chest','back','shoulders','arms','legs','core']
  const sorted = useMemo(
    () => [...muscles].sort((a,b)=> order.indexOf(a.group) - order.indexOf(b.group)),
    [muscles]
  )

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <TGBackButton />
        <ModeSwitchController value={mode} />
      </div>

      <h2 className="text-lg font-semibold mb-3">Группы мышц</h2>
      <div className="grid grid-cols-2 gap-3">
        {sorted.map(m => (
          <Link
            key={m.id}
            href={`/exercises?muscle=${m.id}&mode=${mode}`}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow"
          >
            <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900">
              <Image
                src={ICONS[m.id] || '/icons/muscles/placeholder.png'}
                alt={m.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="p-2 text-center text-sm font-medium">{m.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
