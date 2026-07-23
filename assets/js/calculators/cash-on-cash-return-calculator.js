(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalInitialCashInvested: parseFloat(document.getElementById('input_totalInitialCashInvested').value) || 0,
      annualNoi: parseFloat(document.getElementById('input_annualNoi').value) || 0,
      annualDebtService: parseFloat(document.getElementById('input_annualDebtService').value) || 0
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
    var cashInvested = inputs.totalInitialCashInvested;
    var noi = inputs.annualNoi;
    var debt = inputs.annualDebtService;

    if (cashInvested <= 0) return null;

    var netCashFlow = noi - debt;
    var cocReturn = (netCashFlow / cashInvested) * 100;

    return {
      netCashFlow: netCashFlow,
      cocReturn: cocReturn,
      noi: noi,
      debt: debt
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_netAnnualCashFlow', formatCurrencyLocal(result.netCashFlow));
    setOutputText('output_cashOnCashReturnPercent', result.cocReturn.toFixed(2) + '% Cash-on-Cash');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalInitialCashInvested: inputs.totalInitialCashInvested,
        annualNoi: inputs.annualNoi,
        annualDebtService: inputs.annualDebtService,
        netAnnualCashFlow: result.netCashFlow,
        cashOnCashReturnPercent: result.cocReturn
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
          labels: ['Net Investor Cash Flow', 'Mortgage Debt Service'],
          datasets: [{
            data: [Math.max(0, result.netCashFlow), inputs.annualDebtService],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'NOI Cash Flow Distribution' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'return') {
      return {
        type: 'bar',
        data: {
          labels: ['Cash-on-Cash Return Rate'],
          datasets: [{
            label: 'Cash-on-Cash Yield (%)',
            data: [result.cocReturn],
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual Cash Return Yield Metric (%)' }
          },
          scales: {
            y: { beginAtZero: true }
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
