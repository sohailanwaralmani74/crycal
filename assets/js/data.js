/* ═══════════════════════════════════════════════════════════
   CRYCAL — Global Shared Script
   Loaded on every tool page. Provides:
   - Global account currency (site-wide)
   - Currency formatting helpers
   - Generic input reader
   - Debounce utility
   - Per-tool history (localStorage) + CSV/Excel export
═══════════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────────
//  GLOBAL ACCOUNT CURRENCY
//  Reads a site-wide picker (#globalCurrencyPicker) if present,
//  else falls back to a saved preference, else defaults to USD.
// ──────────────────────────────────────────────────────────

var GLOBAL_CURRENCY_KEY = 'crycal_global_currency';
var CURRENCY_LIST_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';
var CURRENCY_SELECT_IDS = ['baseCurrency', 'mobileCurrency']; // desktop nav + mobile drawer

function getGlobalCurrency() {
  var picker = document.getElementById('baseCurrency') || document.getElementById('mobileCurrency');
  if (picker && picker.value) return picker.value.toUpperCase();

  var saved = localStorage.getItem(GLOBAL_CURRENCY_KEY);
  if (saved) return saved.toUpperCase();

  return 'USD';
}

function setGlobalCurrency(code) {
  if (!code) return;
  localStorage.setItem(GLOBAL_CURRENCY_KEY, code.toUpperCase());
}

// ── Shared currency list (code -> display name), used by the nav
//    pickers AND any tool that needs a currency datalist (e.g. forex.js).
//    Cached 24h so both consumers share one network call. ──
async function fetchCurrencyList() {
  var cached = localStorage.getItem('crycal_currency_list');
  if (cached) {
    try {
      var parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 86400000) return parsed.currencies;
    } catch (e) {}
  }

  try {
    var res = await fetch(CURRENCY_LIST_URL);
    if (!res.ok) throw new Error('Currency list fetch failed');
    var data = await res.json(); // { "usd": "US Dollar", "eur": "Euro", ... }
    var currencies = {};
    Object.keys(data).forEach(function (code) {
      currencies[code.toUpperCase()] = data[code];
    });
    localStorage.setItem('crycal_currency_list', JSON.stringify({
      currencies: currencies,
      timestamp: Date.now()
    }));
    return currencies;
  } catch (error) {
    console.error('Currency list fetch failed:', error);
    return {
      USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
      AUD: 'Australian Dollar', CAD: 'Canadian Dollar', CHF: 'Swiss Franc', NZD: 'New Zealand Dollar'
    };
  }
}

function populateCurrencySelect(selectEl, currencies, selectedCode) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  Object.keys(currencies).sort().forEach(function (code) {
    var opt = document.createElement('option');
    opt.value = code;
    opt.textContent = code + ' - ' + currencies[code];
    if (code === selectedCode) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

// ── Wire up BOTH nav pickers (desktop #baseCurrency, mobile #mobileCurrency)
//    from the live API list, keep them in sync, and recalculate on change. ──
async function initCurrencyPickers() {
  var selects = CURRENCY_SELECT_IDS
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (!selects.length) return; // this page has no currency picker in the DOM

  var currencies = await fetchCurrencyList();
  var selected = (localStorage.getItem(GLOBAL_CURRENCY_KEY) || 'USD').toUpperCase();
  if (!currencies[selected]) {
    selected = currencies.USD ? 'USD' : Object.keys(currencies)[0];
  }

  selects.forEach(function (el) { populateCurrencySelect(el, currencies, selected); });

  selects.forEach(function (el) {
    el.addEventListener('change', function () {
      var code = this.value.toUpperCase();
      setGlobalCurrency(code);
      // Keep desktop + mobile pickers showing the same selection.
      selects.forEach(function (other) { if (other !== el) other.value = code; });
      if (typeof window.updateTool === 'function') window.updateTool();
    });
  });
}

document.addEventListener('DOMContentLoaded', initCurrencyPickers);

// ──────────────────────────────────────────────────────────
//  CURRENCY FORMATTING
// ──────────────────────────────────────────────────────────

var _symbolCache = {};

function getCurrencySymbol(code) {
  if (!code) code = 'USD';
  code = code.toUpperCase();
  if (_symbolCache[code]) return _symbolCache[code];

  try {
    var parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'symbol'
    }).formatToParts(0);
    var symbolPart = parts.find(function (p) { return p.type === 'currency'; });
    var symbol = symbolPart ? symbolPart.value : code;
    _symbolCache[code] = symbol;
    return symbol;
  } catch (e) {
    // Unknown/unsupported ISO code (e.g. some crypto tickers) — just show the code.
    _symbolCache[code] = code;
    return code;
  }
}

function formatCurrency(amount, code) {
  if (typeof amount !== 'number' || isNaN(amount)) amount = 0;
  code = (code || getGlobalCurrency() || 'USD').toUpperCase();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    // Fallback for codes Intl doesn't recognize as valid ISO currency
    return getCurrencySymbol(code) + amount.toFixed(2);
  }
}

// ──────────────────────────────────────────────────────────
//  GENERIC INPUT READER
//  Reads every #input_* field currently in the DOM.
// ──────────────────────────────────────────────────────────

function getCurrentInputs() {
  var inputs = {};
  document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function (el) {
    var key = el.id.replace('input_', '');
    inputs[key] = el.value;
  });
  return inputs;
}

// ──────────────────────────────────────────────────────────
//  DEBOUNCE
// ──────────────────────────────────────────────────────────

function debounce(fn, wait) {
  var timer = null;
  return function () {
    var args = arguments;
    var ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(ctx, args);
    }, wait);
  };
}

// ──────────────────────────────────────────────────────────
//  PRESETS (localStorage) — Auto-save enabled
// ──────────────────────────────────────────────────────────

function getPresetKey() {
  var toolId = document.getElementById('toolContainer').dataset.toolId;
  return 'crycal_presets_' + toolId;
}

function getPresets() {
  try {
    return JSON.parse(localStorage.getItem(getPresetKey())) || [];
  } catch (e) {
    return [];
  }
}

function savePreset(name) {
  var inputs = getCurrentInputs();
  var presets = getPresets();
  var existingIndex = presets.findIndex(function (p) { return p.name === name; });
  if (existingIndex !== -1) {
    presets[existingIndex] = { name: name, values: inputs, timestamp: Date.now() };
  } else {
    presets.push({ name: name, values: inputs, timestamp: Date.now() });
  }
  localStorage.setItem(getPresetKey(), JSON.stringify(presets));
  renderPresetDropdown();
}

function loadPreset(name) {
  var presets = getPresets();
  var preset = presets.find(function (p) { return p.name === name; });
  if (preset) {
    var inputs = preset.values;
    for (var key in inputs) {
      var el = document.getElementById('input_' + key);
      if (el) el.value = inputs[key];
    }
    if (typeof window.updateTool === 'function') window.updateTool();
  }
}

function deletePreset(name) {
  var presets = getPresets();
  presets = presets.filter(function (p) { return p.name !== name; });
  localStorage.setItem(getPresetKey(), JSON.stringify(presets));
  renderPresetDropdown();
}

function renderPresetDropdown() {
  var dropdown = document.getElementById('presetDropdown');
  if (!dropdown) return;
  var presets = getPresets();
  dropdown.innerHTML = '<option value="">Load Preset...</option>';
  presets.forEach(function (p) {
    var opt = document.createElement('option');
    opt.value = p.name;
    opt.textContent = p.name;
    dropdown.appendChild(opt);
  });
}

// ──────────────────────────────────────────────────────────
//  HISTORY (localStorage) — generic storage, per-tool
//  NOTE: the history table's <thead> in tool.html is currently
//  hardcoded to Forex-specific columns (Balance, Risk %, Stop,
//  Pair, Size). This stores ALL inputs/outputs generically, but
//  renderHistory() below still maps to those fixed columns.
//  When you add a second calculator, make the <thead> dynamic
//  (e.g. driven by page.history_columns front matter) and update
//  renderHistory() to read from that config instead.
// ──────────────────────────────────────────────────────────

var HISTORY_MAX_ENTRIES = 200;

// Fallback if a tool page hasn't set history_columns in front matter yet.
var DEFAULT_HISTORY_COLUMNS = [
  { key: 'positionSize', label: 'Result', source: 'output' }
];

function getHistoryColumns() {
  var el = document.getElementById('historyColumnsConfig');
  if (!el) return DEFAULT_HISTORY_COLUMNS;
  try {
    var cols = JSON.parse(el.textContent);
    return (cols && cols.length) ? cols : DEFAULT_HISTORY_COLUMNS;
  } catch (e) {
    return DEFAULT_HISTORY_COLUMNS;
  }
}

// Each column pulls from either the saved inputs, the saved outputs, or
// (for combined fields like "EUR/USD") a template string with {placeholders}
// that get filled from inputs first, then outputs.
//   { key: "balance", label: "Balance", source: "input" }
//   { key: "positionSize", label: "Size", source: "output" }
//   { key: "pair", label: "Pair", source: "computed", template: "{baseCurrency}/{quoteCurrency}" }
function resolveColumnValue(col, entry) {
  var inputs = entry.inputs || {};
  var outputs = entry.outputs || {};

  if (col.source === 'input') return inputs[col.key] != null ? inputs[col.key] : '';
  if (col.source === 'output') return outputs[col.key] != null ? outputs[col.key] : '';

  if (col.source === 'computed' && col.template) {
    return col.template.replace(/\{(\w+)\}/g, function (match, key) {
      if (inputs[key] != null) return inputs[key];
      if (outputs[key] != null) return outputs[key];
      return '';
    });
  }
  return '';
}

function getHistoryKey() {
  var toolId = document.getElementById('toolContainer').dataset.toolId;
  return 'crycal_history_' + toolId;
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(getHistoryKey())) || [];
  } catch (e) {
    return [];
  }
}

function logHistory(inputSnapshot) {
  // Use the snapshot the caller actually calculated with, if provided.
  // Falling back to a live DOM read here would let fast-typing users
  // race an in-flight async calculation and log stale/empty fields.
  var inputs = inputSnapshot || getCurrentInputs();

  // Defensive guard: never log a currency-pair entry with a blank pair.
  if ('baseCurrency' in inputs && (!inputs.baseCurrency || !inputs.quoteCurrency)) {
    return;
  }

  var outputs = {};
  document.querySelectorAll('.output-value').forEach(function (el) {
    var key = el.id.replace('output_', '');
    var numberEl = el.querySelector('.output-number');
    outputs[key] = numberEl ? numberEl.textContent.trim() : '';
  });

  var history = getHistory();

  // Avoid logging duplicate consecutive entries (e.g. from rapid re-renders)
  var last = history[history.length - 1];
  var snapshot = JSON.stringify({ inputs: inputs, outputs: outputs });
  if (last && JSON.stringify({ inputs: last.inputs, outputs: last.outputs }) === snapshot) {
    return;
  }

  history.push({
    timestamp: Date.now(),
    inputs: inputs,
    outputs: outputs
  });

  if (history.length > HISTORY_MAX_ENTRIES) {
    history = history.slice(history.length - HISTORY_MAX_ENTRIES);
  }

  localStorage.setItem(getHistoryKey(), JSON.stringify(history));
}

function clearHistory() {
  localStorage.removeItem(getHistoryKey());
}

function renderHistory() {
  var tbody = document.getElementById('historyTableBody');
  var footer = document.getElementById('historyFooter');
  if (!tbody) return;

  var columns = getHistoryColumns();
  var history = getHistory().slice().reverse(); // newest first
  tbody.innerHTML = '';

  history.forEach(function (entry, idx) {
    var row = document.createElement('tr');
    var time = new Date(entry.timestamp).toLocaleString();

    var cellsHtml = '<td>' + (history.length - idx) + '</td><td>' + time + '</td>';
    columns.forEach(function (col) {
      cellsHtml += '<td>' + resolveColumnValue(col, entry) + '</td>';
    });
    cellsHtml += '<td><button class="btn-history-load" data-index="' + (history.length - 1 - idx) + '">↺ Load</button></td>';

    row.innerHTML = cellsHtml;
    tbody.appendChild(row);
  });

  if (footer) {
    footer.textContent = 'Showing ' + history.length + ' entries';
  }

  tbody.querySelectorAll('.btn-history-load').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var all = getHistory();
      var entry = all[parseInt(this.dataset.index, 10)];
      if (!entry) return;
      for (var key in entry.inputs) {
        var el = document.getElementById('input_' + key);
        if (el) el.value = entry.inputs[key];
      }
      if (typeof window.updateTool === 'function') window.updateTool();
    });
  });
}

function exportHistoryCSV() {
  var history = getHistory();
  if (!history.length) { alert('No history to export.'); return; }
  var columns = getHistoryColumns();

  var rows = [['#', 'Time'].concat(columns.map(function (c) { return c.label; }))];
  history.forEach(function (entry, idx) {
    var row = [idx + 1, new Date(entry.timestamp).toLocaleString()];
    columns.forEach(function (col) { row.push(resolveColumnValue(col, entry)); });
    rows.push(row);
  });

  var csv = rows.map(function (r) {
    return r.map(function (cell) {
      var s = String(cell).replace(/"/g, '""');
      return /[",\n]/.test(s) ? '"' + s + '"' : s;
    }).join(',');
  }).join('\n');

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'crycal-history.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportHistoryExcel() {
  var history = getHistory();
  if (!history.length) { alert('No history to export.'); return; }
  if (typeof XLSX === 'undefined') { alert('Excel export library not loaded.'); return; }
  var columns = getHistoryColumns();

  var rows = history.map(function (entry, idx) {
    var row = { '#': idx + 1, 'Time': new Date(entry.timestamp).toLocaleString() };
    columns.forEach(function (col) { row[col.label] = resolveColumnValue(col, entry); });
    return row;
  });

  var ws = XLSX.utils.json_to_sheet(rows);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'History');
  XLSX.writeFile(wb, 'crycal-history.xlsx');
}
// ──────────────────────────────────────────────────────────
//  URL PARAM HELPERS
// ──────────────────────────────────────────────────────────

function getInputsFromURL() {
  var params = new URLSearchParams(window.location.search);
  var inputs = {};
  params.forEach(function(value, key) {
    inputs[key] = value;
  });
  return inputs;
}

function applyURLParams() {
  var inputs = getInputsFromURL();
  var hasParams = false;
  for (var key in inputs) {
    var el = document.getElementById('input_' + key);
    if (el) {
      el.value = inputs[key];
      hasParams = true;
    }
  }
  if (hasParams && typeof window.updateTool === 'function') {
    window.updateTool();
  }
  return hasParams;
}

function buildShareURL() {
  var inputs = getCurrentInputs();
  var params = new URLSearchParams();
  for (var key in inputs) {
    params.set(key, inputs[key]);
  }
  var queryString = params.toString();
  var base = window.location.origin + window.location.pathname;
  return queryString ? base + '?' + queryString : base;
}
// ──────────────────────────────────────────────────────────
//  EXPOSE GLOBALLY
// ──────────────────────────────────────────────────────────

window.getGlobalCurrency = getGlobalCurrency;
window.setGlobalCurrency = setGlobalCurrency;
window.fetchCurrencyList = fetchCurrencyList;
window.formatCurrency = formatCurrency;
window.getCurrencySymbol = getCurrencySymbol;
window.getCurrentInputs = getCurrentInputs;
window.debounce = debounce;

window.savePreset = savePreset;
window.loadPreset = loadPreset;
window.deletePreset = deletePreset;
window.renderPresetDropdown = renderPresetDropdown;

window.logHistory = logHistory;
window.renderHistory = renderHistory;
window.clearHistory = clearHistory;
window.exportHistoryCSV = exportHistoryCSV;
window.exportHistoryExcel = exportHistoryExcel;
window.applyURLParams = applyURLParams;
window.buildShareURL = buildShareURL;
window.getInputsFromURL = getInputsFromURL;