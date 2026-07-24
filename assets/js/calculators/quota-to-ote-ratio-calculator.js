/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Quota to OTE Ratio Calculator
   Tool ID: quota-to-ote-ratio-calculator
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
      quota: parseFloat(document.getElementById('input_annual_quota')?.value) || 0,
      ote: parseFloat(document.getElementById('input_annual_ote')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var quota = inputs.quota;
    var ote = inputs.ote;
    var ratio = ote > 0 ? quota / ote : 0;
    var commissionRate = quota > 0 ? ((ote / 2) / quota) * 100 : 0;

    setOutputText('quota_ote_ratio', ratio.toFixed(2) + 'x');
    setOutputText('output_quota_ote_ratio', ratio.toFixed(2) + 'x');
    setOutputText('commission_rate', commissionRate.toFixed(2) + '%');
    setOutputText('output_commission_rate', commissionRate.toFixed(2) + '%');

    updateCharts({
      quota: quota,
      ote: ote,
      ratio: ratio,
      commissionRate: commissionRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualQuota: quota,
        annualOte: ote,
        quotaOteRatio: ratio.toFixed(2) + 'x',
        effectiveCommissionRate: commissionRate.toFixed(2) + '%'
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
          labels: ['Annual Quota', 'Annual OTE'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.quota, data.ote],
            backgroundColor: ['#10b981', '#3b82f6']
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
          labels: ['OTE', 'Remaining Quota Beyond OTE'],
          datasets: [{
            data: [data.ote, Math.max(0, data.quota - data.ote)],
            backgroundColor: ['#3b82f6', '#e5e7eb']
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
    var q = document.getElementById('input_annual_quota');
    var o = document.getElementById('input_annual_ote');
    if (q) q.value = '1000000';
    if (o) o.value = '200000';
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
