// app/exercise/[id]/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import TGBackButton from '@/components/TGBackButton'

type ExerciseDetail = {
  id: string
  title: string
  equipment: string
  level: string | null
  target_subregion: string | null
  primary_muscle_id: string | null
  howto: string[] | null
  exercise_media?: { url_mp4: string | null; url_thumb: string | null }[]
}

// В Next 15 params/searchParams могут приходить как Promise — ждём их через await
export default async function ExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const sp = (await searchParams) || {}

  const rawMode = sp.mode
  const mode: 'home' | 'gym' =
    (Array.isArray(rawMode) ? rawMode[0] : rawMode) === 'home' ? 'home' : 'gym'

  const { data, error } = await supabase
    .from('exercises')
    .select(`
      id, title, equipment, level, target_subregion, primary_muscle_id, howto,
      exercise_media ( url_mp4, url_thumb )
    `)
    .eq('id', id)
    .limit(1)

  if (error) {
    return <div className="p-4">Ошибка загрузки упражнения</div>
  }

  const ex = (data ?? [])[0] as ExerciseDetail | undefined
  if (!ex) return <div className="p-4">Не найдено</div>

  return (
    <div className="p-4">
      {/* Телеграм-кнопка «Назад» + наш дубль */}
      <div className="mb-2"><TGBackButton /></div>

      {/* Дополнительная «скрытая» ссылка-назад для доступности */}
      <Link
        href={`/exercises?mode=${mode}&muscle=${ex.primary_muscle_id || ''}`}
        className="sr-only"
      >
        Назад
      </Link>

      <h2 className="text-xl font-semibold mb-2">{ex.title}</h2>

      {ex.exercise_media?.[0]?.url_mp4 ? (
        <video
          src={ex.exercise_media[0].url_mp4 || undefined}
          autoPlay
          loop
          muted
          playsInline
          poster={ex.exercise_media[0].url_thumb || undefined}
          style={{ width: '100%', borderRadius: 12, margin: '12px 0' }}
        />
      ) : (
        <div className="w-full aspect-video rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-sm opacity-60 mb-3">
          видео недоступно
        </div>
      )}

      <p><b>Целевая зона:</b> {ex.target_subregion || '—'}</p>
      <p><b>Инвентарь:</b> {ex.equipment}</p>

      <div className="mt-2">
        <b>Техника:</b>
        <ul className="list-disc pl-5">
          {(ex.howto ?? []).map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  )
}
