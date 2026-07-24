/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Sales Cycle Cost Calculator
   Tool ID: sales-cycle-cost-calculator
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
      length: parseFloat(document.getElementById('input_cycle_length')?.value) || 0,
      aeCost: parseFloat(document.getElementById('input_ae_cost')?.value) || 0,
      sdrCost: parseFloat(document.getElementById('input_sdr_cost')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var length = inputs.length;
    var ae = inputs.aeCost;
    var sdr = inputs.sdrCost;

    var totalCost = length * (ae + sdr);
    var monthlyRunRate = length > 0 ? (totalCost / length) * 30 : 0;

    setOutputText('total_cost', formatCurrency(totalCost));
    setOutputText('output_total_cost', formatCurrency(totalCost));
    setOutputText('monthly_run_rate', formatCurrency(monthlyRunRate));
    setOutputText('output_monthly_run_rate', formatCurrency(monthlyRunRate));

    updateCharts({
      length: length,
      aeTotal: length * ae,
      sdrTotal: length * sdr,
      totalCost: totalCost
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        cycleLengthDays: length,
        aeDailyCost: ae,
        sdrDailyCost: sdr,
        totalCost: formatCurrency(totalCost)
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
          labels: ['AE Total Cost', 'SDR Total Cost'],
          datasets: [{
            label: 'Cost ($)',
            data: [data.aeTotal, data.sdrTotal],
            backgroundColor: ['#10b981', '#f59e0b']
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
        type: 'doughnut',
        data: {
          labels: ['AE Total Cost', 'SDR Total Cost'],
          datasets: [{
            data: [data.aeTotal, data.sdrTotal],
            backgroundColor: ['#10b981', '#f59e0b']
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
    var l = document.getElementById('input_cycle_length');
    var a = document.getElementById('input_ae_cost');
    var s = document.getElementById('input_sdr_cost');
    if (l) l.value = '90';
    if (a) a.value = '500';
    if (s) s.value = '200';
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
