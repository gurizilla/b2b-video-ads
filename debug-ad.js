const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Using the ACTUAL service role key that was added to .env.local recently
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAd() {
    const adId = '3680ec4a-623a-4189-b244-d932f842b3a3';

    const { data, error } = await supabase
        .from('video_ads')
        .select('*')
        .eq('id', adId);

    console.log('Video Ad from Admin view:', data);
}

checkAd();
