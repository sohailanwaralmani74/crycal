(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      vehiclePrice: parseFloat(document.getElementById('input_vehiclePrice').value) || 0,
      downPayment: parseFloat(document.getElementById('input_downPayment').value) || 0,
      tradeInValue: parseFloat(document.getElementById('input_tradeInValue').value) || 0,
      interestRate: parseFloat(document.getElementById('input_interestRate').value) || 0,
      loanTermMonths: parseInt(document.getElementById('input_loanTermMonths').value, 10) || 60,
      salesTaxRate: parseFloat(document.getElementById('input_salesTaxRate').value) || 0
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

  function calculateLoan(inputs) {
    var V = inputs.vehiclePrice;
    var D = inputs.downPayment;
    var T = inputs.tradeInValue;
    var rate = inputs.interestRate / 100 / 12;
    var n = inputs.loanTermMonths;
    var taxRate = inputs.salesTaxRate / 100;

    var taxableBase = Math.max(0, V - T);
    var salesTax = taxableBase * taxRate;
    var netPrincipal = Math.max(0, taxableBase + salesTax - D);

    var monthlyPayment = 0;
    var totalInterest = 0;

    if (netPrincipal > 0 && n > 0) {
      if (rate > 0) {
        monthlyPayment = (netPrincipal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
        totalInterest = (monthlyPayment * n) - netPrincipal;
      } else {
        monthlyPayment = netPrincipal / n;
        totalInterest = 0;
      }
    }

    var totalCost = (monthlyPayment * n) + D + T;

    // Amortization schedule
    var schedule = [];
    var balance = netPrincipal;
    for (var m = 1; m <= n; m++) {
      var interestPaid = balance * rate;
      var principalPaid = monthlyPayment - interestPaid;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        month: m,
        principalPaid: principalPaid,
        interestPaid: interestPaid,
        balance: balance
      });
    }

    return {
      monthlyPayment: monthlyPayment,
      totalPrincipal: netPrincipal,
      totalInterest: Math.max(0, totalInterest),
      totalSalesTax: salesTax,
      totalCost: totalCost,
      schedule: schedule
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateLoan(inputs);

    setOutputText('output_monthlyPayment', formatCurrency(res.monthlyPayment));
    setOutputText('output_totalPrincipal', formatCurrency(res.totalPrincipal));
    setOutputText('output_totalInterest', formatCurrency(res.totalInterest));
    setOutputText('output_totalSalesTax', formatCurrency(res.totalSalesTax));
    setOutputText('output_totalCost', formatCurrency(res.totalCost));

    updateCharts(res, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        vehiclePrice: inputs.vehiclePrice,
        downPayment: inputs.downPayment,
        interestRate: inputs.interestRate,
        monthlyPayment: res.monthlyPayment,
        totalInterest: res.totalInterest
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

    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Net Principal Financed', 'Total Interest Paid', 'Sales Tax Paid'],
          datasets: [{
            data: [
              Math.round(res.totalPrincipal - res.totalSalesTax),
              Math.round(res.totalInterest),
              Math.round(res.totalSalesTax)
            ],
            backgroundColor: ['#4A90D9', '#E05A47', '#FFC107'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Auto Financing Cost Distribution' }
          }
        }
      };
    } else if (tab === 'schedule') {
      var labels = res.schedule.map(function(s) { return 'Mo ' + s.month; });
      var balances = res.schedule.map(function(s) { return Math.round(s.balance); });

      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Remaining Loan Balance',
            data: balances,
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
            title: { display: true, text: 'Loan Amortization Trajectory' }
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
