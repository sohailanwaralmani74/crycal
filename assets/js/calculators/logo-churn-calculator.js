/* ═══════════════════════════════════════════════════════════
   CRYCAL — Logo Churn Calculator
   Tool ID: logo-churn-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

  function getInputs() {
    return {
      startingCustomers: parseFloat(document.getElementById('input_startingCustomers').value) || 0,
      lostCustomers: parseFloat(document.getElementById('input_lostCustomers').value) || 0,
      newCustomers: parseFloat(document.getElementById('input_newCustomers').value) || 0
    };
  }

  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  function formatNumber(value) {
    return Math.round(value).toLocaleString();
  }

  function updateTool() {
    var inputs = getInputs();
    var starting = inputs.startingCustomers;
    var lost = inputs.lostCustomers;
    var newLogos = inputs.newCustomers;

    var churnPct = starting > 0 ? (lost / starting) * 100 : 0;
    var retentionPct = 100 - churnPct;
    var monthlyRetentionDec = 1 - (churnPct / 100);
    var annualChurnPct = (1 - Math.pow(monthlyRetentionDec, 12)) * 100;
    var endingLogos = starting - lost + newLogos;

    var elChurn = document.getElementById('output_logoChurnRate');
    if (elChurn) elChurn.querySelector('.output-number').textContent = formatPercentage(churnPct);

    var elRetention = document.getElementById('output_logoRetentionRate');
    if (elRetention) elRetention.querySelector('.output-number').textContent = formatPercentage(retentionPct);

    var elAnnual = document.getElementById('output_annualizedLogoChurn');
    if (elAnnual) elAnnual.querySelector('.output-number').textContent = formatPercentage(annualChurnPct);

    var elEnding = document.getElementById('output_endingCustomers');
    if (elEnding) elEnding.querySelector('.output-number').textContent = formatNumber(endingLogos);

    updateCharts({
      starting: starting,
      lost: lost,
      newLogos: newLogos,
      ending: endingLogos
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startingCustomers: starting,
        lostCustomers: lost,
        logoChurnRate: churnPct.toFixed(2) + '%',
        logoRetentionRate: retentionPct.toFixed(2) + '%',
        endingCustomers: endingLogos
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
        labels: ['Starting Logos', '- Cancelled Logos', '+ New Logos', 'Ending Logos'],
        datasets: [{
          label: 'Customer Account Count',
          data: [data.starting, -data.lost, data.newLogos, data.ending],
          backgroundColor: ['#2563eb', '#dc2626', '#16a34a', '#059669']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Customer Account Logo Movement', font: { size: 14 } }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_startingCustomers').value = 500;
    document.getElementById('input_lostCustomers').value = 15;
    document.getElementById('input_newCustomers').value = 30;
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
