(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      currentStockPrice: parseFloat(document.getElementById('input_currentStockPrice').value) || 0,
      callStrikePrice: parseFloat(document.getElementById('input_callStrikePrice').value) || 0,
      callPremiumReceived: parseFloat(document.getElementById('input_callPremiumReceived').value) || 0,
      daysToExpiration: parseFloat(document.getElementById('input_daysToExpiration').value) || 30
    };
  }

  function formatCurrencyLocal(amount) {
    var code = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateResults(inputs) {
    var stock = inputs.currentStockPrice;
    var strike = inputs.callStrikePrice;
    var prem = inputs.callPremiumReceived;
    var dte = inputs.daysToExpiration;

    if (stock <= 0 || dte <= 0) return null;

    var staticYield = (prem / stock) * 100;
    var annualizedYield = staticYield * (365 / dte);

    var breakEven = Math.max(0, stock - prem);
    var capGain = Math.max(0, strike - stock);
    var maxProfitPerShare = capGain + prem;
    var maxProfitTotal = maxProfitPerShare * 100; // per 100 shares

    return {
      staticYield: staticYield,
      annualizedYield: annualizedYield,
      breakEven: breakEven,
      maxProfitTotal: maxProfitTotal,
      premTotal: prem * 100,
      capGainTotal: capGain * 100
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_staticOptionYieldPercent', result.staticYield.toFixed(2) + '% Yield');
    setOutputText('output_annualizedOptionYieldPercent', result.annualizedYield.toFixed(1) + '% Annualized');
    setOutputText('output_downsideBreakEvenPrice', formatCurrencyLocal(result.breakEven));
    setOutputText('output_maxPotentialProfit', formatCurrencyLocal(result.maxProfitTotal) + ' (per 100 shares)');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentStockPrice: inputs.currentStockPrice,
        callStrikePrice: inputs.callStrikePrice,
        callPremiumReceived: inputs.callPremiumReceived,
        annualizedOptionYieldPercent: result.annualizedYield,
        downsideBreakEvenPrice: result.breakEven,
        maxPotentialProfit: result.maxProfitTotal
      });
    }
  }

  function updateCharts(result, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var data = generateChartData(currentTab, result, inputs);
    if (!data) return;
    chartInstance = new Chart(ctx, data);
  }

  function generateChartData(tab, result, inputs) {
    if (tab === 'breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Covered Call Profit Sources (Per 100 Shares)'],
          datasets: [
            {
              label: 'Immediate Option Premium Income',
              data: [result.premTotal],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Stock Capital Appreciation to Strike',
              data: [result.capGainTotal],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Maximum Profit Components' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
          }
        }
      };
    }

    if (tab === 'risk') {
      var downsideCushion = inputs.currentStockPrice - result.breakEven;
      return {
        type: 'doughnut',
        data: {
          labels: ['Downside Risk Protection Cushion', 'Net Risk Exposure Price'],
          datasets: [{
            data: [downsideCushion, result.breakEven],
            backgroundColor: ['#2F6F5E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Downside Protection Buffer Share' }
          },
          cutout: '60%'
        }
      };
    }

    return null;
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var def = el.dataset.default || el.getAttribute('value') || '';
      if (def) el.value = def;
    });
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

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', updateTool);
    }
  });

})();
