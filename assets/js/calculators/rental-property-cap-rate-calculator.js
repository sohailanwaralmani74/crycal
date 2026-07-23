(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      propertyMarketValue: parseFloat(document.getElementById('input_propertyMarketValue').value) || 0,
      grossAnnualRentalIncome: parseFloat(document.getElementById('input_grossAnnualRentalIncome').value) || 0,
      annualOperatingExpenses: parseFloat(document.getElementById('input_annualOperatingExpenses').value) || 0
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
    var price = inputs.propertyMarketValue;
    var gross = inputs.grossAnnualRentalIncome;
    var exp = inputs.annualOperatingExpenses;

    if (price <= 0) return null;

    var noi = gross - exp;
    var capRate = (noi / price) * 100;

    return {
      noi: noi,
      capRate: capRate,
      gross: gross,
      exp: exp
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_netOperatingIncomeNoi', formatCurrencyLocal(result.noi));
    setOutputText('output_capitalizationRatePercent', result.capRate.toFixed(2) + '% Cap Rate');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        propertyMarketValue: inputs.propertyMarketValue,
        grossAnnualRentalIncome: inputs.grossAnnualRentalIncome,
        annualOperatingExpenses: inputs.annualOperatingExpenses,
        netOperatingIncomeNoi: result.noi,
        capitalizationRatePercent: result.capRate
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
          labels: ['Net Operating Income (NOI)', 'Annual Operating Expenses'],
          datasets: [{
            data: [Math.max(0, result.noi), inputs.annualOperatingExpenses],
            backgroundColor: ['#2F6F5E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Gross Annual Income Distribution' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'capRate') {
      return {
        type: 'bar',
        data: {
          labels: ['Capitalization Rate Yield'],
          datasets: [{
            label: 'Cap Rate % Yield',
            data: [result.capRate],
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Cap Rate Return Metric (%)' }
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
