// Regenerates supabase/migrations/*_seed_catalog.sql from lib/mockDb.ts.
// Run after editing the catalog data: node scripts/generate-seed.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('../lib/mockDb.ts', import.meta.url), 'utf8');

// mockDb.ts is plain object literals; strip the import and type annotations so it evaluates as JS.
const js = src
  .slice(0, src.indexOf('const SUBJECTS_FOR_BRANCH'))
  .replace(/^import .*$/m, '')
  .replace(/: (Department|Subject|Resource)\[\]/g, '')
  .replace(/export /g, '');
const { DEPARTMENTS, SUBJECTS } = new Function(`${js}; return { DEPARTMENTS, SUBJECTS };`)();

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

const lines = [
  '-- Seed catalog data (departments, branches, subjects).',
  '-- Generated from lib/mockDb.ts by scripts/generate-seed.mjs — do not edit by hand.',
  '',
  'insert into public.departments (id, name) values',
  DEPARTMENTS.map((d) => `  (${q(d.id)}, ${q(d.name)})`).join(',\n') +
    '\non conflict (id) do update set name = excluded.name;',
  '',
  'insert into public.branches (id, department_id, name) values',
  DEPARTMENTS.flatMap((d) => d.branches.map((b) => `  (${q(b.id)}, ${q(d.id)}, ${q(b.name)})`)).join(',\n') +
    '\non conflict (id) do update set department_id = excluded.department_id, name = excluded.name;',
  '',
  'insert into public.subjects (id, name, code, branch_id, year, semester, credits, type) values',
  SUBJECTS.map(
    (s) =>
      `  (${q(s.id)}, ${q(s.name)}, ${q(s.code)}, ${q(s.branchId)}, ${s.year}, ${s.semester}, ${s.credits}, ${q(s.type)})`
  ).join(',\n') +
    '\non conflict (id) do update set name = excluded.name, code = excluded.code, branch_id = excluded.branch_id, year = excluded.year, semester = excluded.semester, credits = excluded.credits, type = excluded.type;',
  '',
];

const out = new URL('../supabase/migrations/20260724000002_seed_catalog.sql', import.meta.url);
writeFileSync(out, lines.join('\n'));
console.log(`Wrote ${SUBJECTS.length} subjects, ${DEPARTMENTS.length} departments.`);
