const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
    const adId = '3680ec4a-623a-4189-b244-d932f842b3a3';
    const campaignId = '3691b168-6c2a-4f60-97cf-ad801a2ffbef';

    console.log('Testing delete for:', { adId, campaignId });

    // 1. Check if ad exists
    const { data: watchAd, error: watchErr } = await supabase
        .from('video_ads')
        .select('id, campaign_id, title')
        .eq('id', adId);

    console.log('Ad exists:', watchAd, 'Error:', watchErr);

    // 2. Test deletion explicitly
    const { data: delData, error: delErr } = await supabase
        .from('video_ads')
        .delete()
        .eq('id', adId)
        .eq('campaign_id', campaignId)
        .select();

    console.log('Deleted Data:', delData, 'Delete Error:', delErr);
}

testDelete();
