(function() {

  var chartInstance = null;
  var currentTab = 'payment_comparison';

  function getInputs() {
    return {
      vehiclePrice: parseFloat(document.getElementById('input_vehiclePrice').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermMonths: parseInt(document.getElementById('input_loanTermMonths').value, 10) || 60,
      tradeInValue: parseFloat(document.getElementById('input_tradeInValue').value) || 0
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

  function calculatePaymentForPrincipal(principal, rate, n) {
    if (principal <= 0 || n <= 0) return { payment: 0, totalInterest: 0 };
    if (rate <= 0) return { payment: principal / n, totalInterest: 0 };
    var pmt = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    var intPaid = (pmt * n) - principal;
    return { payment: pmt, totalInterest: Math.max(0, intPaid) };
  }

  function calculateDownPaymentTiers(inputs) {
    var V = inputs.vehiclePrice;
    var rate = (inputs.interestRate / 100) / 12;
    var n = inputs.loanTermMonths;
    var T = inputs.tradeInValue;

    var p10 = Math.max(0, V - T - (V * 0.10));
    var p20 = Math.max(0, V - T - (V * 0.20));
    var p30 = Math.max(0, V - T - (V * 0.30));

    var res10 = calculatePaymentForPrincipal(p10, rate, n);
    var res20 = calculatePaymentForPrincipal(p20, rate, n);
    var res30 = calculatePaymentForPrincipal(p30, rate, n);

    var interestSaved20vs10 = Math.max(0, res10.totalInterest - res20.totalInterest);
    var interestSaved30vs10 = Math.max(0, res10.totalInterest - res30.totalInterest);

    return {
      paymentAt10: res10.payment,
      paymentAt20: res20.payment,
      paymentAt30: res30.payment,
      interestAt10: res10.totalInterest,
      interestAt20: res20.totalInterest,
      interestAt30: res30.totalInterest,
      interestSaved20vs10: interestSaved20vs10,
      interestSaved30vs10: interestSaved30vs10
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateDownPaymentTiers(inputs);

    setOutputText('output_paymentAt10', formatCurrency(res.paymentAt10));
    setOutputText('output_paymentAt20', formatCurrency(res.paymentAt20));
    setOutputText('output_paymentAt30', formatCurrency(res.paymentAt30));
    setOutputText('output_interestSaved20vs10', formatCurrency(res.interestSaved20vs10));
    setOutputText('output_interestSaved30vs10', formatCurrency(res.interestSaved30vs10));

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehiclePrice: inputs.vehiclePrice,
        interestRate: inputs.interestRate,
        paymentAt10: res.paymentAt10,
        paymentAt20: res.paymentAt20,
        paymentAt30: res.paymentAt30
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

    if (tab === 'payment_comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['10% Down Payment', '20% Down Payment', '30% Down Payment'],
          datasets: [{
            label: 'Estimated Monthly Payment ',
            data: [
              Math.round(res.paymentAt10),
              Math.round(res.paymentAt20),
              Math.round(res.paymentAt30)
            ],
            backgroundColor: ['#E05A47', '#4A90D9', '#2E7D32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Payment Comparison Across Down Payment Tiers' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: function(v) { return sym + v.toLocaleString(); } }
            }
          }
        }
      };
    } else if (tab === 'interest_comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['10% Down Interest', '20% Down Interest', '30% Down Interest'],
          datasets: [{
            label: 'Total Interest Paid ',
            data: [
              Math.round(res.interestAt10),
              Math.round(res.interestAt20),
              Math.round(res.interestAt30)
            ],
            backgroundColor: ['#E05A47', '#FFC107', '#2E7D32'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Lifetime Loan Interest Charges by Down Payment Tier' }
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
