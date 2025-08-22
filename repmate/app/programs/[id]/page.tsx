// app/exercise/[id]/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

// В Next 15 params может быть Promise, поэтому берём props: any и await params
export default async function ExercisePage(props: any) {
  const { id } = await props.params
  const mode = (props.searchParams?.mode || 'home') as 'home' | 'gym'

  const { data, error } = await supabase
    .from('exercises')
    .select(`
      id, title, equipment, level, target_subregion, primary_muscle_id, howto,
      exercise_media ( url_mp4, url_thumb )
    `)
    .eq('id', id)
    .limit(1)

  if (error) {
    return <div style={{ padding: 16 }}>Ошибка загрузки упражнения</div>
  }

  const ex = (data ?? [])[0] as ExerciseDetail | undefined
  if (!ex) return <div style={{ padding: 16 }}>Не найдено</div>

  return (
    <div style={{ padding: 16 }}>
      <Link href={`/exercises?mode=${mode}&muscle=${ex.primary_muscle_id || ''}`}>← Назад</Link>
      <h2 style={{ marginTop: 8 }}>{ex.title}</h2>

      {ex.exercise_media?.[0]?.url_mp4 && (
        <video
          src={ex.exercise_media[0].url_mp4 || undefined}
          autoPlay
          loop
          muted
          playsInline
          poster={ex.exercise_media[0].url_thumb || undefined}
          style={{ width: '100%', borderRadius: 12, margin: '12px 0' }}
        />
      )}

      <p><b>Целевая зона:</b> {ex.target_subregion || '—'}</p>
      <p><b>Инвентарь:</b> {ex.equipment}</p>
      <div>
        <b>Техника:</b>
        <ul>
          {(ex.howto ?? []).map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  )
}
