'use strict';

const app = document.querySelector('#app');
document.querySelector('#footer-year')?.replaceChildren(String(new Date().getFullYear()));
const state = { catalog: null, page: 1, query: '', category: 'all', filters: { location: '', brand: '', model: '', color: '', fuel: '', transmission: '', sort: 'relevance' } };
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const number = new Intl.NumberFormat('pt-BR');
const normalizeText = (value = '') => {
  const text = String(value);
  if (!/[ÃÂ]/.test(text)) return text;
  try { return decodeURIComponent(escape(text)); } catch { return text; }
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const request = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Erro ${response.status}`);
  return response.json();
};
const breadcrumb = (label) => `<div class="breadcrumb"><a href="/">Início</a> &nbsp;/&nbsp; ${escapeHtml(label)}</div>`;
const vehicleImagePath = (vehicleId, filename) => vehicleId && filename
  ? `/vehicle-image?vehicle=${encodeURIComponent(vehicleId)}&file=${encodeURIComponent(filename)}`
  : '/app-assets/placeholder.webp';
const localVehicleImage = (vehicle) => vehicleImagePath(vehicle?.id || vehicle?.sku, vehicle?.image);

function vehicleCard(vehicle) {
  const rawUrl = vehicle.url || '';
  const url = vehicle.lotId ? (rawUrl.startsWith('/leilao/') ? rawUrl : `/leilao${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`) : `/veiculo/${vehicle.slug}`;
  const eventDate = vehicle.event?.date ? new Date(`${vehicle.event.date}T12:00:00`).toLocaleDateString('pt-BR') : '';
  const eventTime = String(vehicle.estimatedStartTime || '').match(/(\d{2}:\d{2})(?::\d{2})?$/)?.[1] || '';
  return `<a class="vehicle-card ${vehicle.lotId ? 'auction-card' : ''}" href="${escapeHtml(url || '#')}">
    ${vehicle.lotId ? `<div class="card-tags"><span>Lote ${escapeHtml(vehicle.number || '')}</span>${vehicle.isFinanciable ? '<span>Financiamento</span>' : ''}</div>` : ''}
    <span class="favorite" aria-label="Adicionar aos favoritos">♡</span>
    <div class="photo"><img loading="lazy" src="${localVehicleImage(vehicle)}" alt="${escapeHtml(`${vehicle.brand || ''} ${vehicle.model || ''}`)}" onerror="this.onerror=null;this.src='/app-assets/placeholder.webp'"></div>
    ${vehicle.lotId ? `<div class="event-strip">Lote em pregão${eventDate ? ` dia ${eventDate}` : ''}${eventTime ? ` às ${eventTime}` : ''}</div>` : ''}
    <div class="card-body"><h3>${escapeHtml([vehicle.brand, vehicle.model, vehicle.version].filter(Boolean).join(' '))}</h3>
      <div class="meta"><span>${escapeHtml(vehicle.manufactureYear || '')}/${escapeHtml(vehicle.modelYear || '')}</span><span>•</span><span>Km ${number.format(vehicle.mileage || 0)}</span><span>•</span><span>${escapeHtml(normalizeText(vehicle.location || ''))}</span></div>
      ${vehicle.lastBid ? `<div class="price"><span>Aberto para Lance</span>Lance atual:<strong>${money.format(vehicle.lastBid)}</strong><b>Dar lance agora</b></div>` : '<div class="price">Disponível para compra<strong>Ver veículo</strong></div>'}
    </div></a>`;
}

function filterOptions(values, field, selected) {
  return (values || []).slice(0, field === 'brand' ? 20 : 15).map((value) => `<label><input type="checkbox" name="${field}" data-filter="${field}" value="${escapeHtml(value)}" ${selected === value ? 'checked' : ''}>${escapeHtml(normalizeText(value))}</label>`).join('');
}

function renderFilters(data) {
  const filters = state.filters;
  const container = document.querySelector('#filters');
  const existingSections = [...container.querySelectorAll('details')];
  const openSections = existingSections.length
    ? new Set(existingSections.filter((section) => section.open).map((section) => section.dataset.section))
    : new Set(['location', 'category', 'brand']);
  const isOpen = (section) => openSections.has(section) ? ' open' : '';
  container.innerHTML = `<details data-section="location"${isOpen('location')}><summary>Localidade</summary><div>${filterOptions(data.facets.location, 'location', filters.location)}</div></details>
    <details data-section="category"${isOpen('category')}><summary>Tipo</summary><div>${filterOptions(data.facets.category, 'category', state.category === 'all' ? '' : state.category)}</div></details>
    <details data-section="brand"${isOpen('brand')}><summary>Marca e modelo</summary><div>${filterOptions(data.facets.brand, 'brand', filters.brand)}</div></details>
    <details data-section="color"${isOpen('color')}><summary>Cor</summary><div>${filterOptions(data.facets.color, 'color', filters.color)}</div></details>
    <details data-section="fuel"${isOpen('fuel')}><summary>Combustível</summary><div>${filterOptions(data.facets.fuel, 'fuel', filters.fuel)}</div></details>
    <details data-section="transmission"${isOpen('transmission')}><summary>Transmissão</summary><div>${filterOptions(data.facets.transmission, 'transmission', filters.transmission)}</div></details>`;
  document.querySelectorAll('[data-filter]').forEach((input) => input.addEventListener('change', () => {
    if (input.checked) document.querySelectorAll(`[data-filter="${input.dataset.filter}"]`).forEach((item) => { if (item !== input) item.checked = false; });
    if (input.dataset.filter === 'category') state.category = input.checked ? input.value : 'all';
    else state.filters[input.dataset.filter] = input.checked ? input.value : '';
    state.page = 1;
    loadCatalog();
  }));
}

async function renderStock() {
  const urlFilters = new URLSearchParams(location.search);
  state.page = Math.max(1, Number(urlFilters.get('pagina')) || 1);
  state.query = urlFilters.get('q') || urlFilters.get('busca') || '';
  state.category = urlFilters.get('tipo') || 'all';
  state.filters.brand = urlFilters.get('marca') || '';
  state.filters.model = urlFilters.get('modelo') || '';
  document.title = 'Leilão de carros online e presencial: compre seu carro na Loop';
  app.innerHTML = `<section class="stock-page"><div class="stock-search"><input id="search" class="field" placeholder="Digite a marca ou modelo"><button id="clear-filters" type="button">⌫ &nbsp; Limpar Filtros</button></div><div class="stock-layout"><aside id="filters"><div class="loading"><span></span></div></aside><section class="stock-results"><div id="catalog"></div></section></div></section>`;
  const search = document.querySelector('#search');
  document.querySelector('#clear-filters').innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"/></svg><span>Limpar Filtros</span>`;
  let timer;
  search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { state.query = search.value; state.page = 1; loadCatalog(); }, 250); });
  document.querySelector('#clear-filters').addEventListener('click', () => { state.page = 1; state.query = ''; state.category = 'all'; state.filters = { location: '', brand: '', model: '', color: '', fuel: '', transmission: '', sort: 'relevance' }; search.value = ''; history.replaceState({}, '', '/estoque'); loadCatalog(); });
  await loadCatalog();
}

