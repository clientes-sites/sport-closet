const BASE_URL_FOTOS = 'https://pub-9eb15062e53d4ad1a85362ac330e3002.r2.dev/';
const CSV_URL = 'Tabela_Sport_Closet_2026.csv';
const ADMIN_PASSWORD = 'sportcloset123';
const AUTH_STORAGE_KEY = 'sport_closet_admin_authenticated';
let adminProducts = [];

function isAdminAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === '1';
}

function setAdminAuthenticated(value) {
  localStorage.setItem(AUTH_STORAGE_KEY, value ? '1' : '0');
}

function showAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.style.display = 'none';
}

function handleAdminLogin() {
  const input = document.getElementById('adminPasswordInput');
  const error = document.getElementById('authError');
  if (!input) return;
  const value = input.value.trim();
  if (value === ADMIN_PASSWORD) {
    setAdminAuthenticated(true);
    hideAuthOverlay();
    initAdmin();
    return;
  }
  error.textContent = 'Senha incorreta. Tente novamente.';
}

function fetchCsvData() {
  fetch(CSV_URL)
    .then(response => {
      if (!response.ok) throw new Error('Falha ao carregar CSV');
      return response.text();
    })
    .then(csvText => {
      const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      loadProducts(result.data);
    })
    .catch(err => {
      console.error(err);
      alert('Não foi possível carregar o CSV local. Use Importar CSV ou verifique o arquivo.');
    });
}

function loadProducts(rows) {
  adminProducts = rows.map((row, index) => {
    return {
      id: row.id || String(index + 1),
      nome: row.nome || '',
      marca: row.marca || '',
      tipo: row.tipo || '',
      liga: row.liga || '',
      preco_brl: row.preco_brl || row.preco_br || row.preco || '',
      preco_usa: row.preco_usa || row.preco_usd || row.usd || '',
      img_1: row.img_1 || '',
      img_2: row.img_2 || '',
      img_3: row.img_3 || '',
      tamanhos: row.tamanhos || row.sizes || '',
      descricao: row.descricao || row.desc || '',
      badge: row.badge || ''
    };
  });
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('adminBody');
  tbody.innerHTML = '';

  adminProducts.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><input data-index="${index}" data-field="id" value="${escapeHtml(product.id)}"></td>
      <td><input data-index="${index}" data-field="nome" value="${escapeHtml(product.nome)}"></td>
      <td><input data-index="${index}" data-field="marca" value="${escapeHtml(product.marca)}"></td>
      <td><input data-index="${index}" data-field="tipo" value="${escapeHtml(product.tipo)}"></td>
      <td><input data-index="${index}" data-field="liga" value="${escapeHtml(product.liga)}"></td>
      <td><input data-index="${index}" data-field="preco_brl" value="${escapeHtml(product.preco_brl)}"></td>
      <td><input data-index="${index}" data-field="preco_usa" value="${escapeHtml(product.preco_usa)}"></td>
      <td><input data-index="${index}" data-field="img_1" value="${escapeHtml(product.img_1)}"><img class="img-preview" src="${previewUrl(product.img_1)}"></td>
      <td><input data-index="${index}" data-field="img_2" value="${escapeHtml(product.img_2)}"><img class="img-preview" src="${previewUrl(product.img_2)}"></td>
      <td><input data-index="${index}" data-field="img_3" value="${escapeHtml(product.img_3)}"><img class="img-preview" src="${previewUrl(product.img_3)}"></td>
      <td><textarea data-index="${index}" data-field="tamanhos">${escapeHtml(product.tamanhos)}</textarea></td>
      <td><textarea data-index="${index}" data-field="descricao">${escapeHtml(product.descricao)}</textarea></td>
      <td><input data-index="${index}" data-field="badge" value="${escapeHtml(product.badge)}"></td>
      <td><button type="button" data-index="${index}" class="btn-delete">Excluir</button></td>
    `;

    tbody.appendChild(row);
  });

  tbody.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', handleInputChange);
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', event => {
      const index = Number(event.target.dataset.index);
      deleteProduct(index);
    });
  });
  updateProductSelectOptions();
}

function handleInputChange(event) {
  const index = Number(event.target.dataset.index);
  const field = event.target.dataset.field;
  if (!Number.isFinite(index) || !field) return;
  adminProducts[index][field] = event.target.value;

  if (field.startsWith('img_')) {
    const img = event.target.nextElementSibling;
    if (img && img.tagName === 'IMG') {
      img.src = previewUrl(event.target.value);
    }
  }
}

const CLOUDFLARE_API_ENDPOINT = 'https://api.cloudflare.com/client/v4/accounts';

function previewUrl(value) {
  if (!value) return 'https://placehold.co/120x120?text=Sem+imagem';
  return value.trim().startsWith('http') ? value.trim() : BASE_URL_FOTOS + encodeURI(value.trim());
}

function updateProductSelectOptions() {
  const select = document.getElementById('selectProductRow');
  if (!select) return;
  select.innerHTML = adminProducts.map((product, index) => {
    const label = `${index + 1} - ${product.nome || 'Sem nome'}`;
    return `<option value="${index}">${escapeHtml(label)}</option>`;
  }).join('');
}

async function uploadImageToCloudflareR2(file, accountId, bucketName, apiToken) {
  const endpoint = `${CLOUDFLARE_API_ENDPOINT}/${encodeURIComponent(accountId)}/r2/buckets/${encodeURIComponent(bucketName)}/objects/${encodeURIComponent(file.name)}`;

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': file.type || 'application/octet-stream'
    },
    body: file
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.errors?.map(e => e.message).join(', ') || 'Upload Cloudflare R2 falhou');
  }

  return file.name;
}

function setImageFieldValue(index, field, value) {
  if (!adminProducts[index]) return;
  adminProducts[index][field] = value;
  renderTable();
  document.getElementById('uploadStatus').textContent = `Imagem enviada e preenchida em ${field} do produto ${index + 1}.`;
}

async function handleUploadImage() {
  const status = document.getElementById('uploadStatus');
  const fileInput = document.getElementById('imageFileUpload');
  const file = fileInput.files[0];
  const accountId = document.getElementById('cfAccountId').value.trim();
  const bucketName = document.getElementById('cfBucketName').value.trim();
  const baseUrl = document.getElementById('cfR2BaseUrl').value.trim();
  const apiToken = document.getElementById('cfApiToken').value.trim();
  const productIndex = Number(document.getElementById('selectProductRow').value);
  const field = document.getElementById('selectImageSlot').value;

  if (!file) {
    status.textContent = 'Escolha um arquivo de imagem para upload.';
    return;
  }
  if (!accountId || !bucketName || !apiToken) {
    status.textContent = 'Informe o Cloudflare Account ID, Bucket Name e API Token.';
    return;
  }
  if (!Number.isFinite(productIndex) || !['img_1', 'img_2', 'img_3'].includes(field)) {
    status.textContent = 'Selecione o produto e a imagem de destino.';
    return;
  }

  status.textContent = 'Enviando imagem para o Cloudflare R2...';

  try {
    await uploadImageToCloudflareR2(file, accountId, bucketName, apiToken);
    const imageUrl = baseUrl
      ? `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(file.name)}`
      : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeURIComponent(file.name)}`;
    setImageFieldValue(productIndex, field, imageUrl);
    status.textContent = `Imagem enviada com sucesso. URL inserida em ${field}.`;
  } catch (err) {
    console.error(err);
    status.textContent = `Erro no upload: ${err.message}`;
  }
}

