import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import ModeSwitchController from '@/components/ModeSwitchController'

export const dynamic = 'force-dynamic'

const EQUIP_ALL = ['none','barbell','dumbbell','machine','cable','kettlebell'] as const
type Equip = typeof EQUIP_ALL[number]

type ExerciseListItem = {
  id: string
  title: string
  equipment: Equip | string
  level: string | null
  target_subregion: string | null
  exercise_media?: { url_thumb: string | null }[]
}

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const rawMode = sp?.mode
  const mode: 'home' | 'gym' =
    (Array.isArray(rawMode) ? rawMode[0] : rawMode) === 'home' ? 'home' : 'gym'

  const rawMuscle = sp?.muscle
  const muscle = (Array.isArray(rawMuscle) ? rawMuscle[0] : rawMuscle) || 'chest_mid'

  const allowed: string[] = mode === 'home' ? ['none'] : [...EQUIP_ALL]

  const { data, error } = await supabase
    .from('exercises')
    .select(`
      id, title, equipment, level, target_subregion,
      exercise_media ( url_thumb )
    `)
    .eq('primary_muscle_id', muscle)
    .in('equipment', allowed)
    .order('title', { ascending: true })

  if (error) {
    return <div className="p-4">Ошибка загрузки упражнений</div>
  }

  const list = (data ?? []) as ExerciseListItem[]

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Упражнения</div>
        <ModeSwitchController value={mode} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {list.map((x) => (
          <Link
            key={x.id}
            href={`/exercise/${x.id}?mode=${mode}`}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow"
          >
            <div className="relative w-full aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
              {x.exercise_media?.[0]?.url_thumb ? (
                <Image
                  src={x.exercise_media[0].url_thumb}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs opacity-60">
                  нет превью
                </div>
              )}
            </div>
            <div className="p-2">
              <div className="text-sm font-medium leading-tight">{x.title}</div>
              <div className="text-xs opacity-70">
                {x.target_subregion ? `зона: ${x.target_subregion} · ` : ''}
                инвентарь: {x.equipment}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
