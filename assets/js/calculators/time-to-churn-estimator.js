/* ═══════════════════════════════════════════════════════════
   CRYCAL — Time-to-Churn Estimator
   Tool ID: time-to-churn-estimator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'lifetime';

  function getInputs() {
    return {
      monthlyChurnRatePct: parseFloat(document.getElementById('input_monthlyChurnRatePct').value) || 0.1,
      arpu: parseFloat(document.getElementById('input_arpu').value) || 0,
      grossMarginPct: parseFloat(document.getElementById('input_grossMarginPct').value) || 80
    };
  }

  function formatCurrency(amount) {
    var code = (typeof getGlobalCurrency === 'function' ? getGlobalCurrency() : 'USD') || 'USD';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function formatNumber(value, digits) {
    return value.toFixed(digits || 1);
  }

  function updateTool() {
    var inputs = getInputs();
    var churnPct = Math.max(0.01, inputs.monthlyChurnRatePct);
    var arpu = inputs.arpu;
    var marginDec = (inputs.grossMarginPct || 80) / 100;

    var lifetimeMonths = 100 / churnPct;
    var lifetimeYears = lifetimeMonths / 12;
    var grossLtv = arpu * lifetimeMonths;
    var netLtv = grossLtv * marginDec;

    var elMos = document.getElementById('output_averageLifetimeMonths');
    if (elMos) elMos.querySelector('.output-number').textContent = formatNumber(lifetimeMonths, 1) + ' mos';

    var elYrs = document.getElementById('output_averageLifetimeYears');
    if (elYrs) elYrs.querySelector('.output-number').textContent = formatNumber(lifetimeYears, 1) + ' yrs';

    var elGrossLtv = document.getElementById('output_grossLtv');
    if (elGrossLtv) elGrossLtv.querySelector('.output-number').textContent = formatCurrency(grossLtv);

    var elNetLtv = document.getElementById('output_netLtv');
    if (elNetLtv) elNetLtv.querySelector('.output-number').textContent = formatCurrency(netLtv);

    updateCharts({
      currentChurnPct: churnPct,
      currentLifetime: lifetimeMonths
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        monthlyChurnRatePct: churnPct + '%',
        arpu: arpu,
        averageLifetimeMonths: lifetimeMonths.toFixed(1) + ' mos',
        grossLtv: grossLtv
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

    var churnRates = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0];
    var lifetimes = churnRates.map(function(r) { return 100 / r; });
    var labels = churnRates.map(function(r) { return r + '%'; });

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Customer Lifetime (Months)',
          data: lifetimes,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Monthly Churn Rate (%) vs. Average Customer Lifetime (Months)', font: { size: 14 } }
        },
        scales: {
          x: {
            title: { display: true, text: 'Monthly Churn Rate %' }
          },
          y: {
            title: { display: true, text: 'Lifetime (Months)' }
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
    document.getElementById('input_monthlyChurnRatePct').value = 2.0;
    document.getElementById('input_arpu').value = 150;
    document.getElementById('input_grossMarginPct').value = 80;
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
