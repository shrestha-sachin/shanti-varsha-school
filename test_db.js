import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error } = await supabase.from('school_toppers').select('*').limit(1)
  console.log(data, error)
  const { data: d2, error: e2 } = await supabase.from('school_toppers').select('*').order('display_order', {ascending:true}).limit(1)
  console.log("With display_order:", e2)
}
test()
