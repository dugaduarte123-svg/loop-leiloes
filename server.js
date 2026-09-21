'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const SNAPSHOT_ROOT = path.join(ROOT, 's');
const SITE_ROOT = path.join(SNAPSHOT_ROOT, 'loopleiloes.com.br');
const API_ROOT = path.join(SNAPSHOT_ROOT, 'api.loopleiloes.com.br');
const INDEX_FILE = path.join(SITE_ROOT, 'index.html');
const APP_ROOT = path.join(ROOT, 'app');
const PUBLIC_DATA_ROOT = path.join(ROOT, 'data', 'public-api');
const PUBLIC_MEDIA_ROOT = path.join(ROOT, 'public-media');
const LOCAL_DB_FILE = process.env.LOOP_DB_FILE || (process.env.VERCEL ? '/tmp/loop-local-db.json' : path.join(ROOT, 'data', 'local-db.json'));
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const TRUST_PROXY = /^(1|true|yes)$/i.test(process.env.LOOP_TRUST_PROXY || '');
const FORCE_SECURE_COOKIES = IS_PRODUCTION || /^(1|true|yes)$/i.test(process.env.LOOP_SECURE_COOKIES || '');
const localSessions = new Map();
const adminSessions = new Map();
const rateLimitBuckets = new Map();
const ADMIN_PASSWORD = String(process.env.LOOP_ADMIN_PASSWORD || '');
const ADMIN_PASSWORD_READY = ADMIN_PASSWORD.length >= 16;
const WHATSAPP_NUMBERS = ['5511980867294', '5511958011799'];
const VEHICLE_PHOTO_BASE = 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/KwUyhjEv9VxIWkPo_Ql7FUmLthg8HKxwThZvvaed7_Tqz9QfJfwrzzgt_3EIvqRG/n/loopbrasil/b/vehicle-photos/o/md/';
const ASSET_VERSION = '20260921-1820';
const POSTPONE_INTERVAL_MS = 24 * 60 * 60 * 1000;
const AUCTION_MIN_DATE = '2026-09-22';
const AUCTION_MAX_DATE = '2026-09-24';

function clientAddress(req) {
  const forwarded = TRUST_PROXY ? req.headers['x-forwarded-for'] : '';
  return String(forwarded || req.socket.remoteAddress || 'unknown').split(',')[0].trim().slice(0, 128);
}

function requestIsHttps(req) {
  if (FORCE_SECURE_COOKIES) return true;
  const forwarded = TRUST_PROXY ? String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() : '';
  return forwarded === 'https' || Boolean(req.socket.encrypted);
}

function cookieSecurity(req, sameSite = 'Lax') {
  return `HttpOnly; SameSite=${sameSite}${requestIsHttps(req) ? '; Secure' : ''}`;
}

function isSameOriginRequest(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    const forwardedHost = TRUST_PROXY ? String(req.headers['x-forwarded-host'] || '').split(',')[0].trim() : '';
    const expectedHost = forwardedHost || String(req.headers.host || '');
    const forwardedProto = TRUST_PROXY ? String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() : '';
    const expectedProtocol = forwardedProto || (req.socket.encrypted ? 'https' : 'http');
    return parsed.host === expectedHost && parsed.protocol === `${expectedProtocol}:`;
  } catch {
    return false;
  }
}

function allowRateLimit(key, maximum, windowMs) {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    rateLimitBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= maximum;
}

function securePasswordMatches(value) {
  if (!ADMIN_PASSWORD_READY) return false;
  const supplied = crypto.createHash('sha256').update(String(value || '')).digest();
  const expected = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
  return crypto.timingSafeEqual(supplied, expected);
}

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

const SPECIAL_ORIGINS = new Map([
  ['https://api.loopleiloes.com.br', '/api'],
  ['http://api.loopleiloes.com.br', '/api'],
  ['https://strapi.loopbrasil.com', '/cms'],
  ['http://strapi.loopbrasil.com', '/cms'],
  ['https://www.loopleiloes.com.br', ''],
  ['http://www.loopleiloes.com.br', ''],
  ['https://loopleiloes.com.br', ''],
  ['http://loopleiloes.com.br', '']
]);
const GENERAL_WHATSAPP_MESSAGE = 'Olá, equipe Loop Leilões. Gostaria de receber atendimento e esclarecer algumas dúvidas sobre os veículos disponíveis.';
const FLOATING_WHATSAPP = `<style>.floating-whatsapp{position:fixed;right:24px;bottom:24px;width:60px;height:60px;border-radius:50%;background:#ff123c;color:#fff;display:grid;place-items:center;box-shadow:0 5px 14px #0004;z-index:9999;transition:transform .18s,background .18s}.floating-whatsapp:hover{background:#dc0d32;transform:translateY(-2px)}.floating-whatsapp svg{width:31px;height:31px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round}</style><a class="floating-whatsapp" href="/go/whatsapp?text=${encodeURIComponent(GENERAL_WHATSAPP_MESSAGE)}" target="_blank" rel="noopener" aria-label="Falar com a Loop pelo WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6.5 8.5h19a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H13l-6.5 4v-18a2 2 0 0 1 2-2Z"/><path d="M10 5.5h14a2 2 0 0 1 2 2v1"/></svg></a>`;
const REMOVE_STOCK_TOGGLE = `<script>(()=>{const remove=()=>{for(const node of document.querySelectorAll('label,span,p')){if(node.textContent.trim()==='Estoque não loteado'){const target=node.closest('.MuiGrid-item')||node.parentElement;target?.remove();}}};remove();new MutationObserver(remove).observe(document.body,{childList:true,subtree:true});})();</script>`;
const REMOVE_ACCOUNT_LINKS = `<script>(()=>{const remove=()=>{for(const link of document.querySelectorAll('a')){const text=link.textContent.trim();if(text==='Login'||text==='Cadastre-se'){const box=link.parentElement;if(box&&[...box.querySelectorAll('a')].some((item)=>item.textContent.trim()==='Login')&&[...box.querySelectorAll('a')].some((item)=>item.textContent.trim()==='Cadastre-se'))box.remove();else link.remove();}}};remove();new MutationObserver(remove).observe(document.body,{childList:true,subtree:true});})();</script>`;

