// app/muscles/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Muscle = { id: string; name: string; group: string; subregion: string | null }

export default async function MusclesPage({ searchParams }:{ searchParams: { mode?: 'home'|'gym' } }) {
  const mode = (searchParams.mode || 'home') as 'home'|'gym'
  const { data } = await supabase.from('muscles').select('*').order('group', { ascending: true })
  const muscles = (data ?? []) as Muscle[]

  return (
    <div style={{ padding: 16 }}>
      <h2>Группы мышц</h2>
      <ul>
        {muscles.map(m => (
          <li key={m.id}>
            <Link href={`/exercises?mode=${mode}&muscle=${m.id}`}>{m.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
