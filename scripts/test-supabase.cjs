const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    failed++;
    console.error(`[FAIL] ${testName}: ${details}`);
  }
}

console.log('=== CivicSaarthi AI – Stage 4.1 Supabase Verification Suite ===\n');

// 1. Environment & Git Security
const gitignorePath = path.join(rootDir, '.gitignore');
const gitignore = fs.readFileSync(gitignorePath, 'utf8');
assert(gitignore.includes('.env\n') || gitignore.includes('.env\r\n'), '.gitignore explicitly excludes .env');
assert(gitignore.includes('!.env.example'), '.gitignore allows .env.example template');

const envExamplePath = path.join(rootDir, '.env.example');
const envExample = fs.readFileSync(envExamplePath, 'utf8');
assert(envExample.includes('VITE_SUPABASE_URL'), '.env.example contains VITE_SUPABASE_URL');
assert(envExample.includes('VITE_SUPABASE_PUBLISHABLE_KEY'), '.env.example contains VITE_SUPABASE_PUBLISHABLE_KEY');
assert(!envExample.includes('VITE_SUPABASE_SERVICE_ROLE') && !envExample.includes('SERVICE_ROLE_KEY='), '.env.example strictly omits service_role key definition');

// 2. Client & Type Definitions
const clientPath = path.join(rootDir, 'src/lib/supabase.ts');
const clientCode = fs.readFileSync(clientPath, 'utf8');
assert(clientCode.includes('createClient'), 'Supabase client uses official createClient');
assert(clientCode.includes('VITE_SUPABASE_PUBLISHABLE_KEY'), 'Supabase client reads VITE_SUPABASE_PUBLISHABLE_KEY');
assert(clientCode.includes('validateSupabaseConfig'), 'Supabase client exports validateSupabaseConfig');
assert(clientCode.includes('isSupabaseConfigured'), 'Supabase client exports isSupabaseConfigured guard');
assert(clientCode.includes('getSupabaseConfigStatus'), 'Supabase client exports getSupabaseConfigStatus helper');

// Check NO Next.js files
assert(!fs.existsSync(path.join(rootDir, 'middleware.ts')), 'NO Next.js middleware.ts exists');
assert(!fs.existsSync(path.join(rootDir, 'src/middleware.ts')), 'NO src/middleware.ts exists');
assert(!fs.existsSync(path.join(rootDir, 'src/utils/supabase/server.ts')), 'NO Next.js server cookie helper exists');

const typesPath = path.join(rootDir, 'src/types/supabase.ts');
const typesCode = fs.readFileSync(typesPath, 'utf8');
assert(typesCode.includes('profiles'), 'Type definition includes profiles table');
assert(typesCode.includes('saved_schemes'), 'Type definition includes saved_schemes table');
assert(typesCode.includes('eligibility_assessments'), 'Type definition includes eligibility_assessments table');
assert(typesCode.includes('citizen_documents'), 'Type definition includes citizen_documents table');

// 3. Database Migrations
const mig1Path = path.join(rootDir, 'supabase/migrations/20261119000001_initial_schema.sql');
const mig1 = fs.readFileSync(mig1Path, 'utf8');
assert(mig1.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'Migration 1 defines profiles table');
assert(mig1.includes('CREATE TABLE IF NOT EXISTS public.saved_schemes'), 'Migration 1 defines saved_schemes table');
assert(mig1.includes('CREATE TABLE IF NOT EXISTS public.eligibility_assessments'), 'Migration 1 defines eligibility_assessments table');
assert(mig1.includes('CREATE TABLE IF NOT EXISTS public.citizen_documents'), 'Migration 1 defines citizen_documents table');
assert(mig1.includes('handle_new_user'), 'Migration 1 includes auth.users signup profile trigger');
assert(mig1.includes('handle_updated_at'), 'Migration 1 includes updated_at trigger');

const mig2Path = path.join(rootDir, 'supabase/migrations/20261119000002_row_level_security.sql');
const mig2 = fs.readFileSync(mig2Path, 'utf8');
assert(mig2.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY'), 'Migration 2 enables RLS on profiles');
assert(mig2.includes('ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY'), 'Migration 2 enables RLS on saved_schemes');
assert(mig2.includes('ALTER TABLE public.eligibility_assessments ENABLE ROW LEVEL SECURITY'), 'Migration 2 enables RLS on eligibility_assessments');
assert(mig2.includes('ALTER TABLE public.citizen_documents ENABLE ROW LEVEL SECURITY'), 'Migration 2 enables RLS on citizen_documents');
assert(mig2.includes('auth.uid() = id'), 'Profiles policy checks auth.uid() = id');
assert(mig2.includes('auth.uid() = user_id'), 'Saved schemes policy checks auth.uid() = user_id');

const mig3Path = path.join(rootDir, 'supabase/migrations/20261119000003_storage_bucket.sql');
const mig3 = fs.readFileSync(mig3Path, 'utf8');
assert(mig3.includes("'citizen-documents'"), "Migration 3 configures 'citizen-documents' bucket");
assert(mig3.includes('false'), "Migration 3 sets bucket public = false");
assert(mig3.includes('storage.foldername(name)'), "Migration 3 enforces user folder isolation");

// 4. Storage Service
const storagePath = path.join(rootDir, 'src/services/storageService.ts');
const storageCode = fs.readFileSync(storagePath, 'utf8');
assert(storageCode.includes('getIsolatedPath'), 'Storage service has isolated path helper');
assert(storageCode.includes('createSignedUrl'), 'Storage service creates signed URLs for private downloads');

// 5. Auth Context & Components
const authCtxPath = path.join(rootDir, 'src/context/AuthContext.tsx');
const authCtx = fs.readFileSync(authCtxPath, 'utf8');
assert(authCtx.includes('signInWithPassword'), 'AuthContext implements email/password sign-in');
assert(authCtx.includes('signUp'), 'AuthContext implements email/password sign-up');
assert(authCtx.includes('signOut'), 'AuthContext implements sign-out');
assert(authCtx.includes('onAuthStateChange'), 'AuthContext listens to session changes');

const protRoutePath = path.join(rootDir, 'src/components/common/ProtectedRoute.tsx');
const protRoute = fs.readFileSync(protRoutePath, 'utf8');
assert(protRoute.includes('ProtectedRoute'), 'ProtectedRoute component implemented');
assert(protRoute.includes('PublicOnlyRoute'), 'PublicOnlyRoute component implemented');

console.log(`\n==========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`==========================================`);

if (failed > 0) {
  process.exit(1);
}
