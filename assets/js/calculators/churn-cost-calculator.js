/* ═══════════════════════════════════════════════════════════
   CRYCAL — Churn Cost Calculator
   Tool ID: churn-cost-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'compounding';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      monthlyChurnRatePct: parseFloat(document.getElementById('input_monthlyChurnRatePct').value) || 0,
      averageCac: parseFloat(document.getElementById('input_averageCac').value) || 0,
      arpu: parseFloat(document.getElementById('input_arpu').value) || 1
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

  function updateTool() {
    var inputs = getInputs();
    var starting = inputs.startingMrr;
    var churnDec = inputs.monthlyChurnRatePct / 100;
    var cac = inputs.averageCac;
    var arpu = Math.max(1, inputs.arpu);

    var cumulativeLostRev = 0;
    var monthlyLossSeries = [];
    var currentMrr = starting;

    for (var m = 1; m <= 12; m++) {
      var lossThisMonth = currentMrr * churnDec;
      currentMrr -= lossThisMonth;
      monthlyLossSeries.push(starting - currentMrr);
      cumulativeLostRev += (starting - currentMrr);
    }

    var totalMrrLossMonth12 = starting - currentMrr;
    var estimatedLostLogos = totalMrrLossMonth12 / arpu;
    var wastedCac = estimatedLostLogos * cac;
    var totalImpact = cumulativeLostRev + wastedCac;

    var elCum = document.getElementById('output_cumulative1YrLostRevenue');
    if (elCum) elCum.querySelector('.output-number').textContent = formatCurrency(cumulativeLostRev);

    var elCac = document.getElementById('output_wastedCacLoss');
    if (elCac) elCac.querySelector('.output-number').textContent = formatCurrency(wastedCac);

    var elTotal = document.getElementById('output_total1YrChurnImpact');
    if (elTotal) elTotal.querySelector('.output-number').textContent = formatCurrency(totalImpact);

    var elMo12 = document.getElementById('output_month12MrrLoss');
    if (elMo12) elMo12.querySelector('.output-number').textContent = formatCurrency(totalMrrLossMonth12);

    updateCharts({
      monthlyLossSeries: monthlyLossSeries
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        monthlyChurnRatePct: inputs.monthlyChurnRatePct + '%',
        cumulative1YrLostRevenue: cumulativeLostRev,
        total1YrChurnImpact: totalImpact
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

    var labels = [];
    for (var i = 1; i <= 12; i++) {
      labels.push('Mo ' + i);
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly MRR Deficit ($)',
          data: data.monthlyLossSeries,
          backgroundColor: '#dc2626'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Compounding Monthly MRR Loss Trajectory', font: { size: 14 } }
        },
        scales: {
          y: {
            ticks: {
              callback: function(v) { return '$' + v.toLocaleString(); }
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
    document.getElementById('input_startingMrr').value = 100000;
    document.getElementById('input_monthlyChurnRatePct').value = 2.5;
    document.getElementById('input_averageCac').value = 1500;
    document.getElementById('input_arpu').value = 200;
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
