'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DATA_ROOT = path.join(ROOT, 'data', 'public-api');
const MEDIA_ROOT = path.join(ROOT, 'public-media', 'vehicles');
const APP_BUNDLE = path.join(ROOT, 's', 'loopleiloes.com.br', '_next', 'static', 'chunks', 'pages', '_app-2982b02e0bcde227.js');
const API_ORIGIN = 'https://api.loopleiloes.com.br';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36';

function getPublicToken() {
  const bundle = fs.readFileSync(APP_BUNDLE, 'utf8');
  const match = bundle.match(/baseURL:\s*"https:\/\/api\.loopleiloes\.com\.br"[\s\S]{0,300}?Bearer "\.concat\("([^"]+)"\)/);
  if (!match) throw new Error('Token publico da API nao encontrado no bundle original.');
  return match[1];
}

const TOKEN = getPublicToken();
const API_HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  Origin: 'https://www.loopleiloes.com.br',
  Referer: 'https://www.loopleiloes.com.br/',
  Accept: 'application/json, text/plain, */*',
  'User-Agent': USER_AGENT
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(url, options = {}, attempts = 5) {
  const { anonymous = false, ...fetchOptions } = options;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: anonymous
          ? { Accept: '*/*', 'User-Agent': USER_AGENT, ...(options.headers || {}) }
          : { ...API_HEADERS, ...(options.headers || {}) },
        signal: AbortSignal.timeout(60_000)
      });
      if (!response.ok) {
        const error = new Error(`${response.status} ${response.statusText}: ${url}`);
        error.nonRetryable = response.status >= 400 && response.status < 500 && response.status !== 429;
        throw error;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (error.nonRetryable) throw error;
      if (attempt < attempts) await wait(Math.min(10_000, attempt * 1_500));
    }
  }
  throw lastError;
}

async function getJson(apiPath) {
  return request(`${API_ORIGIN}${apiPath}`).then((response) => response.json());
}

async function getJsonOptional(apiPath, fallback = null) {
  try { return await getJson(apiPath); }
  catch (error) {
    if (error.nonRetryable && String(error.message).startsWith('404 ')) return fallback;
    throw error;
  }
}

