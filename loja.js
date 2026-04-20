
/* ─── CONFIGURAÇÕES ─────────────────────────────────────────────────────── */
const WPP = '5531992082542';
const BASE_URL_FOTOS = 'https://pub-4af8db08776e49b78718c90c788bddab.r2.dev/';

/* ─── ESTADO DA APLICAÇÃO ────────────────────────────────────────────────── */
const path = window.location.pathname.split("/").pop();
const pageName = (path === '' || path === 'index.html') ? 'index' : path.replace(".html", "").toLowerCase();

const pageTypeMap = {
    'copa2026': 'camisa de seleção',
    'roupas-verao': ['camiseta', 'shorts', 'regata', 'casaco', 'legging', 'roupa - verão', 'roupa - verao', 'bermuda', 'bone', 'chinelo', 'meia'],
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
    price: "", // Removido label obsoleto
    buy: "Pedir no WhatsApp",
    empty: "Nenhum produto encontrado.",
    found: "produtos encontrados",
    slides: [
      { sub: "PISANDO COM ESTILO", title: "NEW BALANCE<br>530 SERIES", btn: "EXPLORE AGORA" },
      { sub: "RUMO AO HEXA", title: "CAMISAS DE<br>SELEÇÃO", btn: "VER COLEÇÃO" },
      { sub: "PARA O DIA A DIA", title: "ROUPAS DE<br>VERÃO", btn: "CONFERIR" }
    ],

    labels: {
      searchPlaceholder: "Pesquisar produtos (nome, marca, tipo)...",
      filterBrand: "Filtrar por Marca:",
      filterLeague: "Filtrar por Liga:",
      filterSponsor: "Filtrar por Patrocinadora:",
      all: "TODAS",
      other: "OUTRAS",
      nav: {
        copa2026: "Copa 2026",
        camisas: "Camisas de Time",
        tenis: "Tênis",
        'roupas-verao': "Roupas de Verão"
      },
      section: {
        index: [
          "LANÇAMENTOS <span>IMPERDÍVEIS</span>", 
          "MAIS <span>PROCURADOS</span>"
        ],
        finder: "ENCONTRE SEU <span>NOVO MANTO</span>",
        copa2026: "COPA <span>2026</span>",


        camisas: "CAMISAS DE <span>TIME</span>",
        tenis: "OS MELHORES <span>TÊNIS</span>",
        'roupas-verao': "ROUPAS DE <span>VERÃO</span>"


      },

      heroSubtitle: {
        copa2026: "COPA 2026",
        camisas: "LEVE A PAIXÃO",
        tenis: "PISANDO COM ESTILO",
        'roupas-verao': "PARA O DIA A DIA"
      },
      heroTitle: {
        copa2026: "A MAIOR JORNADA DO<br>FUTEBOL <span>COMEÇA AQUI</span>",
        camisas: "CAMISAS<br>DE <span>TIME</span>",
        tenis: "OS MELHORES<br><span>TÊNIS</span>",

        'roupas-verao': "ROUPAS DE <span>VERÃO</span>"
      },

      modalSizeLabel: "Tamanho",
      footer: "© 2026 Sport Closet — Todos os direitos reservados",
      whatsappAria: "Falar no WhatsApp",
      ticker: [
        "BEM-VINDO À SPORT CLOSET",
        "OS LANÇAMENTOS PARA A COPA DO MUNDO 2026 ESTÃO AQUI"
      ]
    },
    footer: {
      explore: "EXPLORE",
      support: "SUPORTE",
      about: "SOBRE NÓS",
      social: "SOCIAL",
      aboutText: "O esporte mantém nossa forma. Mantém nosso foco. Nos une. Através dos esportes, temos o poder de mudar vidas — com histórias de atletas inspiradores e tecnologias inovadoras.",
      faq: "Dúvidas Frequentes (FAQ)",
      contact: "Fale Conosco",
      rights: "© 2026 Sport Closet — Todos os direitos reservados."
    },
    mosaic: {
      sneakers: { sub: "PISANDO COM ESTILO", tit: "OS MELHORES TÊNIS", cta: "Comprar" },
      europe: { sub: "EM CAMPO", tit: "CLUBES EUROPEUS", cta: "Explorar" },
      worldcup: { sub: "RUMO AO HEXA", tit: "COPA DO MUNDO 2026", cta: "Ver Agora" },
      summer: { sub: "PARA O DIA A DIA", tit: "ROUPAS DE VERÃO", cta: "Descobrir" }
    },
    teamFilters: {
      todos: "TODOS",
      europeus: "EUROPEUS",
      brasileiros: "BRASILEIROS",
      selecoes: "SELEÇÕES"
    }
  },
  en: {
    price: "Price on request",
    buy: "Order via WhatsApp",
    empty: "No products found.",
    found: "products found",
    slides: [
      { sub: "STYLE ON YOUR FEET", title: "NEW BALANCE<br>530 SERIES", btn: "EXPLORE NOW" },
      { sub: "NATIONAL TEAMS", title: "SELECTION<br>JERSEYS", btn: "SEE COLLECTION" },
      { sub: "FOR YOUR DAILY", title: "SUMMER<br>WEAR", btn: "DISCOVER" }
    ],

    labels: {
      searchPlaceholder: "Search products (name, brand, type)...",
      filterBrand: "Filter by Brand:",
      filterLeague: "Filter by League:",
      filterSponsor: "Filter by Sponsor:",
      all: "ALL",
      other: "OTHER",
      nav: {
        copa2026: "World Cup 2026",
        camisas: "Club Jerseys",
        tenis: "Sneakers",
        'roupas-verao': "Summer Wear"
      },
      heroSubtitle: {
        copa2026: "WORLD CUP 2026",
        camisas: "CARRY THE PASSION",
        tenis: "STYLE ON YOUR FEET",
        'roupas-verao': "FOR YOUR DAILY"
      },
      heroTitle: {
        copa2026: "THE BIGGEST FOOTBALL<br>JOURNEY <span>STARTS HERE</span>",
        camisas: "CLUB <span>JERSEYS</span>",
        tenis: "THE BEST<br><span>SNEAKERS</span>",
        'roupas-verao': "SUMMER <span>WEAR</span>"
      },

      section: {
        index: [
          "NEW <span>RELEASES</span>", 
          "MOST <span>WANTED</span>"
        ],
        finder: "FIND YOUR <span>NEW JERSEY</span>",
        copa2026: "WORLD CUP <span>2026</span>",


        camisas: "CLUB <span>JERSEYS</span>",
        tenis: "THE BEST <span>SNEAKERS</span>",
        'roupas-verao': "SUMMER <span>WEAR</span>"
      },

      modalSizeLabel: "Size",
      footer: "© 2026 Sport Closet — All rights reserved",
      whatsappAria: "Chat on WhatsApp",
      ticker: [
        "WELCOME TO SPORT CLOSET",
        "THE WORLD CUP 2026 COLLECTION IS HERE"
      ]
    },
    footer: {
      explore: "EXPLORE",
      support: "SUPPORT",
      about: "ABOUT US",
      social: "SOCIAL",
      aboutText: "Sport keeps us fit. Keeps us focused. Unites us. Through sports, we have the power to change lives — with stories of inspiring athletes and innovative technologies.",
      faq: "Frequently Asked Questions (FAQ)",
      contact: "Contact Us",
      rights: "© 2026 Sport Closet — All rights reserved."
    },
    mosaic: {
      sneakers: { sub: "STYLE ON YOUR FEET", tit: "THE BEST SNEAKERS", cta: "Shop Now" },
      europe: { sub: "ON THE PITCH", tit: "EUROPEAN CLUBS", cta: "Explore" },
      worldcup: { sub: "NATIONAL TEAMS", tit: "WORLD CUP 2026", cta: "See Now" },
      summer: { sub: "DAILY ESSENTIALS", tit: "SUMMER WEAR", cta: "Discover" }
    },
    teamFilters: {
      todos: "ALL",
      europeus: "EUROPEAN",
      brasileiros: "BRAZILIAN",
      selecoes: "NATIONAL TEAMS"
    },
    types: {
      "camisa de time": "Club Jersey",
      "camisa de seleção": "National Jersey",
      "tênis": "Sneakers",
      "camiseta": "T-Shirt",
      "shorts": "Shorts",
      "regata": "Tank Top",
      "casaco": "Jacket",
      "legging": "Legging"
    },
    descMap: {
      "tecido": "fabric",
      "respirável": "breathable",
      "tecnologia": "technology",
      "jogadores": "players",
      "versão": "version",
      "caimento": "fit",
      "conforto": "comfort",
      "durabilidade": "durability",
      "composição": "composition",
      "poliéster": "polyester",
      "bordado": "embroidered",
      "estampa": "print",
      "qualidade": "quality",
      "importado": "imported",
      "seleção": "national team",
      "time": "club",
      "clássica": "classic",
      "retrô": "retro"
    }
  }
};

