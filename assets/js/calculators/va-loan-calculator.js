(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      homePrice: parseFloat(document.getElementById('input_homePrice').value) || 0,
      downPaymentPercent: parseFloat(document.getElementById('input_downPaymentPercent').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermYears: parseFloat(document.getElementById('input_loanTermYears').value) || 30,
      vaFundingFeeRate: parseFloat(document.getElementById('input_vaFundingFeeRate').value) || 0
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
    var dp = hp * (inputs.downPaymentPercent / 100);
    var baseLoan = Math.max(0, hp - dp);
    var feeAmount = baseLoan * (inputs.vaFundingFeeRate / 100);
    var totalFinanced = baseLoan + feeAmount;

    var r = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermYears * 12;

    if (totalFinanced <= 0 || r <= 0 || n <= 0) return null;

    var monthlyPmt = (totalFinanced * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    var totalInterest = (monthlyPmt * n) - totalFinanced;

    // Amortization schedule
    var yearlyData = [];
    var bal = totalFinanced;
    var cumInt = 0;
    for (var m = 1; m <= n; m++) {
      var intM = bal * r;
      var prinM = Math.min(bal, monthlyPmt - intM);
      cumInt += intM;
      bal -= prinM;
      if (m % 12 === 0) {
        yearlyData.push({ year: m / 12, balance: Math.max(0, bal), interest: cumInt });
      }
    }

    return {
      feeAmount: feeAmount,
      totalFinanced: totalFinanced,
      monthlyPmt: monthlyPmt,
      totalInterest: totalInterest,
      baseLoan: baseLoan,
      downPaymentAmount: dp,
      yearlyData: yearlyData
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_vaFundingFeeAmount', formatCurrencyLocal(result.feeAmount));
    setOutputText('output_totalLoanAmount', formatCurrencyLocal(result.totalFinanced));
    setOutputText('output_monthlyPayment', formatCurrencyLocal(result.monthlyPmt));
    setOutputText('output_totalInterest', formatCurrencyLocal(result.totalInterest));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        homePrice: inputs.homePrice,
        downPaymentPercent: inputs.downPaymentPercent,
        interestRate: inputs.interestRate,
        vaFundingFeeAmount: result.feeAmount,
        totalLoanAmount: result.totalFinanced,
        monthlyPayment: result.monthlyPmt
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
          labels: ['Base Loan Amount', 'VA Funding Fee', 'Total Lifetime Interest'],
          datasets: [{
            data: [result.baseLoan, result.feeAmount, result.totalInterest],
            backgroundColor: ['#2F6F5E', '#C08A2E', '#B23A3A'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'VA Loan Total Lifetime Cost Allocation' }
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
            label: 'Remaining Principal Balance',
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
            title: { display: true, text: 'VA Loan Amortization Schedule' }
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