async function postJson(apiPath, body) {
  return request(`${API_ORIGIN}${apiPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then((response) => response.json());
}

function writeJson(relativePath, value) {
  const destination = path.join(DATA_ROOT, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJsonIfPresent(relativePath) {
  const source = path.join(DATA_ROOT, relativePath);
  return fs.existsSync(source) ? JSON.parse(fs.readFileSync(source, 'utf8')) : null;
}

async function mapLimit(items, concurrency, worker, onProgress) {
  let cursor = 0;
  let completed = 0;
  const results = new Array(items.length);
  async function run() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
      completed += 1;
      if (onProgress) onProgress(completed, items.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

function progress(label) {
  let last = 0;
  return (done, total) => {
    const now = Date.now();
    if (done === total || now - last >= 5_000) {
      process.stdout.write(`${label}: ${done}/${total}\n`);
      last = now;
    }
  };
}

function safeName(value) {
  return String(value).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 180);
}

function collectImageRecords(details) {
  const records = new Map();
  for (const detail of details.filter(Boolean)) {
    const vehicle = detail.vehicle || detail;
    for (const image of vehicle.images || []) {
      const sourceUrls = ['xl', 'lg', 'md', 'sm', 'xs'].map((size) => image.sizes?.[size]).filter(Boolean);
      const url = sourceUrls[0];
      if (!url) continue;
      const key = image.uuid || url;
      records.set(key, {
        vehicleId: vehicle.id,
        uuid: image.uuid || null,
        filename: image.filename || path.basename(new URL(url).pathname),
        description: image.description || null,
        type: image.type || null,
        category: image.category || null,
        sourceUrl: url,
        displayUrl: image.sizes?.md || image.sizes?.sm || image.sizes?.xs || url,
        sourceUrls: [...new Set(sourceUrls)]
      });
    }
  }
  return [...records.values()];
}

async function downloadImage(record) {
  const vehicleFolder = path.join(MEDIA_ROOT, String(record.vehicleId || 'unknown'));
  const destination = path.join(vehicleFolder, safeName(record.filename));
  if (fs.existsSync(destination) && fs.statSync(destination).size > 0) {
    return { ...record, localPath: path.relative(ROOT, destination).replaceAll('\\', '/'), bytes: fs.statSync(destination).size };
  }

  let response;
  let lastError;
  for (const sourceUrl of record.sourceUrls || [record.sourceUrl]) {
    try {
      response = await request(sourceUrl, { anonymous: true });
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!response) throw lastError || new Error(`Foto indisponivel: ${record.filename}`);
  const data = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(vehicleFolder, { recursive: true });
  fs.writeFileSync(destination, data);
  return { ...record, localPath: path.relative(ROOT, destination).replaceAll('\\', '/'), bytes: data.length };
}

async function downloadAllImages(images) {
  const downloaded = await mapLimit(images, 96, async (image) => {
    try {
      return await downloadImage(image);
    } catch (error) {
      return { ...image, error: error.message };
    }
  }, progress('Fotos em resolucao maxima'));
  writeJson('images-local.json', downloaded);
  return downloaded;
}

async function main() {
  const metadataOnly = process.argv.includes('--metadata-only');
  const imagesOnly = process.argv.includes('--images-only');
  const refresh = process.argv.includes('--refresh');
  fs.mkdirSync(DATA_ROOT, { recursive: true });
  fs.mkdirSync(MEDIA_ROOT, { recursive: true });

  if (imagesOnly) {
    const images = readJsonIfPresent('images-index.json');
    if (!images) throw new Error('Execute npm run sync:metadata antes de baixar as imagens.');
    const downloaded = await downloadAllImages(images);
    const previous = readJsonIfPresent('sync-summary.json') || {};
    const summary = {
      ...previous,
      syncedAt: new Date().toISOString(),
      uniquePhotos: images.length,
      downloadedPhotos: downloaded.filter((image) => !image.error).length,
      failedPhotos: downloaded.filter((image) => image.error).length,
      downloadedBytes: downloaded.reduce((sum, image) => sum + (image.bytes || 0), 0)
    };
    writeJson('sync-summary.json', summary);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    return;
  }

  const [docs, events, liveEvent, featuredLots, holidays] = await Promise.all([
    getJson('/docs.json'),
    getJson('/auction/events'),
    getJsonOptional('/auction/events/live'),
    getJson('/auction/lots/featured?quantityOfLots=100'),
    getJson('/auction/holidays')
  ]);
  writeJson('openapi.json', docs);
  writeJson('events.json', events);
  writeJson('events-live.json', liveEvent);
  writeJson('featured-lots.json', featuredLots);
  writeJson('holidays.json', holidays);

  const eventPayloads = await mapLimit(events, 4, async (event) => {
    const [detail, lots, summary] = await Promise.all([
      getJson(`/auction/events/${event.id}`),
      getJson(`/auction/events/${event.id}/lots`),
      getJson(`/auction/events/${event.id}/lots/summary`)
    ]);
    writeJson(`events/${event.id}.json`, detail);
    writeJson(`events/${event.id}/lots.json`, lots);
    writeJson(`events/${event.id}/summary.json`, summary);
    return { event, lots };
  }, progress('Eventos'));

  const search = await postJson('/search/leilao', { size: 5000, query: { bool: { must: [] } } });
  writeJson('search-all.json', search);
  const stock = search.hits?.hits?.map((hit) => hit._source).filter(Boolean) || [];

  const lotsById = new Map();
  for (const payload of eventPayloads) for (const lot of payload.lots || []) lotsById.set(lot.id, lot);
  for (const lot of featuredLots) lotsById.set(lot.id, lot);
  if (liveEvent?.lots) for (const lot of liveEvent.lots) lotsById.set(lot.id, lot);
  const lots = [...lotsById.values()];
  writeJson('lots-index.json', lots);

  const lotDetails = await mapLimit(lots, 6, async (lot) => {
    const cached = refresh ? null : readJsonIfPresent(`lots/${lot.id}.json`);
    if (cached) return cached;
    const detail = await getJson(`/auction/lots/${lot.id}`);
    writeJson(`lots/${lot.id}.json`, detail);
    return detail;
  }, progress('Detalhes dos lotes'));

  const vehiclesBySlug = new Map(stock.filter((vehicle) => vehicle.slug).map((vehicle) => [vehicle.slug, vehicle]));
  const existingVehicleSlugs = readJsonIfPresent('vehicle-slugs.json') || {};
  const vehicleDetails = await mapLimit([...vehiclesBySlug], 6, async ([slug, vehicle]) => {
    const cachedId = existingVehicleSlugs[slug] || vehicle.id || vehicle.sku;
    const cached = refresh ? null : readJsonIfPresent(`vehicles/${cachedId}.json`);
    if (cached) return cached;
    const detail = await getJson(`/vehicles/${encodeURIComponent(slug)}`);
    writeJson(`vehicles/${detail.id || vehicle.id || vehicle.sku}.json`, detail);
    return detail;
  }, progress('Detalhes dos veiculos'));
  const detailsByApiSlug = new Map(vehicleDetails.filter(Boolean).map((vehicle) => [String(vehicle.slug), vehicle]));
  const vehicleSlugIndex = {};
  for (const [slug, listing] of vehiclesBySlug) {
    const detail = detailsByApiSlug.get(slug) || detailsByApiSlug.get(String(listing.sku || listing.id));
    if (detail?.id) vehicleSlugIndex[slug] = detail.id;
  }
  writeJson('vehicle-slugs.json', vehicleSlugIndex);

  const allDetails = [...lotDetails, ...vehicleDetails];
  const images = collectImageRecords(allDetails);
  writeJson('images-index.json', images);

  let downloaded = [];
  if (!metadataOnly) {
    downloaded = await downloadAllImages(images);
  }

  const summary = {
    syncedAt: new Date().toISOString(),
    events: events.length,
    lots: lots.length,
    stockVehicles: stock.length,
    vehicleDetails: vehicleDetails.length,
    uniquePhotos: images.length,
    downloadedPhotos: downloaded.filter((image) => !image.error).length,
    failedPhotos: downloaded.filter((image) => image.error).length,
    downloadedBytes: downloaded.reduce((sum, image) => sum + (image.bytes || 0), 0)
  };
  writeJson('sync-summary.json', summary);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
