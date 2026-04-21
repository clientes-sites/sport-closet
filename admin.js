// ─── SPORT CLOSET — admin.js ───────────────────────────────────────────────
// Integrado com Google Sheets via Apps Script.
// Cole aqui a URL gerada após implantar o Code.gs:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0KrdBrG0Afz4LmUjFL3adH-5AXvlCgQk2fkaWPJpIb-c9wGbo-XzHPTKkTpn5OkR_Rg/exec';

const BASE_URL_FOTOS = 'https://pub-4af8db08776e49b78718c90c788bddab.r2.dev/';
const ADMIN_PASSWORD = 'sportcloset123';
const AUTH_KEY = 'sport_closet_admin_authenticated';

let adminProducts = [];
let filteredIndices = [];
let activeEditIndex = -1;



// ── AUTH ───────────────────────────────────────────────────────────────────
const isAuth = () => localStorage.getItem(AUTH_KEY) === '1';
const setAuth = v => localStorage.setItem(AUTH_KEY, v ? '1' : '0');

function handleLogin() {
  const input = document.getElementById('adminPasswordInput');
  const error = document.getElementById('authError');
  if (input?.value.trim() === ADMIN_PASSWORD) {
    setAuth(true);
    document.getElementById('authOverlay').style.display = 'none';
    initAdmin();
  } else if (error) {
    error.textContent = 'Senha incorreta. Tente novamente.';
    input.value = '';
    input.focus();
  }
}



// ── TOAST ──────────────────────────────────────────────────────────────────
let _tt;
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(_tt);
  _tt = setTimeout(() => { el.className = ''; }, 3500);
}

// ── CONFIRM DIALOG ─────────────────────────────────────────────────────────
function showConfirm(title, msg, onOk) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmDialog').classList.add('open');
  document.getElementById('confirmOk').onclick = () => {
    document.getElementById('confirmDialog').classList.remove('open');
    onOk();
  };
}

// ── LOADING STATE ──────────────────────────────────────────────────────────
function setLoading(active, msg = '') {
  const btn = document.getElementById('btnSave');
  const status = document.getElementById('saveStatus');
  if (btn) {
    btn.disabled = active;
    btn.textContent = active ? 'Salvando…' : 'Salvar no Sheets';
  }
  if (status) {
    status.textContent = msg;
    status.className = 'save-status' + (active ? ' loading' : '');
  }
}

// ── BUSCAR DADOS DO GOOGLE SHEETS ──────────────────────────────────────────
async function fetchFromSheets() {
  setLoading(false, 'Carregando dados…');
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'flex';
  try {
    const res = await fetch(APPS_SCRIPT_URL);
    const json = await res.json();

    // Se o Apps Script retornou sucesso e tem dados, usa eles
    if (json.ok && json.data && json.data.length > 0) {
      loadProducts(json.data);
      window.dispatchEvent(new CustomEvent('productsLoaded', { detail: json.data }));
      toast(`${json.data.length} produtos carregados do Google Sheets.`);
    } else {
      // Fallback para o CSV Público se o Apps Script estiver vazio ou falhar
      console.warn("Apps Script sem dados. Tentando CSV Público...");
      const csvRes = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTJJsi5MlreQayUKZtiZIwb0RcZCPa5ngJOkOmq-uCkKvtxVD8oRvYIJuYosn-22qsXtCsZsHJHfjhs/pub?output=csv');
      const csvText = await csvRes.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          loadProducts(results.data);
          window.dispatchEvent(new CustomEvent('productsLoaded', { detail: results.data }));
          toast(`${results.data.length} produtos carregados via CSV (Apps Script vazio).`);
        }
      });
    }
    setLoading(false, '');
  } catch (err) {
    console.error(err);
    setLoading(false, '');
    toast('Erro ao carregar dados: ' + err.message, 'error');
  } finally {
    if (overlay) overlay.style.display = 'none';
  }
}

