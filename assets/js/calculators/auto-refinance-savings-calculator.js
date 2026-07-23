(function() {

  var chartInstance = null;
  var currentTab = 'savings_breakdown';

  function getInputs() {
    return {
      currentLoanBalance: parseFloat(document.getElementById('input_currentLoanBalance').value) || 0,
      currentInterestRate: parseFloat(document.getElementById('input_currentInterestRate').value) || 0,
      currentRemainingMonths: parseInt(document.getElementById('input_currentRemainingMonths').value, 10) || 48,
      newInterestRate: parseFloat(document.getElementById('input_newInterestRate').value) || 0,
      newLoanTermMonths: parseInt(document.getElementById('input_newLoanTermMonths').value, 10) || 48,
      refinancingFees: parseFloat(document.getElementById('input_refinancingFees').value) || 0
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

  function calculateRefinance(inputs) {
    var B = inputs.currentLoanBalance;
    var r1 = (inputs.currentInterestRate / 100) / 12;
    var n1 = inputs.currentRemainingMonths;

    var r2 = (inputs.newInterestRate / 100) / 12;
    var n2 = inputs.newLoanTermMonths;
    var fees = inputs.refinancingFees;

    if (B <= 0 || n1 <= 0 || n2 <= 0) {
      return {
        currentMonthlyPayment: 0,
        newMonthlyPayment: 0,
        monthlySavings: 0,
        netInterestSavings: 0,
        breakEvenMonths: 'N/A'
      };
    }

    var m1 = (r1 > 0) ? (B * r1 * Math.pow(1 + r1, n1)) / (Math.pow(1 + r1, n1) - 1) : B / n1;
    var m2 = (r2 > 0) ? (B * r2 * Math.pow(1 + r2, n2)) / (Math.pow(1 + r2, n2) - 1) : B / n2;

    var totalInterest1 = (m1 * n1) - B;
    var totalInterest2 = (m2 * n2) - B;

    var monthlySavings = m1 - m2;
    var grossInterestSaved = totalInterest1 - totalInterest2;
    var netInterestSavings = grossInterestSaved - fees;

    var breakEven = 'N/A';
    if (fees <= 0) {
      breakEven = 'Instant ($0 Fees)';
    } else if (monthlySavings > 0) {
      var mos = (fees / monthlySavings).toFixed(1);
      breakEven = mos + ' Months';
    } else {
      breakEven = 'No Monthly Savings';
    }

    return {
      currentMonthlyPayment: m1,
      newMonthlyPayment: m2,
      monthlySavings: monthlySavings,
      netInterestSavings: netInterestSavings,
      breakEvenMonths: breakEven,
      totalInterest1: Math.max(0, totalInterest1),
      totalInterest2: Math.max(0, totalInterest2)
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateRefinance(inputs);

    setOutputText('output_currentMonthlyPayment', formatCurrency(res.currentMonthlyPayment));
    setOutputText('output_newMonthlyPayment', formatCurrency(res.newMonthlyPayment));
    setOutputText('output_monthlySavings', formatCurrency(res.monthlySavings));
    setOutputText('output_netInterestSavings', formatCurrency(res.netInterestSavings));
    setOutputText('output_breakEvenMonths', res.breakEvenMonths);

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentLoanBalance: inputs.currentLoanBalance,
        currentInterestRate: inputs.currentInterestRate,
        newInterestRate: inputs.newInterestRate,
        monthlySavings: res.monthlySavings,
        netInterestSavings: res.netInterestSavings
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

    if (tab === 'savings_breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly Payment', 'Total Interest Cost'],
          datasets: [
            {
              label: 'Current Loan',
              data: [Math.round(res.currentMonthlyPayment), Math.round(res.totalInterest1)],
              backgroundColor: '#E05A47'
            },
            {
              label: 'Refinanced Loan',
              data: [Math.round(res.newMonthlyPayment), Math.round(res.totalInterest2)],
              backgroundColor: '#2E7D32'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Current vs Refinanced Auto Loan Comparison' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'cumulative_savings') {
      var n2 = inputs.newLoanTermMonths;
      var labels = [];
      var cumulativeData = [];
      var monthlySav = res.monthlySavings;
      var fees = inputs.refinancingFees;

      for (var i = 1; i <= n2; i++) {
        labels.push('Mo ' + i);
        cumulativeData.push(Math.round((monthlySav * i) - fees));
      }

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cumulative Net Savings ',
            data: cumulativeData,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74, 144, 217, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Net Refinance Savings Over Time' }
          },
          scales: {
            y: {
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
