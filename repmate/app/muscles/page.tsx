import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function MusclesPage({ searchParams }:{ searchParams: { mode?: 'home'|'gym' } }) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const { data: muscles } = await supabase
    .from('muscles')
    .select('*')
    .order('group', { ascending: true })

  return (
    <div style={{ padding:16 }}>
      <h2>Группы мышц</h2>
      <ul>
        {(muscles ?? []).map(m => (
          <li key={m.id}>
            <Link href={`/exercises?mode=${mode}&muscle=${m.id}`}>{m.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