const mirroredHosts = fs.readdirSync(SNAPSHOT_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.includes('.') && !['api.loopleiloes.com.br', 'loopleiloes.com.br', 'strapi.loopbrasil.com'].includes(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => b.length - a.length);

function rewriteExternalUrls(content) {
  let output = content;

  for (const [origin, localPath] of SPECIAL_ORIGINS) {
    output = output.split(origin).join(localPath);
  }

  for (const host of mirroredHosts) {
    output = output.split(`https://${host}`).join(`/__mirror/${host}`);
    output = output.split(`http://${host}`).join(`/__mirror/${host}`);
  }

  // O Socket.IO original e apenas atualizacao em tempo real. Apontar para a
  // propria origem impede que esta copia envie dados para o servidor oficial.
  output = output.split('"wss://ws.loopbrasil.com/auction"').join('window.location.origin');
  return output;
}

function injectFloatingWhatsapp(content) {
  if (content.includes('class="floating-whatsapp"')) return content;
  return content.replace('</body>', `${REMOVE_STOCK_TOGGLE}${REMOVE_ACCOUNT_LINKS}${FLOATING_WHATSAPP}</body>`);
}

function versionHtmlAssets(content) {
  return content.replace(/\b(src|href)="(\/(?:_next\/(?:static|image)|__mirror|cms\/uploads)\/[^\"]+)"/g, (match, attribute, url) => {
    const separator = url.includes('?') ? '&amp;' : '?';
    return `${attribute}="${url}${separator}v=${ASSET_VERSION}"`;
  });
}

function sanitizeJsonControlCharacters(source) {
  let output = '';
  let insideString = false;
  let escaped = false;

  for (const character of source) {
    if (!insideString) {
      if (character === '"') insideString = true;
      output += character;
      continue;
    }

    if (escaped) {
      output += character;
      escaped = false;
    } else if (character === '\\') {
      output += character;
      escaped = true;
    } else if (character === '"') {
      output += character;
      insideString = false;
    } else if (character === '\r' || character === '\n' || character === '\t') {
      output += ' ';
    } else {
      output += character;
    }
  }

  return output;
}

function readCapturedJson(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(source);
  } catch {
    return JSON.parse(sanitizeJsonControlCharacters(source));
  }
}

function readNextData() {
  const html = fs.readFileSync(INDEX_FILE, 'utf8');
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return new Map();

  const data = JSON.parse(match[1]);
  const queries = data?.props?.pageProps?.dehydratedState?.queries || [];
  return new Map(queries.map((query) => [query.queryKey?.[0], query.state?.data]));
}

const captured = {
  events: readCapturedJson(path.join(API_ROOT, 'auction', 'events.html')),
  liveEvents: readCapturedJson(path.join(API_ROOT, 'auction', 'events', 'live.html')),
  featuredLots: readCapturedJson(path.join(API_ROOT, 'auction', 'lots', 'featured.html')),
  nextData: readNextData()
};

let catalogCache;
let imageSourceCache;
let imageFilenameCache;
let imageByVehicleCache;
let lotsIndexCache;
let eventLotsIndexCache;
let vehicleSlugsCache;

function publicJson(relativePath, fallback = null) {
  const file = path.join(PUBLIC_DATA_ROOT, relativePath);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function reactivatedPastEvents() {
  const eventsRoot = path.join(PUBLIC_DATA_ROOT, 'events');
  let files = [];
  try { files = fs.readdirSync(eventsRoot).filter((name) => /^\d+\.json$/.test(name)); } catch { return []; }
  return files.map((name) => publicJson(`events/${name}`)).filter((event) => event?.date && event.date <= '2026-09-19');
}

function allPublicEvents() {
  const upcoming = publicJson('events.json', captured.events) || [];
  const byId = new Map(upcoming.map((event) => [String(event.id), event]));
  for (const event of reactivatedPastEvents()) byId.set(String(event.id), event);
  return [...byId.values()].sort((first, second) => `${first.date} ${first.time || ''}`.localeCompare(`${second.date} ${second.time || ''}`));
}

function catalog() {
  if (!catalogCache) {
    const search = publicJson('search-all.json', { hits: { hits: [] } });
    const slugs = vehicleSlugs();
    const vehicles = search.hits?.hits?.map((hit) => hit._source).filter(Boolean) || [];
    const existingLots = new Set(vehicles.map((vehicle) => String(vehicle.lotId || '')).filter(Boolean));
    for (const event of reactivatedPastEvents()) {
      const lots = publicJson(`events/${event.id}/lots.json`, []);
      for (const lot of lots) {
        if (!lot?.vehicle || existingLots.has(String(lot.id))) continue;
        const urlParts = String(lot.url || '').split('/').filter(Boolean);
        vehicles.push({
          ...lot.vehicle,
          id: lot.vehicle.id,
          sku: lot.vehicle.id,
          slug: urlParts[2] || `lote-${lot.id}`,
          category: lot.vehicle.category || lot.vehicle.type,
          lotId: lot.id,
          number: lot.number,
          url: lot.url,
          lastBid: lot.lastBid,
          status: 'aberto_para_lance',
          isFinanciable: lot.isFinancing,
          estimatedStartTime: lot.estimatedStartTime,
          event: { id: event.id, date: event.date, title: event.title }
        });
        existingLots.add(String(lot.id));
      }
    }
    catalogCache = vehicles.map((vehicle) => {
      return { ...vehicle, image: vehicle.image || null };
    });
    const modelImages = new Map(catalogCache.filter((vehicle) => vehicle.image).map((vehicle) => [`${vehicle.brand}|${vehicle.model}`, vehicle.image]));
    const brandImages = new Map(catalogCache.filter((vehicle) => vehicle.image).map((vehicle) => [vehicle.brand, vehicle.image]));
    const categoryImages = new Map(catalogCache.filter((vehicle) => vehicle.image).map((vehicle) => [vehicle.category || vehicle.type, vehicle.image]));
    const fallbackImage = catalogCache.find((vehicle) => vehicle.image)?.image || null;
    catalogCache = catalogCache.map((vehicle) => vehicle.image ? vehicle : {
      ...vehicle,
      image: modelImages.get(`${vehicle.brand}|${vehicle.model}`)
        || brandImages.get(vehicle.brand)
        || categoryImages.get(vehicle.category || vehicle.type)
        || fallbackImage
    });
  }
  return catalogCache;
}

function lotsIndex() {
  if (!lotsIndexCache) {
    lotsIndexCache = new Map(publicJson('lots-index.json', []).map((lot) => [String(lot.id), lot]));
  }
  return lotsIndexCache;
}

function eventLotsIndex() {
  if (!eventLotsIndexCache) {
    eventLotsIndexCache = new Map();
    const eventsRoot = path.join(PUBLIC_DATA_ROOT, 'events');
    let directories = [];
    try { directories = fs.readdirSync(eventsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()); } catch { return eventLotsIndexCache; }
    for (const directory of directories) {
      for (const lot of publicJson(`events/${directory.name}/lots.json`, [])) eventLotsIndexCache.set(String(lot.id), lot);
    }
  }
  return eventLotsIndexCache;
}

function vehicleSlugs() {
  if (!vehicleSlugsCache) vehicleSlugsCache = publicJson('vehicle-slugs.json', {});
  return vehicleSlugsCache;
}

function ensureImageSourceCache() {
  if (!imageSourceCache) {
    imageSourceCache = new Map();
    imageFilenameCache = new Map();
    imageByVehicleCache = new Map();
  }
}

function imageSource(relativePath) {
  ensureImageSourceCache();

  let decoded;
  try { decoded = decodeURIComponent(relativePath).replaceAll('\\', '/'); }
  catch { return null; }
  const filename = path.basename(decoded);
  return imageByFilename(filename)?.source || null;
}

function imageByFilename(filename) {
  if (!filename || path.basename(filename) !== filename || !/\.(?:jpe?g|png|webp|gif)$/i.test(filename)) return null;
  return {
    relativePath: `vehicles/shared/${filename}`,
    source: `${VEHICLE_PHOTO_BASE}${encodeURIComponent(filename)}`
  };
}

function readLocalDb() {
  let db;
  let existed = true;
  try { db = JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf8')); }
  catch { db = {}; existed = false; }
  const previousSettings = JSON.stringify(db.settings || {});
  db.users = Array.isArray(db.users) ? db.users : [];
  db.analytics = db.analytics && typeof db.analytics === 'object' ? db.analytics : {};
  db.analytics.visitors = db.analytics.visitors && typeof db.analytics.visitors === 'object' ? db.analytics.visitors : {};
  db.analytics.whatsappVisitors = db.analytics.whatsappVisitors && typeof db.analytics.whatsappVisitors === 'object' ? db.analytics.whatsappVisitors : {};
  db.analytics.pageViews = Number(db.analytics.pageViews) || 0;
  db.analytics.whatsappClicks = Number(db.analytics.whatsappClicks) || 0;
  db.settings = db.settings && typeof db.settings === 'object' ? db.settings : {};
  db.settings.dateOffsetDays = Number(db.settings.dateOffsetDays) || 0;
  db.settings.autoPostponeEnabled = true;
  if (!db.settings.nextAutoPostponeAt || !Number.isFinite(Date.parse(db.settings.nextAutoPostponeAt))) {
    db.settings.nextAutoPostponeAt = new Date(Date.now() + POSTPONE_INTERVAL_MS).toISOString();
  }
  if (!existed || previousSettings !== JSON.stringify(db.settings)) writeLocalDb(db);
  return db;
}

function writeLocalDb(db) {
  fs.mkdirSync(path.dirname(LOCAL_DB_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_DB_FILE, `${JSON.stringify(db, null, 2)}\n`, 'utf8');
}

function cookieValue(req, name) {
  const prefix = `${name}=`;
  const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : '';
}

function dateOffsetDays() {
  return readLocalDb().settings.dateOffsetDays;
}

function shiftDateString(value, days = dateOffsetDays()) {
  if (!days || typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/.test(value)) return value;
  const separator = value.includes(' ') ? ' ' : value.includes('T') ? 'T' : '';
  const [datePart, timePart] = separator ? value.split(separator) : [value, ''];
  const [year, month, day] = datePart.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  const result = `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}-${String(shifted.getUTCDate()).padStart(2, '0')}`;
  return timePart ? `${result}${separator}${timePart}` : result;
}

function clampAuctionDateString(value) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})(.*)$/);
  if (!match || !match[1].startsWith('2026-09-')) return value;
  const date = match[1] < AUCTION_MIN_DATE ? AUCTION_MIN_DATE : match[1] > AUCTION_MAX_DATE ? AUCTION_MAX_DATE : match[1];
  return `${date}${match[2]}`;
}

