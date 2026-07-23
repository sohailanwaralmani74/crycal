(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      grossPaycheckIncome: parseFloat(document.getElementById('input_grossPaycheckIncome').value) || 0,
      payFrequency: document.getElementById('input_payFrequency').value,
      filingStatus: document.getElementById('input_filingStatus').value,
      childDependents: parseFloat(document.getElementById('input_childDependents').value) || 0
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

  function getPayPeriods(freq) {
    if (freq.indexOf('Weekly') !== -1) return 52;
    if (freq.indexOf('Biweekly') !== -1) return 26;
    if (freq.indexOf('Semi-Monthly') !== -1) return 24;
    if (freq.indexOf('Monthly') !== -1) return 12;
    return 26;
  }

  function calculateResults(inputs) {
    var grossPerCheck = inputs.grossPaycheckIncome;
    var periods = getPayPeriods(inputs.payFrequency);
    var annualGross = grossPerCheck * periods;

    var stdDeduction = 14600; // Single
    if (inputs.filingStatus.indexOf('Married Filing Jointly') !== -1) {
      stdDeduction = 29200;
    } else if (inputs.filingStatus.indexOf('Head of Household') !== -1) {
      stdDeduction = 21900;
    }

    var taxableInc = Math.max(0, annualGross - stdDeduction);

    // Progressive Federal Tax Brackets
    var tax = 0;
    if (taxableInc > 0) {
      if (taxableInc <= 11600) tax = taxableInc * 0.10;
      else if (taxableInc <= 47150) tax = 1160 + (taxableInc - 11600) * 0.12;
      else if (taxableInc <= 100525) tax = 5426 + (taxableInc - 47150) * 0.22;
      else if (taxableInc <= 191950) tax = 17168.50 + (taxableInc - 100525) * 0.24;
      else tax = 39110.50 + (taxableInc - 191950) * 0.32;
    }

    var childCredit = inputs.childDependents * 2000;
    var netAnnualTax = Math.max(0, tax - childCredit);

    var taxPerCheck = netAnnualTax / periods;
    var netTakeHome = Math.max(0, grossPerCheck - taxPerCheck);

    return {
      annualGross: annualGross,
      taxPerCheck: taxPerCheck,
      netTakeHome: netTakeHome,
      netAnnualTax: netAnnualTax
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_annualGrossSalary', formatCurrencyLocal(result.annualGross));
    setOutputText('output_estimatedFederalTaxPerPaycheck', formatCurrencyLocal(result.taxPerCheck));
    setOutputText('output_netPaycheckTakeHome', formatCurrencyLocal(result.netTakeHome));
    setOutputText('output_totalAnnualFederalTax', formatCurrencyLocal(result.netAnnualTax));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        grossPaycheckIncome: inputs.grossPaycheckIncome,
        payFrequency: inputs.payFrequency,
        filingStatus: inputs.filingStatus,
        estimatedFederalTaxPerPaycheck: result.taxPerCheck,
        netPaycheckTakeHome: result.netTakeHome
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
          labels: ['Net Take-Home Pay', 'Federal Tax Withheld'],
          datasets: [{
            data: [result.netTakeHome, result.taxPerCheck],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Single Paycheck Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'annual') {
      return {
        type: 'bar',
        data: {
          labels: ['Annual Salary Allocation'],
          datasets: [
            {
              label: 'Total Net Annual Take-Home',
              data: [result.annualGross - result.netAnnualTax],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Total Annual Federal Tax Withheld',
              data: [result.netAnnualTax],
              backgroundColor: '#C08A2E'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Annual Gross Income Distribution' }
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
