import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function run() {
    console.log("Fetching policies...")
    const { data, error } = await supabase.from('pg_policies').select('*').limit(20)
    console.log("Policies:", data, error)
}
run()
