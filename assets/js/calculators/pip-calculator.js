/* ═══════════════════════════════════════════════════════════
   CRYCAL — Pip Calculator (Enhanced)
   Tool ID: pip-calculator
   Adds: quote currency, live exchange-rate conversion,
   lot-size quick-select, and input validation.
   Rate source: https://open.er-api.com (free, no key required)
═══════════════════════════════════════════════════════════ */

(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  var rateCache = {};              // { "USD_EUR": { rate, date, fetchedAt } }
  var RATE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  var updateRequestId = 0;         // guards against stale async responses
  var lastChartData = null;        // so switchChartTab can redraw without refetching

  // ── Get Inputs ──
  function getInputs() {
    var assetEl = document.getElementById('input_assetName');
    var quoteEl = document.getElementById('input_quoteCurrency');
    return {
      assetName: assetEl ? assetEl.value.trim() : '',
      quoteCurrency: quoteEl && quoteEl.value.trim() ? quoteEl.value.trim().toUpperCase() : 'USD',
      pipSize: parseFloat(document.getElementById('input_pipSize').value) || 0,
      contractSize: parseFloat(document.getElementById('input_contractSize').value) || 0,
      tradeSize: parseFloat(document.getElementById('input_tradeSize').value) || 0
    };
  }

  // ── Format a currency amount in a SPECIFIC currency code (not just the global one) ──
  function formatCurrencyIn(amount, code) {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(amount);
    } catch (e) {
      var symbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(code) : (code + ' ');
      return symbol + amount.toFixed(4);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el && el.querySelector('.output-number')) {
      el.querySelector('.output-number').textContent = text;
    }
  }

  // ── Live Exchange Rate Fetch (cached) ──
  function fetchExchangeRate(fromCcy, toCcy) {
    if (!fromCcy || !toCcy || fromCcy === toCcy) {
      return Promise.resolve({ rate: 1, date: null, same: true });
    }
    var cacheKey = fromCcy + '_' + toCcy;
    var cached = rateCache[cacheKey];
    var now = Date.now();
    if (cached && (now - cached.fetchedAt) < RATE_CACHE_TTL) {
      return Promise.resolve(cached);
    }
    return fetch('https://open.er-api.com/v6/latest/' + encodeURIComponent(fromCcy))
      .then(function(res) {
        if (!res.ok) throw new Error('Rate fetch failed (' + res.status + ')');
        return res.json();
      })
      .then(function(data) {
        if (!data || data.result !== 'success' || !data.rates || typeof data.rates[toCcy] !== 'number') {
          throw new Error('Currency not supported by rate provider');
        }
        var result = {
          rate: data.rates[toCcy],
          date: data.time_last_update_utc || null,
          same: false,
          fetchedAt: now
        };
        rateCache[cacheKey] = result;
        return result;
      });
  }

  // ── Main Update (async due to live rate fetch) ──
  function updateTool() {
    var inputs = getInputs();
    var assetName = inputs.assetName;
    var quoteCurrency = inputs.quoteCurrency;
    var pipSize = inputs.pipSize;
    var contractSize = inputs.contractSize;
    var tradeSize = inputs.tradeSize;
    var accountCurrency = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';

    var thisRequestId = ++updateRequestId;

    // ── Validation ──
    if (pipSize <= 0 || contractSize <= 0 || tradeSize <= 0) {
      setOutputText('output_pipValue', '—');
      setOutputText('output_pipValueTrade', '—');
      setOutputText('output_pipValueConverted', '—');
      setOutputText('output_exchangeRateDisplay', 'Enter a valid pip size, contract size & trade size (must be greater than 0)');
      setOutputText('output_contractSizeDisplay', contractSize > 0 ? contractSize.toLocaleString() : '—');
      setOutputText('output_pipSizeDisplay', pipSize > 0 ? pipSize.toFixed(6) : '—');
      lastChartData = null;
      updateCharts(null);
      return;
    }

    var pipValuePerLot = pipSize * contractSize;
    var pipValueTrade = pipValuePerLot * tradeSize;

    // Show quote-currency values immediately; conversion fills in once the rate resolves
    setOutputText('output_pipValue', formatCurrencyIn(pipValuePerLot, quoteCurrency));
    setOutputText('output_pipValueTrade', formatCurrencyIn(pipValueTrade, quoteCurrency));
    setOutputText('output_contractSizeDisplay', contractSize.toLocaleString());
    setOutputText('output_pipSizeDisplay', pipSize.toFixed(6));

    function finalize(convertedValue, rateForChart, isFallback) {
      if (thisRequestId !== updateRequestId) return; // a newer update superseded this one

      var chartPayload = {
        assetName: assetName,
        quoteCurrency: quoteCurrency,
        accountCurrency: accountCurrency,
        pipValuePerLot: pipValuePerLot,
        pipValueTrade: pipValueTrade,
        pipValueConverted: convertedValue,
        tradeSize: tradeSize,
        pipSize: pipSize,
        contractSize: contractSize
      };
      lastChartData = chartPayload;
      updateCharts(chartPayload);

      if (typeof window.logHistory === 'function') {
        window.logHistory({
          assetName: assetName || '—',
          quoteCurrency: quoteCurrency,
          pipSize: pipSize,
          contractSize: contractSize,
          tradeSize: tradeSize,
          pipValue: convertedValue
        });
      }
      if (typeof window.renderPresetDropdown === 'function') {
        window.renderPresetDropdown();
      }
    }

    if (quoteCurrency === accountCurrency) {
      setOutputText('output_pipValueConverted', formatCurrencyIn(pipValueTrade, accountCurrency));
      setOutputText('output_exchangeRateDisplay', 'Quote and account currency match — no conversion needed');
      finalize(pipValueTrade, 1, false);
      return;
    }

    setOutputText('output_pipValueConverted', '…');
    setOutputText('output_exchangeRateDisplay', 'Fetching live rate…');

    fetchExchangeRate(quoteCurrency, accountCurrency)
      .then(function(result) {
        if (thisRequestId !== updateRequestId) return;
        var converted = pipValueTrade * result.rate;
        setOutputText('output_pipValueConverted', formatCurrencyIn(converted, accountCurrency));
        var rateMsg = '1 ' + quoteCurrency + ' = ' + result.rate.toFixed(4) + ' ' + accountCurrency;
        if (result.date) rateMsg += ' (as of ' + result.date.split(' ')[0] + ')';
        setOutputText('output_exchangeRateDisplay', rateMsg);
        finalize(converted, result.rate, false);
      })
      .catch(function() {
        if (thisRequestId !== updateRequestId) return;
        setOutputText('output_pipValueConverted', formatCurrencyIn(pipValueTrade, quoteCurrency) + ' (conversion unavailable)');
        setOutputText('output_exchangeRateDisplay', 'Live rate unavailable — showing quote currency value');
        finalize(pipValueTrade, null, true);
      });
  }

  // ── Charts ──
  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {
    if (!data) return null;
    var currencySymbol = (typeof getCurrencySymbol === 'function')
      ? getCurrencySymbol(typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD')
      : '$';

    if (tab === 'breakdown') {
      var contractSize = data.contractSize || 100000;
      var pipSize = data.pipSize || 0.0001;
      var titleText = data.assetName
        ? 'Pip Value by Lot Size — ' + data.assetName
        : 'Pip Value by Lot Size';

      var std = pipSize * contractSize * 1.0;
      var mini = pipSize * (contractSize / 10) * 1.0;
      var micro = pipSize * (contractSize / 100) * 1.0;

      return {
        type: 'bar',
        data: {
          labels: ['Standard Lot', 'Mini Lot', 'Micro Lot'],
          datasets: [{
            label: 'Pip Value (' + (data.quoteCurrency || currencySymbol) + ')',
            data: [std, mini, micro],
            backgroundColor: ['#C08A2E', '#2F6F5E', '#4A90D9'],
            borderColor: ['#A87520', '#1f4f42', '#3a7b8c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: titleText, font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Pip Value' },
              ticks: {
                callback: function(v) { return v.toFixed(2); }
              }
            }
          }
        }
      };
    }

    if (tab === 'comparison') {
      var quoteVal = data.pipValueTrade || 0;
      var acctVal = (data.pipValueConverted !== undefined && data.pipValueConverted !== null)
        ? data.pipValueConverted
        : quoteVal;
      var quoteLabel = 'Trade Value (' + (data.quoteCurrency || 'Quote') + ')';
      var acctLabel = 'Trade Value (' + (data.accountCurrency || 'Account') + ')';

      return {
        type: 'bar',
        data: {
          labels: [quoteLabel, acctLabel],
          datasets: [{
            label: 'Pip Trade Value',
            data: [quoteVal, acctVal],
            backgroundColor: ['#4A90D9', '#2F6F5E'],
            borderColor: ['#3a7b8c', '#1f4f42'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Quote Currency vs Account Currency', font: { size: 14 } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Value' },
              ticks: {
                callback: function(v) { return v.toFixed(2); }
              }
            }
          }
        }
      };
    }

    return null;
  }

  // ── Switch Chart Tab ──
  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else if (typeof window.updateTool === 'function') {
      window.updateTool();
    }
  }

  // ── Reset Tool ──
  function resetTool() {
    var assetEl = document.getElementById('input_assetName');
    if (assetEl) assetEl.value = '';
    var quoteEl = document.getElementById('input_quoteCurrency');
    if (quoteEl) quoteEl.value = 'USD';
    document.getElementById('input_pipSize').value = 0.0001;
    document.getElementById('input_contractSize').value = 100000;
    document.getElementById('input_tradeSize').value = 1.0;
    if (typeof window.updateTool === 'function') window.updateTool();
  }

  // ── Expose Globally ──
  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  // ── Initialise ──
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();