// app/exercises/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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
  searchParams
}:{
  searchParams:{ mode?: 'home'|'gym', muscle?: string }
}) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const muscle = searchParams.muscle || 'chest_mid'
  const allowed = mode === 'home' ? ['none'] : EQUIP_ALL

  const { data } = await supabase
    .from('exercises')
    .select(`
      id, title, equipment, level, target_subregion,
      exercise_media ( url_thumb )
    `)
    .eq('primary_muscle_id', muscle)
    .in('equipment', allowed as string[])
    .order('title', { ascending: true })

  const list = (data ?? []) as ExerciseListItem[]

  return (
    <div style={{ padding: 16 }}>
      <h2>Упражнения</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {list.map(x => (
          <li key={x.id} style={{ margin: '8px 0' }}>
            <Link href={`/exercise/${x.id}?mode=${mode}`}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {x.exercise_media?.[0]?.url_thumb && (
                  // next/image даст только warning — не критично; оставлю <img>
                  <img
                    src={x.exercise_media[0].url_thumb || ''}
                    alt=""
                    width={64}
                    height={64}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 600 }}>{x.title}</div>
                  <div style={{ fontSize: 12, opacity: .7 }}>
                    {x.target_subregion ? `зона: ${x.target_subregion} · ` : ''}инвентарь: {x.equipment}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