async function loadCatalog() {
  const target = document.querySelector('#catalog');
  target.innerHTML = '<div class="loading"><span></span>Buscando veículos...</div>';
  const params = new URLSearchParams({ page: state.page, limit: 24, q: state.query, category: state.category, ...state.filters });
  const data = await request(`/api/catalog?${params}`);
  state.catalog = data;
  renderFilters(data);
  target.innerHTML = `<div class="stock-result-head"><strong>${number.format(data.total)} veículos encontrados</strong><label>Ordenar por:<select id="sort"><option value="relevance">Relevância</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="mileage-asc">Menor quilometragem</option><option value="mileage-desc">Maior quilometragem</option><option value="year-desc">Ano decrescente</option><option value="year-asc">Ano crescente</option></select></label></div>${data.items.length ? `<div class="grid">${data.items.map(vehicleCard).join('')}</div>` : '<div class="empty">Nenhum veículo encontrado com esses filtros.</div>'}<div class="pagination"><button id="prev" ${data.page <= 1 ? 'disabled' : ''}>Anterior</button><button class="active">${data.page} de ${data.pages}</button><button id="next" ${data.page >= data.pages ? 'disabled' : ''}>Próxima</button></div>`;
  const sort = document.querySelector('#sort');
  sort.value = state.filters.sort;
  sort.addEventListener('change', () => { state.filters.sort = sort.value; state.page = 1; loadCatalog(); });
  document.querySelector('#prev')?.addEventListener('click', () => { state.page -= 1; loadCatalog(); scrollTo(0, 0); });
  document.querySelector('#next')?.addEventListener('click', () => { state.page += 1; loadCatalog(); scrollTo(0, 0); });
}

async function renderEvents() {
  document.title = 'Próximos eventos de leilão de carros online e presencial | Loop';
  const events = await request('/api/auction/events');
  const lotsByEvent = await Promise.all(events.map((event) => request(`/api/auction/events/${event.id}/lots`)));
  app.innerHTML = `<section class="events-page"><h1>Agenda de eventos</h1><div class="events-timeline">${events.map((event, index) => {
    const date = new Date(`${event.date}T12:00:00`);
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '-feira').toUpperCase();
    const type = String(event.type || 'online').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const lots = lotsByEvent[index] || [];
    return `<div class="event-row"><div class="event-marker"><strong>${String(date.getDate()).padStart(2, '0')} ${date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()}</strong><span>${weekday}</span><i></i></div><article class="official-event-card"><div class="event-summary"><div class="event-logo"><img src="/app-assets/logo-loop.svg" alt="Loop"></div><div><h2>${escapeHtml(event.title)}</h2><p>▣ &nbsp;${date.toLocaleDateString('pt-BR')} &nbsp;&nbsp;&nbsp; ◷ &nbsp;${escapeHtml(event.time)} &nbsp;&nbsp;&nbsp; ▣ &nbsp;${number.format(event.numberOfLots || lots.length)} veículos</p><span>▣ &nbsp; ${escapeHtml(type)}</span></div><a href="/eventos/${escapeHtml(event.slug)}/${event.id}" aria-label="Abrir evento">⌃</a></div><div class="event-preview">${lots.slice(0, 3).map((lot) => vehicleCard({ ...lot.vehicle, lotId: lot.id, number: lot.number, url: lot.url, lastBid: lot.lastBid, event: { id: event.id, date: event.date }, estimatedStartTime: lot.estimatedStartTime, isFinanciable: lot.isFinancing })).join('')}</div><a class="event-all" href="/eventos/${escapeHtml(event.slug)}/${event.id}">Ver todos os lotes</a></article></div>`;
  }).join('')}</div><section class="events-help"><h2>Quer saber como participar dos nossos leilões?</h2><a class="button" href="/conteudo/como-participar-do-leilao">Saiba mais</a></section><section class="newsletter">Receba as melhores ofertas antes de todo mundo! Inscreva-se em nossa <strong>NEWSLETTER:</strong><input class="field" type="email"><button class="button">Assinar</button></section></section>`;
}

async function renderEvent(eventId) {
  const [event, lots] = await Promise.all([request(`/api/auction/events/${eventId}`), request(`/api/auction/events/${eventId}/lots`)]);
  document.title = `${event.title} | Loop Leilões`;
  app.innerHTML = `<section class="page">${breadcrumb('Evento')}<div class="hero"><h1>${escapeHtml(event.title)}</h1><p>${escapeHtml(event.location)} • ${escapeHtml(event.date)} às ${escapeHtml(event.time)} • ${number.format(lots.length)} lotes</p></div><h2>Veículos deste evento</h2><div class="grid">${lots.map((lot) => vehicleCard({ ...lot.vehicle, lotId: lot.id, url: lot.url, lastBid: lot.lastBid })).join('')}</div></section>`;
}

function gallery(vehicle) {
  const images = vehicle.images || [];
  const paths = images.map((image) => vehicleImagePath(vehicle.id, image.filename));
  return `<div><div class="gallery-main"><img id="main-photo" src="${paths[0] || '/app-assets/placeholder.webp'}" alt="${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}"><button id="prev-photo" class="gallery-arrow prev" aria-label="Foto anterior">‹</button><button id="next-photo" class="gallery-arrow next" aria-label="Próxima foto">›</button></div><div class="thumbs">${paths.map((src, index) => `<button class="${index === 0 ? 'active' : ''}" data-photo="${src}"><img loading="lazy" src="${src}" alt="Foto ${index + 1}"></button>`).join('')}</div></div>`;
}

