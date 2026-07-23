(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      homeValue: parseFloat(document.getElementById('input_homeValue').value) || 0,
      currentBalance: parseFloat(document.getElementById('input_currentBalance').value) || 0,
      maxLtvPercent: parseFloat(document.getElementById('input_maxLtvPercent').value) || 80,
      newInterestRate: parseFloat(document.getElementById('input_newInterestRate').value) || 0,
      newLoanTermYears: parseFloat(document.getElementById('input_newLoanTermYears').value) || 30
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
    var hv = inputs.homeValue;
    var maxLoan = hv * (inputs.maxLtvPercent / 100);
    var cashOut = Math.max(0, maxLoan - inputs.currentBalance);

    var r = (inputs.newInterestRate / 100) / 12;
    var n = inputs.newLoanTermYears * 12;

    if (maxLoan <= 0 || r <= 0 || n <= 0) return null;

    var newMonthlyPmt = (maxLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var retainedEquity = Math.max(0, hv - maxLoan);

    return {
      maxLoan: maxLoan,
      cashOut: cashOut,
      newMonthlyPmt: newMonthlyPmt,
      retainedEquity: retainedEquity
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_maxLoanAmount', formatCurrencyLocal(result.maxLoan));
    setOutputText('output_maxCashOutPayout', formatCurrencyLocal(result.cashOut));
    setOutputText('output_newMonthlyPayment', formatCurrencyLocal(result.newMonthlyPmt));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        homeValue: inputs.homeValue,
        currentBalance: inputs.currentBalance,
        maxLtvPercent: inputs.maxLtvPercent,
        maxLoanAmount: result.maxLoan,
        maxCashOutPayout: result.cashOut,
        newMonthlyPayment: result.newMonthlyPmt
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
          labels: ['Existing Mortgage Paid Off', 'Cash Out Payout', 'Retained Home Equity'],
          datasets: [{
            data: [inputs.currentBalance, result.cashOut, result.retainedEquity],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#DCE1E3'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Home Value Equity Distribution After Refinance' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'equity') {
      return {
        type: 'bar',
        data: {
          labels: ['Home Value Allocation'],
          datasets: [
            {
              label: 'New Refinance Loan Amount',
              data: [result.maxLoan],
              backgroundColor: '#2F6F5E'
            },
            {
              label: 'Retained Home Equity (Unborrowed)',
              data: [result.retainedEquity],
              backgroundColor: '#DCE1E3'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'LTV Loan vs Retained Equity' }
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
