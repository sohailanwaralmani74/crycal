(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalMedicalBill: parseFloat(document.getElementById('input_totalMedicalBill').value) || 0,
      hardshipDiscountPercent: parseFloat(document.getElementById('input_hardshipDiscountPercent').value) || 0,
      paymentPlanMonths: parseFloat(document.getElementById('input_paymentPlanMonths').value) || 24
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
    var bill = inputs.totalMedicalBill;
    var discPercent = inputs.hardshipDiscountPercent / 100;
    var months = inputs.paymentPlanMonths;

    if (bill <= 0 || months <= 0) return null;

    var discountSavings = bill * discPercent;
    var negotiatedBalance = bill - discountSavings;
    var monthlyPmt = negotiatedBalance / months;

    var schedule = [];
    var bal = negotiatedBalance;
    for (var m = 1; m <= months; m++) {
      bal -= monthlyPmt;
      schedule.push({ month: m, balance: Math.max(0, bal) });
    }

    return {
      discountSavings: discountSavings,
      negotiatedBalance: negotiatedBalance,
      monthlyPmt: monthlyPmt,
      schedule: schedule,
      totalBill: bill
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    setOutputText('output_negotiatedBalance', formatCurrencyLocal(result.negotiatedBalance));
    setOutputText('output_monthlyPaymentPlan', formatCurrencyLocal(result.monthlyPmt));
    setOutputText('output_discountSavings', formatCurrencyLocal(result.discountSavings));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalMedicalBill: inputs.totalMedicalBill,
        hardshipDiscountPercent: inputs.hardshipDiscountPercent,
        paymentPlanMonths: inputs.paymentPlanMonths,
        negotiatedBalance: result.negotiatedBalance,
        monthlyPaymentPlan: result.monthlyPmt,
        discountSavings: result.discountSavings
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
          labels: ['Negotiated Balance to Pay', 'Discount Savings Achieved'],
          datasets: [{
            data: [result.negotiatedBalance, result.discountSavings],
            backgroundColor: ['#2F6F5E', '#C08A2E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Medical Bill Discount Allocation' }
          },
          cutout: '60%'
        }
      };
    }

    if (tab === 'timeline') {
      var labels = result.schedule.map(function(d) { return 'Mo ' + d.month; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: '0% Interest Medical Debt Balance',
            data: result.schedule.map(function(d) { return d.balance; }),
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
            title: { display: true, text: '0% Payment Plan Payoff Schedule' }
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
