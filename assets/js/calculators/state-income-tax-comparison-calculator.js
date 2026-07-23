(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      annualTaxableIncome: parseFloat(document.getElementById('input_annualTaxableIncome').value) || 0,
      currentStateTaxRate: parseFloat(document.getElementById('input_currentStateTaxRate').value) || 0,
      targetStateTaxRate: parseFloat(document.getElementById('input_targetStateTaxRate').value) || 0
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
    var inc = inputs.annualTaxableIncome;
    if (inc <= 0) return null;

    var curTax = inc * (inputs.currentStateTaxRate / 100);
    var tarTax = inc * (inputs.targetStateTaxRate / 100);
    var annualSavings = Math.max(0, curTax - tarTax);

    return {
      curTax: curTax,
      tarTax: tarTax,
      annualSavings: annualSavings,
      monthlySavings: annualSavings / 12
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_currentStateTaxLiability', formatCurrencyLocal(result.curTax));
    setOutputText('output_targetStateTaxLiability', formatCurrencyLocal(result.tarTax));
    setOutputText('output_annualRelocationTaxSavings', formatCurrencyLocal(result.annualSavings));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualTaxableIncome: inputs.annualTaxableIncome,
        currentStateTaxRate: inputs.currentStateTaxRate,
        targetStateTaxRate: inputs.targetStateTaxRate,
        currentStateTaxLiability: result.curTax,
        targetStateTaxLiability: result.tarTax,
        annualRelocationTaxSavings: result.annualSavings
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
    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Current State Tax', 'Target State Tax'],
          datasets: [{
            label: 'Annual Tax Owed',
            data: [result.curTax, result.tarTax],
            backgroundColor: ['#B23A3A', '#2F6F5E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Annual State Income Tax Comparison' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
    }

    if (tab === 'monthly') {
      return {
        type: 'bar',
        data: {
          labels: ['Net Relocation Benefit'],
          datasets: [{
            label: 'Additional Monthly Take-Home Cash Flow',
            data: [result.monthlySavings],
            backgroundColor: '#2F6F5E'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Take-Home Cash Flow Boost' }
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
