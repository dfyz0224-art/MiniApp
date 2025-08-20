import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function ProgramsPage({ searchParams }:{ searchParams:{ mode?: 'home'|'gym' } }) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const { data: programs } = await supabase.from('programs').select('*').order('title')
  return (
    <div style={{ padding:16 }}>
      <h2>Готовые тренировки</h2>
      <ul>
        {(programs ?? []).map(p => (
          <li key={p.id}><Link href={`/programs/${p.id}?mode=${mode}`}>{p.title}</Link></li>
        ))}
      </ul>
    </div>
  )
}
