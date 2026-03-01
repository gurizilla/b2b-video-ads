import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function run() {
    console.log("Fetching video_ads...")
    const { data, error } = await supabase.from('video_ads').select('id, user_id, company_id, campaign_id')
    if (error) console.error(error)
    else console.log(JSON.stringify(data, null, 2))
}
run()