function auctionPriceSeed(value) {
  const source = String(value.lotId || value.id || value.vehicle?.id || value.description || 'loop');
  let hash = 0;
  for (const character of source) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return hash;
}

function auctionPriceInRange(value, minimum, maximum, step = 500) {
  const slots = Math.floor((maximum - minimum) / step) + 1;
  return minimum + (auctionPriceSeed(value) % slots) * step;
}

function adjustedAuctionPrice(value, rawPrice) {
  const hasVehicleIdentity = value.lotId || value.number != null || value.vehicle || value.brand || value.model;
  if (!hasVehicleIdentity) return rawPrice;

  const vehicle = value.vehicle || value;
  const description = [value.description, vehicle.brand, vehicle.model, vehicle.version]
    .filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const year = Number(vehicle.modelYear || vehicle.manufactureYear) || 0;
  const category = String(vehicle.category || vehicle.type || value.category || value.type || '').toUpperCase();

  if (/\b(S10|HILUX)\b/.test(description)) return auctionPriceInRange(value, 30_000, 40_000, 500);
  if (/\bUNO\b/.test(description)) return auctionPriceInRange(value, 4_500, 6_000, 500);
  if (/\bPALIO\b/.test(description)) return auctionPriceInRange(value, 6_500, 8_500, 500);
  if (/\bCORSA\b/.test(description)) return auctionPriceInRange(value, 8_500, 10_500, 500);
  if (/\bSTRADA\b/.test(description) && (!year || year <= 2016)) return auctionPriceInRange(value, 15_000, 17_000, 500);
  if (/\bBROS\b/.test(description)) return auctionPriceInRange(value, 5_600, 6_300, 100);
  if (category.includes('MOTO') && /\b160\b/.test(description)) return auctionPriceInRange(value, 4_500, 5_500, 250);

  const current = Number(rawPrice) || 0;
  if (current > 0) return Math.max(500, Math.round((current * 0.75) / 500) * 500);
  if (category.includes('MOTO')) return auctionPriceInRange(value, 3_500, 6_500, 250);
  if (category.includes('PESADO')) return auctionPriceInRange(value, 18_000, 35_000, 1_000);
  if (year && year <= 2005) return auctionPriceInRange(value, 5_000, 9_000, 500);
  if (year && year <= 2010) return auctionPriceInRange(value, 8_000, 13_000, 500);
  if (year && year <= 2015) return auctionPriceInRange(value, 12_000, 19_000, 500);
  if (year && year <= 2020) return auctionPriceInRange(value, 20_000, 32_000, 500);
  return auctionPriceInRange(value, 30_000, 48_000, 1_000);
}

function shiftAuctionDates(value, days = dateOffsetDays()) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((item) => shiftAuctionDates(item, days));
  if (typeof value !== 'object') return value;
  const originalDate = String(value.date || value.estimatedStartTime || value.event?.date || '').slice(0, 10);
  const reactivate = originalDate.startsWith('2026-09-') && originalDate < AUCTION_MIN_DATE && (value.number != null || value.vehicle);
  const shifted = {};
  for (const [key, item] of Object.entries(value)) {
    shifted[key] = key === 'lastBid'
      ? adjustedAuctionPrice(value, item)
      : key === 'status' && reactivate
      ? 'aberto_para_lance'
      : typeof item === 'string' && ['date', 'estimatedStartTime', 'startDate', 'endDate'].includes(key)
      ? shiftDateString(clampAuctionDateString(item), days)
      : shiftAuctionDates(item, days);
  }
  return shifted;
}