// ── SALVAR NO GOOGLE SHEETS ────────────────────────────────────────────────
async function saveToSheets() {
  if (!adminProducts.length) {
    toast('Nenhum produto para salvar.', 'error');
    return;
  }

  setLoading(true, 'Sincronizando com Sheets…');

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'save', data: adminProducts })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Servidor retornou ${res.status}: ${text.slice(0, 50)}...`);
    }

    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Erro na resposta do Google');

    toast(`✓ Sincronizado com Google Sheets! (${json.saved} produtos)`);
    setLoading(false, `Último Sync: ${new Date().toLocaleTimeString('pt-BR')}`);
  } catch (err) {
    console.error("Erro no Apps Script:", err);
    setLoading(false, '');
    toast('Erro de Sincronização: ' + err.message, 'error');
  }
}


// ── CARREGAR PRODUTOS ──────────────────────────────────────────────────────
function loadProducts(rows) {
  adminProducts = rows.map((row, i) => ({
    id: row.id || String(i + 1),
    nome: row.nome || '',
    marca: row.marca || '',
    tipo: row.tipo || '',
    liga: row.liga || '',
    modelo: row.modelo || row.model || row.colecao || '',
    preco_brl: row.preco_brl || row.preco_br || row.preco || '',
    preco_usa: row.preco_usa || row.preco_usd || row.usd || '',
    img_1: row.img_1 || '',
    img_2: row.img_2 || '',
    img_3: row.img_3 || '',
    tamanhos: row.tamanhos || row.sizes || '',
    descricao: row.descricao || row.desc || '',
    badge: row.badge || '',
    status: norm(row.status) || 'ativo'
  }));
  populateFilters();
  applyFilters();
  updateSidebar();
}

// ── MODAL DE EDIÇÃO ───────────────────────────────────────────────────────
function openProductModal(idx) {
  activeEditIndex = idx;
  const p = adminProducts[idx];

  document.getElementById('modalTitle').textContent = p.nome ? `Editar: ${p.nome}` : 'Novo Produto';

  // Imagens
  document.getElementById('modalImg1').value = p.img_1 || '';
  document.getElementById('modalImg2').value = p.img_2 || '';
  document.getElementById('modalImg3').value = p.img_3 || '';
  document.getElementById('modalImg1Prev').src = prevUrl(p.img_1);
  document.getElementById('modalImg2Prev').src = prevUrl(p.img_2);
  document.getElementById('modalImg3Prev').src = prevUrl(p.img_3);

  // Inputs
  document.getElementById('modalNome').value = p.nome || '';
  document.getElementById('modalId').value = p.id || '';
  document.getElementById('modalMarca').value = p.marca || '';
  document.getElementById('modalTipo').value = p.tipo || '';
  document.getElementById('modalLiga').value = p.liga || '';
  document.getElementById('modalModelo').value = p.modelo || '';
  document.getElementById('modalBadge').value = p.badge || '';
  document.getElementById('modalPrecoBrl').value = p.preco_brl || '';
  document.getElementById('modalPrecoUsa').value = p.preco_usa || '';
  document.getElementById('modalTamanhos').value = p.tamanhos || '';
  document.getElementById('modalDescricao').value = p.descricao || '';

  document.getElementById('productModal').classList.add('open');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  activeEditIndex = -1;
}

// ── UTILITÁRIOS ─────────────────────────────────────────────────────────────
function norm(str) {
  if (!str) return '';
  return str.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function esc(str) {
  if (!str) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

function saveProductModal() {
  if (activeEditIndex === -1) return;

  const p = adminProducts[activeEditIndex];
  p.nome = document.getElementById('modalNome').value;
  p.id = document.getElementById('modalId').value;
  p.marca = document.getElementById('modalMarca').value;
  p.tipo = document.getElementById('modalTipo').value;
  p.liga = document.getElementById('modalLiga').value;
  p.modelo = document.getElementById('modalModelo').value;
  p.badge = document.getElementById('modalBadge').value;
  p.preco_brl = document.getElementById('modalPrecoBrl').value;
  p.preco_usa = document.getElementById('modalPrecoUsa').value;
  p.tamanhos = document.getElementById('modalTamanhos').value;
  p.descricao = document.getElementById('modalDescricao').value;
  p.img_1 = document.getElementById('modalImg1').value;
  p.img_2 = document.getElementById('modalImg2').value;
  p.img_3 = document.getElementById('modalImg3').value;

  closeProductModal();
  applyFilters();
  updateSidebar();

  // Instant Sync: Salva e Publica em um só passo
  saveToSheets();
}



// ── FILTROS ────────────────────────────────────────────────────────────────
function populateFilters() {
  const marcas = [...new Set(adminProducts.map(p => p.marca).filter(Boolean))].sort();
  const tipos = [...new Set(adminProducts.map(p => p.tipo).filter(Boolean))].sort();
  document.getElementById('filterMarca').innerHTML =
    '<option value="">Todas as marcas</option>' +
    marcas.map(m => `<option>${esc(m)}</option>`).join('');
  document.getElementById('filterTipo').innerHTML =
    '<option value="">Todos os tipos</option>' +
    tipos.map(t => `<option>${esc(t)}</option>`).join('');
}

function applyFilters() {
  const q = norm(document.getElementById('searchInput')?.value || '');
  const marca = document.getElementById('filterMarca')?.value || '';
  const tipo = document.getElementById('filterTipo')?.value || '';

  filteredIndices = adminProducts
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => {
      const mQ = !q || [p.nome, p.marca, p.liga, p.tipo, p.id, p.descricao]
        .some(v => norm(v).includes(q));
      return mQ && (!marca || p.marca === marca) && (!tipo || p.tipo === tipo);
    })
    .map(({ i }) => i);

  renderTable();

  document.getElementById('filteredCount').textContent =
    filteredIndices.length === adminProducts.length
      ? `${adminProducts.length} produtos`
      : `${filteredIndices.length} de ${adminProducts.length}`;
}

function updateSidebar() {
  document.getElementById('statCount').textContent = adminProducts.length;
  const sel = document.getElementById('selectProductRow');
  if (sel) sel.innerHTML = adminProducts.map((p, i) =>
    `<option value="${i}">${esc(`${i + 1} – ${p.nome || 'Sem nome'}`)}</option>`
  ).join('');
}

// ── TABELA ─────────────────────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('adminBody');
  tbody.innerHTML = '';

  filteredIndices.forEach((ri, di) => {
    const p = adminProducts[ri];
    const tr = document.createElement('tr');
    tr.className = 'clickable-row';
    tr.innerHTML = `
      <td class="row-num">${di + 1}</td>
      <td class="col-id"><code>${esc(p.id)}</code></td>
      <td class="col-nome"><strong>${esc(p.nome)}</strong></td>
      <td class="col-marca">${esc(p.marca)}</td>
      <td class="col-tipo">${esc(p.tipo)}</td>
      <td class="col-liga">${esc(p.liga)}</td>
      <td class="col-modelo">${esc(p.modelo)}</td>
      <td class="col-preco">${esc(p.preco_brl)}</td>
      <td class="col-preco">${esc(p.preco_usa)}</td>
      <td class="img-cell">
        <img class="img-preview" src="${prevUrl(p.img_1)}" onerror="this.src='https://placehold.co/80x80/131313/444?text=?'">
      </td>
      <td class="img-cell">
        <img class="img-preview" src="${prevUrl(p.img_2)}" onerror="this.src='https://placehold.co/80x80/131313/444?text=?'">
      </td>
      <td class="img-cell">
        <img class="img-preview" src="${prevUrl(p.img_3)}" onerror="this.src='https://placehold.co/80x80/131313/444?text=?'">
      </td>
      <td class="col-txt">${esc(p.tamanhos)}</td>
      <td class="col-txt">${esc(p.descricao)}</td>
      <td>
        ${p.badge ? `<span class="badge-chip">${esc(p.badge)}</span>` : ''}
      </td>
      <td>
        ${p.status === 'arquivado' ? `<span class="status-chip archived">Arquivado</span>` : `<span class="status-chip active">Ativo</span>`}
      </td>
      <td>
        <div style="display:flex; gap:5px;" onclick="event.stopPropagation()">
          <button class="btn btn-sm ${p.status === 'arquivado' ? 'btn-primary' : 'btn-danger'} btn-arch" data-i="${ri}" title="${p.status === 'arquivado' ? 'Desarquivar' : 'Arquivar'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
          </button>
        </div>
      </td>`;

    tr.addEventListener('click', () => openProductModal(ri));
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('input[data-f], textarea[data-f]').forEach(el =>
    el.addEventListener('input', onInput));

  tbody.querySelectorAll('.btn-edit').forEach(btn =>
    btn.addEventListener('click', e => {
      const idx = Number(e.currentTarget.dataset.i);
      openProductModal(idx);
    }));

  tbody.querySelectorAll('.btn-arch').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = Number(e.currentTarget.dataset.i);
      toggleArchiveProduct(idx);
    }));
}


function onInput(e) {
  const idx = Number(e.target.dataset.i);
  const field = e.target.dataset.f;
  if (!Number.isFinite(idx) || !field) return;
  adminProducts[idx][field] = e.target.value;
  if (field.startsWith('img_')) {
    const img = e.target.nextElementSibling;
    if (img?.tagName === 'IMG') img.src = prevUrl(e.target.value);
  }
}

function addProduct() {
  // Limpa filtros para garantir que o novo produto seja visível
  if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
  if (document.getElementById('filterMarca')) document.getElementById('filterMarca').value = '';
  if (document.getElementById('filterTipo')) document.getElementById('filterTipo').value = '';

  const maxId = adminProducts.length
    ? Math.max(...adminProducts.map(p => Number(p.id) || 0)) : 0;

  const newProduct = {
    id: String(maxId + 1), nome: '', marca: '', tipo: '', liga: '', modelo: '',
    preco_brl: '', preco_usa: '',
    img_1: '', img_2: '', img_3: '',
    tamanhos: '', descricao: '', badge: '', status: 'ativo'
  };

  adminProducts.push(newProduct);
  applyFilters();
  updateSidebar();

  // Abre o modal imediatamente para o novo produto
  openProductModal(adminProducts.length - 1);

  toast('Novo rascunho criado. Preencha os dados e salve no Sheets.');
}


function deleteProduct(idx) {
  adminProducts.splice(idx, 1);
  applyFilters();
  updateSidebar();
  populateFilters();
  toast('Produto removido. Clique em "Salvar no Sheets" para confirmar.', 'error');
}

function toggleArchiveProduct(idx) {
  const p = adminProducts[idx];
  p.status = p.status === 'arquivado' ? 'ativo' : 'arquivado';
  applyFilters();
  updateSidebar();
  populateFilters();
  toast(`Produto marcado como ${p.status}. Clique em "Salvar no Sheets".`, p.status === 'ativo' ? 'success' : 'error');
}

function prevUrl(val) {
  if (!val) return 'https://placehold.co/80x80/131313/444?text=?';
  return val.trim().startsWith('http')
    ? val.trim()
    : BASE_URL_FOTOS + encodeURI(val.trim());
}

// ── CLOUDFLARE R2 INTEGRADO ────────────────────────────────────────────────
function saveR2Config() {
  const config = {
    acct: document.getElementById('modalAcct').value.trim(),
    bucket: document.getElementById('modalBucket').value.trim(),
    token: document.getElementById('modalToken').value.trim(),
    base: document.getElementById('modalBase').value.trim()
  };
  localStorage.setItem('sport_closet_r2_config', JSON.stringify(config));
}

function loadR2Config() {
  const raw = localStorage.getItem('sport_closet_r2_config');
  if (!raw) return;
  const c = JSON.parse(raw);
  document.getElementById('modalAcct').value = c.acct || '';
  document.getElementById('modalBucket').value = c.bucket || '';
  document.getElementById('modalToken').value = c.token || '';
  document.getElementById('modalBase').value = c.base || '';

  // Sincroniza com a aba de upload antiga (opcional)
  if (document.getElementById('cfAccountId')) document.getElementById('cfAccountId').value = c.acct || '';
  if (document.getElementById('cfBucketName')) document.getElementById('cfBucketName').value = c.bucket || '';
  if (document.getElementById('cfApiToken')) document.getElementById('cfApiToken').value = c.token || '';
  if (document.getElementById('cfR2BaseUrl')) document.getElementById('cfR2BaseUrl').value = c.base || '';
}

function triggerUpload(num) {
  document.getElementById(`fileSlot${num}`).click();
}

async function handleSlotUpload(num) {
  const file = document.getElementById(`fileSlot${num}`).files[0];
  if (!file) return;

  const acct = document.getElementById('modalAcct').value.trim();
  const bucket = document.getElementById('modalBucket').value.trim();
  const token = document.getElementById('modalToken').value.trim();
  const base = document.getElementById('modalBase').value.trim();

  if (!acct || !bucket || !token) {
    toast('Configure as chaves do Cloudflare R2 primeiro!', 'error');
    document.getElementById('settingsR2').style.display = 'block';
    return;
  }

  toast(`Subindo "${file.name}" para o R2...`);

  try {
    const ep = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(acct)}/r2/buckets/${encodeURIComponent(bucket)}/objects/${encodeURIComponent(file.name)}`;
    const res = await fetch(ep, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!res.ok) throw new Error(`Erro R2: ${res.status}`);

    const fileName = file.name;
    const input = document.getElementById(`modalImg${num}`);
    const prev = document.getElementById(`modalImg${num}Prev`);

    // Atualiza campo e preview
    input.value = fileName;
    prev.src = prevUrl(fileName);

    toast(`✓ Upload concluído: ${fileName}`);
  } catch (err) {
    console.error(err);
    toast('Falha no upload R2: ' + err.message, 'error');
  } finally {
    document.getElementById(`fileSlot${num}`).value = ''; // Limpa o input file
  }
}

