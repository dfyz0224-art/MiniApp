// app/muscles/page.tsx
import { supabase } from '@/lib/supabase'
import MusclesGridClient from './MusclesGridClient'

type Muscle = { id: string; name: string; group: string; subregion: string | null }

// (опционально) всегда тянуть свежие данные из БД
export const dynamic = 'force-dynamic'

export default async function MusclesPage({
  searchParams,
}: {
  searchParams: { mode?: 'home' | 'gym' }
}) {
  const mode = (searchParams.mode || 'gym') as 'home' | 'gym'

  const { data, error } = await supabase
    .from('muscles')
    .select('id,name,"group",subregion')
    .order('group', { ascending: true })

  if (error) {
    // мягкий фолбэк
    return <div className="p-4">Ошибка загрузки групп мышц</div>
  }

  const muscles = (data ?? []) as Muscle[]
  return <MusclesGridClient muscles={muscles} initialMode={mode} />
}
