/**
 * SPORT CLOSET — Componentes Dinâmicos
 * Centraliza o Cabeçalho, Navegação, Rodapé e Modal para evitar repetição.
 */

const SHARED_COMPONENTS = {
    ticker: `
        <div class="ticker">
            <div class="ticker-inner">
                <span>BEM-VINDO À SPORT CLOSET</span><span>✦</span>
                <span>OS LANÇAMENTOS PARA A COPA DO MUNDO 2026 ESTÃO AQUI</span><span>✦</span>
                <span>BEM-VINDO À SPORT CLOSET</span><span>✦</span>
                <span>OS LANÇAMENTOS PARA A COPA DO MUNDO 2026 ESTÃO AQUI</span><span>✦</span>
            </div>
        </div>
    `,
    nav: `
        <nav>
            <div class="nav-left">
                <div class="brands-toggle-mobile" onclick="toggleBrandsDropdown(event)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>
            </div>
            <a href="index.html" class="nav-logo-link">
                <img src="https://pub-4af8db08776e49b78718c90c788bddab.r2.dev/logo-horizontal.png" class="logo-horizontal" alt="Sport Closet">
            </a>
            <div class="nav-search nav-search-desktop">
                <input type="text" class="nav-search-input" placeholder="Pesquisar produtos (nome, marca, tipo)..." oninput="handleSearch(this.value)">
            </div>
            <div class="nav-right">
                <button class="region-btn" onclick="toggleRegion()" id="regionBtn" data-usa="0">🇧🇷 Brasil (R$)</button>
            </div>
        </nav>
        <div class="brand-bar">
            <div class="nav-search nav-search-mobile">
                <input type="text" class="nav-search-input" placeholder="Pesquisar produtos..." oninput="handleSearch(this.value)">
            </div>
            <ul class="brand-links brand-links-desktop">
                <li><a href="copa2026.html" data-nav="copa2026">Copa 2026</a></li>
                <li><a href="camisas.html" data-nav="camisas">Camisas de Time</a></li>
                <li><a href="tenis.html" data-nav="tenis">Tênis</a></li>
                <li><a href="roupas-verao.html" data-nav="roupas-verao">Roupas de Verão</a></li>
            </ul>
        </div>
        <div class="brands-dropdown" id="brandsDropdown">
            <ul class="brand-links">
                <li><a href="copa2026.html" data-nav="copa2026">Copa 2026</a></li>
                <li><a href="camisas.html" data-nav="camisas">Camisas de Time</a></li>
                <li><a href="tenis.html" data-nav="tenis">Tênis</a></li>
                <li><a href="roupas-verao.html" data-nav="roupas-verao">Roupas de Verão</a></li>
            </ul>
        </div>
    `,
    modal: `
        <div class="overlay" id="overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="mcls" onclick="closeModal()">✕</button>
                <div class="modal-img-wrap">
                    <button class="carousel-chevron left" id="chevronLeft" onclick="carouselStep(-1)">‹</button>
                    <div class="carousel-track" id="carouselTrack"></div>
                    <button class="carousel-chevron right" id="chevronRight" onclick="carouselStep(1)">›</button>
                    <div class="carousel-dots" id="carouselDots"></div>
                </div>
                <div class="modal-body">
                    <div class="m-brand" id="mBrand"></div>
                    <div class="m-name" id="mName"></div>
                    <div class="m-type" id="mType"></div>
                    <div class="m-price" id="mPrice"></div>
                    <div class="m-price-alt" id="mPriceAlt"></div>
                    <div class="m-label">Tamanho</div>
                    <div class="sizes" id="mSizes"></div>
                    <div class="m-desc" id="mDesc"></div>
                    <button class="m-wpp" id="mWpp">Pedir pelo WhatsApp</button>
                </div>
            </div>
        </div>
    `,
    footer: `
        <footer>
            <div class="footer-content">
                <div class="footer-col">
                    <h4>EXPLORE</h4>
                    <ul>
                        <li><a href="camisas.html">Camisas de Time</a></li>
                        <li><a href="tenis.html">Tênis Lifestyle</a></li>
                        <li><a href="copa2026.html">Copa do Mundo 2026</a></li>
                        <li><a href="roupas-verao.html">Roupas de Verão</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>SUPORTE</h4>
                    <ul>
                        <li><a href="https://wa.me/5531992082542?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20o%20Sport%20Closet...">Dúvidas Frequentes (FAQ)</a></li>
                        <li><a href="https://wa.me/5531992082542">Fale Conosco</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>SOBRE NÓS</h4>
                    <p style="font-size:12px; line-height:1.6; color:var(--muted);">O esporte mantém nossa forma. Mantém nosso foco. Nos une. Através dos esportes, temos o poder de mudar vidas — com histórias de atletas inspiradores e tecnologias inovadoras.</p>
                </div>
                <div class="footer-col">
                    <h4>SOCIAL</h4>
                    <a href="https://www.instagram.com/sportcloset.co" target="_blank" class="insta-circle">
                        <img src="https://pub-4af8db08776e49b78718c90c788bddab.r2.dev/instagram.svg" alt="Instagram">
                    </a>
                </div>
            </div>
            <div class="footer-bottom">
                <a href="index.html" class="nav-logo-link" style="margin-bottom:10px;">
                    <img src="https://pub-4af8db08776e49b78718c90c788bddab.r2.dev/logo-vertical.png" class="logo-vertical" alt="Sport Closet Seal">
                </a>
                <div class="footer-legal">© 2026 Sport Closet — Todos os direitos reservados.</div>
            </div>
        </footer>
    `,
    whatsapp: `
        <a class="wpp-float" href="https://wa.me/5531992082542?text=Olá!%20Estou%20no%20site%20da%20Sport%20Closet%20e%20gostaria%20de%20atendimento." target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.633a.5.5 0 0 0 .61.61l5.775-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.088-1.392l-.363-.216-3.763.963.982-3.637-.237-.376A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        </a>
    `
};

function injectSharedComponents() {
    const body = document.body;
    const page = body.dataset.page;

    // Injeção de Cabeçalho (Ticker + Nav)
    const headerWrap = document.createElement('header');
    headerWrap.innerHTML = SHARED_COMPONENTS.ticker + SHARED_COMPONENTS.nav;
    body.prepend(headerWrap);

    // Injeção de Modal e Footer no final
    const footerWrap = document.createElement('div');
    footerWrap.innerHTML = SHARED_COMPONENTS.modal + SHARED_COMPONENTS.footer + SHARED_COMPONENTS.whatsapp;
    body.appendChild(footerWrap);

    // Ativar o link correto na navegação
    document.querySelectorAll(`[data-nav="${page}"]`).forEach(a => a.classList.add('active'));
}

// Iniciar injeção imediatamente
injectSharedComponents();