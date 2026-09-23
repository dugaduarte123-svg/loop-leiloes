'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.env.LOOP_DISABLE_AUTO_LISTEN = 'true';
const { createServer } = require('../server');

let server;
let origin;

test.before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('entrega a home original com dependencias locais', async () => {
  const response = await fetch(`${origin}/`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Leil/);
  assert.match(html, /\/_next\/static\/chunks\/pages\/index-/);
  assert.doesNotMatch(html, /https:\/\/api\.loopleiloes\.com\.br/);
  assert.match(html, /https:\/\/objectstorage\.sa-saopaulo-1\.oraclecloud\.com/);
});

test('aplica cabecalhos de seguranca e bloqueia escrita entre origens', async () => {
  const health = await fetch(`${origin}/health`);
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(health.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.match(health.headers.get('content-security-policy'), /default-src 'self'/);

  const blocked = await fetch(`${origin}/api/search/leilao`, {
    method: 'POST',
    headers: { origin: 'https://site-malicioso.example', 'content-type': 'application/json' },
    body: '{}'
  });
  assert.equal(blocked.status, 403);
});

test('entrega o cadastro original da segunda captura', async () => {
  const response = await fetch(`${origin}/cadastro`, { headers: { accept: 'text/html' } });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /\/_next\/static\/chunks\/pages\/cadastro-38bba157c1a7d25f\.js/);
  assert.doesNotMatch(html, /https:\/\/api\.loopleiloes\.com\.br/);

  const pageChunk = await fetch(`${origin}/_next/static/chunks/pages/cadastro-38bba157c1a7d25f.js`);
  assert.equal(pageChunk.status, 200);

  const emptyTracker = await fetch(`${origin}/__mirror/assets.adobedtm.com/extensions/EPc7341b33570d4c988798fc9f0093d4b2/AppMeasurement.min.js`);
  assert.equal(emptyTracker.status, 204);
});

test('entrega eventos, lotes e busca pela API local', async () => {
  const events = await fetch(`${origin}/api/auction/events`).then((response) => response.json());
  const lots = await fetch(`${origin}/api/auction/lots/featured?quantityOfLots=4`).then((response) => response.json());
  const search = await fetch(`${origin}/api/search/leilao`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ size: 0, aggs: { brands: {}, composite_brand_model: {} } })
  }).then((response) => response.json());

  assert.ok(events.length > 0);
  assert.equal(lots.length, 4);
  assert.ok(search.hits.total.value > 0);
  assert.ok(search.aggregations.brands.buckets.length > 0);
});

test('entrega conteudo do CMS e imagens espelhadas', async () => {
  const banners = await fetch(`${origin}/cms/banners-leilao`).then((response) => response.json());
  const news = await fetch(`${origin}/cms/noticias?_limit=4`).then((response) => response.json());
  const image = await fetch(`${origin}/__mirror/objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Flogo-leilao.svg`);

  assert.ok(Array.isArray(banners.banners));
  assert.equal(news.length, 4);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /svg/);
});