function bindGallery() {
  let buttons = [...document.querySelectorAll('[data-photo]')];
  const select = (button) => {
    document.querySelector('#main-photo').src = button.dataset.photo;
    document.querySelectorAll('[data-photo]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  };
  buttons.forEach((button) => button.querySelector('img')?.addEventListener('error', () => {
    const wasActive = button.classList.contains('active');
    button.remove();
    buttons = buttons.filter((item) => item !== button);
    if (wasActive && buttons[0]) select(buttons[0]);
  }));
  buttons.forEach((button) => button.addEventListener('click', () => select(button)));
  const move = (direction) => {
    if (!buttons.length) return;
    const active = Math.max(0, buttons.findIndex((button) => button.classList.contains('active')));
    select(buttons[(active + direction + buttons.length) % buttons.length]);
  };
  document.querySelector('#prev-photo')?.addEventListener('click', () => move(-1));
  document.querySelector('#next-photo')?.addEventListener('click', () => move(1));
}

function bindMediaTabs(inspectionInfo = []) {
  const tabs = [...document.querySelectorAll('.lot-media-tabs button')];
  const videoTab = tabs.find((tab) => /v[ií]deos?/i.test(tab.textContent || ''));
  const mediaTabs = [...document.querySelectorAll('.lot-media-tabs button')];
  const cautionTab = mediaTabs.find((tab) => /cautelar/i.test(tab.textContent || ''));
  if (!cautionTab || !mediaTabs.length) return;
  const icons = {
    Fotos: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="1.5"/><path d="m5 17 4-4 3 3 2-2 5 3"/></svg>',
    Vídeos: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15 10 5-3v10l-5-3z"/><rect x="3" y="6" width="12" height="12" rx="1"/></svg>',
    Cautelar: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
  };
  mediaTabs.forEach((tab) => {
    const label = /cautelar/i.test(tab.textContent || '') ? 'Cautelar' : /v[ií]deos?/i.test(tab.textContent || '') ? 'Vídeos' : 'Fotos';
    tab.innerHTML = `${icons[label]}${label}`;
  });
  let panel = document.querySelector('.caution-panel');
  if (!panel) {
    panel = document.createElement('section');
    panel.className = 'caution-panel';
    panel.hidden = true;
    const rows = inspectionInfo.filter((item) => item.type === 'cautioninspection');
    panel.innerHTML = rows.length
      ? `<h2>Laudo cautelar</h2><div class="caution-grid">${rows.map((item) => `<div><span>${escapeHtml(normalizeText(item.label || ''))}</span><strong>${escapeHtml(normalizeText(item.description || '-'))}</strong></div>`).join('')}</div>`
      : '<h2>Laudo cautelar</h2><p>Laudo cautelar indisponível para este veículo.</p>';
    document.querySelector('.lot-media-tabs')?.after(panel);
  }
  let videoPanel = document.querySelector('.video-panel');
  if (videoTab && !videoPanel) {
    videoPanel = document.createElement('section');
    videoPanel.className = 'video-panel caution-panel';
    videoPanel.hidden = true;
    videoPanel.innerHTML = '<h2>Vídeos</h2><p>Vídeo indisponível para este veículo.</p>';
    panel.after(videoPanel);
  }
  const photoNodes = () => document.querySelectorAll('.gallery-main,.thumbs,.lot-gallery,.lot-thumbs');
  const setTab = (selected) => {
    const isCaution = selected === cautionTab;
    const isVideo = selected === videoTab;
    photoNodes().forEach((node) => { node.hidden = isCaution || isVideo; });
    panel.hidden = !isCaution;
    if (videoPanel) videoPanel.hidden = !isVideo;
    mediaTabs.forEach((tab) => {
      const active = tab === selected;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  };
  mediaTabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab)));
  setTab(mediaTabs.find((tab) => tab.classList.contains('active')) || mediaTabs[0]);
}

function specs(vehicle) {
  const info = vehicle.mainInfo || {};
  const values = [['Marca', vehicle.brand], ['Modelo', vehicle.model], ['Versão', vehicle.version], ['Ano', `${info.yearManufacture || vehicle.manufactureYear || '-'}/${info.yearModel || vehicle.modelYear || '-'}`], ['Quilometragem', `${number.format(info.mileage ?? vehicle.mileage ?? 0)} km`], ['Combustível', info.fuel || vehicle.fuel], ['Câmbio', info.transmission || vehicle.transmission], ['Cor', info.color || vehicle.color], ['Placa', info.licensePlate || vehicle.licensePlate], ['Localização', vehicle.location]];
  return `<div class="specs">${values.map(([label, value]) => `<div class="spec"><span>${label}</span><strong>${escapeHtml(value || '-')}</strong></div>`).join('')}</div>`;
}

async function renderVehicle(slug) {
  const vehicle = await request(`/api/vehicles/${encodeURIComponent(slug)}`);
  const bid = Number(vehicle.lastBid || 0);
  const whatsappText = encodeURIComponent(`Olá, equipe Loop Leilões. Tenho interesse no veículo ${normalizeText(`${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`)} anunciado por ${money.format(bid)}. Poderiam me orientar sobre os próximos passos? Link do veículo: ${window.location.href}`);
  const inspection = (vehicle.inspectionInfo || [])
    .filter((item) => !['Observações gerais', 'Resumo do laudo'].includes(normalizeText(item.label)))
    .sort((first, second) => normalizeText(first.label).localeCompare(normalizeText(second.label), 'pt-BR', { sensitivity: 'base' }));
  const observation = normalizeText(vehicle.observation || vehicle.inspectionInfo?.find((item) => normalizeText(item.label) === 'Observações gerais')?.description || 'Consulte todas as informações do veículo antes de participar.');
  document.title = `${normalizeText(vehicle.brand)} ${normalizeText(vehicle.model)} | Loop Leilões`;
  app.innerHTML = `<section class="page vehicle-detail-page">${breadcrumb('Veículo')}<div class="detail-layout"><div>${gallery(vehicle)}<div class="lot-media-tabs"><button class="active">▣ &nbsp; Fotos</button><button>▮ &nbsp; Vídeos</button><button>▣ &nbsp; Cautelar</button></div></div><aside class="detail-panel"><span class="badge">${escapeHtml(normalizeText(vehicle.category || vehicle.type || 'Veículo'))}</span><h1>${escapeHtml(normalizeText(`${vehicle.brand} ${vehicle.model}`))}</h1><p>${escapeHtml(normalizeText(vehicle.version || ''))}</p><div class="detail-price"><span>Lance inicial</span><strong>${money.format(bid)}</strong></div><a class="button whatsapp-bid" href="https://wa.me/5511980867294?text=${whatsappText}" target="_blank" rel="noopener">Dar lance via WhatsApp</a></aside></div>${specs(vehicle)}<section class="lot-section"><h2>Observações</h2><p>${escapeHtml(observation)}</p></section><section class="lot-section"><h2>Itens de vistoria</h2><div class="inspection-table">${inspection.map((item) => `<div><strong>${escapeHtml(normalizeText(item.label))}</strong><span>${escapeHtml(normalizeText(item.description || '-'))}</span></div>`).join('')}</div></section></section>`;
  bindGallery();
  bindMediaTabs(vehicle.inspectionInfo || []);
}

async function renderLot(eventId, lotId) {
  const [lot, event, eventLots] = await Promise.all([
    request(`/api/auction/lots/${lotId}`),
    request(`/api/auction/events/${eventId}`),
    request(`/api/auction/events/${eventId}/lots`)
  ]);
  const vehicle = lot.vehicle;
  const images = vehicle.images || [];
  const imagePaths = images.map((image) => vehicleImagePath(vehicle.id, image.filename));
  const bid = Number(lot.lastBid || 0);
  const commission = Number(lot.auction?.commission || 5);
  const feeItems = Array.isArray(lot.fees) ? lot.fees : lot.fees ? [lot.fees] : [];
  const fixedFee = feeItems.reduce((sum, fee) => sum + Number(fee.value || 0), 0);
  const administrativeFee = feeItems.filter((fee) => normalizeText(fee.description || '').toLowerCase().includes('administra')).reduce((sum, fee) => sum + Number(fee.value || 0), 0);
  const otherServicesFee = fixedFee - administrativeFee;
  const total = bid + (bid * commission / 100) + fixedFee;
  const status = normalizeText(lot.status || '').replaceAll('_', ' ');
  const info = lot.mainInfo || {};
  const location = normalizeText(lot.importantInfo?.carPickup?.description || vehicle.location || '-');
  const observation = normalizeText(lot.observation || 'Consulte as condições e o edital do evento antes de participar.');
  const inspection = (lot.inspectionInfo || [])
    .filter((item) => !['Observações gerais', 'Resumo do laudo'].includes(normalizeText(item.label)))
    .sort((first, second) => normalizeText(first.label).localeCompare(normalizeText(second.label), 'pt-BR', { sensitivity: 'base' }));
  const eventDate = event.date ? new Date(`${event.date}T12:00:00`).toLocaleDateString('pt-BR') : '';
  document.title = `${normalizeText(lot.description)} | Loop Leilões`;
  const whatsappText = encodeURIComponent(`Olá, equipe Loop Leilões. Tenho interesse em enviar uma proposta para o lote ${lot.number} — ${normalizeText(lot.description)}. Poderiam me orientar sobre os próximos passos? Link do veículo: ${window.location.href}`);
  app.innerHTML = `<section class="lot-event"><div class="lot-event-title">${escapeHtml(event.title)} | ${escapeHtml(event.location)} | ${escapeHtml(eventDate)} às ${escapeHtml(event.time || '')}</div><div class="lot-rail">${eventLots.slice(0, 30).map((item) => `<a class="lot-rail-item ${String(item.id) === String(lotId) ? 'active' : ''}" href="${escapeHtml(item.url || '#')}"><span><img src="${vehicleImagePath(item.vehicle?.id, item.vehicle?.image)}" alt="Lote ${item.number}"></span><b>Lote ${item.number}</b></a>`).join('')}</div></section><section class="lot-page">${breadcrumb(`Lote ${lot.number}`)}<div class="lot-title-row"><div><small>Lote ${escapeHtml(lot.number)}</small><h1>${escapeHtml(normalizeText(lot.description))}</h1></div><strong class="lot-seller">◒ ${escapeHtml(normalizeText(lot.principal?.description || lot.importantInfo?.seller || 'Comitente'))}</strong></div><div class="lot-layout"><div class="lot-content"><div class="lot-gallery"><img id="main-photo" src="${imagePaths[0] || ''}" alt="${escapeHtml(normalizeText(lot.description))}"><button id="prev-photo" class="gallery-arrow prev" aria-label="Foto anterior">‹</button><button id="next-photo" class="gallery-arrow next" aria-label="Próxima foto">›</button></div><div class="lot-thumbs">${imagePaths.slice(0, 24).map((src, index) => `<button class="${index === 0 ? 'active' : ''}" data-photo="${src}"><img loading="lazy" src="${src}" alt="Foto ${index + 1}"></button>`).join('')}</div><div class="lot-media-tabs"><button class="active">▣ &nbsp; Fotos</button><button>▮ &nbsp; Vídeos</button><button>▣ &nbsp; Cautelar</button></div><div class="lot-main-specs"><div><span>Câmbio</span><strong>${escapeHtml(normalizeText(info.transmission || '-'))}</strong></div><div><span>Combustível</span><strong>${escapeHtml(normalizeText(info.fuel || '-'))}</strong></div><div><span>Km</span><strong>${info.mileage == null ? '-' : number.format(info.mileage)}</strong></div><div><span>Placa</span><strong>${escapeHtml(info.licensePlate || '-')}</strong></div><div><span>Ano</span><strong>${escapeHtml(`${info.yearManufacture || '-'} / ${info.yearModel || '-'}`)}</strong></div><div><span>Cor</span><strong>${escapeHtml(normalizeText(info.color || '-'))}</strong></div><div><span>Nota de avaliação</span><strong>${escapeHtml(lot.classification || '-')}</strong></div></div><section class="lot-section"><h2>Observações</h2><p>${escapeHtml(observation)}</p></section><div class="lot-location"><span>●</span><div>Localização do veículo:<strong>${escapeHtml(location)}</strong></div></div><section class="lot-section"><h2>Itens de vistoria</h2><div class="inspection-table">${inspection.map((item) => `<div><strong>${escapeHtml(normalizeText(item.label))}</strong><span>${escapeHtml(normalizeText(item.description || '-'))}</span></div>`).join('')}</div></section></div><aside class="bid-panel"><div class="bid-status">${status.includes('aberto') ? 'Aberto para Lance' : escapeHtml(status)}</div><div class="bid-summary"><span>Lance inicial: <strong>${money.format(bid)}</strong></span>${lot.isFinancing ? '<button>Ver parcelas ◒</button>' : ''}</div><div class="bid-value"><span>Lance inicial:</span><strong>${money.format(bid)}</strong><small>Valor total com taxas: <b id="bid-total">${money.format(total)}</b></small></div><a class="bid-login whatsapp-bid" href="https://wa.me/5511980867294?text=${whatsappText}" target="_blank" rel="noopener">Dar lance via WhatsApp</a><div class="bid-tabs"><button type="button">Histórico de lances⌄</button><button id="calculator-toggle" type="button" aria-expanded="false">Calculadora de taxas⌄</button></div><p class="bid-empty">Nenhum lance até o momento.</p><div id="fee-calculator" class="fee-calculator" hidden><div class="calculator-bid"><span>Se o lance for</span><div><button id="bid-minus" type="button" aria-label="Diminuir lance">−</button><strong id="calculator-bid"></strong><button id="bid-plus" type="button" aria-label="Aumentar lance">+</button></div></div><div><span>Taxa administrativa</span><strong id="calculator-fixed"></strong></div><div><span>Taxa de comissão</span><strong id="calculator-commission"></strong></div><div><span>Outros serviços</span><strong>${money.format(0)}</strong></div><div class="calculator-total"><span>Total</span><strong id="calculator-total"></strong></div></div></aside></div></section>`;
  const financingButton = document.querySelector('.bid-summary button');
  if (financingButton) {
    const financingLink = document.createElement('a');
    financingLink.className = 'financing-button';
    financingLink.href = '#financing';
    financingLink.innerHTML = 'Ver parcelas <img alt="Santander" height="24" width="24" src="https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fpartners-Santander.svg">';
    financingButton.replaceWith(financingLink);
  }
  const calculator = document.querySelector('#fee-calculator');
  const calculatorToggle = document.querySelector('#calculator-toggle');
  const emptyBids = document.querySelector('.bid-empty');
  const increment = Number(lot.bidIncrement || lot.minimumBidIncrement || 500);
  let simulatedBid = bid;
  const updateCalculator = () => {
    const commissionValue = simulatedBid * commission / 100;
    document.querySelector('#calculator-bid').textContent = money.format(simulatedBid);
    document.querySelector('#calculator-fixed').textContent = money.format(administrativeFee);
    document.querySelector('#calculator-commission').textContent = money.format(commissionValue);
    document.querySelector('.fee-calculator>div:nth-child(4) strong').textContent = otherServicesFee ? money.format(otherServicesFee) : '—';
    document.querySelector('#calculator-total').textContent = money.format(simulatedBid + fixedFee + commissionValue);
  };
  updateCalculator();
  calculatorToggle?.addEventListener('click', () => {
    const opening = calculator.hidden;
    calculator.hidden = !opening;
    emptyBids.hidden = opening;
    calculatorToggle.setAttribute('aria-expanded', String(opening));
    calculatorToggle.textContent = `Calculadora de taxas${opening ? '⌃' : '⌄'}`;
  });
  document.querySelector('#bid-minus')?.addEventListener('click', () => { simulatedBid = Math.max(bid, simulatedBid - increment); updateCalculator(); });
  document.querySelector('#bid-plus')?.addEventListener('click', () => { simulatedBid += increment; updateCalculator(); });
  const mainSpecValues = document.querySelectorAll('.lot-main-specs strong');
  if (mainSpecValues[4]) mainSpecValues[4].textContent = `${info.yearManufacture || '-'}/${info.yearModel || '-'}`;
  if (mainSpecValues[6] && lot.classification != null) mainSpecValues[6].textContent = String(lot.classification).padStart(2, '0');
  const seller = document.querySelector('.lot-seller');
  const titleBlock = document.querySelector('.lot-title-row > div');
  if (seller && titleBlock) titleBlock.append(seller);
  if (seller && lot.principal?.id) {
    const flag = new Image();
    flag.alt = normalizeText(lot.principal.description || 'Comitente');
    flag.onload = () => seller.replaceChildren(flag);
    flag.src = `/__mirror/objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/comitente-flags%2F${encodeURIComponent(lot.principal.id)}.png`;
  }
  const rail = document.querySelector('.lot-rail');
  if (rail && eventLots.length > 30) {
    rail.insertAdjacentHTML('beforeend', eventLots.slice(30).map((item) => `<a class="lot-rail-item ${String(item.id) === String(lotId) ? 'active' : ''}" href="${escapeHtml(item.url || '#')}"><span><img loading="lazy" src="${vehicleImagePath(item.vehicle?.id, item.vehicle?.image)}" alt="Lote ${item.number}"></span><b>Lote ${item.number}</b></a>`).join(''));
  }
  const thumbs = document.querySelector('.lot-thumbs');
  if (thumbs && imagePaths.length > 24) {
    thumbs.insertAdjacentHTML('beforeend', imagePaths.slice(24).map((src, index) => `<button data-photo="${src}"><img loading="lazy" src="${src}" alt="Foto ${index + 25}"></button>`).join(''));
  }
  bindGallery();
  bindMediaTabs(lot.inspectionInfo || []);
  const activeRailItem = document.querySelector('.lot-rail-item.active');
  if (rail && activeRailItem) rail.scrollLeft = activeRailItem.offsetLeft - (rail.clientWidth / 2) + (activeRailItem.clientWidth / 2);
  document.querySelectorAll('.lot-rail-item img').forEach((image) => image.addEventListener('error', () => {
    image.src = '/app-assets/placeholder.webp';
  }, { once: true }));
}

function renderInstitutional(type) {
  const pages = {
    'leilao-automotivo': ['Leilão automotivo', 'Comprar seu próximo veículo pode ser simples', 'Escolha o veículo, leia o edital, faça seu cadastro e acompanhe o leilão online. Na Loop você encontra veículos vistoriados e informações claras para decidir.'],
    financiamento: ['Serviços para facilitar sua compra', 'Tudo para cuidar do seu veículo', 'Consulte as condições disponíveis para financiamento, documentação, transporte e regularização do veículo adquirido.'],
    'venda-sua-frota': ['Venda sua frota com a Loop', 'Uma solução completa para empresas', 'Cuidamos da avaliação, preparação, divulgação, leilão, pagamento e documentação da sua frota.'],
    sobre: ['Sobre a Loop', 'Tecnologia e transparência no mercado automotivo', 'A Loop é uma empresa Webmotors e Estapar criada para conectar compradores e vendedores de veículos com segurança e agilidade.'],
    ajuda: ['Central de ajuda', 'Como podemos ajudar?', 'Encontre informações sobre cadastro, participação nos leilões, lances, pagamentos, documentação e retirada do veículo.']
  };
  const [title, heading, text] = pages[type] || pages.ajuda;
  document.title = `${title} | Loop Leilões`;
  app.innerHTML = `<section class="page">${breadcrumb(title)}<div class="hero"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(text)}</p><a class="button" href="/eventos">Ver próximos leilões</a></div><div class="specs"><div class="spec"><span>1º passo</span><strong>Faça seu cadastro</strong></div><div class="spec"><span>2º passo</span><strong>Escolha um veículo</strong></div><div class="spec"><span>3º passo</span><strong>Participe com segurança</strong></div></div></section>`;
}

function renderAuth(mode) {
  const register = mode === 'cadastro';
  document.title = `${register ? 'Cadastro' : 'Login'} | Loop Leilões`;
  app.innerHTML = `<section class="auth-wrap"><div class="auth-card"><h1>${register ? 'Crie sua conta' : 'Seja bem-vindo!'}</h1><p>${register ? 'Preencha seus dados para participar dos eventos.' : 'Para participar dos eventos você precisa estar logado e com o cadastro completo.'}</p><form id="auth-form">${register ? '<label>Nome completo<input class="field" name="name" required></label>' : ''}<label><span class="sr-only">E-mail</span><input class="field" type="email" name="email" placeholder="E-mail" autocomplete="email" required></label><label class="password-field"><span class="sr-only">Senha</span><input class="field" type="password" name="password" placeholder="Senha" minlength="10" maxlength="200" autocomplete="current-password" required><button type="button" aria-label="Exibir senha">◉̸</button></label>${register ? '' : '<a class="auth-link" href="/esqueci-minha-senha">Esqueci minha senha</a>'}<button class="button" type="submit">${register ? 'Cadastrar' : 'Entrar'}</button><p id="auth-message"></p></form><p class="auth-switch">${register ? 'Já possui uma conta? <a href="/login">Entrar</a>' : 'Ainda não tem uma conta? <a href="/cadastro">Cadastre-se</a>'}</p></div></section>`;
  document.querySelector('#auth-form').addEventListener('submit', async (event) => {
    event.preventDefault(); const message = document.querySelector('#auth-message');
    try { const body = Object.fromEntries(new FormData(event.target)); const result = await request(`/api/local-auth/${register ? 'register' : 'login'}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); message.textContent = result.message; message.style.color = '#469419'; if (!register) location.href = new URLSearchParams(location.search).get('origem') || '/minha-conta/compras'; }
    catch { message.textContent = 'Não foi possível concluir. Verifique os dados informados.'; message.style.color = '#ff123c'; }
  });
}

function renderFleetSale() {
  document.title = 'Venda sua frota | Loop Leilões';
  app.innerHTML = `<section class="fleet-hero"><div class="fleet-copy"><h1>Veja como podemos<br>ajudar a sua empresa a<br>desmobilizar sua frota</h1><p>A Loop, empresa da Webmotors e Estapar, oferece a solução mais completa para vender seus veículos ao maior valor de mercado.</p><div class="fleet-benefits"><span>✓ <b>Gestão e garantia de transferência dos veículos.</b></span><span>✓ <b>Custo zero para vender a sua frota.</b></span><span>✓ <b>Vistoria e preparação profissional.</b></span></div></div><aside class="fleet-form"><h2>Desmobilize sua frota</h2><form id="fleet-form"><label>Nome<input class="field" required></label><label>E-mail corporativo<input class="field" type="email" required></label><label>Telefone<input class="field" required></label><label>Quantidade de veículos<input class="field" type="number" min="1" required></label><button class="button">Quero vender minha frota</button><p id="fleet-message"></p></form></aside></section><section class="fleet-features"><p class="eyebrow">Facilidades</p><h2>Facilitamos o jeito de vender a sua frota</h2><div class="steps"><div><b>1</b><strong>Avaliação</strong><span>Analisamos os veículos da sua empresa.</span></div><div><b>2</b><strong>Preparação</strong><span>Vistoria e divulgação profissional.</span></div><div><b>3</b><strong>Venda</strong><span>Leilão para milhares de compradores.</span></div><div><b>4</b><strong>Transferência</strong><span>Acompanhamento da documentação.</span></div></div></section>`;
  document.querySelector('#fleet-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#fleet-message').textContent = 'Interesse registrado apenas nesta demonstração local.'; });
}

function renderAutomotive() {
  document.title = 'Leilão de carros online e presencial | Loop Leilões';
  const benefits = [
    ['auto-icon-01.png', 'Segurança total', 'Veículos com procedência.'],
    ['auto-icon-02.png', 'Financiamento', 'Para veículos arrematados*.'],
    ['auto-icon-03.png', 'Leilão online', 'Participe de todo o Brasil.'],
    ['auto-icon-04.png', 'Para todos', 'Pessoa física e lojista.'],
    ['auto-icon-05.png', 'Transparência', 'Informações para decidir.']
  ];
  const faq = [
    ['O que é um leilão automotivo?', 'É uma modalidade de venda em que os interessados disputam veículos por meio de lances.'],
    ['Qual é a origem dos veículos do nosso leilão?', 'Nosso estoque é composto por veículos de frota, montadoras e recuperados de bancos.'],
    ['Como participar de um leilão automotivo da Loop?', 'É necessário ter mais de 18 anos, criar o cadastro e manter os documentos atualizados.'],
    ['Quem pode participar de um leilão?', 'Pessoas físicas e empresas podem participar dos eventos disponíveis para o seu perfil.'],
    ['Posso ver o carro antes de dar um lance?', 'Sim. Recomendamos visitar o veículo com antecedência e conferir todas as condições do edital.'],
    ['Posso desistir de um lance?', 'Não. Os lances não podem ser retirados; participe apenas quando tiver certeza da compra.']
  ];
  app.innerHTML = `<section class="auto-hero"><div class="auto-copy"><h1>As melhores<br>ofertas<br><em>a um lance<br>de você.</em></h1><p>A <strong>Loop Leilões</strong> te ajuda a arrematar e financiar veículos de leilão com total segurança e transparência. <strong>Faça seu cadastro e dê seu lance!</strong></p><form class="auto-lead-form"><label>E-mail*<input class="field" type="email" required></label><button class="button" type="submit">Quero participar</button></form></div><div class="auto-visual"><p>Uma empresa: &nbsp; <b>webmotors</b> &nbsp; <b>ESTAPAR</b></p><img src="/app-assets/auto-hero.png" alt="Leilão Seguro é na Loop"></div></section><section class="auto-benefits">${benefits.map(([icon, title, text]) => `<div><img src="/app-assets/${icon}" alt=""><strong>${title}</strong><span>${text}</span></div>`).join('')}</section><section class="auto-steps"><p class="eyebrow">Como comprar</p><h2>Seu lance em 5 passos</h2><p>Confira como é fácil arrematar seu veículo de leilão na Loop.</p><div class="steps"><div><b>1</b><strong>Cadastre-se</strong><span>Informe seus dados e documentos.</span></div><div><b>2</b><strong>Escolha</strong><span>Consulte fotos, edital e condições.</span></div><div><b>3</b><strong>Dê seu lance</strong><span>Acompanhe o evento online.</span></div><div><b>4</b><strong>Pagamento</strong><span>Confira prazos e opções disponíveis.</span></div></div></section><section class="auto-info"><div><h2>Leilão presencial e online</h2><p>Você pode acompanhar os leilões presencialmente em nossos pátios ou, se preferir, online de qualquer lugar do Brasil.</p><a class="button" href="/eventos">Consultar agenda de eventos</a></div><div><h2>Para pessoa física e loja</h2><p>Tanto quem quer garantir um carro com procedência quanto o lojista que deseja abastecer seu estoque podem participar.</p><a class="button secondary" href="/estoque">Ver veículos</a></div></section><section class="auto-finance"><div><p class="eyebrow">Financiamento</p><h2>Você arremata as melhores ofertas e ainda pode financiar seu veículo.</h2><p>*Disponível para veículos selecionados e sujeito à análise de crédito.</p><a class="button" href="/financiamento">Simule seu financiamento</a></div><img src="/app-assets/auto-financing.svg" alt="Financiamento de veículos"></section><section class="auto-faq"><p class="eyebrow">Tire suas dúvidas</p><h2>Perguntas frequentes</h2>${faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</section>`;
  document.querySelector('.auto-lead-form').addEventListener('submit', (event) => { event.preventDefault(); location.href = '/cadastro'; });
}

function renderMessagePage(title, heading, text, action = ['Voltar ao início', '/']) {
  document.title = `${title} | Loop Leilões`;
  app.innerHTML = `<section class="page">${breadcrumb(title)}<div class="message-card"><div class="message-icon">✓</div><h1>${escapeHtml(heading)}</h1><p class="lead">${escapeHtml(text)}</p><a class="button" href="${escapeHtml(action[1])}">${escapeHtml(action[0])}</a></div></section>`;
}

function renderFinancing() {
  document.title = 'Financiamento de Veículos | Loop Financiamento';
  const steps = [['1. Escolha um veículo', 'Vai comprar com a Loop seu veículo? Temos milhares de opções para você.'], ['2. Insira seus dados', 'Com os seus dados, apresentamos condições personalizadas e a melhor oferta.'], ['3. Faça a avaliação do crédito', 'A Santander Financiamentos analisa seus dados com toda segurança.'], ['4. Envie sua proposta', 'Preencha e envie sua proposta para solicitar a aprovação.']];
  const questions = ['Quais veículos posso financiar?', 'O que preciso para financiar um veículo?', 'Como financiar um carro ou uma moto?', 'Como funciona o financiamento?', 'Qual é a taxa de juros de um financiamento?', 'Existe opção de financiamento de veículos para PCD?', 'Em caso de dúvidas por onde entro em contato?'];
  app.innerHTML = `<section class="finance-hero"><div><h1>Quer comprar?<br><strong>É só financiar!</strong></h1><p>Conte com a <b>Loop</b> para as melhores condições no <b>financiamento</b> do seu veículo!</p><h2>Simule agora seu financiamento!</h2><a class="button" href="/estoque">Simular</a></div><img src="/app-assets/auto-financing.svg" alt="Financiamento de veículos"></section><section class="finance-why"><h2>Por que financiar seu veículo com a Loop?</h2><p>A análise é 100% on-line e o valor do crédito pré-aprovado sai na hora!</p><p>Você conta com a segurança do Santander Financiamentos. A Loop é o único leilão que oferece a compra do veículo com a opção de financiamento!</p><h2>Financie online seu novo carro ou moto em até 60 meses!</h2><div><strong>Financie em até 60x*</strong><strong>Financiamento de até 100%* do valor</strong></div><small>* Condições sujeitas à análise de crédito.</small></section><section class="finance-private"><h2>Quer vender ou comprar seu carro no particular?<br><strong>Financiamos também!</strong></h2><p>Tem aquele veículo e quer vender para um amigo, parente, vizinho ou anunciou na internet? A gente financia para você!</p><a class="button" href="/estoque">Simular agora</a></section><section class="finance-steps"><h2>Como financiar seu veículo</h2><div>${steps.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section><section class="finance-faq"><h2>Ainda ficou com dúvida?</h2>${questions.map((question) => `<details><summary>${question}</summary><p>Consulte as condições da simulação e fale com o atendimento Loop.</p></details>`).join('')}</section>`;
}

function renderRecovery(hasToken = false) {
  const title = hasToken ? 'Redefinir senha' : 'Esqueci minha senha';
  document.title = `${title} | Loop Leilões`;
  app.innerHTML = `<section class="recovery-page"><div class="form-card"><h1>${title}</h1><p class="lead">${hasToken ? 'Crie uma nova senha para sua conta.' : 'Digite seu e-mail no campo abaixo para receber um link de alteração de senha.'}</p><form id="recovery-form">${hasToken ? '<label>Nova senha<input class="field" type="password" minlength="6" required></label><label>Confirme a senha<input class="field" type="password" minlength="6" required></label>' : '<label>Email<input class="field" type="email" placeholder="Email" required></label>'}<button class="button" type="submit">${hasToken ? 'Alterar senha' : 'Enviar senha'}</button><p id="recovery-message"></p></form></div></section>`;
  document.querySelector('#recovery-form').addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#recovery-message').textContent = hasToken ? 'Senha local atualizada com sucesso.' : 'Se o e-mail estiver cadastrado, as instruções serão exibidas nesta demonstração local.';
  });
}

function renderInformation(step) {
  const pages = {
    'participe-agora': ['Participe agora', 'Seu cadastro está quase pronto', 'Confirme seus dados e conheça as etapas necessárias para participar dos leilões.'],
    'de-seu-lance': ['Dê seu lance', 'Acompanhe o lote em tempo real', 'Defina seu limite, acompanhe os lances e consulte sempre as condições do edital.'],
    pagamento: ['Pagamento', 'Confira as condições de pagamento', 'Depois da arrematação, acompanhe os prazos, taxas e instruções na área da sua conta.'],
    'leve-seu-veiculo': ['Leve seu veículo', 'Retirada e transporte', 'Com o pagamento confirmado, escolha a retirada ou simule o transporte do veículo.']
  };
  const [title, heading, text] = pages[step] || pages['participe-agora'];
  document.title = `${title} | Loop Leilões`;
  app.innerHTML = `<section class="page">${breadcrumb(title)}<div class="hero"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(text)}</p><a class="button" href="/eventos">Ver leilões</a></div><div class="steps"><div><b>1</b><strong>Cadastre-se</strong><span>Crie sua conta local.</span></div><div><b>2</b><strong>Escolha</strong><span>Analise fotos e informações.</span></div><div><b>3</b><strong>Participe</strong><span>Acompanhe a demonstração.</span></div><div><b>4</b><strong>Conclua</strong><span>Confira pagamento e retirada.</span></div></div></section>`;
}

async function renderConditionals(eventId) {
  if (eventId) return renderEvent(eventId);
  const events = await request('/api/auction/events');
  app.innerHTML = `<section class="page">${breadcrumb('Condicionais')}<h1>Lotes condicionais</h1><p class="lead">Consulte eventos com lotes aguardando análise e acompanhe o resultado pela sua conta.</p><div class="event-list">${events.slice(0, 8).map((event) => `<article class="event-card"><div class="event-date"><strong>${escapeHtml(event.id)}</strong><span>evento</span></div><div><span class="badge">Em análise</span><h3>${escapeHtml(event.title)}</h3><p>${number.format(event.numberOfLots || 0)} lotes disponíveis</p></div><a class="button" href="/eventos/${escapeHtml(event.slug)}/${event.id}">Consultar</a></article>`).join('')}</div></section>`;
}

function renderAccount(section, id = '') {
  const names = {
    'alterar-cadastro': 'Dados cadastrais', 'alterar-documentos': 'Documentos', compras: 'Minhas compras', favoritos: 'Favoritos',
    'redefinir-senha': 'Redefinir senha', tickets: 'Atendimento', aviso: 'Atualização cadastral', 'cadastro-atualizado': 'Cadastro atualizado',
    'dados-cadastrais': 'Dados cadastrais', 'validar-cadastro': 'Validar cadastro', 'adicionar-documentacao': 'Adicionar documentação', documentacao: 'Documentação da compra'
  };
  const title = names[section] || 'Minha conta';
  document.title = `${title} | Loop Leilões`;
  const detail = id ? `<div class="notice">Referência local: <strong>${escapeHtml(id)}</strong></div>` : '';
  app.innerHTML = `<section class="page">${breadcrumb('Minha conta')}<div class="account-layout"><aside class="account-menu"><strong>Minha conta</strong><a href="/minha-conta/compras">Minhas compras</a><a href="/minha-conta/favoritos">Favoritos</a><a href="/minha-conta/alterar-cadastro">Dados cadastrais</a><a href="/minha-conta/alterar-documentos">Documentos</a><a href="/minha-conta/tickets">Atendimento</a><a href="/logout">Sair</a></aside><div class="account-content"><h1>${escapeHtml(title)}</h1>${detail}<div class="empty"><h2>Nenhum item por aqui</h2><p>Esta área usa somente dados da demonstração local e não acessa a conta do site oficial.</p><a class="button" href="/estoque">Explorar veículos</a></div></div></div></section>`;
}

async function renderNews(slug) {
  const news = await request('/cms/noticias');
  const article = news.find((item) => item.SEO_URL === slug) || news[0];
  if (!article) return renderMessagePage('Notícia', 'Conteúdo não encontrado', 'A notícia solicitada não está disponível nesta captura.');
  const image = article.image?.formats?.large?.url || article.image?.url;
  const paragraphs = String(article.body || article.meta?.description || '').split(/\n{2,}/).filter((line) => !line.trim().startsWith('![')).slice(0, 12);
  document.title = `${article.title} | Loop Leilões`;
  app.innerHTML = `<article class="page article">${breadcrumb('Notícias')}<p class="eyebrow">${escapeHtml(article.topic || 'Conteúdo Loop')}</p><h1>${escapeHtml(article.title)}</h1><p class="lead">${escapeHtml(article.subject || article.meta?.description || '')}</p>${image ? `<img class="article-cover" src="/cms${escapeHtml(image)}" alt="">` : ''}<div class="article-body">${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph.replace(/^#+\s*/, ''))}</p>`).join('')}</div></article>`;
}

function renderTransmission(eventId, live) {
  document.title = 'Transmissão | Loop Leilões';
  app.innerHTML = `<section class="page">${breadcrumb('Transmissão')}<div class="stream-layout"><div class="stream-stage"><span>AO VIVO</span><div class="play">▶</div><p>Transmissão demonstrativa do evento ${escapeHtml(eventId)}</p></div><aside class="detail-panel"><span class="badge">${live ? 'Ao vivo' : 'Sala do evento'}</span><h1>Acompanhe o leilão</h1><p>Vídeo, áudio e lances reais estão desativados nesta cópia local.</p><a class="button" href="/eventos">Voltar à agenda</a></aside></div></section>`;
}

function renderPreRegister(slug) {
  document.title = 'Pré-cadastro | Loop Leilões';
  app.innerHTML = `<section class="page">${breadcrumb('Pré-cadastro')}<div class="form-card"><h1>Pré-cadastro</h1><p class="lead">Demonstre interesse em ${escapeHtml(slug.replaceAll('-', ' '))}.</p><form id="pre-form"><label>Nome completo<input class="field" required></label><label>E-mail<input class="field" type="email" required></label><label>Telefone<input class="field" required></label><button class="button">Enviar interesse</button><p id="pre-message"></p></form></div></section>`;
  document.querySelector('#pre-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#pre-message').textContent = 'Interesse registrado somente neste navegador.'; });
}

async function renderAdminLogin(errorMessage = '') {
  app.innerHTML = `<section class="admin-login-page"><div class="admin-login-card"><p class="eyebrow">ÁREA RESTRITA</p><h1>Painel administrativo</h1><p>Acesso protegido para gerenciamento interno.</p><form id="admin-login-form"><label>Senha administrativa<input class="field" type="password" name="password" autocomplete="current-password" required></label><button class="button" type="submit">Entrar no painel</button><p id="admin-login-message" class="admin-message">${escapeHtml(errorMessage)}</p></form></div></section>`;
  document.querySelector('#admin-login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.querySelector('#admin-login-message');
    const button = event.target.querySelector('button');
    button.disabled = true;
    message.textContent = 'Validando acesso...';
    try {
      const body = Object.fromEntries(new FormData(event.target));
      await request('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      await renderAdmin();
    } catch (error) {
      message.textContent = error.message;
      button.disabled = false;
    }
  });
}

async function renderAdmin() {
  document.title = 'Painel administrativo | Loop';
  let stats;
  try {
    const session = await request('/api/admin/session');
    if (!session.authenticated) return renderAdminLogin();
    stats = await request('/api/admin/stats');
  } catch (error) {
    return renderAdminLogin(error.message);
  }
  app.innerHTML = `<section class="admin-page"><div class="admin-heading"><div><p class="eyebrow">ADMINISTRAÇÃO</p><h1>Painel administrativo</h1><p>Acompanhe os acessos e gerencie as datas dos leilões.</p></div><div class="admin-heading-actions"><a href="/" class="button secondary">Ver site</a><button id="admin-logout" class="button ghost" type="button">Sair</button></div></div><div class="admin-stats"><article><span>Pessoas que acessaram</span><strong id="admin-visitors">${number.format(stats.uniqueVisitors)}</strong><small>Visitantes únicos</small></article><article><span>Acessos ao site</span><strong id="admin-views">${number.format(stats.pageViews)}</strong><small>Páginas visualizadas</small></article><article><span>Cliques no WhatsApp</span><strong id="admin-whatsapp">${number.format(stats.whatsappClicks)}</strong><small>${number.format(stats.whatsappVisitors)} pessoas</small></article></div><section class="admin-action"><div><p class="eyebrow">DATAS DOS VEÍCULOS</p><h2>Adiamento geral</h2><p>Ao confirmar, todos os veículos e eventos serão adiados em exatamente <strong>2 dias</strong>.</p><p>Adiamento acumulado atual: <b id="admin-offset">${number.format(stats.dateOffsetDays)} dias</b>.</p></div><div class="admin-controls"><button id="postpone-all" class="button" type="button" ${stats.canPostpone ? '' : 'disabled'}>Adiamento</button><small id="postpone-countdown"></small><label class="admin-auto"><input id="auto-postpone" type="checkbox" checked disabled><span class="toggle-control"></span><b>Adiamento automático diário</b></label><small id="auto-schedule"></small></div></section><p id="admin-message" class="admin-message" role="status"></p></section>`;
  document.querySelector('#admin-logout').addEventListener('click', async () => { await request('/api/admin/logout', { method: 'POST' }); renderAdminLogin(); });
  let currentStats = stats;
  const updateSchedule = () => {
    const button = document.querySelector('#postpone-all');
    const countdown = document.querySelector('#postpone-countdown');
    const autoSchedule = document.querySelector('#auto-schedule');
    const remaining = currentStats.nextPostponeAt ? Date.parse(currentStats.nextPostponeAt) - Date.now() : 0;
    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.ceil((remaining % 3600000) / 60000);
      button.disabled = true;
      countdown.textContent = `Disponível novamente em ${hours}h ${minutes}min.`;
    } else {
      button.disabled = false;
      countdown.textContent = 'Disponível para uso.';
    }
    autoSchedule.textContent = currentStats.autoPostponeEnabled && currentStats.nextAutoPostponeAt
      ? `Próxima execução automática: ${new Date(currentStats.nextAutoPostponeAt).toLocaleString('pt-BR')}.`
      : 'Automação desativada.';
  };
  updateSchedule();
  const countdownTimer = setInterval(updateSchedule, 30000);
  window.addEventListener('pagehide', () => clearInterval(countdownTimer), { once: true });
  document.querySelector('#postpone-all').addEventListener('click', async () => {
    if (!confirm('Adiar TODOS os veículos e eventos em 2 dias?')) return;
    const button = document.querySelector('#postpone-all');
    const message = document.querySelector('#admin-message');
    button.disabled = true;
    message.textContent = 'Aplicando adiamento...';
    try {
      const updated = await request('/api/admin/postpone', { method: 'POST' });
      currentStats = updated;
      document.querySelector('#admin-offset').textContent = `${number.format(updated.dateOffsetDays)} dias`;
      message.textContent = updated.message;
      updateSchedule();
    } catch (error) {
      message.textContent = `Erro: ${error.message}`;
    }
  });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a.whatsapp-bid');
  if (!link) return;
  const original = new URL(link.href, location.origin);
  const text = original.searchParams.get('text') || '';
  link.href = `/go/whatsapp?text=${encodeURIComponent(text)}`;
});

async function router() {
  const path = decodeURIComponent(location.pathname);
  document.body.classList.toggle('auth-page', path === '/login' || path === '/cadastro');
  try {
    if (path === '/') return await renderStock();
    if (path === '/admin') return await renderAdmin();
    if (path === '/estoque') return await renderStock();
    if (path === '/eventos') return await renderEvents();
    let match = path.match(/^\/eventos\/[^/]+\/(\d+)$/); if (match) return await renderEvent(match[1]);
    match = path.match(/^\/leilao\/[^/]+\/[^/]+\/(\d+)\/(\d+)$/); if (match) return await renderLot(match[1], match[2]);
    match = path.match(/^\/veiculo\/(.+)$/); if (match) return await renderVehicle(match[1]);
    if (path === '/login' || path === '/cadastro') return renderAuth(path.slice(1));
    if (path === '/logout') return renderMessagePage('Sair', 'Você saiu da conta local', 'Nenhuma sessão do site oficial foi acessada.', ['Voltar ao início', '/']);
    if (path === '/esqueci-minha-senha') return renderRecovery(false);
    if (/^\/esqueci-minha-senha\/[^/]+$/.test(path)) return renderRecovery(true);
    match = path.match(/^\/cadastro\/informacoes\/([^/]+)$/); if (match) return renderInformation(match[1]);
    if (path === '/cadastro/confirmar-email') return renderMessagePage('Confirmar e-mail', 'Confira seu e-mail', 'A confirmação é simulada localmente. Nenhuma mensagem foi enviada.', ['Continuar', '/cadastro/informacoes/participe-agora']);
    if (path === '/cadastro/confirmar-sms') return renderMessagePage('Confirmar telefone', 'Confirme seu telefone', 'A confirmação por SMS é simulada localmente.', ['Continuar', '/cadastro/informacoes/participe-agora']);
    if (/^\/cadastro\/[^/]+\/sucesso$/.test(path)) return renderMessagePage('Cadastro concluído', 'Cadastro concluído com sucesso', 'Sua conta de demonstração está pronta.', ['Entrar', '/login']);
    if (path === '/eventos/condicionais') return await renderConditionals();
    match = path.match(/^\/eventos\/condicionais\/[^/]+\/(\d+)$/); if (match) return await renderConditionals(match[1]);
    match = path.match(/^\/minha-conta\/(.+)$/); if (match) { const pieces = match[1].split('/'); return renderAccount(pieces.at(-1), pieces.find((piece) => /^\d+$/.test(piece)) || ''); }
    match = path.match(/^\/noticias\/([^/]+)$/); if (match) return await renderNews(match[1]);
    match = path.match(/^\/pre-cadastro\/([^/]+)$/); if (match) return renderPreRegister(match[1]);
    match = path.match(/^\/transmissao\/(live|sala)\/([^/]+)$/); if (match) return renderTransmission(match[2], match[1] === 'live');
    if (path === '/venda-sua-frota/sucesso') return renderMessagePage('Venda sua frota', 'Recebemos seu interesse', 'Os dados foram registrados apenas nesta demonstração.', ['Voltar ao início', '/']);
    if (path === '/401') return renderMessagePage('Acesso restrito', 'Entre para continuar', 'Esta página exige uma conta local.', ['Fazer login', '/login']);
    if (path === '/500') return renderMessagePage('Erro', 'Algo não saiu como esperado', 'Tente novamente em alguns instantes.', ['Voltar ao início', '/']);
    if (path === '/venda-sua-frota') return renderFleetSale();
    if (path === '/leilao-automotivo') return renderAutomotive();
    if (path === '/financiamento') return renderFinancing();
    match = path.match(/^\/conteudo\/([^/]+)$/); if (match) return renderInstitutional(match[1]);
    app.innerHTML = `<section class="error"><strong>404</strong><h1>Não foi possível encontrar esta página.</h1><p>Não perca tempo e veja nossos eventos.</p><a class="button" href="/eventos">Ver nossos eventos</a></section>`;
  } catch (error) {
    app.innerHTML = `<section class="error"><strong>!</strong><h1>Não foi possível carregar</h1><p>${escapeHtml(error.message)}</p><button class="button" onclick="location.reload()">Tentar novamente</button></section>`;
  }
}

document.querySelector('.menu-button').addEventListener('click', () => document.querySelector('.topbar nav').classList.toggle('open'));
router();