function shiftDatesInHtml(content, days = dateOffsetDays()) {
  let shifted = content.replace(/\b(\d{4}-\d{2}-\d{2})(?=(?:[T ][0-9]{2}:[0-9]{2})|\b)/g, (date) => shiftDateString(clampAuctionDateString(date), days));
  shifted = shifted.replace(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g, (value, day, month, year) => {
    const iso = shiftDateString(clampAuctionDateString(`${year}-${month}-${day}`), days);
    const [newYear, newMonth, newDay] = iso.split('-');
    return `${newDay}/${newMonth}/${newYear}`;
  });
  return shifted;
}

function analyticsSummary(db = readLocalDb()) {
  const lastPostponedAt = db.settings.lastPostponedAt || null;
  const nextManualAt = lastPostponedAt ? new Date(new Date(lastPostponedAt).getTime() + POSTPONE_INTERVAL_MS).toISOString() : null;
  const canPostpone = !nextManualAt || Date.now() >= Date.parse(nextManualAt);
  return {
    uniqueVisitors: Object.keys(db.analytics.visitors).length,
    pageViews: db.analytics.pageViews,
    whatsappClicks: db.analytics.whatsappClicks,
    whatsappVisitors: Object.keys(db.analytics.whatsappVisitors).length,
    dateOffsetDays: db.settings.dateOffsetDays,
    lastPostponedAt,
    canPostpone,
    nextPostponeAt: canPostpone ? null : nextManualAt,
    autoPostponeEnabled: db.settings.autoPostponeEnabled,
    nextAutoPostponeAt: db.settings.nextAutoPostponeAt || null
  };
}

function postponeAll(db, now = new Date()) {
  db.settings.dateOffsetDays += 2;
  db.settings.lastPostponedAt = now.toISOString();
  if (db.settings.autoPostponeEnabled) db.settings.nextAutoPostponeAt = new Date(now.getTime() + POSTPONE_INTERVAL_MS).toISOString();
}

function runAutomaticPostpone() {
  const db = readLocalDb();
  if (!db.settings.autoPostponeEnabled || !db.settings.nextAutoPostponeAt) return false;
  const next = Date.parse(db.settings.nextAutoPostponeAt);
  if (!Number.isFinite(next) || Date.now() < next) return false;
  const dueRuns = Math.max(1, Math.floor((Date.now() - next) / POSTPONE_INTERVAL_MS) + 1);
  db.settings.dateOffsetDays += dueRuns * 2;
  db.settings.lastPostponedAt = new Date().toISOString();
  db.settings.nextAutoPostponeAt = new Date(next + dueRuns * POSTPONE_INTERVAL_MS).toISOString();
  writeLocalDb(db);
  return true;
}

function trackPageView(req, res, url) {
  const isBrowserPage = req.method === 'GET' && req.headers.accept?.includes('text/html') && /Mozilla\//i.test(req.headers['user-agent'] || '');
  if (!isBrowserPage || url.pathname === '/admin') return;
  const db = readLocalDb();
  const now = new Date().toISOString();
  let visitorId = cookieValue(req, 'loop_visitor');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    res.setHeader('Set-Cookie', `loop_visitor=${visitorId}; Path=/; ${cookieSecurity(req)}; Max-Age=31536000`);
  }
  const visitor = db.analytics.visitors[visitorId] || { firstSeenAt: now, views: 0 };
  visitor.lastSeenAt = now;
  visitor.views += 1;
  db.analytics.visitors[visitorId] = visitor;
  db.analytics.pageViews += 1;
  writeLocalDb(db);
}

function trackWhatsapp(req) {
  const db = readLocalDb();
  const visitorId = cookieValue(req, 'loop_visitor');
  const recipient = WHATSAPP_NUMBERS[db.analytics.whatsappClicks % WHATSAPP_NUMBERS.length];
  db.analytics.whatsappClicks += 1;
  db.analytics.lastWhatsappClickAt = new Date().toISOString();
  if (visitorId) db.analytics.whatsappVisitors[visitorId] = db.analytics.lastWhatsappClickAt;
  writeLocalDb(db);
  return recipient;
}

function sessionUser(req) {
  const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith('loop_session='));
  const sessionId = cookie?.slice('loop_session='.length);
  return sessionId ? localSessions.get(sessionId) || null : null;
}

function adminSession(req) {
  const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith('loop_admin_session='));
  const sessionId = cookie?.slice('loop_admin_session='.length);
  const session = sessionId ? adminSessions.get(sessionId) || null : null;
  if (session && Date.now() - session.createdAt > 8 * 60 * 60 * 1000) {
    adminSessions.delete(sessionId);
    return null;
  }
  return session;
}

function requireAdmin(req, res) {
  if (adminSession(req)) return true;
  json(res, 401, { error: 'Autenticação administrativa necessária.' });
  return false;
}

