const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: cData } = await supabase.from('campaigns').select('*');
  console.log('--- Campaigns (' + (cData ? cData.length : 0) + ') ---');
  console.log(cData);

  const { data: vData } = await supabase.from('video_ads').select('*');
  console.log('--- Video Ads (' + (vData ? vData.length : 0) + ') ---');
  console.log(vData);
}

run();
