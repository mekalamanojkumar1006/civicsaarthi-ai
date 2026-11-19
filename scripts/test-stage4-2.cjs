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

console.log('=== CivicSaarthi AI – Stage 4.2 Authentication & Profiles Verification ===\n');

// 1. Migration for profiles table
const migProfilesPath = path.join(rootDir, 'supabase/migrations/20261119000004_citizen_profiles.sql');
assert(fs.existsSync(migProfilesPath), 'Migration file 20261119000004_citizen_profiles.sql exists');

const migProfiles = fs.readFileSync(migProfilesPath, 'utf8');
assert(migProfiles.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'profiles table definition exists');
assert(migProfiles.includes('id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE'), 'profiles.id references auth.users with cascade delete');
assert(migProfiles.includes('full_name TEXT'), 'profiles contains full_name column');
assert(migProfiles.includes('phone TEXT'), 'profiles contains phone column');
assert(migProfiles.includes('date_of_birth DATE'), 'profiles contains date_of_birth column');
assert(migProfiles.includes('state TEXT'), 'profiles contains state column');
assert(migProfiles.includes('district TEXT'), 'profiles contains district column');
assert(migProfiles.includes('preferred_language TEXT DEFAULT \'en\''), 'profiles contains preferred_language column');
assert(migProfiles.includes('created_at TIMESTAMPTZ'), 'profiles contains created_at column');
assert(migProfiles.includes('updated_at TIMESTAMPTZ'), 'profiles contains updated_at column');
assert(migProfiles.includes('handle_new_user()'), 'Trigger function handle_new_user() defined for automatic signup provisioning');
assert(migProfiles.includes('on_auth_user_created'), 'Trigger on_auth_user_created bound to auth.users AFTER INSERT');
assert(migProfiles.includes('set_profiles_updated_at'), 'Trigger set_profiles_updated_at bound to public.profiles BEFORE UPDATE');

// 2. Row Level Security Policies
assert(migProfiles.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'), 'Row Level Security explicitly enabled on public.profiles');
assert(migProfiles.includes('CREATE POLICY "Users can view own profile"'), 'RLS policy: Users can view own profile defined');
assert(migProfiles.includes('USING (auth.uid() = id)'), 'SELECT policy enforces auth.uid() = id');
assert(migProfiles.includes('CREATE POLICY "Users can update own profile"'), 'RLS policy: Users can update own profile defined');
assert(migProfiles.includes('WITH CHECK (auth.uid() = id)'), 'UPDATE policy enforces auth.uid() = id');
assert(migProfiles.includes('CREATE POLICY "Users can insert own profile"'), 'RLS policy: Users can insert own profile defined');

// 3. AuthContext Implementation
const authCtxPath = path.join(rootDir, 'src/context/AuthContext.tsx');
const authCtx = fs.readFileSync(authCtxPath, 'utf8');
assert(authCtx.includes('signIn = async'), 'AuthContext implements signIn method');
assert(authCtx.includes('signUp = async'), 'AuthContext implements signUp method');
assert(authCtx.includes('signOut = async'), 'AuthContext implements signOut method');
assert(authCtx.includes('updateProfile = async'), 'AuthContext implements updateProfile method');
assert(authCtx.includes('onAuthStateChange'), 'AuthContext binds onAuthStateChange listener');
assert(authCtx.includes('flowType: \'pkce\'') || fs.readFileSync(path.join(rootDir, 'src/lib/supabase.ts'), 'utf8').includes('flowType: \'pkce\''), 'Configured PKCE auth flow for browser security');

// 4. Connected UI Pages
const loginPath = path.join(rootDir, 'src/pages/LoginPage.tsx');
const loginCode = fs.readFileSync(loginPath, 'utf8');
assert(loginCode.includes('signIn({ email, password })'), 'LoginPage calls real signIn');
assert(loginCode.includes('showPassword'), 'LoginPage includes password visibility toggle');
assert(loginCode.includes('disabled={loading}'), 'LoginPage disables submit button during loading');

const regPath = path.join(rootDir, 'src/pages/RegisterPage.tsx');
const regCode = fs.readFileSync(regPath, 'utf8');
assert(regCode.includes('signUp({'), 'RegisterPage calls real signUp');
assert(regCode.includes('dateOfBirth'), 'RegisterPage passes dateOfBirth');
assert(regCode.includes('district'), 'RegisterPage passes district');
assert(regCode.includes('password.length < 6'), 'RegisterPage validates minimum password length');
assert(regCode.includes('agreeTerms'), 'RegisterPage validates terms agreement');

// 5. Route Protection
const routesPath = path.join(rootDir, 'src/routes/AppRoutes.tsx');
const routesCode = fs.readFileSync(routesPath, 'utf8');
assert(routesCode.includes('PublicOnlyRoute'), 'AppRoutes guards /login and /register with PublicOnlyRoute');
assert(routesCode.includes('ProtectedRoute'), 'AppRoutes guards citizen portal routes with ProtectedRoute');
assert(routesCode.includes('<Route path="/" element={<HomePage />} />'), 'Public landing page accessible without login');

// 6. Demo Mode Separation
const appCtxPath = path.join(rootDir, 'src/context/AppContext.tsx');
const appCtx = fs.readFileSync(appCtxPath, 'utf8');
assert(appCtx.includes('isDemoProfile'), 'AppContext explicitly tracks isDemoProfile');
assert(appCtx.includes('isDatabaseSynced'), 'AppContext explicitly tracks isDatabaseSynced');

const profilePagePath = path.join(rootDir, 'src/pages/ProfilePage.tsx');
const profileCode = fs.readFileSync(profilePagePath, 'utf8');
assert(profileCode.includes('Supabase Account Active'), 'ProfilePage displays Supabase active status when authenticated');
assert(profileCode.includes('Demonstration Profile Active'), 'ProfilePage displays Demonstration Profile Active banner when in demo mode');

console.log(`\n==========================================`);
console.log(`Stage 4.2 Results: ${passed} Passed, ${failed} Failed`);
console.log(`==========================================`);

if (failed > 0) {
  process.exit(1);
}