function json(res, statusCode, value, extraHeaders = {}) {
  const body = JSON.stringify(value);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...extraHeaders
  });
  res.end(body);
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error('Corpo da requisicao excede 1 MB'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function searchResponse(request = {}) {
  const bool = request.query?.bool || {};
  const must = Array.isArray(bool.must) ? bool.must : [];
  const mustNot = Array.isArray(bool.must_not) ? bool.must_not : [];
  const hasEvent = (vehicle) => Boolean(vehicle.event?.id || vehicle.lotId);
  const normalized = (value) => String(value || '').toLocaleLowerCase('pt-BR');
  let vehicles = shiftAuctionDates(catalog());

  for (const clause of must) {
    if (clause.exists?.field === 'event.id') vehicles = vehicles.filter(hasEvent);
    if (clause.term?.category) vehicles = vehicles.filter((vehicle) => normalized(vehicle.category) === normalized(clause.term.category));
    if (clause.term?.['event.date']) vehicles = vehicles.filter((vehicle) => vehicle.event?.date === clause.term['event.date']);
  }
  for (const clause of mustNot) {
    if (clause.exists?.field === 'event.id') vehicles = vehicles.filter((vehicle) => !hasEvent(vehicle));
    if (clause.term?.['event.date']) vehicles = vehicles.filter((vehicle) => vehicle.event?.date !== clause.term['event.date']);
  }

  const response = {
    took: 0,
    timed_out: false,
    _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
    hits: {
      total: { value: vehicles.length, relation: 'eq' },
      max_score: null,
      hits: (request.size || 0) > 0 ? vehicles.slice(0, request.size).map((vehicle) => ({ _id: String(vehicle.id || vehicle.sku), _source: vehicle })) : []
    }
  };

  if (request.aggs?.brands || request.aggs?.composite_brand_model) {
    const brands = new Map();
    const models = new Map();
    for (const vehicle of vehicles) {
      const brand = vehicle.brand;
      const model = vehicle.model;
      if (!brand) continue;
      brands.set(brand, (brands.get(brand) || 0) + 1);
      if (model) {
        const key = `${brand}\u0000${model}`;
        models.set(key, (models.get(key) || 0) + 1);
      }
    }
    response.aggregations = {
      brands: { buckets: [...brands].map(([key, doc_count]) => ({ key, doc_count })) },
      composite_brand_model: {
        buckets: [...models].map(([key, doc_count]) => {
          const [brand, model] = key.split('\u0000');
          return { key: { brand, model }, doc_count };
        })
      }
    };
  } else if (request.aggs?.event) {
    const dates = new Map();
    for (const vehicle of vehicles) {
      const date = vehicle.event?.date;
      if (!date) continue;
      dates.set(date, (dates.get(date) || 0) + 1);
    }
    response.aggregations = {
      event: {
        buckets: [...dates].sort(([a], [b]) => a.localeCompare(b)).map(([date, doc_count]) => ({
          key_as_string: date,
          key: Date.parse(`${date}T00:00:00Z`),
          doc_count
        }))
      }
    };
  }

  return response;
}

function safeResolve(base, relativePath) {
  let decoded;
  try {
    decoded = decodeURIComponent(relativePath).replace(/^[/\\]+/, '');
  } catch {
    return null;
  }

  const resolved = path.resolve(base, decoded);
  const baseWithSeparator = path.resolve(base) + path.sep;
  return resolved.startsWith(baseWithSeparator) ? resolved : null;
}

function findCapturedFile(base, relativePath) {
  const initial = safeResolve(base, relativePath);
  if (!initial) return null;

  const candidates = [initial];
  if (!path.extname(initial)) candidates.push(`${initial}.html`, `${initial}.css`, `${initial}.js`);
  candidates.push(path.join(initial, 'index.html'));
  return candidates.find((candidate) => {
    try {
      return fs.statSync(candidate).isFile();
    } catch {
      return false;
    }
  }) || null;
}

function serveFile(res, filePath, rewrite = false, cacheControl = null) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';
  const isText = /^(text\/|application\/json|image\/svg)/.test(contentType);

  if (isText) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (source.startsWith('No Content:')) {
      res.writeHead(204, { 'Cache-Control': 'no-store' });
      res.end();
      return;
    }
  }

  if (rewrite && isText) {
    let body = rewriteExternalUrls(fs.readFileSync(filePath, 'utf8'));
    if (extension === '.html') body = versionHtmlAssets(injectFloatingWhatsapp(shiftDatesInHtml(body)));
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-cache'
    });
    res.end(body);
    return;
  }

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': cacheControl || (extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable')
  });
  fs.createReadStream(filePath).pipe(res);
}