function addProduct() {
  const nextId = String(adminProducts.length ? Math.max(...adminProducts.map(p => Number(p.id) || 0)) + 1 : 1);
  adminProducts.push({
    id: nextId,
    nome: '',
    marca: '',
    tipo: '',
    liga: '',
    preco_brl: '',
    preco_usa: '',
    img_1: '',
    img_2: '',
    img_3: '',
    tamanhos: '',
    descricao: '',
    badge: ''
  });
  renderTable();
}

function deleteProduct(index) {
  adminProducts.splice(index, 1);
  renderTable();
}

function exportCsv() {
  const csv = Papa.unparse(adminProducts, {
    quotes: true,
    delimiter: ',',
    header: true
  });
  const output = document.getElementById('csvOutput');
  output.value = csv;
  downloadCsv(csv, 'text/csv;charset=utf-8;', 'Tabela_Sport_Closet_2026.csv');
}

function exportJson() {
  const json = JSON.stringify(adminProducts, null, 2);
  const output = document.getElementById('csvOutput');
  output.value = json;
  downloadFile(json, 'application/json;charset=utf-8;', 'Tabela_Sport_Closet_2026.json');
}

function downloadFile(text, mimeType, filename) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyOutput() {
  const output = document.getElementById('csvOutput');
  if (!output.value) {
    alert('Clique em Exportar CSV ou Exportar JSON antes de copiar.');
    return;
  }
  navigator.clipboard.writeText(output.value)
    .then(() => alert('Saída copiada para a área de transferência.'))
    .catch(() => alert('Não foi possível copiar.'));
}

function importCsvFile(file) {
  const reader = new FileReader();
  reader.onload = event => {
    const csvText = event.target.result;
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    loadProducts(result.data);
  };
  reader.readAsText(file, 'utf-8');
}

function refreshPreview() {
  document.querySelectorAll('input[data-field^="img_"]')?.forEach(input => {
    const img = input.nextElementSibling;
    if (img && img.tagName === 'IMG') {
      img.src = previewUrl(input.value);
    }
  });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"]+/g, match => {
    const escape = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return escape[match];
  });
}

function initAdmin() {
  document.getElementById('btnAdd').addEventListener('click', addProduct);
  document.getElementById('btnExport').addEventListener('click', exportCsv);
  document.getElementById('btnExportJson').addEventListener('click', exportJson);
  document.getElementById('btnCopy').addEventListener('click', copyOutput);
  document.getElementById('btnPreview').addEventListener('click', refreshPreview);
  document.getElementById('btnUploadImage').addEventListener('click', handleUploadImage);
  const fileInput = document.getElementById('csvImport');
  document.getElementById('btnImport').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) importCsvFile(file);
  });

  fetchCsvData();
}

function initAuth() {
  document.getElementById('adminLoginBtn').addEventListener('click', handleAdminLogin);
  document.getElementById('adminPasswordInput').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      handleAdminLogin();
    }
  });

  if (isAdminAuthenticated()) {
    hideAuthOverlay();
    initAdmin();
  } else {
    showAuthOverlay();
  }
}

window.addEventListener('DOMContentLoaded', initAuth);
