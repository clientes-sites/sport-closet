
/* ─── CONFIGURAÇÕES ─────────────────────────────────────────────────────── */
const WPP = '5551989912555';
const BASE_URL_FOTOS = 'https://pub-9eb15062e53d4ad1a85362ac330e3002.r2.dev/';

/* ─── ESTADO DA APLICAÇÃO ────────────────────────────────────────────────── */
const path = window.location.pathname.split("/").pop();
const pageName = (path === '' || path === 'index.html') ? 'index' : path.replace(".html", "").toLowerCase();

const pageTypeMap = {
    'copa2026': 'camisa de seleção',
    'roupas-verao': 'roupa - verão',
    'camisas': 'camisa de time',
    'tenis': 'tênis'
};
const pageType = pageTypeMap[pageName] || 'todos';

let activeFilters = {
  tipo: 'todos',
  liga: 'todos',
  marca: 'todos',
  peca: 'todos'
};
let searchQuery = '';
let curProd = null;
let curSize = null;

/* ─── DICIONÁRIO DE TRADUÇÃO E TEXTOS ────────────────────────────────────────── */
const i18n = {
  pt: {
    price: "Preço sob consulta",
    buy: "Pedir no WhatsApp",
    empty: "Nenhum produto encontrado.",
    found: "produtos encontrados",
    slides: [
      { sub: "COPA 2026", title: "CAMISAS DE<br>SELEÇÃO", btn: "VEJA AGORA" },
      { sub: "PISANDO COM ESTILO", title: "OS MELHORES<br>TÊNIS", btn: "EXPLORE" },
      { sub: "PARA O DIA A DIA", title: "ROUPAS DE<br>VERÃO", btn: "CONFERIR" }
    ]
  },
  en: {
    price: "Price on request",
    buy: "Order via WhatsApp",
    empty: "No products found.",
    found: "products found",
    slides: [
      { sub: "WORLD CUP 2026", title: "NATIONAL TEAM<br>JERSEYS", btn: "SHOP NOW" },
      { sub: "STYLE ON YOUR FEET", title: "THE BEST<br>SNEAKERS", btn: "EXPLORE" },
      { sub: "FOR YOUR DAILY", title: "SUMMER<br>WEAR", btn: "DISCOVER" }
    ],
    types: {
      "camisa de time": "Club Jersey",
      "camisa de seleção": "National Jersey",
      "tênis": "Sneakers",
      "roupa - verão": "Summer Wear"
    }
  }
};

/* ─── HELPERS ──────────────────────────────────────────────────────────── */
function isEu() { return document.getElementById('regionBtn')?.dataset.eu === '1'; }
function getLang() { return isEu() ? i18n.en : i18n.pt; }

function tStr(str) {
  if (!str) return '';
  const lang = getLang();
  if (!isEu() || !lang.types) return str;
  return lang.types[str.toLowerCase()] || str;
}

function wppMsg(p, sz) {
  const s = sz ? ` | Tamanho: ${sz}` : '';
  return encodeURIComponent(`Olá! Tenho interesse no produto:\n\n*${p.nome}* (ID: ${p.id})${s}\n\nVi no seu site.`);
}

function formatPrice(p) {
  if (isEu()) {
    return p.eur && p.eur > 0 ? `€ ${p.eur.toFixed(2).replace('.', ',')}` : getLang().price;
  }
  return p.brl && p.brl > 0 ? `R$ ${p.brl.toFixed(2).replace('.', ',')}` : getLang().price;
}