async function handleApi(req, res, url) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Allow': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Cache-Control': 'no-store'
    });
    res.end();
    return true;
  }

  if (url.pathname === '/api/auth/session' && req.method === 'GET') {
    const user = sessionUser(req);
    json(res, 200, user ? { user: { id: user.id, name: user.name, email: user.email } } : {}, { 'Cache-Control': 'no-store' });
    return true;
  }
  if (url.pathname === '/api/admin/session' && req.method === 'GET') {
    const session = adminSession(req);
    json(res, 200, session ? { authenticated: true, user: 'admin' } : { authenticated: false }, { 'Cache-Control': 'no-store' });
    return true;
  }
  if (url.pathname === '/api/admin/login' && req.method === 'POST') {
    if (!ADMIN_PASSWORD_READY) {
      json(res, 503, { error: 'Painel administrativo não configurado.' }, { 'Cache-Control': 'no-store' });
      return true;
    }
    if (!allowRateLimit(`admin-login:${clientAddress(req)}`, 5, 15 * 60 * 1000)) {
      json(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' });
      return true;
    }
    const raw = await collectBody(req);
    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { json(res, 400, { error: 'Dados inválidos.' }); return true; }
    if (!securePasswordMatches(body.password)) {
      json(res, 401, { error: 'Senha administrativa inválida.' });
      return true;
    }
    const sessionId = crypto.randomBytes(32).toString('hex');
    adminSessions.set(sessionId, { createdAt: Date.now() });
    json(res, 200, { authenticated: true, message: 'Acesso administrativo autorizado.' }, {
      'Set-Cookie': `loop_admin_session=${sessionId}; Path=/; ${cookieSecurity(req, 'Strict')}; Max-Age=28800`,
      'Cache-Control': 'no-store'
    });
    return true;
  }
  if (url.pathname === '/api/admin/logout' && req.method === 'POST') {
    const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith('loop_admin_session='));
    if (cookie) adminSessions.delete(cookie.slice('loop_admin_session='.length));
    json(res, 200, { authenticated: false }, { 'Set-Cookie': `loop_admin_session=; Path=/; ${cookieSecurity(req, 'Strict')}; Max-Age=0`, 'Cache-Control': 'no-store' });
    return true;
  }
  if (url.pathname === '/api/admin/stats' && req.method === 'GET') {
    if (!requireAdmin(req, res)) return true;
    json(res, 200, analyticsSummary());
    return true;
  }
  if (url.pathname === '/api/admin/postpone' && req.method === 'POST') {
    if (!requireAdmin(req, res)) return true;
    if (!allowRateLimit(`admin-action:${clientAddress(req)}`, 30, 60 * 60 * 1000)) {
      json(res, 429, { error: 'Limite de ações administrativas atingido. Aguarde e tente novamente.' });
      return true;
    }
    const db = readLocalDb();
    const summary = analyticsSummary(db);
    if (!summary.canPostpone) {
      json(res, 429, { ...summary, error: 'O adiamento manual pode ser usado apenas uma vez a cada 24 horas.' });
      return true;
    }
    postponeAll(db);
    writeLocalDb(db);
    json(res, 200, { ...analyticsSummary(db), message: 'Todos os veiculos e eventos foram adiados em 2 dias.' });
    return true;
  }
  if (url.pathname === '/api/admin/auto-postpone' && req.method === 'POST') {
    if (!requireAdmin(req, res)) return true;
    const raw = await collectBody(req);
    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { json(res, 400, { error: 'JSON invalido' }); return true; }
    const db = readLocalDb();
    db.settings.autoPostponeEnabled = true;
    if (db.settings.autoPostponeEnabled) {
      const last = Date.parse(db.settings.lastPostponedAt || '');
      const base = Number.isFinite(last) && Date.now() < last + POSTPONE_INTERVAL_MS ? last : Date.now();
      db.settings.nextAutoPostponeAt = new Date(base + POSTPONE_INTERVAL_MS).toISOString();
    }
    writeLocalDb(db);
    json(res, 200, { ...analyticsSummary(db), message: db.settings.autoPostponeEnabled ? 'Adiamento automatico diario ativado.' : 'Adiamento automatico desativado.' });
    return true;
  }
  if (url.pathname === '/api/auction/events' && req.method === 'GET') {
    json(res, 200, shiftAuctionDates(allPublicEvents()));
    return true;
  }
  if (url.pathname === '/api/auction/events/live' && req.method === 'GET') {
    json(res, 200, shiftAuctionDates(publicJson('events-live.json', captured.liveEvents)));
    return true;
  }
  if (url.pathname === '/api/auction/lots/featured' && req.method === 'GET') {
    const quantity = Math.max(0, Number(url.searchParams.get('quantityOfLots')) || captured.featuredLots.length);
    json(res, 200, shiftAuctionDates(publicJson('featured-lots.json', captured.featuredLots).slice(0, quantity)));
    return true;
  }
  let match = url.pathname.match(/^\/api\/auction\/events\/(\d+)\/lots$/);
  if (match && req.method === 'GET') {
    const value = publicJson(`events/${match[1]}/lots.json`);
    if (value) json(res, 200, shiftAuctionDates(value)); else json(res, 404, { error: 'Evento nao encontrado' });
    return true;
  }
  match = url.pathname.match(/^\/api\/auction\/events\/(\d+)$/);
  if (match && req.method === 'GET') {
    const value = publicJson(`events/${match[1]}.json`);
    if (value) json(res, 200, shiftAuctionDates(value)); else json(res, 404, { error: 'Evento nao encontrado' });
    return true;
  }
  match = url.pathname.match(/^\/api\/auction\/lots\/(\d+)$/);
  if (match && req.method === 'GET') {
    const detail = publicJson(`lots/${match[1]}.json`);
    const indexed = lotsIndex().get(match[1]);
    const scheduled = eventLotsIndex().get(match[1]);
    const value = detail && {
      ...(scheduled || {}),
      ...indexed,
      ...detail,
      lastBid: Number(detail.lastBid) > 0 ? detail.lastBid : indexed?.lastBid ?? scheduled?.lastBid ?? 0,
      vehicle: { ...(scheduled?.vehicle || {}), ...(indexed?.vehicle || {}), ...(detail.vehicle || {}) }
    };
    if (value) json(res, 200, shiftAuctionDates(value)); else json(res, 404, { error: 'Lote nao encontrado' });
    return true;
  }
  match = url.pathname.match(/^\/api\/vehicles\/(.+)$/);
  if (match && req.method === 'GET') {
    const slug = decodeURIComponent(match[1]);
    const vehicle = catalog().find((item) => item.slug === slug);
    const detailId = vehicleSlugs()[slug] || vehicle?.id || vehicle?.sku;
    const detail = vehicle && publicJson(`vehicles/${detailId}.json`);
    const value = detail ? { ...vehicle, ...detail, id: detail.id, sku: vehicle.sku } : null;
    if (value) json(res, 200, shiftAuctionDates(value)); else json(res, 404, { error: 'Veiculo nao encontrado' });
    return true;
  }
  if (url.pathname === '/api/catalog' && req.method === 'GET') {
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 24));
    const query = (url.searchParams.get('q') || '').trim().toLocaleLowerCase('pt-BR');
    const category = (url.searchParams.get('category') || 'all').toLocaleLowerCase('pt-BR');
    const location = (url.searchParams.get('location') || '').toLocaleLowerCase('pt-BR');
    const brand = (url.searchParams.get('brand') || '').toLocaleLowerCase('pt-BR');
    const model = (url.searchParams.get('model') || '').toLocaleLowerCase('pt-BR');
    const color = (url.searchParams.get('color') || '').toLocaleLowerCase('pt-BR');
    const fuel = (url.searchParams.get('fuel') || '').toLocaleLowerCase('pt-BR');
    const transmission = (url.searchParams.get('transmission') || '').toLocaleLowerCase('pt-BR');
    const sort = url.searchParams.get('sort') || 'relevance';
    const searchText = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
    const queryTerms = searchText(query).split(/\s+/).filter(Boolean);
    const locationKey = (value) => String(value || '').trim().toLocaleLowerCase('pt-BR').replace(/\s*-\s*/g, '-');
    const filtered = catalog().filter((vehicle) => {
      const text = searchText([vehicle.brand, vehicle.model, vehicle.version].filter(Boolean).join(' '));
      const matchesText = queryTerms.every((term) => text.includes(term));
      const vehicleCategory = String(vehicle.category || '').toLocaleLowerCase('pt-BR');
      const matchesCategory = category === 'all' || vehicleCategory.includes(category);
      const matches = (field, expected) => !expected || String(field || '').toLocaleLowerCase('pt-BR') === expected;
      return matchesText && matchesCategory && (!location || locationKey(vehicle.location) === locationKey(location)) && matches(vehicle.brand, brand) && matches(vehicle.model, model)
        && matches(vehicle.color, color) && matches(vehicle.fuel, fuel) && matches(vehicle.transmission, transmission);
    });
    const value = (vehicle, field) => Number(vehicle[field]) || 0;
    filtered.sort((first, second) => {
      if (sort === 'price-asc') return (Number(adjustedAuctionPrice(first, first.lastBid)) || 0) - (Number(adjustedAuctionPrice(second, second.lastBid)) || 0);
      if (sort === 'price-desc') return (Number(adjustedAuctionPrice(second, second.lastBid)) || 0) - (Number(adjustedAuctionPrice(first, first.lastBid)) || 0);
      if (sort === 'mileage-asc') return value(first, 'mileage') - value(second, 'mileage');
      if (sort === 'mileage-desc') return value(second, 'mileage') - value(first, 'mileage');
      if (sort === 'year-desc') return value(second, 'modelYear') - value(first, 'modelYear');
      if (sort === 'year-asc') return value(first, 'modelYear') - value(second, 'modelYear');
      const lotOrder = Number(Boolean(second.lotId)) - Number(Boolean(first.lotId));
      if (lotOrder) return lotOrder;
      if (first.lotId && second.lotId) {
        return `${first.event?.date || ''} ${first.estimatedStartTime || ''}`.localeCompare(`${second.event?.date || ''} ${second.estimatedStartTime || ''}`);
      }
      return 0;
    });
    const facets = {};
    for (const field of ['location', 'category', 'brand', 'color', 'fuel', 'transmission']) {
      const values = catalog().map((vehicle) => vehicle[field]).filter(Boolean);
      facets[field] = (field === 'location' ? [...new Map(values.map((value) => [locationKey(value), value])).values()] : [...new Set(values)])
        .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' }));
    }
    const start = (page - 1) * limit;
    json(res, 200, {
      items: shiftAuctionDates(filtered.slice(start, start + limit).map((vehicle) => ({ ...vehicle, id: vehicleSlugs()[vehicle.slug] || vehicle.id || vehicle.sku }))),
      total: filtered.length,
      eventTotal: filtered.filter((vehicle) => vehicle.event?.id || vehicle.lotId).length,
      futureTotal: catalog().filter((vehicle) => !(vehicle.event?.id || vehicle.lotId)).length,
      facets,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      limit
    });
    return true;
  }
  if ((url.pathname === '/api/local-auth/register' || url.pathname === '/api/local-auth/login') && req.method === 'POST') {
    const isRegistration = url.pathname.endsWith('/register');
    const limitKey = `local-auth:${isRegistration ? 'register' : 'login'}:${clientAddress(req)}`;
    if (!allowRateLimit(limitKey, isRegistration ? 5 : 10, 15 * 60 * 1000)) {
      json(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }, { 'Cache-Control': 'no-store' });
      return true;
    }
    const raw = await collectBody(req);
    let body;
    try { body = JSON.parse(raw); } catch { json(res, 400, { error: 'JSON invalido' }); return true; }
    const email = String(body.email || '').trim().toLocaleLowerCase('pt-BR');
    const password = String(body.password || '');
    const name = String(body.name || '').trim().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 10 || password.length > 200 || (isRegistration && name.length < 2)) {
      json(res, 400, { error: 'Dados invalidos' }, { 'Cache-Control': 'no-store' });
      return true;
    }
    const db = readLocalDb();
    const existing = db.users.find((user) => user.email === email);
    if (url.pathname.endsWith('/register')) {
      if (existing) { json(res, 409, { error: 'E-mail ja cadastrado' }); return true; }
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
      db.users.push({ id: crypto.randomUUID(), name, email, salt, passwordHash, createdAt: new Date().toISOString() });
      writeLocalDb(db);
      json(res, 201, { message: 'Cadastro local criado com sucesso.' });
      return true;
    }
    if (!existing) { json(res, 401, { error: 'Credenciais invalidas' }); return true; }
    const passwordHash = crypto.scryptSync(password, existing.salt, 64).toString('hex');
    if (!crypto.timingSafeEqual(Buffer.from(passwordHash, 'hex'), Buffer.from(existing.passwordHash, 'hex'))) { json(res, 401, { error: 'Credenciais invalidas' }); return true; }
    const sessionId = crypto.randomBytes(24).toString('hex');
    localSessions.set(sessionId, existing);
    json(res, 200, { message: `Bem-vindo, ${existing.name || existing.email}.` }, {
      'Set-Cookie': `loop_session=${sessionId}; Path=/; ${cookieSecurity(req)}; Max-Age=28800`,
      'Cache-Control': 'no-store'
    });
    return true;
  }
  if (url.pathname === '/api/search/leilao' && req.method === 'POST') {
    const body = await collectBody(req);
    let request = {};
    try { request = body ? JSON.parse(body) : {}; } catch { /* corpo invalido equivale a busca vazia */ }
    json(res, 200, searchResponse(request));
    return true;
  }
  if (url.pathname === '/api/auction/users/viewed-modal' && req.method === 'PUT') {
    json(res, 200, { success: true });
    return true;
  }
  return false;
}

