/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Demo to Close Conversion Calculator
   Tool ID: demo-to-close-conversion-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';

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
      demos: parseFloat(document.getElementById('input_demos_held')?.value) || 0,
      closed: parseFloat(document.getElementById('input_deals_closed')?.value) || 0,
      avgSize: parseFloat(document.getElementById('input_avg_deal_size')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var demos = inputs.demos;
    var closed = Math.min(inputs.closed, demos);
    var avgSize = inputs.avgSize;

    var rate = demos > 0 ? (closed / demos) * 100 : 0;
    var revenue = closed * avgSize;
    var lostDemos = Math.max(0, demos - closed);

    setOutputText('conversion_rate', rate.toFixed(2) + '%');
    setOutputText('output_conversion_rate', rate.toFixed(2) + '%');
    setOutputText('pipeline_value', formatCurrency(revenue));
    setOutputText('output_pipeline_value', formatCurrency(revenue));

    updateCharts({
      demos: demos,
      closed: closed,
      lostDemos: lostDemos,
      rate: rate,
      revenue: revenue
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        demosHeld: demos,
        dealsClosed: closed,
        avgDealSize: formatCurrency(avgSize),
        conversionRate: rate.toFixed(2) + '%',
        totalRevenue: formatCurrency(revenue)
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

    if (currentTab === 'bar' || currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Demos Held', 'Deals Closed'],
          datasets: [{
            label: 'Count',
            data: [data.demos, data.closed],
            backgroundColor: ['#3b82f6', '#10b981']
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
        type: 'pie',
        data: {
          labels: ['Closed Won', 'Lost / Open Demos'],
          datasets: [{
            data: [data.closed, data.lostDemos],
            backgroundColor: ['#10b981', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
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
    var d = document.getElementById('input_demos_held');
    var c = document.getElementById('input_deals_closed');
    var a = document.getElementById('input_avg_deal_size');
    if (d) d.value = '100';
    if (c) c.value = '20';
    if (a) a.value = '10000';
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