// ── EXPORTAR (backup local) ────────────────────────────────────────────────
function exportJson() {
  const json = JSON.stringify(adminProducts, null, 2);
  document.getElementById('csvOutput').value = json;
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([json], { type: 'application/json' })),
    download: 'backup_sport_closet.json'
  });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  toast('Backup JSON baixado!');
  switchTab('exportar');
}

function copyOutput() {
  const v = document.getElementById('csvOutput').value;
  if (!v) return toast('Gere um backup antes de copiar.', 'error');
  navigator.clipboard.writeText(v)
    .then(() => toast('Copiado!'))
    .catch(() => toast('Erro ao copiar.', 'error'));
}

// ── TABS ───────────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p =>
    p.classList.toggle('active', p.id === `tab-${name}`));
  document.querySelectorAll('.tab-btn, .nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === name));
  const titles = {
    produtos: 'Produtos',
    upload: 'Upload para Cloudflare R2',
    exportar: 'Backup / Saída'
  };
  document.getElementById('topBarTitle').textContent = titles[name] || name;
}

// ── HELPERS ────────────────────────────────────────────────────────────────
function esc(v) {
  return String(v ?? '').replace(/[&<>"]/g,
    m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

function togglePass(inputId, btnId) {
  const inp = document.getElementById(inputId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  document.getElementById(btnId).title = inp.type === 'password' ? 'Mostrar' : 'Ocultar';
}


// ── INIT ───────────────────────────────────────────────────────────────────
function initAdmin() {
  if (!isAuth()) return;

  loadR2Config(); // Carrega as chaves do Cloudflare salvas localmente

  // Sidebar & Tabs
  document.querySelectorAll('.tab-btn, .nav-btn').forEach(b =>
    b.addEventListener('click', () => switchTab(b.dataset.tab)));

  // Botões do Topo
  document.getElementById('btnAdd')?.addEventListener('click', addProduct);
  document.getElementById('btnSave')?.addEventListener('click', saveToSheets);
  document.getElementById('btnReload')?.addEventListener('click', () =>
    showConfirm('Recarregar planilha', 'Alterações não salvas serão perdidas. Continuar?', fetchFromSheets));
  document.getElementById('btnExportJson')?.addEventListener('click', exportJson);
  document.getElementById('btnCopy')?.addEventListener('click', copyOutput);

  // Botões do Modal (Crucial!)
  document.getElementById('btnCloseModal')?.addEventListener('click', closeProductModal);
  document.getElementById('btnCancelModal')?.addEventListener('click', closeProductModal);
  document.getElementById('btnSaveModal')?.addEventListener('click', saveProductModal);

  // Toggle de Configurações R2 no Modal
  document.getElementById('btnToggleSettings')?.addEventListener('click', () => {
    const el = document.getElementById('settingsR2');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  });

  // Salvar config R2 ao digitar
  ['modalAcct', 'modalBucket', 'modalToken', 'modalBase'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', saveR2Config);
  });

  // Auto-preview no modal
  ['modalImg1', 'modalImg2', 'modalImg3'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', e => {
      const prev = document.getElementById(`${id}Prev`);
      if (prev) prev.src = prevUrl(e.target.value);
    });
  });

  // Logout & Misc
  document.getElementById('btnLogout')?.addEventListener('click', () =>
    showConfirm('Sair', 'Encerrar a sessão?', () => { setAuth(false); location.reload(); }));

  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('filterMarca')?.addEventListener('change', applyFilters);
  document.getElementById('filterTipo')?.addEventListener('change', applyFilters);

  document.getElementById('confirmCancel')?.addEventListener('click', () =>
    document.getElementById('confirmDialog')?.classList.remove('open'));

  document.getElementById('cfTokenToggle')?.addEventListener('click', () =>
    togglePass('cfApiToken', 'cfTokenToggle'));

  // Avisa antes de fechar com alterações não salvas
  window.addEventListener('beforeunload', e => {
    if (adminProducts.length > 0) {
      // Omitir confirmação simples para não incomodar sempre, 
      // mas o navegador lidará com isso se definirmos returnValue.
    }
  });

  // ── SIDEBAR TOGGLE ──────────────────────────────────────────
  // Usa id único e classe própria — NUNCA nav-btn — para não acionar switchTab
  const sidebar = document.getElementById('adminSidebar');
  const toggleBtn = document.getElementById('btnSidebarToggle');
  const toggleLabel = toggleBtn?.querySelector('.sb-toggle-label');

  if (sidebar && toggleBtn) {
    // Restaurar estado salvo
    if (localStorage.getItem('sc_sb_collapsed') === '1') {
      sidebar.classList.add('collapsed');
      if (toggleLabel) toggleLabel.textContent = 'Expandir';
    }
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const collapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sc_sb_collapsed', collapsed ? '1' : '0');
      if (toggleLabel) toggleLabel.textContent = collapsed ? 'Expandir' : 'Recolher';
    });
  }

  // Carregamento Inicial Automático
  fetchFromSheets();
}

function initAuth() {
  document.getElementById('passToggle')?.addEventListener('click', () =>
    togglePass('adminPasswordInput', 'passToggle'));

  document.getElementById('adminLoginBtn')?.addEventListener('click', handleLogin);
  document.getElementById('adminPasswordInput')?.addEventListener('keyup', e => {
    if (e.key === 'Enter') handleLogin();
  });

  if (isAuth()) {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.style.display = 'none';
    initAdmin();
  }
}

window.addEventListener('DOMContentLoaded', initAuth);