function handleCms(req, res, url) {
  if (url.pathname === '/cms/banners-leilao' && req.method === 'GET') {
    json(res, 200, captured.nextData.get('getBanners') || {});
    return true;
  }
  if (url.pathname === '/cms/noticias' && req.method === 'GET') {
    const news = captured.nextData.get('getNewsList') || [];
    const limit = Number(url.searchParams.get('_limit'));
    json(res, 200, limit > 0 ? news.slice(0, limit) : news);
    return true;
  }
  if (url.pathname.startsWith('/cms/uploads/')) {
    const file = findCapturedFile(path.join(SNAPSHOT_ROOT, 'strapi.loopbrasil.com'), url.pathname.slice('/cms/'.length));
    if (file) {
      serveFile(res, file, false);
      return true;
    }
    res.writeHead(302, {
      Location: `https://strapi.loopbrasil.com${url.pathname.slice('/cms'.length)}`,
      'Cache-Control': 'public, max-age=3600'
    });
    res.end();
    return true;
  }
  return false;
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' wss:; media-src 'self' https:; frame-src 'self'");
    if (requestIsHttps(req)) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    try {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !isSameOriginRequest(req)) {
        json(res, 403, { error: 'Origem da requisição não permitida.' }, { 'Cache-Control': 'no-store' });
        return;
      }
      if (url.pathname.startsWith('/api/') && req.method !== 'GET' && !allowRateLimit(`write:${clientAddress(req)}`, 120, 60 * 1000)) {
        json(res, 429, { error: 'Muitas requisições. Aguarde alguns instantes.' });
        return;
      }
      runAutomaticPostpone();
      trackPageView(req, res, url);

      if (url.pathname === '/health') {
        json(res, 200, { status: 'ok', snapshotFiles: 2414 });
        return;
      }

      if (req.method === 'GET' && url.pathname === '/go/whatsapp') {
        const recipient = trackWhatsapp(req);
        const text = String(url.searchParams.get('text') || '').slice(0, 1500);
        const target = new URL(`https://wa.me/${recipient}`);
        if (text) target.searchParams.set('text', text);
        res.writeHead(302, { Location: target.href, 'Cache-Control': 'no-store' });
        res.end();
        return;
      }

      if (req.method === 'GET' && url.pathname === '/logout') {
        const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith('loop_session='));
        if (cookie) localSessions.delete(cookie.slice('loop_session='.length));
        res.writeHead(302, { Location: '/', 'Set-Cookie': `loop_session=; Path=/; ${cookieSecurity(req)}; Max-Age=0` });
        res.end();
        return;
      }

      if (req.method === 'GET' && url.pathname.startsWith('/minha-conta/') && !sessionUser(req)) {
        res.writeHead(302, { Location: `/login?origem=${encodeURIComponent(url.pathname)}` });
        res.end();
        return;
      }

      if (url.pathname.startsWith('/api/') && await handleApi(req, res, url)) return;
      if (url.pathname.startsWith('/cms/') && handleCms(req, res, url)) return;

      if (url.pathname.startsWith('/__mirror/')) {
        const remainder = url.pathname.slice('/__mirror/'.length);
        const separator = remainder.indexOf('/');
        const host = separator === -1 ? remainder : remainder.slice(0, separator);
        const relativePath = separator === -1 ? '' : remainder.slice(separator + 1);
        if (mirroredHosts.includes(host)) {
          const file = findCapturedFile(path.join(SNAPSHOT_ROOT, host), relativePath);
          if (file) {
            serveFile(res, file, true);
            return;
          }

          // A captura original nao contem todas as variacoes xs/sm/md/xl.
          // Quando uma delas faltar, entregue a foto local equivalente pelo
          // nome do arquivo em vez de deixar um bloco vazio no navegador.
          if (host.endsWith('.oraclecloud.com') && relativePath.includes('/vehicle-photos/')) {
            let filename = '';
            try { filename = path.basename(decodeURIComponent(relativePath)); } catch {}
            const indexed = filename ? imageByFilename(filename) : null;
            const local = indexed ? findCapturedFile(PUBLIC_MEDIA_ROOT, indexed.relativePath) : null;
            if (local) {
              serveFile(res, local, false);
              return;
            }
          }
        }
      }

      if (url.pathname === '/_next/image') {
        const requested = url.searchParams.get('url');
        let remote;
        if (requested?.startsWith('/__mirror/')) {
          const remainder = requested.slice('/__mirror/'.length);
          const separator = remainder.indexOf('/');
          const host = separator === -1 ? remainder : remainder.slice(0, separator);
          const relativePath = separator === -1 ? '' : remainder.slice(separator + 1);
          if (mirroredHosts.includes(host)) {
            try { remote = new URL(`https://${host}/${relativePath}`); } catch { remote = null; }
          }
        } else if (requested?.startsWith('/cms/uploads/')) {
          try { remote = new URL(`https://strapi.loopbrasil.com${requested.slice('/cms'.length)}`); } catch { remote = null; }
        } else {
          try { remote = new URL(requested); } catch { remote = null; }
        }
        const allowedImageHost = remote?.hostname.endsWith('.oraclecloud.com') || remote?.hostname === 'strapi.loopbrasil.com';
        if (remote?.protocol === 'https:' && allowedImageHost) {
          const mirrored = findCapturedFile(path.join(SNAPSHOT_ROOT, remote.hostname), remote.pathname);
          if (mirrored) {
            serveFile(res, mirrored, false);
            return;
          }

          const filename = path.basename(decodeURIComponent(remote.pathname));
          const indexed = imageByFilename(filename);
          if (indexed) {
            const local = findCapturedFile(PUBLIC_MEDIA_ROOT, indexed.relativePath);
            if (local) {
              serveFile(res, local, false);
              return;
            }
            res.writeHead(302, { Location: indexed.source, 'Cache-Control': 'no-store' });
            res.end();
            return;
          }
          ensureImageSourceCache();
          const byFilename = imageFilenameCache.get(filename.toLocaleLowerCase('pt-BR'));
          if (byFilename) {
            const local = findCapturedFile(PUBLIC_MEDIA_ROOT, byFilename.relativePath);
            if (local) {
              serveFile(res, local, false);
              return;
            }
          }

          res.writeHead(302, { Location: remote.href, 'Cache-Control': 'public, max-age=3600' });
          res.end();
          return;
        }
        json(res, 400, { error: 'Imagem externa nao permitida' });
        return;
      }

      if (url.pathname.startsWith('/_next/')) {
        const file = findCapturedFile(SITE_ROOT, url.pathname);
        if (file) {
          const isLargeAppBundle = path.basename(file).startsWith('_app-') && path.extname(file) === '.js';
          serveFile(res, file, !isLargeAppBundle);
          return;
        }
      }

      if (url.pathname === '/app.css' || url.pathname === '/app.js') {
        const file = findCapturedFile(APP_ROOT, url.pathname.slice(1));
        if (file) {
          serveFile(res, file, false, 'no-store');
          return;
        }
      }

      if (url.pathname.startsWith('/app-assets/')) {
        const file = findCapturedFile(path.join(APP_ROOT, 'assets'), url.pathname.slice('/app-assets/'.length));
        if (file) {
          serveFile(res, file, false);
          return;
        }
      }

      // A Hostinger bloqueia com 403 URLs de arquivos .jpg que nao existem no
      // deploy antes de encaminha-las ao Node. Esta rota sem extensao entrega
      // as fotos locais quando presentes e busca a copia oficial caso contrario.
      if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname === '/vehicle-image') {
        const vehicleId = url.searchParams.get('vehicle') || '';
        const filename = url.searchParams.get('file') || '';
        if (!/^\d+$/.test(vehicleId) || !filename || path.basename(filename) !== filename) {
          json(res, 400, { error: 'Imagem invalida' });
          return;
        }

        const exactLocal = findCapturedFile(PUBLIC_MEDIA_ROOT, `vehicles/${vehicleId}/${filename}`);
        if (exactLocal) {
          serveFile(res, exactLocal, false);
          return;
        }

        const indexed = imageByFilename(filename);
        const fallbackFilename = null;
        if (!indexed) {
          json(res, 404, { error: 'Imagem nao encontrada' });
          return;
        }

        const candidates = [indexed];
        const fallback = fallbackFilename ? imageByFilename(fallbackFilename) : null;
        if (fallback && fallback.relativePath !== indexed.relativePath) candidates.push(fallback);

        for (const candidate of candidates) {
          const local = findCapturedFile(PUBLIC_MEDIA_ROOT, candidate.relativePath);
          if (local) {
            serveFile(res, local, false);
            return;
          }
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.writeHead(302, { Location: candidate.source, 'Cache-Control': 'no-store' });
          res.end();
          return;
        }
        json(res, 502, { error: 'Falha ao carregar imagem' });
        return;
      }

      if (url.pathname.startsWith('/media/')) {
        const relativeMediaPath = url.pathname.slice('/media/'.length);
        const file = findCapturedFile(PUBLIC_MEDIA_ROOT, relativeMediaPath);
        if (file) {
          serveFile(res, file, false);
          return;
        }
        ensureImageSourceCache();
        const filename = path.basename(decodeURIComponent(relativeMediaPath));
        const byFilename = imageFilenameCache.get(filename.toLocaleLowerCase('pt-BR'));
        if (byFilename) {
          const local = findCapturedFile(PUBLIC_MEDIA_ROOT, byFilename.relativePath);
          if (local) {
            serveFile(res, local, false);
            return;
          }
        }
        const remoteSource = imageSource(relativeMediaPath);
        if (remoteSource) {
          res.writeHead(302, { Location: remoteSource, 'Cache-Control': 'no-store' });
          res.end();
          return;
        }
      }

      if (req.method === 'GET' && url.pathname === '/') {
        serveFile(res, INDEX_FILE, true);
        return;
      }

      if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
        const capturedPage = findCapturedFile(SITE_ROOT, url.pathname);
        if (capturedPage && path.extname(capturedPage).toLowerCase() === '.html') {
          serveFile(res, capturedPage, true);
          return;
        }
      }

      if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
        serveFile(res, path.join(APP_ROOT, 'index.html'), false);
        return;
      }

      json(res, 404, { error: 'Rota nao encontrada', path: url.pathname });
    } catch (error) {
      console.error(error);
      if (!res.headersSent) json(res, 500, { error: 'Erro interno do servidor' });
      else res.end();
    }
  });
}

function startServer() {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  const server = createServer();
  server.listen(port, host, () => {
    console.log(`Loop Leiloes: http://${host}:${port}`);
    if (!ADMIN_PASSWORD_READY) console.warn('Painel /admin desativado: configure LOOP_ADMIN_PASSWORD com pelo menos 16 caracteres.');
  });
  const automaticPostponeTimer = setInterval(runAutomaticPostpone, 60_000);
  automaticPostponeTimer.unref();
  return server;
}

const disableAutoListen = /^(1|true|yes)$/i.test(process.env.LOOP_DISABLE_AUTO_LISTEN || '');
if (!disableAutoListen) startServer();

module.exports = { createServer, rewriteExternalUrls, runAutomaticPostpone, sanitizeJsonControlCharacters, startServer };