const wppSvg = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.633a.5.5 0 0 0 .61.61l5.775-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.088-1.392l-.363-.216-3.763.963.982-3.637-.237-.376A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`;

/* ─── FILTROS E BUSCA ───────────────────────────────────────────────────── */
function setFilter(group, value) {
  activeFilters[group] = value.toLowerCase();
  document.querySelectorAll(`.fb[data-g="${group}"]`).forEach(b => {
    b.classList.toggle('active', b.dataset.v.toLowerCase() === value.toLowerCase());
  });
  renderGrid();
}

function handleSearch(val) {
  searchQuery = (val || '').toLowerCase().trim();
  renderGrid();
}

/* ─── ATUALIZAÇÃO DE TEXTOS DINÂMICOS ──────────────────────────────────────── */
function updateStaticTexts() {
  const lang = getLang();
  if (pageName === 'index') {
    const slides = document.querySelectorAll('#heroSlider .slide');
    slides.forEach((slide, idx) => {
      if (!lang.slides[idx]) return;
      slide.querySelector('.slide-subtitle').textContent = lang.slides[idx].sub;
      slide.querySelector('.slide-title').innerHTML = lang.slides[idx].title;
      slide.querySelector('.slide-btn').textContent = lang.slides[idx].btn;
    });
  }
}

/* ─── ALGORITMO DE RANDOMIZAÇÃO (FISHER-YATES) ─────────────────────────── */
function embaralhar(array) {
  let lista = [...array];
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

/* ─── RENDERIZAÇÃO DO GRID DE PRODUTOS ─────────────────────────────────── */
function renderGrid() {
  const source = window.produtos || [];
  const lang = getLang();

  if (pageName === 'index') {
    const selecionados = embaralhar(source);
    desenharCards('grid-drop-exclusivo', selecionados.slice(0, 10));
    desenharCards('grid-mais-vistos', selecionados.slice(10, 20));
  } else {
    const list = source.filter(p => {
      const pTipo = (p.tipo || "").toLowerCase();
      const pMarca = (p.marca || "").toLowerCase();
      const pNome = (p.nome || "").toLowerCase();
      const pLiga = (p.liga || "").toLowerCase();

      let matchPageType = false;
      if (pageType === 'todos' || pageName === 'index') {
          matchPageType = true;
      } else {
          matchPageType = pTipo === pageType || pTipo.includes(pageType) || pageType.includes(pTipo);
      }

      const matchLigaFilter = pageName !== 'camisas' || activeFilters.liga === 'todos' || pLiga === activeFilters.liga;
      const matchMarcaFilter = pageName !== 'tenis' || activeFilters.marca === 'todos' || pMarca === activeFilters.marca;
      const matchPecaFilter = pageName !== 'roupas-verao' || activeFilters.peca === 'todos' || pNome.includes(activeFilters.peca);
      const matchBusca = !searchQuery || pNome.includes(searchQuery) || pMarca.includes(searchQuery) || pTipo.includes(searchQuery) || pLiga.includes(searchQuery);

      return matchPageType && matchLigaFilter && matchMarcaFilter && matchPecaFilter && matchBusca;
    });

    const countEl = document.getElementById('pcount');
    if (countEl) countEl.textContent = `${list.length} ${lang.found}`;
    
    desenharCards('grid', list);
  }
}

function desenharCards(containerId, lista) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const lang = getLang();

  if (lista.length === 0) {
    grid.innerHTML = `<div class="empty">${lang.empty}</div>`;
    if (pageName !== 'index') {
        const countEl = document.getElementById('pcount');
        if (countEl) countEl.textContent = `0 ${lang.found}`;
    }
    return;
  }

  grid.innerHTML = lista.map(p => {
    const fotoUrl = encodeURI(BASE_URL_FOTOS + p.imgs[0]);
    return `
    <div class="card" onclick="openModal(${p.id})">
      <div class="card-img">
        <img src="${fotoUrl}" alt="${p.nome}" loading="lazy" onerror="this.src='https://placehold.co/400x500?text=Foto+Indisponível'">
        ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
      </div>
      <div class="card-info">
        <div class="card-brand">${p.marca.toUpperCase()}</div>
        <div class="card-name">${tStr(p.nome)}</div>
        <div class="card-footer">
          <div class="card-price">${formatPrice(p)}</div>
          <button class="wpp-btn" onclick="event.stopPropagation();window.open('https://wa.me/${WPP}?text=${wppMsg(p, null)}','_blank')">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.633a.5.5 0 0 0 .61.61l5.775-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.088-1.392l-.363-.216-3.763.963.982-3.637-.237-.376A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            ${lang.buy}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}


/* ─── MODAL ─────────────────────────────────────────────────────────────── */
let carouselImgs = [];
let carouselIdx = 0;