/* ─── HELPERS ──────────────────────────────────────────────────────────── */
const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

function isUsa() { 
  const btn = document.getElementById('regionBtn');
  if (btn) return btn.dataset.usa === '1';
  return localStorage.getItem('sport_closet_usa') === '1';
}
function getLang() { return isUsa() ? i18n.en : i18n.pt; }


function tStr(str) {
  if (!str) return '';
  const lang = getLang();
  if (!isUsa() || !lang.types) return str;
  const lowerStr = str.toLowerCase();
  if (lang.types[lowerStr]) return lang.types[lowerStr];
  // Fallback for multi-type pages
  for (const key in lang.types) {
    if (lowerStr.includes(key)) return lang.types[key];
  }
  return str;
}

function wppMsg(p, sz) {
  const lang = getLang();
  const sizeLabel = isUsa() ? 'Size' : 'Tamanho';
  const priceLabel = isUsa() ? 'Price' : 'Preço';
  const sizePart = sz ? ` | ${sizeLabel}: ${sz}` : '';
  const pricePart = ` | ${priceLabel}: ${formatPrice(p)}`;
  
  const message = isUsa()
    ? `Hello! I saw the product *${p.nome}* (${p.marca}) on Sport Closet and I'd like more information.${sizePart}${pricePart}`
    : `Olá! Vi o produto *${p.nome}* (${p.marca}) na Sport Closet e gostaria de mais informações.${sizePart}${pricePart}`;

  return encodeURIComponent(message);
}

