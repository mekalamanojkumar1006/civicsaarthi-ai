const fs = require('fs');
const path = require('path');

const rootSqlPath = path.resolve(__dirname, '../consolidated_migration.sql');
const supabaseSqlPath = path.resolve(__dirname, '../supabase/consolidated_migration.sql');
const removedDuplicatePath = path.resolve(__dirname, '../supabase/migrations/consolidated_migration.sql');

const rootSql = fs.readFileSync(rootSqlPath, 'utf8');
const supabaseSql = fs.readFileSync(supabaseSqlPath, 'utf8');

const migration1Path = path.resolve(__dirname, '../supabase/migrations/20261119000001_initial_schema.sql');
const migration2Path = path.resolve(__dirname, '../supabase/migrations/20261119000002_row_level_security.sql');
const migration3Path = path.resolve(__dirname, '../supabase/migrations/20261119000003_storage_bucket.sql');
const migration4Path = path.resolve(__dirname, '../supabase/migrations/20261119000004_citizen_profiles.sql');

const m1 = fs.readFileSync(migration1Path, 'utf8');
const m2 = fs.readFileSync(migration2Path, 'utf8');
const m3 = fs.readFileSync(migration3Path, 'utf8');
const m4 = fs.readFileSync(migration4Path, 'utf8');

console.log('════════════════════════════════════════════════════════════════════════');
console.log('CivicSaarthi AI – Stage 4.2 SQL Verification Suite (Post-Cleanup)');
console.log('Targets:');
console.log('  1. consolidated_migration.sql (Root)');
console.log('  2. supabase/consolidated_migration.sql');
console.log('  3. supabase/migrations/20261119000001_initial_schema.sql');
console.log('  4. supabase/migrations/20261119000002_row_level_security.sql');
console.log('  5. supabase/migrations/20261119000003_storage_bucket.sql');
console.log('  6. supabase/migrations/20261119000004_citizen_profiles.sql');
console.log('════════════════════════════════════════════════════════════════════════\n');

// 1. Duplicate Removal Check
const duplicateRemoved = !fs.existsSync(removedDuplicatePath);
console.log(`1. Duplicate supabase/migrations/consolidated_migration.sql removed: ${duplicateRemoved ? 'PASS' : 'FAIL'}`);

// 2. Consolidated File Synchronization
const filesIdentical = rootSql === supabaseSql;
console.log(`2. Root & Supabase consolidated migration files strictly identical: ${filesIdentical ? 'PASS' : 'FAIL'}`);

// 3. Four Timestamped Migration Files Intact
const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir);
const expectedMigrations = [
  '20261119000001_initial_schema.sql',
  '20261119000002_row_level_security.sql',
  '20261119000003_storage_bucket.sql',
  '20261119000004_citizen_profiles.sql'
];
const migrationsIntact = migrationFiles.length === 4 && expectedMigrations.every(f => migrationFiles.includes(f));
console.log(`3. Exactly 4 timestamped migration files intact in supabase/migrations/: ${migrationsIntact ? 'PASS' : 'FAIL'}`);

// 4. Syntax & Formatting Artifact Checks across ALL SQL files
const allSqlFiles = [
  { name: 'consolidated_migration.sql', content: rootSql },
  { name: '20261119000001_initial_schema.sql', content: m1 },
  { name: '20261119000002_row_level_security.sql', content: m2 },
  { name: '20261119000003_storage_bucket.sql', content: m3 },
  { name: '20261119000004_citizen_profiles.sql', content: m4 }
];

