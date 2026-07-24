/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Average Deal Size Calculator
   Tool ID: average-deal-size-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'overview';

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

  function setOutputText(id, text) {
    var el = document.getElementById(id) || document.getElementById('output_' + id);
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = text;
      } else {
        var numEl = el.querySelector('.output-number');
        if (numEl) numEl.textContent = text;
        else el.textContent = text;
      }
    }
  }

  function getInputs() {
    return {
      totalRevenue: parseFloat(document.getElementById('input_total_revenue')?.value) || 0,
      deals: parseFloat(document.getElementById('input_number_of_deals')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var totalRevenue = inputs.totalRevenue;
    var deals = inputs.deals;
    var avgDealSize = deals > 0 ? totalRevenue / deals : 0;

    setOutputText('average_deal_size', formatCurrency(avgDealSize));
    setOutputText('output_average_deal_size', formatCurrency(avgDealSize));

    updateCharts({
      totalRevenue: totalRevenue,
      deals: deals,
      avgDealSize: avgDealSize
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalRevenue: totalRevenue,
        numberOfDeals: deals,
        averageDealSize: formatCurrency(avgDealSize)
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

    if (currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Your Avg Deal', 'SMB Avg ($5k)', 'Enterprise Avg ($50k)'],
          datasets: [{
            label: 'Deal Value ($)',
            data: [data.avgDealSize, 5000, 50000],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Average Deal Size'],
          datasets: [{
            label: 'Value ($)',
            data: [data.avgDealSize],
            backgroundColor: ['#3b82f6']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.chart-tab').forEach(function(t) {
      if ((t.dataset && t.dataset.tab === tabId) || (t.getAttribute('onclick') && t.getAttribute('onclick').indexOf(tabId) !== -1)) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    updateTool();
  }

  function resetTool() {
    var r = document.getElementById('input_total_revenue');
    var d = document.getElementById('input_number_of_deals');
    if (r) r.value = '500000';
    if (d) d.value = '50';
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select, input[id^="input_"]').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    updateTool();
  });
  setTimeout(updateTool, 100);
})();
