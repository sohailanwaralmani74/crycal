(function() {

  var chartInstance = null;
  var currentTab = 'payment_structure';

  function getInputs() {
    return {
      vehiclePrice: parseFloat(document.getElementById('input_vehiclePrice').value) || 0,
      downPayment: parseFloat(document.getElementById('input_downPayment').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermMonths: parseInt(document.getElementById('input_loanTermMonths').value, 10) || 48,
      balloonAmount: parseFloat(document.getElementById('input_balloonAmount').value) || 0
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

  function calculateBalloon(inputs) {
    var V = inputs.vehiclePrice;
    var D = inputs.downPayment;
    var rate = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermMonths;
    var F = inputs.balloonAmount;

    var netPrincipal = Math.max(0, V - D);
    if (netPrincipal <= 0 || n <= 0) {
      return {
        regularMonthlyPayment: 0,
        standardMonthlyPayment: 0,
        paymentSavingsMonthly: 0,
        finalBalloonPayment: 0,
        totalInterestPaid: 0,
        totalInterestStandard: 0
      };
    }

    var balloonPmt = 0;
    var standardPmt = 0;

    if (rate > 0) {
      var factor = Math.pow(1 + rate, n);
      balloonPmt = (netPrincipal * rate * factor - F * rate) / (factor - 1);
      standardPmt = (netPrincipal * rate * factor) / (factor - 1);
    } else {
      balloonPmt = (netPrincipal - F) / n;
      standardPmt = netPrincipal / n;
    }

    balloonPmt = Math.max(0, balloonPmt);
    standardPmt = Math.max(0, standardPmt);

    var totalInterestPaid = (balloonPmt * n) + F - netPrincipal;
    var totalInterestStandard = (standardPmt * n) - netPrincipal;
    var savingsMonthly = Math.max(0, standardPmt - balloonPmt);

    return {
      regularMonthlyPayment: balloonPmt,
      standardMonthlyPayment: standardPmt,
      paymentSavingsMonthly: savingsMonthly,
      finalBalloonPayment: F,
      totalInterestPaid: Math.max(0, totalInterestPaid),
      totalInterestStandard: Math.max(0, totalInterestStandard)
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateBalloon(inputs);

    setOutputText('output_regularMonthlyPayment', formatCurrency(res.regularMonthlyPayment));
    setOutputText('output_standardMonthlyPayment', formatCurrency(res.standardMonthlyPayment));
    setOutputText('output_paymentSavingsMonthly', formatCurrency(res.paymentSavingsMonthly));
    setOutputText('output_finalBalloonPayment', formatCurrency(res.finalBalloonPayment));
    setOutputText('output_totalInterestPaid', formatCurrency(res.totalInterestPaid));

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehiclePrice: inputs.vehiclePrice,
        downPayment: inputs.downPayment,
        interestRate: inputs.interestRate,
        balloonAmount: inputs.balloonAmount,
        regularMonthlyPayment: res.regularMonthlyPayment,
        standardMonthlyPayment: res.standardMonthlyPayment
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

    if (tab === 'payment_structure') {
      return {
        type: 'bar',
        data: {
          labels: ['Regular Monthly Payment', 'Final Month Payment (Balloon Included)'],
          datasets: [{
            label: 'Payment Amount ',
            data: [
              Math.round(res.regularMonthlyPayment),
              Math.round(res.regularMonthlyPayment + res.finalBalloonPayment)
            ],
            backgroundColor: ['#4A90D9', '#E05A47'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Payment vs Final Lump-Sum Maturity Payment' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'loan_comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Monthly Payment', 'Total Interest Cost'],
          datasets: [
            {
              label: 'Balloon Financing',
              data: [Math.round(res.regularMonthlyPayment), Math.round(res.totalInterestPaid)],
              backgroundColor: '#4A90D9'
            },
            {
              label: 'Standard Financing',
              data: [Math.round(res.standardMonthlyPayment), Math.round(res.totalInterestStandard)],
              backgroundColor: '#2E7D32'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Balloon Financing vs Standard Amortized Financing' }
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
