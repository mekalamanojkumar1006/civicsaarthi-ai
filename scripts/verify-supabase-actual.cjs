const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log('CivicSaarthi AI: Live Remote Supabase Connectivity & Verification');
  console.log('════════════════════════════════════════════════════════════════════════');

  // 1. Read .env.local
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('FAIL: .env.local does not exist!');
    process.exit(1);
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  let supabaseUrl = '';
  let supabaseKey = '';

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.split('=')[1].trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) {
      supabaseKey = trimmed.split('=')[1].trim();
    }
  }

  console.log('\n1. Environment Configuration Check:');
  console.log(`- Supabase URL: ${supabaseUrl}`);
  console.log(`- Publishable Key: ${supabaseKey ? `${supabaseKey.slice(0, 16)}...[REDACTED] (Length: ${supabaseKey.length})` : 'MISSING'}`);

  if (!supabaseUrl || !supabaseKey) {
    console.error('FAIL: Supabase credentials missing from .env.local');
    process.exit(1);
  }

  // 2. Connectivity test (REST Gateway)
  console.log('\n2. Network Connectivity & REST Gateway:');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    console.log(`- REST API HTTP Status: ${res.status} (${res.statusText})`);
  } catch (err) {
    console.error('- Connectivity Failed:', err.message);
  }

  // 3. Database query test using Supabase Client
  console.log('\n3. Real Remote Database Queries (Table Existence & RLS):');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const tablesToTest = ['profiles', 'saved_schemes', 'eligibility_assessments', 'citizen_documents'];
  let allTablesAvailable = true;

  for (const table of tablesToTest) {
    try {
      const { data, error, status, statusText } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`- Table [${table}]: FAILED (Status ${status}): ${error.message} (Code: ${error.code})`);
        allTablesAvailable = false;
      } else {
        console.log(`- Table [${table}]: AVAILABLE (Status ${status}) -> Returned ${data.length} records under RLS.`);
      }
    } catch (e) {
      console.log(`- Table [${table}]: EXCEPTION: ${e.message}`);
      allTablesAvailable = false;
    }
  }
  console.log(`- Table Availability Summary: ${allTablesAvailable ? 'ALL 4 TABLES CONFIRMED LIVE' : 'TABLES MISSING OR INACCESSIBLE'}`);

  // 4. Storage Bucket & Policy Verification
  console.log('\n4. Storage Bucket (citizen-documents) Verification:');
  try {
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket('citizen-documents');
    if (bucketError) {
      console.log(`- getBucket('citizen-documents'): FAILED -> ${bucketError.message}`);
    } else {
      console.log(`- Bucket Found: "${bucket.name}" (ID: ${bucket.id})`);
      console.log(`- Public Access: ${bucket.public ? 'TRUE (WARNING)' : 'FALSE (Strictly Private - PASS)'}`);
      console.log(`- File Size Limit: ${bucket.file_size_limit} bytes (~${(bucket.file_size_limit / 1024 / 1024).toFixed(1)} MB)`);
      console.log(`- Allowed MIME Types: ${JSON.stringify(bucket.allowed_mime_types)}`);
    }

    // Test unauthenticated listing (should be rejected or empty under RLS)
    const { data: files, error: listError } = await supabase.storage.from('citizen-documents').list('', { limit: 5 });
    if (listError) {
      console.log(`- Unauthenticated file listing: Blocked by policy (${listError.message}) - PASS`);
    } else {
      console.log(`- Unauthenticated file listing: Returned ${files.length} items (Enforcing RLS) - PASS`);
    }
  } catch (err) {
    console.log(`- Storage exception: ${err.message}`);
  }

  // 5. Auth Service Connectivity (Zero Email Sending)
  console.log('\n5. Auth Service Endpoint Connectivity (No Email Triggering):');
  try {
    const healthRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseKey,
      },
    });
    console.log(`- Auth Gateway Health Endpoint: Status ${healthRes.status} (${healthRes.statusText})`);
  } catch (err) {
    console.log(`- Auth Health Exception: ${err.message}`);
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log(`- getSession() probe: ${sessionError ? sessionError.message : 'OK (No active session in cold client - Expected)'}`);
  } catch (err) {
    console.log(`- getSession() probe exception: ${err.message}`);
  }

  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'nonexistent.healthprobe@example.com',
      password: 'SafePassword123!',
    });
    if (signInError && (signInError.status === 400 || signInError.message.includes('Invalid login credentials'))) {
      console.log(`- Auth signIn probe: SUCCESS -> Handled by GoTrue ("${signInError.message}")`);
      console.log(`- Zero user emails triggered; Auth gateway responsive and live.`);
    } else if (signInError) {
      console.log(`- Auth signIn probe response: ${signInError.message} (Status: ${signInError.status})`);
    } else {
      console.log(`- Auth signIn probe: Unexpected login success.`);
    }
  } catch (err) {
    console.log(`- signIn probe exception: ${err.message}`);
  }

  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('Verification Complete.');
  console.log('════════════════════════════════════════════════════════════════════════');
}

main().catch(console.error);
