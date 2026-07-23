(function() {

  var chartInstance = null;
  var currentTab = 'loan_composition';

  function getInputs() {
    return {
      currentCarValue: parseFloat(document.getElementById('input_currentCarValue').value) || 0,
      currentLoanBalance: parseFloat(document.getElementById('input_currentLoanBalance').value) || 0,
      newCarPrice: parseFloat(document.getElementById('input_newCarPrice').value) || 0,
      newCarInterestRate: parseFloat(document.getElementById('input_newCarInterestRate').value) || 0,
      newCarTermMonths: parseInt(document.getElementById('input_newCarTermMonths').value, 10) || 60,
      newCarDownPayment: parseFloat(document.getElementById('input_newCarDownPayment').value) || 0
    };
  }

  function formatCurrency(amount) {
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

  function calculateNegativeEquity(inputs) {
    var Vold = inputs.currentCarValue;
    var Bold = inputs.currentLoanBalance;
    var Vnew = inputs.newCarPrice;
    var rate = (inputs.newCarInterestRate / 100) / 12;
    var n = inputs.newCarTermMonths;
    var D = inputs.newCarDownPayment;

    var gap = Math.max(0, Bold - Vold);
    var basePrincipal = Math.max(0, Vnew - D);
    var totalPrincipal = Math.max(0, Vnew + gap - D);

    var totalMonthlyPayment = 0;
    var baseMonthlyPayment = 0;

    if (totalPrincipal > 0 && n > 0) {
      if (rate > 0) {
        totalMonthlyPayment = (totalPrincipal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
        baseMonthlyPayment = (basePrincipal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      } else {
        totalMonthlyPayment = totalPrincipal / n;
        baseMonthlyPayment = basePrincipal / n;
      }
    }

    var monthlyPenalty = Math.max(0, totalMonthlyPayment - baseMonthlyPayment);
    var totalInterestWithRollover = (totalMonthlyPayment * n) - totalPrincipal;
    var totalInterestBase = (baseMonthlyPayment * n) - basePrincipal;

    return {
      negativeEquityGap: gap,
      totalNewLoanAmount: totalPrincipal,
      newMonthlyPayment: totalMonthlyPayment,
      paymentIncreaseFromRollover: monthlyPenalty,
      totalInterestWithRollover: Math.max(0, totalInterestWithRollover),
      baseMonthlyPayment: baseMonthlyPayment,
      basePrincipal: basePrincipal,
      totalInterestBase: Math.max(0, totalInterestBase)
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateNegativeEquity(inputs);

    setOutputText('output_negativeEquityGap', formatCurrency(res.negativeEquityGap));
    setOutputText('output_totalNewLoanAmount', formatCurrency(res.totalNewLoanAmount));
    setOutputText('output_newMonthlyPayment', formatCurrency(res.newMonthlyPayment));
    setOutputText('output_paymentIncreaseFromRollover', formatCurrency(res.paymentIncreaseFromRollover));
    setOutputText('output_totalInterestWithRollover', formatCurrency(res.totalInterestWithRollover));

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentCarValue: inputs.currentCarValue,
        currentLoanBalance: inputs.currentLoanBalance,
        negativeEquityGap: res.negativeEquityGap,
        totalNewLoanAmount: res.totalNewLoanAmount,
        newMonthlyPayment: res.newMonthlyPayment
      });
    }
  }

  function updateCharts(res, inputs) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    var chartData = generateChartData(currentTab, res, inputs);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, res, inputs) {
    var sym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol(getGlobalCurrency() || 'USD') : '$';

    if (tab === 'loan_composition') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Net New Vehicle Price', 'Rolled-over Negative Equity'],
          datasets: [{
            data: [
              Math.round(res.basePrincipal),
              Math.round(res.negativeEquityGap)
            ],
            backgroundColor: ['#4A90D9', '#E05A47'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'New Financed Loan Principal Composition' }
          }
        }
      };
    } else if (tab === 'payment_impact') {
      return {
        type: 'bar',
        data: {
          labels: ['Clean Trade-in Payment', 'Rollover Penalty', 'Total New Payment'],
          datasets: [{
            label: 'Monthly Cost ',
            data: [
              Math.round(res.baseMonthlyPayment),
              Math.round(res.paymentIncreaseFromRollover),
              Math.round(res.newMonthlyPayment)
            ],
            backgroundColor: ['#2E7D32', '#FFC107', '#E05A47'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Payment Impact of Rolled-over Negative Equity' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
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
  });

})();
