(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermYears: parseFloat(document.getElementById('input_loanTermYears').value) || 30,
      upfrontFeeRate: parseFloat(document.getElementById('input_upfrontFeeRate').value) || 1.0,
      annualFeeRate: parseFloat(document.getElementById('input_annualFeeRate').value) || 0.35
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
    var hp = inputs.homePrice;
    var upfrontFee = hp * (inputs.upfrontFeeRate / 100);
    var totalFinanced = hp + upfrontFee;

    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermYears * 12;

    if (totalFinanced <= 0 || r <= 0 || n <= 0) return null;

    var monthlyPi = (totalFinanced * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var monthlyUsdaFee = (hp * (inputs.annualFeeRate / 100)) / 12;
    var totalMonthly = monthlyPi + monthlyUsdaFee;

    // Amortization schedule
    var yearlyData = [];
    var bal = totalFinanced;
    for (var m = 1; m <= n; m++) {
      var intM = bal * r;
      var prinM = Math.min(bal, monthlyPi - intM);
      bal -= prinM;
      if (m % 12 === 0) {
        yearlyData.push({ year: m / 12, balance: Math.max(0, bal) });
      }
    }

    return {
      upfrontFee: upfrontFee,
      totalFinanced: totalFinanced,
      monthlyPi: monthlyPi,
      monthlyUsdaFee: monthlyUsdaFee,
      totalMonthly: totalMonthly,
      yearlyData: yearlyData
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_upfrontFeeAmount', formatCurrencyLocal(result.upfrontFee));
    setOutputText('output_totalFinancedBalance', formatCurrencyLocal(result.totalFinanced));
    setOutputText('output_monthlyPrincipalInterest', formatCurrencyLocal(result.monthlyPi));
    setOutputText('output_monthlyUsdaFee', formatCurrencyLocal(result.monthlyUsdaFee));
    setOutputText('output_totalMonthlyPayment', formatCurrencyLocal(result.totalMonthly));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        homePrice: inputs.homePrice,
        interestRate: inputs.interestRate,
        upfrontFeeAmount: result.upfrontFee,
        monthlyUsdaFee: result.monthlyUsdaFee,
        totalMonthlyPayment: result.totalMonthly
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
          labels: ['Principal & Interest (P&I)', 'Monthly USDA Fee'],
          datasets: [{
            data: [result.monthlyPi, result.monthlyUsdaFee],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Monthly Payment Breakdown' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'amortization') {
      var labels = result.yearlyData.map(function(d) { return 'Yr ' + d.year; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'USDA Loan Balance',
            data: result.yearlyData.map(function(d) { return d.balance; }),
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
            title: { display: true, text: 'USDA Amortization Schedule' }
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
