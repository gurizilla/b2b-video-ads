// test-db.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the service role key to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
    console.log('Fetching campaigns...');
    const { data, error } = await supabase
        .from('campaigns')
        .select(`
        *, 
        profiles(email)
    `);

    if (error) {
        console.error('Error fetching campaigns:', error);
        return;
    }

    console.log(`Found ${data.length} campaigns:`);
    console.log(JSON.stringify(data, null, 2));
}

checkDb();