test('entrega o aviso anti-golpe personalizado pelo proprio site', async () => {
  const pageChunk = await fetch(`${origin}/_next/static/chunks/pages/index-9bd418cb92a1996f.js`);
  const javascript = await pageChunk.text();
  const image = await fetch(`${origin}/aviso-anti-golpe?v=20260923-1`);

  assert.equal(pageChunk.status, 200);
  assert.match(javascript, /src: "\/aviso-anti-golpe\?v=20260923-1"/);
  assert.doesNotMatch(javascript, /src: "https:\/\/objectstorage[^\"]+modal-anti-golpe\.png/);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/png/);
  assert.equal((await image.arrayBuffer()).byteLength, 752938);
});

test('atende imagens otimizadas da home e redireciona assets publicos', async () => {
  const source = 'https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-depoiments-5.jpg';
  const params = new URLSearchParams({ url: source, w: '256', q: '75' });
  const response = await fetch(`${origin}/_next/image?${params}`, { redirect: 'manual' });
  assert.ok(response.status === 200 || response.status === 302);
  if (response.status === 302) assert.match(response.headers.get('location'), /oraclecloud\.com/);
});

test('entrega fotos de veiculos por uma rota aceita pela Hostinger', async () => {
  const params = new URLSearchParams({
    vehicle: '60102679',
    file: 'chevrolet-prisma-1-4-mpfi-joy-8v-flex-4p-manual-frente-passageiro-ca0f7933.jpg'
  });
  const response = await fetch(`${origin}/vehicle-image?${params}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/jpeg/);
  assert.ok((await response.arrayBuffer()).byteLength > 1000);

  const fallbackParams = new URLSearchParams({
    vehicle: '60086395',
    file: 'renault-master13m3-25dci-frente-motorista-831b7064.jpg'
  });
  const fallback = await fetch(`${origin}/vehicle-image?${fallbackParams}`);
  assert.equal(fallback.status, 200);
  assert.match(fallback.headers.get('content-type'), /image\/jpeg/);
});

test('entrega as novas paginas publicas e o catalogo completo', async () => {
  const page = await fetch(`${origin}/estoque`, { headers: { accept: 'text/html' } });
  const html = await page.text();
  const catalog = await fetch(`${origin}/api/catalog?limit=12&q=volkswagen`).then((response) => response.json());
  const events = await fetch(`${origin}/api/auction/events`).then((response) => response.json());
  const event = await fetch(`${origin}/api/auction/events/${events[0].id}`).then((response) => response.json());
  const lots = await fetch(`${origin}/api/auction/events/${events[0].id}/lots`).then((response) => response.json());

  assert.equal(page.status, 200);
  assert.match(html, /app\.js/);
  assert.ok(catalog.total > 0);
  assert.ok(catalog.items.length <= 12);
  assert.ok(catalog.facets.category.includes('Leve'));
  assert.ok(catalog.facets.category.includes('Moto'));
  assert.ok(catalog.facets.category.includes('Pesado'));
  assert.equal(event.id, events[0].id);
  assert.ok(Array.isArray(lots));
});

test('protege a area privada como o site oficial', async () => {
  const response = await fetch(`${origin}/minha-conta/compras`, { redirect: 'manual', headers: { accept: 'text/html' } });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), '/login?origem=%2Fminha-conta%2Fcompras');
});

test('entrega todas as familias de rotas do manifesto pela aplicacao local', async () => {
  const routes = [
    '/cadastro/confirmar-email', '/cadastro/confirmar-sms', '/cadastro/informacoes/pagamento',
    '/cadastro/token-local/sucesso', '/esqueci-minha-senha', '/esqueci-minha-senha/token-local',
    '/eventos/condicionais', '/financiamento', '/leilao-automotivo', '/login',
    '/minha-conta/alterar-cadastro', '/minha-conta/alterar-documentos', '/minha-conta/compras',
    '/minha-conta/compras/123/documentacao', '/minha-conta/favoritos', '/minha-conta/tickets/123',
    '/noticias/de-onde-vem-os-carros-leiloados', '/pre-cadastro/evento-local',
    '/transmissao/live/123', '/transmissao/sala/123', '/venda-sua-frota', '/venda-sua-frota/sucesso'
  ];
  for (const route of routes) {
    const response = await fetch(`${origin}${route}`, { headers: { accept: 'text/html' } });
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert.match(html, /<main id="app">/, route);
    assert.match(html, /app\.js/, route);
  }
});

test('todos os lotes atuais possuem pagina completa e galeria', async () => {
  const lots = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'public-api', 'lots-index.json'), 'utf8'));
  assert.ok(lots.length > 200);

  for (const indexedLot of lots) {
    const response = await fetch(`${origin}/api/auction/lots/${indexedLot.id}`);
    const lot = await response.json();
    assert.equal(response.status, 200, `lote ${indexedLot.id}`);
    assert.equal(lot.id, indexedLot.id, `lote ${indexedLot.id}`);
    assert.ok(lot.description, `descricao do lote ${indexedLot.id}`);
    assert.ok(lot.vehicle?.images?.length > 0, `galeria do lote ${indexedLot.id}`);
    assert.ok(lot.mainInfo, `ficha tecnica do lote ${indexedLot.id}`);
    assert.ok(lot.observation, `observacoes do lote ${indexedLot.id}`);
    assert.ok(lot.inspectionInfo?.length > 0, `vistoria do lote ${indexedLot.id}`);
    assert.ok(lot.principal?.description, `comitente do lote ${indexedLot.id}`);
    assert.ok(Number(lot.lastBid) > 0, `valor ajustado do lote ${indexedLot.id}`);
  }
});

test('todos os produtos de estoque possuem detalhe e pagina publica', async () => {
  const search = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'public-api', 'search-all.json'), 'utf8'));
  const vehicles = search.hits.hits.map((hit) => hit._source);
  const categories = new Set(vehicles.map((vehicle) => vehicle.category));
  assert.equal(vehicles.length, 1917);
  assert.deepEqual(categories, new Set(['Leve', 'Moto', 'Pesado']));

  for (let start = 0; start < vehicles.length; start += 40) {
    const batch = vehicles.slice(start, start + 40);
    const responses = await Promise.all(batch.map(async (vehicle) => {
      const response = await fetch(`${origin}/api/vehicles/${encodeURIComponent(vehicle.slug)}`);
      return { vehicle, response, detail: await response.json() };
    }));
    for (const { vehicle, response, detail } of responses) {
      assert.equal(response.status, 200, vehicle.slug);
      assert.equal(detail.brand, vehicle.brand, vehicle.slug);
      assert.ok(detail.mainInfo, `ficha tecnica ${vehicle.slug}`);
      assert.ok(detail.inspectionInfo?.length > 0, `vistoria ${vehicle.slug}`);
    }
  }

  for (const category of categories) {
    const vehicle = vehicles.find((item) => item.category === category);
    const response = await fetch(`${origin}/veiculo/${vehicle.slug}`, { headers: { accept: 'text/html' } });
    assert.equal(response.status, 200, category);
    assert.match(await response.text(), /app\.js\?v=20260919-3/, category);
  }
});
