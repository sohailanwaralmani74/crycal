(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      loanAmount: parseFloat(document.getElementById('input_loanAmount').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermMonths: parseFloat(document.getElementById('input_loanTermMonths').value) || 36
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
    var P = inputs.loanAmount;
    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermMonths;

    if (P <= 0 || r <= 0 || n <= 0) return null;

    var monthlyPmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var totalRepayment = monthlyPmt * n;
    var totalInterest = totalRepayment - P;

    // Monthly data for chart
    var monthlyData = [];
    var bal = P;
    for (var m = 1; m <= n; m++) {
      var intM = bal * r;
      var prinM = Math.min(bal, monthlyPmt - intM);
      bal -= prinM;
      monthlyData.push({ month: m, balance: Math.max(0, bal) });
    }

    return {
      monthlyPmt: monthlyPmt,
      totalInterest: totalInterest,
      totalRepayment: totalRepayment,
      principal: P,
      monthlyData: monthlyData
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_monthlyPayment', formatCurrencyLocal(result.monthlyPmt));
    setOutputText('output_totalInterest', formatCurrencyLocal(result.totalInterest));
    setOutputText('output_totalRepayment', formatCurrencyLocal(result.totalRepayment));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        loanAmount: inputs.loanAmount,
        interestRate: inputs.interestRate,
        loanTermMonths: inputs.loanTermMonths,
        monthlyPayment: result.monthlyPmt,
        totalInterest: result.totalInterest,
        totalRepayment: result.totalRepayment
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
    var currencySymbol = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Principal Loan Amount', 'Total Interest Cost'],
          datasets: [{
            data: [result.principal, result.totalInterest],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Personal Loan Cost Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'amortization') {
      var labels = result.monthlyData.map(function(d) { return 'Mo ' + d.month; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Remaining Principal Balance',
            data: result.monthlyData.map(function(d) { return d.balance; }),
            borderColor: '#2F6F5E',
            backgroundColor: 'rgba(47, 111, 94, 0.1)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Amortization Schedule' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(val) { return currencySymbol + val.toFixed(0); } }
            }
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
