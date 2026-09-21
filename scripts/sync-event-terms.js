'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dataRoot = path.join(root, 'data', 'public-api');
const outputRoot = path.join(dataRoot, 'terms');
const bundle = fs.readFileSync(path.join(root, 's', 'loopleiloes.com.br', '_next', 'static', 'chunks', 'pages', '_app-2982b02e0bcde227.js'), 'utf8');
const token = bundle.match(/baseURL:\s*"https:\/\/api\.loopleiloes\.com\.br"[\s\S]{0,300}?Bearer "\.concat\("([^"]+)"\)/)?.[1];

if (!token) throw new Error('Token publico da API nao encontrado.');
fs.mkdirSync(outputRoot, { recursive: true });

const termIds = new Set();
for (const filename of fs.readdirSync(path.join(dataRoot, 'lots'))) {
  if (!filename.endsWith('.json')) continue;
  const lot = JSON.parse(fs.readFileSync(path.join(dataRoot, 'lots', filename), 'utf8'));
  if (lot.terms?.id) termIds.add(lot.terms.id);
}

(async () => {
  for (const id of termIds) {
    const response = await fetch(`https://api.loopleiloes.com.br/auction/events/terms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: 'https://www.loopleiloes.com.br',
        Referer: 'https://www.loopleiloes.com.br/'
      }
    });
    if (!response.ok) {
      process.stdout.write(`Termos ${id}: ${response.status}\n`);
      continue;
    }
    const body = await response.json();
    fs.writeFileSync(path.join(outputRoot, `${id}.json`), `${JSON.stringify(body, null, 2)}\n`, 'utf8');
    process.stdout.write(`Termos ${id}: ok\n`);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
