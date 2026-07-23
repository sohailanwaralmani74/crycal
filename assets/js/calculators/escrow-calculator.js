(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      annualPropertyTax: parseFloat(document.getElementById('input_annualPropertyTax').value) || 0,
      annualHomeInsurance: parseFloat(document.getElementById('input_annualHomeInsurance').value) || 0,
      monthlyPmi: parseFloat(document.getElementById('input_monthlyPmi').value) || 0
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
    var monthlyTax = inputs.annualPropertyTax / 12;
    var monthlyIns = inputs.annualHomeInsurance / 12;
    var totalMonthlyEscrow = monthlyTax + monthlyIns + inputs.monthlyPmi;
    var totalAnnualEscrow = totalMonthlyEscrow * 12;

    return {
      monthlyTax: monthlyTax,
      monthlyIns: monthlyIns,
      totalMonthlyEscrow: totalMonthlyEscrow,
      totalAnnualEscrow: totalAnnualEscrow
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_monthlyTaxEscrow', formatCurrencyLocal(result.monthlyTax));
    setOutputText('output_monthlyInsuranceEscrow', formatCurrencyLocal(result.monthlyIns));
    setOutputText('output_totalMonthlyEscrow', formatCurrencyLocal(result.totalMonthlyEscrow));
    setOutputText('output_totalAnnualEscrow', formatCurrencyLocal(result.totalAnnualEscrow));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualPropertyTax: inputs.annualPropertyTax,
        annualHomeInsurance: inputs.annualHomeInsurance,
        monthlyPmi: inputs.monthlyPmi,
        totalMonthlyEscrow: result.totalMonthlyEscrow,
        totalAnnualEscrow: result.totalAnnualEscrow
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
          labels: ['Property Taxes', 'Home Insurance', 'PMI Insurance'],
          datasets: [{
            data: [result.monthlyTax, result.monthlyIns, inputs.monthlyPmi],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Monthly Escrow Payment Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'annual') {
      return {
        type: 'bar',
        data: {
          labels: ['Annual Escrow Total'],
          datasets: [
            {
              label: 'Property Taxes',
              data: [inputs.annualPropertyTax],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Home Insurance',
              data: [inputs.annualHomeInsurance],
              backgroundColor: '#C08A2E'
            },
            {
              label: 'Annual PMI',
              data: [inputs.monthlyPmi * 12],
              backgroundColor: '#B23A3A'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Annual Escrow Cost Distribution' }
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
