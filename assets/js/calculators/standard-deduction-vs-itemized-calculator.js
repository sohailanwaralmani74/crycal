(function() {

  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      filingStatus: document.getElementById('input_filingStatus').value,
      stateAndLocalTaxes: parseFloat(document.getElementById('input_stateAndLocalTaxes').value) || 0,
      mortgageInterestPaid: parseFloat(document.getElementById('input_mortgageInterestPaid').value) || 0,
      charitableContributions: parseFloat(document.getElementById('input_charitableContributions').value) || 0
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
    var stdDeduction = 14600;
    if (inputs.filingStatus.indexOf('Married') !== -1) stdDeduction = 29200;
    else if (inputs.filingStatus.indexOf('Head') !== -1) stdDeduction = 21900;

    var salt = Math.min(10000, inputs.stateAndLocalTaxes);
    var itemized = salt + inputs.mortgageInterestPaid + inputs.charitableContributions;

    var strategy = "Take Standard Deduction";
    var extraSavings = 0;

    if (itemized > stdDeduction) {
      strategy = "Itemize Deductions (Schedule A)";
      extraSavings = itemized - stdDeduction;
    } else {
      extraSavings = stdDeduction - itemized;
    }

    return {
      stdDeduction: stdDeduction,
      itemized: itemized,
      strategy: strategy,
      extraSavings: extraSavings,
      salt: salt
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_standardDeductionAmount', formatCurrencyLocal(result.stdDeduction));
    setOutputText('output_totalItemizedDeductions', formatCurrencyLocal(result.itemized));
    setOutputText('output_recommendedStrategy', result.strategy);
    setOutputText('output_extraDeductionSavings', formatCurrencyLocal(result.extraSavings) + ' Larger Deduction');

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        filingStatus: inputs.filingStatus,
        stateAndLocalTaxes: inputs.stateAndLocalTaxes,
        mortgageInterestPaid: inputs.mortgageInterestPaid,
        standardDeductionAmount: result.stdDeduction,
        totalItemizedDeductions: result.itemized,
        recommendedStrategy: result.strategy
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
          labels: ['Deduction Method Comparison'],
          datasets: [
            {
              label: 'Standard Deduction',
              data: [result.stdDeduction],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Total Itemized Deductions',
              data: [result.itemized],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Standard vs Itemized Deduction Comparison' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      };
    }

    if (tab === 'itemizedBreakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['SALT Taxes (Capped $10k)', 'Mortgage Interest', 'Charitable Donations'],
          datasets: [{
            data: [result.salt, inputs.mortgageInterestPaid, inputs.charitableContributions],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Itemized Schedule A Write-Off Breakdown' }
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
