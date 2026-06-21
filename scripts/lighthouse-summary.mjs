import fs from 'fs';

const manifestPath = 'lhci-reports/manifest.json';

if (!fs.existsSync(manifestPath)) {
  console.log('No Lighthouse reports found.');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const run =
  manifest.find((entry) => entry.isRepresentativeRun) ??
  manifest[manifest.length - 1];

if (!run?.summary) {
  console.log('No Lighthouse scores found in manifest.');
  process.exit(0);
}

const categories = [
  ['Performance', 'performance'],
  ['Accessibility', 'accessibility'],
  ['Best Practices', 'best-practices'],
  ['SEO', 'seo'],
  ['PWA', 'pwa'],
];

const lines = [
  '## Lighthouse scores (median run)',
  '',
  '| Category | Score |',
  '| --- | --- |',
];

for (const [label, key] of categories) {
  const score = run.summary[key];
  lines.push(
    `| ${label} | ${score != null ? Math.round(score * 100) : '—'} |`
  );
}

lines.push(
  '',
  'Download the `lighthouse-reports` artifact for full HTML reports.'
);

console.log(lines.join('\n'));