function translateDesc(text) {
  if (!isUsa() || !text) return text;
  let translated = text.toLowerCase();
  const map = i18n.en.descMap;
  for (const key in map) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, map[key]);
  }
  // Primeira letra maiúscula
  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

function formatPrice(p) {
  if (isUsa()) {
    return p.usd && p.usd > 0 ? `$${p.usd.toFixed(2)}` : "";
  }
  const price = p.brl || 0;
  if (price === 0) return "";
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const wppSvg = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.633a.5.5 0 0 0 .61.61l5.775-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.088-1.392l-.363-.216-3.763.963.982-3.637-.237-.376A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`;

/* ─── FILTROS E BUSCA ───────────────────────────────────────────────────── */
function setFilter(group, value) {
  activeFilters[group] = value.toLowerCase();
  
  // Se mudar a MARCA, resetamos a PEÇA (modelo) para evitar filtros conflitantes
  if (group === 'marca') {
    activeFilters.peca = 'todos';
  }

  document.querySelectorAll(`.fb[data-g="${group}"]`).forEach(b => {
    b.classList.toggle('active', norm(b.dataset.v) === norm(value));
  });
  
  // Limpa o grid antes de re-renderizar para evitar flicker visual de itens antigos
  const grid = document.getElementById('grid') || document.getElementById('grid-drop-exclusivo');
  if (grid) grid.innerHTML = '';
  
  renderGrid();
}

function handleSearch(val) {
  searchQuery = norm(val);
  
  // UX: Ocultar banners se houver busca ativa
  const isSearching = searchQuery.length > 0;
  document.body.classList.toggle('search-active-ui', isSearching);
  
  renderGrid();
}


function toggleRegion() {
  const btn = document.getElementById('regionBtn');
  const isCurrentlyUsa = isUsa();
  const newVal = isCurrentlyUsa ? '0' : '1';
  
  if (btn) {
    btn.dataset.usa = newVal;
    btn.textContent = newVal === '1' ? '🇺🇸 USA ($)' : '🇧🇷 Brasil (R$)';
  }
  
  localStorage.setItem('sport_closet_usa', newVal);
  updateStaticTexts();
  renderGrid();
  if (pageName === 'index') renderTeamSlider('todos');
}


function toggleBrandsDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('brandsDropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

/* ─── ATUALIZAÇÃO DE TEXTOS DINÂMICOS ──────────────────────────────────────── */
function updateStaticTexts() {
  const lang = getLang();

  // Search input placeholder
  document.querySelectorAll('.nav-search-input').forEach(input => {
    input.placeholder = lang.labels.searchPlaceholder;
  });

  // Navigation labels
  document.querySelectorAll('.brand-links a[href="copa2026.html"]').forEach(a => a.textContent = lang.labels.nav.copa2026);
  document.querySelectorAll('.brand-links a[href="camisas.html"]').forEach(a => a.textContent = lang.labels.nav.camisas);
  document.querySelectorAll('.brand-links a[href="tenis.html"]').forEach(a => a.textContent = lang.labels.nav.tenis);
  document.querySelectorAll('.brand-links a[href="roupas-verao.html"]').forEach(a => a.textContent = lang.labels.nav['roupas-verao']);

  // Ticker texts
  const tickerTexts = lang.labels.ticker || [];
  document.querySelectorAll('.ticker-inner span').forEach((span, idx) => {
    if (idx % 2 === 0 && tickerTexts.length > 0) {
      const messageIndex = Math.floor(idx / 2) % tickerTexts.length;
      span.textContent = tickerTexts[messageIndex];
    }
  });

  // Modal and footer labels
  document.querySelectorAll('.m-label').forEach(el => {
    el.textContent = lang.labels.modalSizeLabel;
  });
  // Dynamic content updates
  const wppFloat = document.querySelector('.wpp-float');

  if (wppFloat) wppFloat.setAttribute('aria-label', lang.labels.whatsappAria);

  // Filter labels
  const filterLabel = document.querySelector('.fg-label');
  if (filterLabel) {
    if (pageName === 'camisas') {
      filterLabel.textContent = lang.labels.filterLeague;
    } else if (pageName === 'copa2026') {
      filterLabel.textContent = lang.labels.filterSponsor;
    } else {
      filterLabel.textContent = lang.labels.filterBrand;
    }
  }

  // Section/title texts
  if (pageName === 'index' && Array.isArray(lang.labels.section.index)) {
    const ft = document.querySelector('.finder-title');
    if (ft && lang.labels.section.finder) {
      ft.innerHTML = lang.labels.section.finder;
    }
    
    // Títulos específicos da Home (Lançamentos / Mais Procurados)
    if (pageName === 'index') {
      document.querySelectorAll('.section-title').forEach((el, idx) => {
        const target = lang.labels.section.index[idx];
        if (target) {
          const tNorm = target.replace(/\s+/g, ' ').trim().toLowerCase();
          const cNorm = el.innerHTML.replace(/\s+/g, ' ').trim().toLowerCase();
          if (tNorm !== cNorm) {
            el.innerHTML = target;
          }
        }
      });
    }





  } else {
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle && lang.labels.section[pageName]) {
      const target = lang.labels.section[pageName];
      const tNorm = target.replace(/\s+/g, ' ').trim().toLowerCase();
      const cNorm = sectionTitle.innerHTML.replace(/\s+/g, ' ').trim().toLowerCase();
      if (tNorm !== cNorm) {
        sectionTitle.innerHTML = target;
      }
    }

  }


  const heroSubtitle = document.querySelector('.slide-subtitle');
  if (heroSubtitle && lang.labels.heroSubtitle[pageName]) {
    if (heroSubtitle.textContent !== lang.labels.heroSubtitle[pageName]) {
      heroSubtitle.textContent = lang.labels.heroSubtitle[pageName];
    }
  }

  const heroTitle = document.querySelector('.slide-title');
  if (heroTitle && lang.labels.heroTitle[pageName]) {
    if (heroTitle.innerHTML !== lang.labels.heroTitle[pageName]) {
      heroTitle.innerHTML = lang.labels.heroTitle[pageName];
    }
  }


  document.querySelectorAll('.fb[data-v="todos"]').forEach(btn => {
    btn.textContent = lang.labels.all;
  });

  document.querySelectorAll('.fb[data-v="outras"]').forEach(btn => {
    btn.textContent = lang.labels.other;
  });

  if (pageName === 'index') {
    const slides = document.querySelectorAll('#heroSlider .slide');
    slides.forEach((slide, idx) => {
      if (!lang.slides[idx]) return;
      slide.querySelector('.slide-subtitle').textContent = lang.slides[idx].sub;
      slide.querySelector('.slide-title').innerHTML = lang.slides[idx].title;
      slide.querySelector('.slide-btn').textContent = lang.slides[idx].btn;
    });
  }

  const titleMap = {
    index: 'Sport Closet — Camisas de Time, Tênis e Roupas de Verão',
    copa2026: 'Copa 2026 — Sport Closet',
    camisas: 'Camisas de Time — Sport Closet',
    tenis: 'Tênis — Sport Closet',
    'roupas-verao': 'Roupas de Verão — Sport Closet'
  };

  const titleMapEn = {
    index: 'Sport Closet — Club Jerseys, Sneakers and Summer Wear',
    copa2026: 'World Cup 2026 — Sport Closet',
    camisas: 'Club Jerseys — Sport Closet',
    tenis: 'Sneakers — Sport Closet',
    'roupas-verao': 'Summer Wear — Sport Closet'
  };
  
  if (document.title && titleMap[pageName]) {
    document.title = isUsa() ? (titleMapEn[pageName] || titleMap[pageName]) : titleMap[pageName];
  }

  const footerCopyright = document.querySelector('.footer-legal');
  if (footerCopyright) footerCopyright.textContent = lang.footer.rights;
  
  const footAbout = document.querySelector('.footer-col p');
  if (footAbout) footAbout.textContent = lang.footer.aboutText;

  const footHeaders = document.querySelectorAll('.footer-col h4');
  if (footHeaders.length >= 4) {
    footHeaders[0].textContent = lang.footer.explore;
    footHeaders[1].textContent = lang.footer.support;
    footHeaders[2].textContent = lang.footer.about;
    footHeaders[3].textContent = lang.footer.social;
  }

  const footLinks = document.querySelectorAll('.footer-col ul li a');
  footLinks.forEach(a => {
    if (a.textContent.includes('FAQ')) a.textContent = lang.footer.faq;
    if (a.textContent.includes('Fale Conosco') || a.textContent.includes('Contact')) a.textContent = lang.footer.contact;
  });

  // Mosaic Translations (Home)
  const mosaicItems = document.querySelectorAll('.mosaic-item');
  if (mosaicItems.length >= 4) {
    const m = lang.mosaic;
    const updateMosaic = (item, data) => {
      if (!item) return;
      const sub = item.querySelector('.m-sub');
      const tit = item.querySelector('.m-tit');
      const cta = item.querySelector('.m-cta');
      if (sub) sub.textContent = data.sub;
      if (tit) tit.textContent = data.tit;
      if (cta) cta.textContent = data.cta;
    };
    updateMosaic(mosaicItems[0], m.sneakers);
    updateMosaic(mosaicItems[1], m.europe);
    updateMosaic(mosaicItems[2], m.worldcup);
    updateMosaic(mosaicItems[3], m.summer);
  }

  // Team Finder Filters
  document.querySelectorAll('.fp').forEach(btn => {
    const val = btn.textContent.toLowerCase();
    if (val.includes('todos') || val.includes('all')) btn.textContent = lang.teamFilters.todos;
    if (val.includes('europeus') || val.includes('european')) btn.textContent = lang.teamFilters.europeus;
    if (val.includes('brasileiros') || val.includes('brazilian')) btn.textContent = lang.teamFilters.brasileiros;
    if (val.includes('seleções') || val.includes('national')) btn.textContent = lang.teamFilters.selecoes;
  });
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

  if (pageName === 'index' && !searchQuery) {
    const selecionados = embaralhar(source);
    desenharCards('grid-drop-exclusivo', selecionados.slice(0, 10));
    desenharCards('grid-mais-vistos', selecionados.slice(10, 20));
  } else {
    const list = source.filter(p => {
      const pTipo = norm(p.tipo);
      const pMarca = norm(p.marca);
      const pNome = norm(p.nome);
      const pLiga = norm(p.liga);

      let matchPageType = false;
      if (pageType === 'todos' || pageName === 'index') {
          matchPageType = true;
      } else if (Array.isArray(pageType)) {
          matchPageType = pageType.map(pt => norm(pt)).includes(pTipo);
      } else {
          matchPageType = pTipo === norm(pageType);
      }

      const matchLigaFilter = pageName !== 'camisas' || activeFilters.liga === 'todos' || pLiga === norm(activeFilters.liga);
      const matchMarcaFilter = (pageName !== 'tenis' && pageName !== 'roupas-verao') || activeFilters.marca === 'todos' || pMarca === norm(activeFilters.marca);
      
      let matchCopaSponsor = true;
      if (pageName === 'copa2026' && activeFilters.tipo !== 'todos') {
          if (activeFilters.tipo === 'outras') {
              matchCopaSponsor = !['nike', 'adidas', 'puma'].includes(pMarca);
          } else {
              matchCopaSponsor = pMarca === norm(activeFilters.tipo);
          }
      }

      const matchBusca = !searchQuery || 
                         pNome.includes(searchQuery) || 
                         pMarca.includes(searchQuery) || 
                         pTipo.includes(searchQuery) || 
                         pLiga.includes(searchQuery);
      
      const pModelo = norm(p.modelo);
      const matchPecaFilter = activeFilters.peca === 'todos' || (pageName === 'roupas-verao' ? pTipo === norm(activeFilters.peca) : pModelo === norm(activeFilters.peca));

      return matchPageType && matchLigaFilter && matchMarcaFilter && matchCopaSponsor && matchBusca && matchPecaFilter;
    });

    const targetGrid = pageName === 'index' ? 'grid-drop-exclusivo' : 'grid';
    const countEl = document.getElementById('pcount');
    if (countEl) countEl.textContent = `${list.length} ${lang.found}`;
    
    desenharCards(targetGrid, list);
    if (pageName === 'index') {
        const grid2 = document.getElementById('grid-mais-vistos');
        if (grid2) grid2.innerHTML = '';
    }

    // -- LOGIC FOR DYNAMIC FILTERS --
    if (['tenis', 'roupas-verao', 'camisas'].includes(pageName)) {
        // Compute base page products completely unfiltered
        const baseList = source.filter(p => {
          const pTipo = norm(p.tipo);
          let matchPageType = false;
          if (pageType === 'todos' || pageName === 'index') {
              matchPageType = true;
          } else if (Array.isArray(pageType)) {
              matchPageType = pageType.map(pt => norm(pt)).includes(pTipo);
          } else {
              matchPageType = pTipo === norm(pageType);
          }
          const matchBusca = !searchQuery || 
                           norm(p.nome).includes(searchQuery) || 
                           norm(p.marca).includes(searchQuery) || 
                           pTipo.includes(searchQuery) || 
                           norm(p.liga).includes(searchQuery);
          return matchPageType && matchBusca;
        });

        if (pageName === 'camisas') {
            updateDynamicFilters('dynamicLigaFilters', 'liga', 'liga', baseList);
            updateDynamicFilters('dynamicMarcaFilters', 'marca', 'marca', baseList);
        } else if (pageName === 'tenis') {
            updateDynamicFilters('dynamicBrandFilters', 'marca', 'marca', baseList);
            updateDynamicFilters('dynamicModelFilters', 'peca', 'modelo', list);
        } else if (pageName === 'roupas-verao') {
            updateDynamicFilters('dynamicBrandFilters', 'marca', 'marca', baseList);
            updateDynamicFilters('dynamicPieceFilters', 'peca', 'tipo', list);
        }
    }

    refreshFilterVisibility(list);
  }
}

/**
 * Gera dinamicamente os botões de filtro com base nos produtos atuais.
 * @param {string} containerId ID do container no HTML
 * @param {string} filterGroup O grupo (data-g) do filtro (ex: marca, peca, liga)
 * @param {string} productField O campo no objeto produto (ex: marca, modelo, liga)
 * @param {Array} filteredList A lista de produtos passada para o filtro
 */
function updateDynamicFilters(containerId, filterGroup, productField, filteredList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Pegar todos os valores únicos que NÃO estão vazios para este campo
    const valuesSet = new Set();
    
    // Para filtros de nível secundário (peca/modelo), filtramos apenas os que batem com a MARCA selecionada
    // Ja para filtros de nível primário (marca/liga), olhamos todos os produtos da página
    filteredList.forEach(p => {
        const val = p[productField];
        if (val && val.trim()) {
            // Se for modelo, só adiciona se bater com a marca ativa (ou se não houver marca ativa)
            if (filterGroup === 'peca' && activeFilters.marca !== 'todos' && norm(p.marca) !== norm(activeFilters.marca)) return;
            
            valuesSet.add(val.trim().toLowerCase());
        }
    });

    const values = Array.from(valuesSet).sort();

    // 2. Preservar o botão "TODOS"
    const todosBtn = container.querySelector(`.fb[data-v="todos"], .fp[data-v="todos"]`);
    container.innerHTML = '';
    if (todosBtn) {
        container.appendChild(todosBtn);
        todosBtn.classList.toggle('active', activeFilters[filterGroup] === 'todos');
    }

    // 3. Criar novos botões
    values.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'fb';
        if (activeFilters[filterGroup] === v) btn.classList.add('active');
        btn.dataset.g = filterGroup;
        btn.dataset.v = v;
        btn.textContent = v.toUpperCase();
        btn.onclick = () => setFilter(filterGroup, v);
        container.appendChild(btn);
    });
}

/** 
 * Oculta botões de filtro (FB/FP) se não houver produtos correspondentes 
 * no set atual de dados filtrados (ignorando o próprio grupo pra não 'travar')
 */
function refreshFilterVisibility(filteredList) {
  const allProds = window.produtos || [];
  
  // Para cada grupo de filtro (marca, liga, tipo/sponsor)
  ['marca', 'liga', 'tipo'].forEach(group => {
    const buttons = document.querySelectorAll(`.fb[data-g="${group}"], .fp[data-g="${group}"]`);
    buttons.forEach(btn => {
      const val = norm(btn.dataset.v);
      if (val === 'todos') return;

      // Verifica se existe algum produto com este valor no contexto da página
      const exists = allProds.some(p => {
        // Deve respeitar o tipo da página (ex: se estou em camisas, só conta camisas)
        let matchPage = false;
        if (pageName === 'index') matchPage = true;
        else if (Array.isArray(pageType)) matchPage = pageType.map(pt => norm(pt)).includes(norm(p.tipo));
        else matchPage = norm(p.tipo) === norm(pageType);

        if (!matchPage) return false;

        if (group === 'marca') return norm(p.marca) === val;
        if (group === 'liga') return norm(p.liga) === val;
        if (group === 'tipo') return norm(p.marca) === val; // Sponsor na Copa
        return false;
      });

      btn.style.display = exists ? 'inline-block' : 'none';
      
      // Caso o filtro selecionado tenha sumido (improvável com a lógica acima), resetamos
      if (!exists && activeFilters[group] === val) {
        setFilter(group, 'todos');
      }
    });
  });

  // Visibilidade de Filtros de Peças/Modelos (Customizado por página)
  const pecaButtons = document.querySelectorAll('.fb[data-g="peca"], .fp[data-g="peca"]');
  pecaButtons.forEach(btn => {
    const val = norm(btn.dataset.v);
    if (val === 'todos') return;

    const exists = allProds.some(p => {
      // Deve respeitar a página e a marca já selecionada
      let matchPage = false;
      if (pageName === 'index') matchPage = true;
      else if (Array.isArray(pageType)) matchPage = pageType.map(pt => norm(pt)).includes(norm(p.tipo));
      else matchPage = norm(p.tipo) === norm(pageType);

      if (!matchPage) return false;

      // Respeita a marca selecionada (se houver) para filtrar modelos relevantes
      if (activeFilters.marca !== 'todos' && norm(p.marca) !== norm(activeFilters.marca)) return false;

      return norm(p.modelo) === val;
    });

    btn.style.display = exists ? 'inline-block' : 'none';
    if (!exists && activeFilters.peca === val) setFilter('peca', 'todos');
  });
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
    const fotoUrl = p.imgs && p.imgs[0] ? encodeURI(p.imgs[0]) : 'https://placehold.co/400x500?text=Foto+Indisponível';
    return `
    <div class="card" onclick="openModal(${p.id})">
      <div class="card-img">
        <img src="${fotoUrl}" alt="${p.nome}" loading="lazy" onerror="this.src='https://placehold.co/400x500?text=Foto+Indisponível'">
        ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}
      </div>

      <div class="card-info">
        <div class="card-brand">${p.marca.toUpperCase()}</div>
        <div class="card-name">${p.nome}</div>
        <div class="card-footer">
          <div class="card-price">${formatPrice(p)}</div>
          <button class="grid-wpp-btn" onclick="event.stopPropagation(); window.open('https://wa.me/${WPP}?text=${wppMsg(p)}', '_blank')">
            <span style="display:flex; width:16px; height:16px;">${wppSvg.replace('<svg ', '<svg style="width:16px;height:16px;fill:currentColor;" ')}</span>
            ${isUsa() ? 'ORDER ON WHATSAPP' : 'COMPRAR NO WHATSAPP'}
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
  document.getElementById('mName').textContent = curProd.nome;
  document.getElementById('mType').textContent = tStr(curProd.tipo).toUpperCase();
  document.getElementById('mPrice').textContent = formatPrice(curProd);
  
  const altPrice = isUsa() ? formatPrice({ brl: curProd.brl }) : formatPrice({ usd: curProd.usd });
  const altEl = document.getElementById('mPriceAlt');
  if (altEl) {
    altEl.textContent = altPrice;
    altEl.style.display = altPrice ? 'block' : 'none';
  }

  document.getElementById('mDesc').textContent = translateDesc(curProd.desc) || "";

  document.getElementById('mSizes').innerHTML = (curProd.tamanhos || [])
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
    <div class="carousel-slide"><img src="${encodeURI(img)}" loading="${i === 0 ? 'eager' : 'lazy'}"></div>`).join('');
  
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
    const leftChevron = document.getElementById('chevronLeft');
    const rightChevron = document.getElementById('chevronRight');
    if(leftChevron) leftChevron.style.display = carouselImgs.length > 1 && carouselIdx > 0 ? 'flex' : 'none';
    if(rightChevron) rightChevron.style.display = carouselImgs.length > 1 && carouselIdx < carouselImgs.length - 1 ? 'flex' : 'none';
}


/* ─── INICIALIZAÇÃO ──────────────────────────────────────────────────────── */
function init() {
    // 1. Inicializar Estado de Região (Prioridade Máxima)
    const btn = document.getElementById('regionBtn');
    const savedUsa = localStorage.getItem('sport_closet_usa');

    if (btn) {
        btn.onclick = null; // Limpa onclick do HTML
        btn.addEventListener('click', toggleRegion);
        if (savedUsa === '1') {
            btn.dataset.usa = '1';
            btn.textContent = '🇺🇸 USA ($)';
        } else {
            btn.dataset.usa = '0';
            btn.textContent = '🇧🇷 Brasil (R$)';
        }
    }

    // 2. Traduzir e Renderizar
    try {
      updateStaticTexts();
    } catch (e) {
      console.error("Erro ao atualizar textos estáticos:", e);
    }
    
    renderGrid();
    if (pageName === 'index') renderTeamSlider('todos');
    
    // 3. Eventos Adicionais
    const inputs = document.querySelectorAll('.nav-search-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const val = input.value;
            inputs.forEach(other => { if (other !== input) other.value = val; });
            handleSearch(val);
        });
    });

    document.querySelector('.mcls')?.addEventListener('click', () => closeModal());
    document.getElementById('overlay')?.addEventListener('click', (e) => closeModal(e));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // 4. Finalizar carregamento suave (Aumentado para evitar pulos em telas internas)
    setTimeout(() => {
      document.body.classList.remove('is-loading');
    }, 600);
}

/* ─── CARREGAMENTO DOS DADOS DO CSV LOCAL ──────────────────────────────── */
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJJsi5MlreQayUKZtiZIwb0RcZCPa5ngJOkOmq-uCkKvtxVD8oRvYIJuYosn-22qsXtCsZsHJHfjhs/pub?output=csv';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0KrdBrG0Afz4LmUjFL3adH-5AXvlCgQk2fkaWPJpIb-c9wGbo-XzHPTKkTpn5OkR_Rg/exec';

function bootStore() {
  document.body.classList.add('is-loading');
  
  // Tenta o Apps Script primeiro (como no admin.js)
  fetch(APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(json => {
      if (json.ok && json.data && json.data.length > 0) {
        processCSVData(json.data);
        init();
      } else {
        throw new Error("Apps Script sem dados");
      }
    })
    .catch(err => {
      console.warn("Apps Script falhou ou vazio. Tentando CSV fallback...", err);
      // Fallback para PapaParse via script
      const sc = document.createElement('script');
      sc.src = "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js";
      sc.onload = () => {
        Papa.parse(GOOGLE_SHEET_CSV_URL, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            if (results.data && results.data.length > 0) {
              processCSVData(results.data);
              init();
            } else {
              loadFallbackCsv();
            }
          },
          error: function(err) {
            console.error("Erro ao baixar CSV:", err);
            loadFallbackCsv();
          }
        });
      };
      sc.onerror = () => loadFallbackCsv();
      document.head.appendChild(sc);
    });
}

function loadFallbackCsv() {
  console.error("Erro total ao carregar dados.");
  const grid = document.getElementById('grid') || document.getElementById('grid-drop-exclusivo');
  if(grid) grid.innerHTML = '<div class="empty">Erro ao carregar produtos. Verifique sua conexão.</div>';
  window.produtos = [];
  init();
}

function processCSVData(data) {
  window.produtos = data.map((row, index) => {
    const szStr = row.tamanhos || row.sizes || '';
    const sep = szStr.includes(';') ? ';' : ',';
    const tamanhos = szStr.split(sep).map(s => s.trim()).filter(s => s);

    return {
      id: row.id || index + 1,
      nome: row.nome || '',
      marca: norm(row.marca),
      tipo: norm(row.tipo),
      liga: norm(row.liga),
      modelo: norm(row.modelo || row.model || row.colecao),
      brl: parseFloat((row.preco_brl || '0').replace(',', '.')) || 0,
      usd: parseFloat((row.preco_usa || '0').replace(',', '.')) || 0,
      tamanhos: tamanhos,
      desc: row.descricao || '',
      badge: row.badge || '',
      imgs: [row.img_1, row.img_2, row.img_3]
            .filter(img => img && img.trim())
            .map(img => {
                const clean = img.trim();
                if (clean.startsWith('http')) return clean;
                return BASE_URL_FOTOS + clean;
            }),
      status: norm(row.status || 'ativo')
    };
  }).filter(p => p.nome && p.status !== 'arquivado');
}

/* ─── LOGICA DO SLIDER DE TIMES (HOME) ────────────────────────────────────── */
function filterTeamSlider(val, btn) {
  document.querySelectorAll('.fp').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTeamSlider(val);
}

function renderTeamSlider(filterKey) {
  const source = window.produtos || [];
  let filtered = source.filter(p => {
    const pt = norm(p.tipo);
    return (pt === norm('camisa de time') || pt === norm('camisa de seleção'));
  });

  if (filterKey === 'todos') {
    filtered = embaralhar(filtered);
  } else if (filterKey === 'europeus') {

    // Exclui times Brasileiros e Seleções para mostrar apenas Clubes Europeus
    filtered = filtered.filter(p => {
      const liga = norm(p.liga);
      const brTerms = ['brasil', 'brasileirao', 'brasileirão'];
      const selecoesTerms = ['brasil', 'argentina', 'alemanha', 'italia', 'japao', 'belgica', 'portugal', 'frança', 'espanha'];
      return !brTerms.includes(liga) && !selecoesTerms.includes(liga) && norm(p.tipo) === norm('camisa de time');
    });
  } else if (filterKey === 'brasileiros') {
    filtered = filtered.filter(p => norm(p.liga) === norm('brasileirão') || norm(p.liga) === norm('brasileirao'));
  } else if (filterKey === 'selecoes') {
    filtered = filtered.filter(p => norm(p.tipo) === norm('camisa de seleção'));
  }

  desenharCards('homeTeamSlider', filtered);
}


function scrollTeamSlider(dir) {
  const slider = document.getElementById('homeTeamSlider');
  if (!slider) return;
  const scrollAmount = 300;
  slider.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', bootStore);
window.addEventListener('productsLoaded', () => {
  // Re-renderizar se os produtos acabaram de carregar do Google Sheets
  renderGrid();
  // Se for a home, recarregar o slider de times também
  if (pageName === 'index') renderTeamSlider('todos');
});



