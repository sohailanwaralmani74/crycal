(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      currentAge: parseFloat(document.getElementById('input_currentAge').value) || 35,
      riskTolerance: document.getElementById('input_riskTolerance').value,
      totalInvestableAssets: parseFloat(document.getElementById('input_totalInvestableAssets').value) || 0
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
    var age = inputs.currentAge;
    var total = inputs.totalInvestableAssets;

    if (total <= 0) return null;

    var stockPct = Math.max(20, Math.min(90, 110 - age));
    if (inputs.riskTolerance.indexOf('Conservative') !== -1) stockPct = Math.max(15, stockPct - 15);
    else if (inputs.riskTolerance.indexOf('Aggressive') !== -1) stockPct = Math.min(95, stockPct + 10);

    var cashPct = 10;
    var bondPct = Math.max(0, 100 - stockPct - cashPct);

    var stocksVal = total * (stockPct / 100);
    var bondsVal = total * (bondPct / 100);
    var cashVal = total * (cashPct / 100);

    return {
      stockPct: stockPct,
      bondPct: bondPct,
      cashPct: cashPct,
      stocksVal: stocksVal,
      bondsVal: bondsVal,
      cashVal: cashVal,
      total: total
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_recommendedStocksAmount', formatCurrencyLocal(result.stocksVal) + ' (' + result.stockPct + '%)');
    setOutputText('output_recommendedBondsAmount', formatCurrencyLocal(result.bondsVal) + ' (' + result.bondPct + '%)');
    setOutputText('output_recommendedCashAmount', formatCurrencyLocal(result.cashVal) + ' (' + result.cashPct + '%)');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentAge: inputs.currentAge,
        riskTolerance: inputs.riskTolerance,
        totalInvestableAssets: inputs.totalInvestableAssets,
        recommendedStocksAmount: result.stocksVal,
        recommendedBondsAmount: result.bondsVal,
        recommendedCashAmount: result.cashVal
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
        type: 'doughnut',
        data: {
          labels: ['Equities / Stocks (' + result.stockPct + '%)', 'Fixed Income / Bonds (' + result.bondPct + '%)', 'Cash Reserves (' + result.cashPct + '%)'],
          datasets: [{
            data: [result.stockPct, result.bondPct, result.cashPct],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Target Asset Allocation Weights' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'portfolioValues') {
      return {
        type: 'bar',
        data: {
          labels: ['Portfolio Allocation Values'],
          datasets: [
            {
              label: 'Stocks ',
              data: [result.stocksVal],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Bonds ',
              data: [result.bondsVal],
              backgroundColor: '#C08A2E'
            },
            {
              label: 'Cash ',
              data: [result.cashVal],
              backgroundColor: '#DCE1E3'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Dollar Value Asset Class Distribution' }
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
          }
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
