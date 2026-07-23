/* ═══════════════════════════════════════════════════════════
   CRYCAL — Customer Churn Rate Calculator
   Tool ID: customer-churn-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'retention';

  function getInputs() {
    return {
      startingCustomers: parseFloat(document.getElementById('input_startingCustomers').value) || 0,
      lostCustomers: parseFloat(document.getElementById('input_lostCustomers').value) || 0
    };
  }

  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  function formatMonths(value) {
    return value.toFixed(1) + ' mos';
  }

  function updateTool() {
    var inputs = getInputs();
    var starting = inputs.startingCustomers;
    var lost = inputs.lostCustomers;

    var monthlyChurn = starting > 0 ? (lost / starting) * 100 : 0;
    var monthlyRetention = 100 - monthlyChurn;
    var monthlyRetentionDec = 1 - (monthlyChurn / 100);
    var annualChurn = (1 - Math.pow(monthlyRetentionDec, 12)) * 100;
    var avgLifetimeMonths = monthlyChurn > 0 ? 100 / monthlyChurn : 0;

    var elMonthly = document.getElementById('output_monthlyChurnRatePct');
    if (elMonthly) elMonthly.querySelector('.output-number').textContent = formatPercentage(monthlyChurn);

    var elAnnual = document.getElementById('output_annualChurnRatePct');
    if (elAnnual) elAnnual.querySelector('.output-number').textContent = formatPercentage(annualChurn);

    var elRet = document.getElementById('output_customerRetentionRatePct');
    if (elRet) elRet.querySelector('.output-number').textContent = formatPercentage(monthlyRetention);

    var elLife = document.getElementById('output_averageCustomerLifetimeMonths');
    if (elLife) elLife.querySelector('.output-number').textContent = formatMonths(avgLifetimeMonths);

    updateCharts({
      monthlyChurn: monthlyChurn,
      annualChurn: annualChurn
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingCustomers: starting,
        lostCustomers: lost,
        monthlyChurnRatePct: monthlyChurn.toFixed(2) + '%',
        annualChurnRatePct: annualChurn.toFixed(2) + '%'
      });
    }
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Monthly Churn Rate (%)', 'Annualized Compounding Churn (%)'],
        datasets: [{
          label: 'Churn Rate %',
          data: [data.monthlyChurn, data.annualChurn],
          backgroundColor: ['#f59e0b', '#dc2626']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Monthly vs. Annual Compounding Customer Churn Rate', font: { size: 14 } }
        },
        scales: {
          y: {
            ticks: {
              callback: function(v) { return v.toFixed(1) + '%'; }
            }
          }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_startingCustomers').value = 1000;
    document.getElementById('input_lostCustomers').value = 30;
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
