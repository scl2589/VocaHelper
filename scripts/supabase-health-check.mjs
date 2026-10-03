import { appendFileSync } from 'node:fs';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY repository secrets.');
  process.exit(1);
}

try {
  const endpoint = new URL('/rest/v1/vocabularies', url);
  endpoint.searchParams.set('select', 'id');
  endpoint.searchParams.set('limit', '1');
  const response = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Database request returned HTTP ${response.status}.`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error('Unexpected database response.');
  const message = `Supabase database query succeeded at ${new Date().toISOString()} (${rows.length} row returned).`;
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Database query failed.');
  process.exitCode = 1;
}
