import { supabase } from '@/lib/supabase'
import MusclesGridClient from './MusclesGridClient'

export default async function MusclesPage({ searchParams }:{ searchParams:{ mode?: 'home'|'gym' } }) {
  const mode = (searchParams.mode || 'gym') as 'home'|'gym'
  const { data } = await supabase.from('muscles').select('*').order('group', { ascending: true })
  return <MusclesGridClient muscles={(data ?? []) as any[]} initialMode={mode} />
}
