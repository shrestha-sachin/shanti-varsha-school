import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kzpyvpfxogvvmliwocsy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cHl2cGZ4b2d2dm1saXdvY3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjEyNTAsImV4cCI6MjA4OTE5NzI1MH0.hNfDW66wnIKltVM4s0W3J4y0DU_J5NhySxNHwrYSVxI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
