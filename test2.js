const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const supabaseKeyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

if (supabaseUrlMatch && supabaseKeyMatch) {
  const supabase = createClient(supabaseUrlMatch[1], supabaseKeyMatch[1]);
  async function run() {
    try {
      console.log('--- DB Profiles ---')
      const { data: pData } = await supabase.from('profiles').select('id, email, company_id, is_admin');
      console.log(pData);
      console.log('--- Campaigns ---')
      const { data: cData } = await supabase.from('campaigns').select('id, status, company_id');
      console.log(cData);
      console.log('--- Ads ---');
      const { data: aData } = await supabase.from('video_ads').select('id, status, company_id, campaign_id');
      console.log(aData);
    } catch (err) {
      console.error(err);
    }
  }
  run();
}
