// debug-db.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // 1. Check a campaign to see if company_id is null
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, title, company_id, companies(name)');

    console.log('Campaigns:', JSON.stringify(campaigns, null, 2));

    // 2. Check companies
    const { data: companies, error: compError } = await supabase
        .from('companies')
        .select('id, name');

    console.log('Companies error:', compError);
    console.log('Companies:', JSON.stringify(companies, null, 2));
}

check();
