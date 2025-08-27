import { supabase } from '@/lib/supabase'
import MusclesGridClient from './MusclesGridClient'
type Muscle = { id: string; name: string; group: string; subregion: string | null }

export const dynamic = 'force-dynamic'

export default async function MusclesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const rawMode = sp?.mode
  const mode: 'home' | 'gym' =
    (Array.isArray(rawMode) ? rawMode[0] : rawMode) === 'home' ? 'home' : 'gym'

  const { data, error } = await supabase
    .from('muscles')
    .select('id,name,"group",subregion')
    .order('group', { ascending: true })

  if (error) return <div className="p-4">Ошибка загрузки групп мышц</div>
  return <MusclesGridClient muscles={(data ?? []) as Muscle[]} initialMode={mode} />
}
