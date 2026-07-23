(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      totalDebtBalance: parseFloat(document.getElementById('input_totalDebtBalance').value) || 0,
      averageInterestRate: parseFloat(document.getElementById('input_averageInterestRate').value) || 0,
      monthlyBudget: parseFloat(document.getElementById('input_monthlyBudget').value) || 0
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
    var P = inputs.totalDebtBalance;
    var r = (inputs.averageInterestRate / 100) / 12;
    var PMT = inputs.monthlyBudget;

    if (P <= 0 || PMT <= 0) return null;

    var minInt = P * r;
    if (PMT <= minInt) {
      return {
        months: 999,
        debtFreeDateStr: 'Payment too low to cover interest',
        totalInterest: 0,
        schedule: []
      };
    }

    var bal = P;
    var totalInterest = 0;
    var monthCount = 0;
    var schedule = [];

    while (bal > 0 && monthCount < 600) {
      monthCount++;
      var intM = bal * r;
      var prinM = Math.min(bal, PMT - intM);
      totalInterest += intM;
      bal -= prinM;
      schedule.push({ month: monthCount, balance: Math.max(0, bal) });
    }

    var now = new Date();
    var targetDate = new Date(now.getFullYear(), now.getMonth() + monthCount, 1);
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var debtFreeDateStr = monthNames[targetDate.getMonth()] + " " + targetDate.getFullYear();

    return {
      months: monthCount,
      debtFreeDateStr: debtFreeDateStr,
      totalInterest: totalInterest,
      schedule: schedule,
      principal: P
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var result = calculateResults(inputs);
    if (!result) return;

    if (result.months >= 600) {
      setOutputText('output_monthsToPayoff', '50+ Years');
      setOutputText('output_estimatedDebtFreeDate', result.debtFreeDateStr);
      setOutputText('output_totalInterestPaid', '—');
      return;
    }

    setOutputText('output_monthsToPayoff', result.months + ' Months (' + (result.months / 12).toFixed(1) + ' yrs)');
    setOutputText('output_estimatedDebtFreeDate', result.debtFreeDateStr);
    setOutputText('output_totalInterestPaid', formatCurrencyLocal(result.totalInterest));

    updateCharts(result, inputs);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalDebtBalance: inputs.totalDebtBalance,
        averageInterestRate: inputs.averageInterestRate,
        monthlyBudget: inputs.monthlyBudget,
        monthsToPayoff: result.months + ' mos',
        estimatedDebtFreeDate: result.debtFreeDateStr,
        totalInterestPaid: result.totalInterest
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
      var labels = result.schedule.map(function(d) { return 'Mo ' + d.month; });
      return {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Remaining Debt Balance',
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
            title: { display: true, text: 'Debt Payoff Balance Reduction Trajectory' }
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

    if (tab === 'principalVsInterest') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Original Principal Balance', 'Total Interest Cost'],
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
            title: { display: true, text: 'Principal vs Interest Total Cost Breakdown' }
          },
          cutout: '60%'
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
