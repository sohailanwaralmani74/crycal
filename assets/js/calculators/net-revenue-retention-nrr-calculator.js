/* ═══════════════════════════════════════════════════════════
   CRYCAL — Net Revenue Retention (NRR) Calculator
   Tool ID: net-revenue-retention-nrr-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      startingMrr: parseFloat(document.getElementById('input_startingMrr').value) || 0,
      expansionMrr: parseFloat(document.getElementById('input_expansionMrr').value) || 0,
      contractionMrr: parseFloat(document.getElementById('input_contractionMrr').value) || 0,
      churnedMrr: parseFloat(document.getElementById('input_churnedMrr').value) || 0
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

  function updateTool() {
    var inputs = getInputs();
    var starting = inputs.startingMrr;
    var expansion = inputs.expansionMrr;
    var contraction = inputs.contractionMrr;
    var churned = inputs.churnedMrr;

    var endingMrr = starting + expansion - contraction - churned;
    var nrrPct = starting > 0 ? (endingMrr / starting) * 100 : 0;
    var netChange = endingMrr - starting;
    var arrImpact = netChange * 12;

    var elNrr = document.getElementById('output_nrrPercentage');
    if (elNrr) elNrr.querySelector('.output-number').textContent = formatPercentage(nrrPct);

    var elEnding = document.getElementById('output_endingMrr');
    if (elEnding) elEnding.querySelector('.output-number').textContent = formatCurrency(endingMrr);

    var elChange = document.getElementById('output_netGrowthDollar');
    if (elChange) elChange.querySelector('.output-number').textContent = formatCurrency(netChange);

    var elArr = document.getElementById('output_arrImpact');
    if (elArr) elArr.querySelector('.output-number').textContent = formatCurrency(arrImpact);

    updateCharts({
      starting: starting,
      expansion: expansion,
      contraction: contraction,
      churned: churned,
      ending: endingMrr
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingMrr: starting,
        expansionMrr: expansion,
        churnedMrr: churned,
        nrrPercentage: nrrPct.toFixed(2) + '%',
        endingMrr: endingMrr
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
        labels: ['Starting MRR', '+ Expansion', '- Contraction', '- Churn', 'Ending MRR'],
        datasets: [{
          label: 'MRR Waterfall ($)',
          data: [data.starting, data.expansion, -data.contraction, -data.churned, data.ending],
          backgroundColor: [
            '#2563eb',
            '#16a34a',
            '#f59e0b',
            '#dc2626',
            data.ending >= data.starting ? '#059669' : '#d97706'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Cohort MRR Waterfall Breakdown', font: { size: 14 } }
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
    document.getElementById('input_expansionMrr').value = 15000;
    document.getElementById('input_contractionMrr').value = 3000;
    document.getElementById('input_churnedMrr').value = 5000;
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