function openModal(id) {
  const list = window.produtos || [];
  curProd = list.find(x => Number(x.id) === Number(id));
  if (!curProd) return;
  curSize = null;
  const lang = getLang();
  
  carouselImgs = curProd.imgs || [];
  carouselIdx = 0;
  renderCarousel();

  document.getElementById('mBrand').textContent = curProd.marca.toUpperCase();
  document.getElementById('mName').textContent = tStr(curProd.nome);
  document.getElementById('mType').textContent = (tStr(curProd.tipo) || "").toUpperCase();
  document.getElementById('mPrice').textContent = formatPrice(curProd);
  document.getElementById('mDesc').textContent = curProd.desc || "";

  document.getElementById('mSizes').innerHTML = (curProd.sizes || ["P", "M", "G", "GG"])
    .map(s => `<button class="sz" onclick="selSize('${s}',this)">${s}</button>`).join('');

  const wppBtn = document.getElementById('mWpp');
  wppBtn.innerHTML = wppSvg + ' ' + lang.buy;
  wppBtn.onclick = () => window.open(`https://wa.me/${WPP}?text=${wppMsg(curProd, curSize)}`, '_blank');
  
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selSize(s, btn) {
  curSize = s;
  document.querySelectorAll('.sz').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  const wppBtn = document.getElementById('mWpp');
  wppBtn.onclick = () => window.open(`https://wa.me/${WPP}?text=${wppMsg(curProd, curSize)}`, '_blank');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('overlay')) return;
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── CARROSSEL DO MODAL ────────────────────────────────────────────────── */
function renderCarousel() {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = carouselImgs.map((img, i) => `
    <div class="carousel-slide"><img src="${encodeURI(BASE_URL_FOTOS + img)}" loading="${i === 0 ? 'eager' : 'lazy'}"></div>`).join('');
  
  const dots = document.getElementById('carouselDots');
  dots.innerHTML = carouselImgs.length > 1 ? carouselImgs.map((_, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}" onclick="carouselGoTo(${i})"></span>`).join('') : '';
  
  scrollToSlide(carouselIdx, 'instant');
  updateChevrons();
  
  track.onscroll = () => {
    carouselIdx = Math.round(track.scrollLeft / track.offsetWidth);
    updateDots();
    updateChevrons();
  };
}

function scrollToSlide(idx, behavior = 'smooth') {
  const track = document.getElementById('carouselTrack');
  track.scrollTo({ left: idx * track.offsetWidth, behavior });
}

function carouselStep(dir) {
  carouselIdx = Math.max(0, Math.min(carouselImgs.length - 1, carouselIdx + dir));
  scrollToSlide(carouselIdx);
}

function carouselGoTo(idx) {
  carouselIdx = idx;
  scrollToSlide(carouselIdx);
}

function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
}

function updateChevrons() {
  document.getElementById('chevronLeft').style.display = carouselImgs.length > 1 && carouselIdx > 0 ? 'flex' : 'none';
  document.getElementById('chevronRight').style.display = carouselImgs.length > 1 && carouselIdx < carouselImgs.length - 1 ? 'flex' : 'none';
}

/* ─── INICIALIZAÇÃO ──────────────────────────────────────────────────────── */
function init() {
  updateStaticTexts();
  renderGrid();

  document.querySelector('.mcls').addEventListener('click', () => closeModal());
  document.getElementById('overlay').addEventListener('click', (e) => closeModal(e));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const inputs = document.querySelectorAll('.nav-search-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const val = input.value;
      inputs.forEach(other => { if (other !== input) other.value = val; });
      handleSearch(val);
    });
  });
}

/* ─── INTEGRAÇÃO PLANILHA GOOGLE SHEETS ──────────────────────────────────── */
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJJsi5MlreQayUKZtiZIwb0RcZCPa5ngJOkOmq-uCkKvtxVD8oRvYIJuYosn-22qsXtCsZsHJHfjhs/pub?output=csv";

function bootStore() {
  const sc = document.createElement('script');
  sc.src = "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js";
  sc.onload = () => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(r => r.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            processCSVData(results.data);
            init();
          }
        });
      }).catch(err => {
        console.error("Erro ao carregar do Google Sheets", err);
        window.produtos = [];
        window.todos = [];
        init();
      });
  };
  document.head.appendChild(sc);
}

function processCSVData(data) {
  const finalProducts = [];
  const getVal = (row, possibleKeys) => {
    for (let k of possibleKeys) {
      if (row[k] !== undefined) return String(row[k]).trim();
    }
    return '';
  };

  data.forEach((row, index) => {
    const nome = getVal(row, ['nome_produto', 'nome', 'nome_produto ']);
    if (!nome) return;

    const imgs = [];
    ['arquivo_foto_principal', 'arquivo_foto_2', 'arquivo_foto_3'].forEach(k => {
      const v = row[k] ? row[k].trim() : '';
      if (v) imgs.push(v);
    });

    const szStr = getVal(row, ['tamanhos', 'tamanho']);
    const sep = szStr.includes(';') ? ';' : ',';
    const sizes = szStr.split(sep).map(s => s.trim()).filter(s => s);

    finalProducts.push({
      id: index + 1,
      nome: nome,
      marca: getVal(row, ['marca']).toLowerCase(),
      tipo: getVal(row, ['tipo']).toLowerCase(),
      brl: parseFloat(getVal(row, ['preco_br', 'preco_brl', 'preco']).replace(',', '.')) || 0,
      eur: parseFloat(getVal(row, ['preco_eur']).replace(',', '.')) || 0,
      sizes: sizes,
      desc: getVal(row, ['descricao', 'desc', 'descricao ']),
      badge: getVal(row, ['badge', 'badge ']),
      imgs: imgs
    });
  });
  window.produtos = finalProducts;
  window.todos = finalProducts;
}

document.addEventListener('DOMContentLoaded', bootStore);
