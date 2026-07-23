/* ═══════════════════════════════════════════════════════════
   CRYCAL — Renewal Rate Calculator
   Tool ID: renewal-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'renewal';

  function getInputs() {
    return {
      expiringContractsCount: parseFloat(document.getElementById('input_expiringContractsCount').value) || 0,
      renewedContractsCount: parseFloat(document.getElementById('input_renewedContractsCount').value) || 0,
      expiringContractsValue: parseFloat(document.getElementById('input_expiringContractsValue').value) || 0,
      renewedContractsValue: parseFloat(document.getElementById('input_renewedContractsValue').value) || 0
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
    var expCount = inputs.expiringContractsCount;
    var renCount = inputs.renewedContractsCount;
    var expValue = inputs.expiringContractsValue;
    var renValue = inputs.renewedContractsValue;

    var logoRenewalPct = expCount > 0 ? (renCount / expCount) * 100 : 0;
    var dollarRenewalPct = expValue > 0 ? (renValue / expValue) * 100 : 0;
    var nonRenewalPct = 100 - logoRenewalPct;
    var lostValue = Math.max(0, expValue - renValue);

    var elLogo = document.getElementById('output_logoRenewalRatePct');
    if (elLogo) elLogo.querySelector('.output-number').textContent = formatPercentage(logoRenewalPct);

    var elDollar = document.getElementById('output_dollarRenewalRatePct');
    if (elDollar) elDollar.querySelector('.output-number').textContent = formatPercentage(dollarRenewalPct);

    var elNon = document.getElementById('output_nonRenewalRatePct');
    if (elNon) elNon.querySelector('.output-number').textContent = formatPercentage(nonRenewalPct);

    var elLost = document.getElementById('output_lostRenewalValue');
    if (elLost) elLost.querySelector('.output-number').textContent = formatCurrency(lostValue);

    updateCharts({
      logoRenewalPct: logoRenewalPct,
      dollarRenewalPct: dollarRenewalPct
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        expiringContractsCount: expCount,
        renewedContractsCount: renCount,
        logoRenewalRatePct: logoRenewalPct.toFixed(2) + '%',
        dollarRenewalRatePct: dollarRenewalPct.toFixed(2) + '%'
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
        labels: ['Logo Renewal Rate (%)', 'Dollar / Revenue Renewal Rate (%)'],
        datasets: [{
          label: 'Renewal Rate %',
          data: [data.logoRenewalPct, data.dollarRenewalPct],
          backgroundColor: ['#2563eb', '#16a34a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Logo vs. Dollar Renewal Rate Comparison', font: { size: 14 } }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function(v) { return v + '%'; }
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
    document.getElementById('input_expiringContractsCount').value = 50;
    document.getElementById('input_renewedContractsCount').value = 42;
    document.getElementById('input_expiringContractsValue').value = 500000;
    document.getElementById('input_renewedContractsValue').value = 450000;
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
