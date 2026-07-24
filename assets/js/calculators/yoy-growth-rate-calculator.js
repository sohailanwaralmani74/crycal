/* ═══════════════════════════════════════════════════════════
   Wanjaaro — YoY Growth Rate Calculator
   Tool ID: yoy-growth-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'comparison';

  function getInputs() {
    return {
      priorYearRevenue: parseFloat(document.getElementById('input_priorYearRevenue').value) || 0,
      currentYearRevenue: parseFloat(document.getElementById('input_currentYearRevenue').value) || 0
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

  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  function formatMultiple(value) {
    return value.toFixed(2) + 'x';
  }

  function updateTool() {
    var inputs = getInputs();
    var prior = inputs.priorYearRevenue;
    var current = inputs.currentYearRevenue;

    var dollarGrowth = current - prior;
    var yoyPct = prior > 0 ? (dollarGrowth / prior) * 100 : 0;
    var growthMult = prior > 0 ? current / prior : 0;
    var cmgrPct = prior > 0 && current > 0 ? (Math.pow(current / prior, 1 / 12) - 1) * 100 : 0;

    var elYoy = document.getElementById('output_yoyGrowthPercentage');
    if (elYoy) elYoy.querySelector('.output-number').textContent = formatPercentage(yoyPct);

    var elDollar = document.getElementById('output_absoluteDollarGrowth');
    if (elDollar) elDollar.querySelector('.output-number').textContent = formatCurrency(dollarGrowth);

    var elMult = document.getElementById('output_growthMultiple');
    if (elMult) elMult.querySelector('.output-number').textContent = formatMultiple(growthMult);

    var elCmgr = document.getElementById('output_impliedMonthlyGrowthRate');
    if (elCmgr) elCmgr.querySelector('.output-number').textContent = formatPercentage(cmgrPct);

    updateCharts({
      prior: prior,
      current: current
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        priorYearRevenue: prior,
        currentYearRevenue: current,
        yoyGrowthPercentage: yoyPct.toFixed(2) + '%',
        absoluteDollarGrowth: dollarGrowth
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
        labels: ['Prior Year ARR / Revenue', 'Current Year ARR / Revenue'],
        datasets: [{
          label: 'Annual Revenue ($)',
          data: [data.prior, data.current],
          backgroundColor: ['#64748b', data.current >= data.prior ? '#16a34a' : '#dc2626']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Prior Year vs. Current Year Revenue Growth', font: { size: 14 } }
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
    document.getElementById('input_priorYearRevenue').value = 1000000;
    document.getElementById('input_currentYearRevenue').value = 2500000;
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
