import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const EQUIP_ALL = ['none','barbell','dumbbell','machine','cable','kettlebell']

export default async function ExercisesPage({
  searchParams
}:{ searchParams:{ mode?: 'home'|'gym', muscle?: string } }) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const muscle = searchParams.muscle || 'chest_mid'
  const allowed = mode === 'home' ? ['none'] : EQUIP_ALL

  const { data: list } = await supabase
    .from('exercises')
    .select(`
      id, title, equipment, level, target_subregion,
      exercise_media ( url_thumb )
    `)
    .eq('primary_muscle_id', muscle)
    .in('equipment', allowed)
    .order('title', { ascending: true })

  return (
    <div style={{ padding:16 }}>
      <h2>Упражнения</h2>
      <ul style={{ listStyle:'none', padding:0 }}>
        {(list ?? []).map((x:any) => (
          <li key={x.id} style={{ margin:'8px 0' }}>
            <Link href={`/exercise/${x.id}?mode=${mode}`}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                {x.exercise_media?.[0]?.url_thumb && (
                  <img src={x.exercise_media[0].url_thumb} alt="" width={64} height={64} style={{ borderRadius:8, objectFit:'cover' }}/>
                )}
                <div>
                  <div style={{ fontWeight:600 }}>{x.title}</div>
                  <div style={{ fontSize:12, opacity:.7 }}>
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
