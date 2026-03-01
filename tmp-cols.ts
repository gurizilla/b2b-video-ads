import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function getCols() {
    const { data, error } = await supabase.rpc('get_video_ads_columns')
    if (error) {
        // Fallback: just try to select company_id
        const { error: selectError } = await supabase.from('video_ads').select('company_id').limit(1)
        if (selectError) {
            console.log("no company_id column:", selectError.message)

            // Try fetching campaigns
            const { data: ads } = await supabase.from('video_ads').select('*, campaigns(company_id)').limit(1)
            console.log("video ads related schema:", ads)
        } else {
            console.log("company_id exists!")
        }
    }
}
getCols()
