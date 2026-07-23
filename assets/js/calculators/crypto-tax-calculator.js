(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalProceeds: parseFloat(document.getElementById('input_totalProceeds').value) || 0,
      costBasis: parseFloat(document.getElementById('input_costBasis').value) || 0,
      holdingPeriod: document.getElementById('input_holdingPeriod').value,
      incomeBracketRate: parseFloat(document.getElementById('input_incomeBracketRate').value) || 0
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
    var proceeds = inputs.totalProceeds;
    var basis = inputs.costBasis;
    var gain = Math.max(0, proceeds - basis);

    var taxRate = inputs.incomeBracketRate;
    if (inputs.holdingPeriod.indexOf('Long-Term') !== -1) {
      taxRate = 15.0; // standard long term rate
    }

    var taxOwed = gain * (taxRate / 100);
    var netProfit = gain - taxOwed;

    return {
      gain: gain,
      taxRate: taxRate,
      taxOwed: taxOwed,
      netProfit: netProfit,
      basis: basis
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_totalCapitalGain', formatCurrencyLocal(result.gain));
    setOutputText('output_effectiveTaxRate', result.taxRate.toFixed(1) + '%');
    setOutputText('output_estimatedCryptoTax', formatCurrencyLocal(result.taxOwed));
    setOutputText('output_netProfitAfterTax', formatCurrencyLocal(result.netProfit));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalProceeds: inputs.totalProceeds,
        costBasis: inputs.costBasis,
        holdingPeriod: inputs.holdingPeriod,
        totalCapitalGain: result.gain,
        estimatedCryptoTax: result.taxOwed,
        netProfitAfterTax: result.netProfit
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
          labels: ['Original Cost Basis', 'Net Profit After Tax', 'Crypto Tax Owed'],
          datasets: [{
            data: [result.basis, result.netProfit, result.taxOwed],
            backgroundColor: ['#DCE1E3', '#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Total Proceeds Distribution' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'taxability') {
      return {
        type: 'bar',
        data: {
          labels: ['Capital Gain Profit'],
          datasets: [
            {
              label: 'Net Profit Keep',
              data: [result.netProfit],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Tax Owed to IRS',
              data: [result.taxOwed],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Profit vs Tax Owed Comparison' }
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