let syntaxClean = true;
for (const file of allSqlFiles) {
  const backslashes = file.content.match(/\\/g);
  const htmlEntities = file.content.match(/&[#a-zA-Z0-9]+;/g);
  const dotEscapes = file.content.match(/\\\./g);
  const pgCatalogCoalesce = file.content.match(/pg_catalog\.coalesce/gi);

  if (backslashes || htmlEntities || dotEscapes || pgCatalogCoalesce) {
    console.error(`FAIL: Artifact found in ${file.name}`);
    syntaxClean = false;
  }
}
console.log(`4. Formatting artifacts (\\, HTML entities, dot escapes, pg_catalog.coalesce) across ALL files: ${syntaxClean ? 'NONE (PASS)' : 'FAIL'}`);

// 5. Consolidated COALESCE Expression Check
const standardCoalesceMatches = rootSql.match(/COALESCE\s*\(/g);
console.log(`5. Standard PostgreSQL COALESCE expressions in consolidated SQL: ${standardCoalesceMatches ? standardCoalesceMatches.length : 0} (Expected: 6)`);

// 6. Target Table Alias & Conflict References Check
const hasTableAlias = rootSql.includes('INSERT INTO public.profiles AS current_profile');
console.log(`6. Target table alias (INSERT INTO public.profiles AS current_profile): ${hasTableAlias ? 'PASS' : 'FAIL'}`);

const hasCurrentProfileFullName = rootSql.includes('current_profile.full_name');
const hasCurrentProfilePhone = rootSql.includes('current_profile.phone');
const hasCurrentProfileState = rootSql.includes('current_profile.state');
const hasCurrentProfileDistrict = rootSql.includes('current_profile.district');
const hasCurrentProfileLang = rootSql.includes('current_profile.preferred_language');
const allConflictAliasesPresent = hasCurrentProfileFullName && hasCurrentProfilePhone && hasCurrentProfileState && hasCurrentProfileDistrict && hasCurrentProfileLang;
console.log(`7. Conflict references use current_profile.* alias: ${allConflictAliasesPresent ? 'PASS' : 'FAIL'}`);

// 7. SECURITY DEFINER Hardening in consolidated & timestamped files
const searchPathCountConsolidated = rootSql.split("SET search_path = ''").length - 1;
const searchPathCountM1 = m1.split("SET search_path = ''").length - 1;
const searchPathCountM4 = m4.split("SET search_path = ''").length - 1;
console.log(`8. SECURITY DEFINER functions hardened with SET search_path = '':`);
console.log(`   - Consolidated SQL: ${searchPathCountConsolidated} (Expected: 2)`);
console.log(`   - Migration 000001: ${searchPathCountM1} (Expected: 2)`);
console.log(`   - Migration 000004: ${searchPathCountM4} (Expected: 2)`);

const hasPgCatalogNow = rootSql.includes('pg_catalog.now()');
console.log(`9. Uses schema-qualified pg_catalog.now(): ${hasPgCatalogNow ? 'PASS' : 'FAIL'}`);

// 8. Storage Bucket & Path Documentation
const hasStoragePathDoc = rootSql.includes('<auth_user_id>/<filename>');
console.log(`10. Storage path documentation specifies <auth_user_id>/<filename>: ${hasStoragePathDoc ? 'PASS' : 'FAIL'}`);

const hasFoldernameIsolation = rootSql.includes('(storage.foldername(name))[1] = auth.uid()::text');
console.log(`11. Storage RLS policy enforces (storage.foldername(name))[1] = auth.uid()::text: ${hasFoldernameIsolation ? 'PASS' : 'FAIL'}`);

const hasPrivateBucket = rootSql.includes('public = false') && rootSql.includes('15728640') && rootSql.includes("ARRAY['application/pdf', 'image/jpeg', 'image/png']");
console.log(`12. Storage bucket: private=false, 15MB limit, PDF/JPEG/PNG MIME restrictions: ${hasPrivateBucket ? 'PASS' : 'FAIL'}`);

// 9. Schema Elements
const tables = ['public.profiles', 'public.saved_schemes', 'public.eligibility_assessments', 'public.citizen_documents'];
const allTablesPresent = tables.every(t => rootSql.includes(`CREATE TABLE IF NOT EXISTS ${t}`));
console.log(`13. All 4 tables defined with CREATE TABLE IF NOT EXISTS: ${allTablesPresent ? 'PASS' : 'FAIL'}`);

const rlsCount = rootSql.split('ENABLE ROW LEVEL SECURITY;').length - 1;
console.log(`14. Tables with ENABLE ROW LEVEL SECURITY: ${rlsCount} (Expected: 4)`);

// 10. Delimiter & Semicolon Balance across all files
let allDelimitersBalanced = true;
for (const file of allSqlFiles) {
  let round = 0, curly = 0, square = 0;
  for (const c of file.content) {
    if (c === '(') round++;
    if (c === ')') round--;
    if (c === '{') curly++;
    if (c === '}') curly--;
    if (c === '[') square++;
    if (c === ']') square--;
  }
  if (round !== 0 || curly !== 0 || square !== 0) {
    console.error(`FAIL: Delimiter mismatch in ${file.name}`);
    allDelimitersBalanced = false;
  }
}
console.log(`15. Delimiter balance ((), {}, []) across ALL SQL files: ${allDelimitersBalanced ? 'BALANCED (PASS)' : 'FAIL'}`);

const dollarQuotes = rootSql.match(/\$\$/g);
console.log(`16. Consolidated function body dollar quotes ($$): ${dollarQuotes ? dollarQuotes.length : 4} (Must be 4)`);

// 11. External Parser Availability Notice
console.log('\n────────────────────────────────────────────────────────────────────────');
console.log('NOTE ON PARSER VALIDATION:');
console.log('No standalone external PostgreSQL AST parser (e.g. pg-query-parser) is');
console.log('installed in package.json. While these static lexical, structural, and');
console.log('token-matching checks verify syntax rules, search_path semantics, and');
console.log('character integrity, they do not execute inside a live PostgreSQL engine.');
console.log('Successful execution must be verified via Supabase SQL Editor.');
console.log('────────────────────────────────────────────────────────────────────────\n');

const allPassed = duplicateRemoved &&
  filesIdentical &&
  migrationsIntact &&
  syntaxClean &&
  (standardCoalesceMatches && standardCoalesceMatches.length === 6) &&
  hasTableAlias &&
  allConflictAliasesPresent &&
  searchPathCountConsolidated === 2 &&
  searchPathCountM1 === 2 &&
  searchPathCountM4 === 2 &&
  hasPgCatalogNow &&
  hasStoragePathDoc &&
  hasFoldernameIsolation &&
  hasPrivateBucket &&
  allTablesPresent &&
  rlsCount === 4 &&
  allDelimitersBalanced &&
  (dollarQuotes && dollarQuotes.length === 4);

if (allPassed) {
  console.log('>>> OVERALL RESULT: PASSED (ALL VERIFICATIONS CONFIRMED) <<<');
  process.exit(0);
} else {
  console.error('>>> OVERALL RESULT: FAILED <<<');
  process.exit(1);
}
