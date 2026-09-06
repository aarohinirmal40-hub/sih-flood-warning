import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface FloodReport {
  id: string
  name: string
  location: string
  issue: string
  details: string
  created_at: string
}

export async function fetchReports(): Promise<FloodReport[]> {
  const { data, error } = await supabase
    .from('flood_reports')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as FloodReport[]
}

export async function insertReport(report: Omit<FloodReport, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('flood_reports').insert(report)
  if (error) throw error
}
