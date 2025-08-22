import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const EQUIP_ALL = ['none','barbell','dumbbell','machine','cable','kettlebell'] as const
type Equip = typeof EQUIP_ALL[number]

type Day = { id: string; title: string | null; day_index: number | null }
type ExerciseMedia = { url_thumb: string | null }
type ExerciseRow = {
  id: string
  title: string
  equipment: Equip | string
  exercise_media?: ExerciseMedia[]
}
type JoinedItem = {
  default_sets: number | null
  default_reps: string | null
  notes: string | null
  exercises: ExerciseRow | null
}

export default async function ProgramPage({
  params, searchParams
}:{ params:{ id:string }, searchParams:{ mode?: 'home'|'gym' } }) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const allowed = mode === 'home' ? (['none'] as readonly Equip[]) : EQUIP_ALL

  const { data: daysData } = await supabase
    .from('program_days')
    .select('id, title, day_index')
    .eq('program_id', params.id)
    .order('day_index', { ascending: true })

  const days = (daysData ?? []) as Day[]
  const result: { day: Day; exercises: JoinedItem[] }[] = []

  for (const d of days) {
    const { data: items } = await supabase
      .from('program_day_exercises')
      .select(`
        default_sets, default_reps, notes,
        exercises:exercise_id ( id, title, equipment, exercise_media ( url_thumb ) )
      `)
      .eq('program_day_id', d.id)

    const rows = (items ?? []) as JoinedItem[]
    const visible = rows.filter((it) => {
      const eq = it.exercises?.equipment as Equip | undefined
      return it.exercises && eq ? allowed.includes(eq) : false
    })

    result.push({ day: d, exercises: visible })
  }

  return (
    <div style={{ padding: 16 }}>
      <Link href={`/programs?mode=${mode}`}>← Назад</Link>
      <h2 style={{ marginTop: 8 }}>Программа</h2>

      {result.map(({ day, exercises }) => (
        <div key={day.id} style={{ margin:'12px 0', padding:'12px', border:'1px solid #eee', borderRadius:8 }}>
          <h3 style={{ marginTop: 0 }}>{day.title || (day.day_index ? `День ${day.day_index}` : 'День')}</h3>
          <ul style={{ listStyle:'none', padding:0 }}>
            {exercises.map((it, i) => (
              <li key={i} style={{ margin:'8px 0', display:'flex', gap:12, alignItems:'center' }}>
                {it.exercises?.exercise_media?.[0]?.url_thumb && (
                  <img
                    src={it.exercises.exercise_media[0].url_thumb || ''}
                    width={56}
                    height={56}
                    style={{ borderRadius:8, objectFit:'cover' }}
                    alt=""
                  />
                )}
                <div>
                  <div style={{ fontWeight:600 }}>{it.exercises?.title}</div>
                  <div style={{ fontSize:12, opacity:.7 }}>
                    {it.default_sets}×{it.default_reps}{it.notes ? ` · ${it.notes}` : ''}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
