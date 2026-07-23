(function() {
  var chartInstance = null;
  var currentTab = 'currencyPrices';
  var lastChartData = null;

  function getInputs() {
    return {
      baseUsdPrice: parseFloat(document.getElementById('input_baseUsdPrice').value) || 0,
      eurFxRate: parseFloat(document.getElementById('input_eurFxRate').value) || 0,
      eurPppFactor: parseFloat(document.getElementById('input_eurPppFactor').value) || 0,
      gbpFxRate: parseFloat(document.getElementById('input_gbpFxRate').value) || 0,
      gbpPppFactor: parseFloat(document.getElementById('input_gbpPppFactor').value) || 0,
      audFxRate: parseFloat(document.getElementById('input_audFxRate').value) || 0,
      audPppFactor: parseFloat(document.getElementById('input_audPppFactor').value) || 0
    };
  }

  function formatCurrencyCustom(amount, symbol) {
    return symbol + Math.round(amount).toLocaleString();
  }

  function roundCharm(val) {
    if (val <= 0) return 0;
    var base = Math.round(val);
    var remainder = base % 5;
    if (remainder >= 3) return base + (5 - remainder);
    return base - remainder;
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateLocalized(inputs) {
    var rawEur = inputs.baseUsdPrice * inputs.eurFxRate * inputs.eurPppFactor;
    var eurPrice = roundCharm(rawEur);
    var eurUsdEquivalent = inputs.eurFxRate > 0 ? eurPrice / inputs.eurFxRate : 0;

    var rawGbp = inputs.baseUsdPrice * inputs.gbpFxRate * inputs.gbpPppFactor;
    var gbpPrice = roundCharm(rawGbp);
    var gbpUsdEquivalent = inputs.gbpFxRate > 0 ? gbpPrice / inputs.gbpFxRate : 0;

    var rawAud = inputs.baseUsdPrice * inputs.audFxRate * inputs.audPppFactor;
    var audPrice = roundCharm(rawAud);
    var audUsdEquivalent = inputs.audFxRate > 0 ? audPrice / inputs.audFxRate : 0;

    return {
      eurPrice: eurPrice,
      gbpPrice: gbpPrice,
      audPrice: audPrice,
      eurUsdEquivalent: eurUsdEquivalent,
      gbpUsdEquivalent: gbpUsdEquivalent,
      audUsdEquivalent: audUsdEquivalent,
      baseUsdPrice: inputs.baseUsdPrice
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateLocalized(inputs);

    setOutputText('output_eurPrice', formatCurrencyCustom(res.eurPrice, '€'));
    setOutputText('output_gbpPrice', formatCurrencyCustom(res.gbpPrice, '£'));
    setOutputText('output_audPrice', formatCurrencyCustom(res.audPrice, 'A$'));
    setOutputText('output_eurUsdEquivalent', formatCurrencyCustom(res.eurUsdEquivalent, '$'));
    setOutputText('output_gbpUsdEquivalent', formatCurrencyCustom(res.gbpUsdEquivalent, '$'));
    setOutputText('output_audUsdEquivalent', formatCurrencyCustom(res.audUsdEquivalent, '$'));

    lastChartData = res;
    updateCharts(res);
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'currencyPrices') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['USD ($)', 'EUR (€)', 'GBP (£)', 'AUD (A$)'],
          datasets: [{
            label: 'Native Price Point',
            data: [data.baseUsdPrice, data.eurPrice, data.gbpPrice, data.audPrice],
            backgroundColor: ['#4A90D9', '#4ade80', '#fbbf24', '#a78bfa'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Localized Prices in Native Currency', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'usdParityComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Base USD', 'EUR in USD', 'GBP in USD', 'AUD in USD'],
          datasets: [{
            label: 'USD Normalized Price ($)',
            data: [data.baseUsdPrice, data.eurUsdEquivalent, data.gbpUsdEquivalent, data.audUsdEquivalent],
            backgroundColor: ['#4A90D9', '#4ade80', '#fbbf24', '#a78bfa'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'PPP-Adjusted Prices Normalized in USD ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_baseUsdPrice').value = 49;
    document.getElementById('input_eurFxRate').value = 0.92;
    document.getElementById('input_eurPppFactor').value = 0.95;
    document.getElementById('input_gbpFxRate').value = 0.78;
    document.getElementById('input_gbpPppFactor').value = 0.98;
    document.getElementById('input_audFxRate').value = 1.52;
    document.getElementById('input_audPppFactor').value = 0.90;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });
})();
