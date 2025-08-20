import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const EQUIP_ALL = ['none','barbell','dumbbell','machine','cable','kettlebell']

export default async function ProgramPage({ params, searchParams }:{
  params:{ id:string }, searchParams:{ mode?: 'home'|'gym' }
}) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const allowed = mode === 'home' ? ['none'] : EQUIP_ALL

  const { data: days } = await supabase
    .from('program_days')
    .select('id, title, day_index')
    .eq('program_id', params.id)
    .order('day_index')

  const result:{ day:any, exercises:any[] }[] = []

  for (const d of (days ?? [])) {
    const { data: items } = await supabase
      .from('program_day_exercises')
      .select(`
        default_sets, default_reps, notes,
        exercises:exercise_id ( id, title, equipment,
          exercise_media ( url_thumb )
        )
      `)
      .eq('program_day_id', d.id)

    const visible = (items ?? []).filter((it:any)=> allowed.includes(it.exercises?.equipment || 'none'))
    result.push({ day:d, exercises:visible })
  }

  return (
    <div style={{ padding:16 }}>
      <Link href={`/programs?mode=${mode}`}>← Назад</Link>
      <h2 style={{ marginTop:8 }}>Программа</h2>

      {(result ?? []).map(({day,exercises}, idx) => (
        <div key={day.id} style={{ margin:'12px 0', padding:'12px', border:'1px solid #eee', borderRadius:8 }}>
          <h3 style={{ marginTop:0 }}>{day.title || `День ${day.day_index}`}</h3>
          <ul style={{ listStyle:'none', padding:0 }}>
            {exercises.map((it:any, i:number) => (
              <li key={i} style={{ margin:'8px 0', display:'flex', gap:12, alignItems:'center' }}>
                {it.exercises?.exercise_media?.[0]?.url_thumb && (
                  <img src={it.exercises.exercise_media[0].url_thumb} width={56} height={56} style={{ borderRadius:8, objectFit:'cover' }} alt=""/>
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
