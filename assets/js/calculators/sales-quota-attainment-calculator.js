/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Sales Quota Attainment Calculator
   Tool ID: sales-quota-attainment-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'doughnut';

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
      achieved: parseFloat(document.getElementById('input_achieved_sales')?.value) || 0,
      quota: parseFloat(document.getElementById('input_sales_quota')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var achieved = inputs.achieved;
    var quota = inputs.quota;
    var attainment = quota > 0 ? (achieved / quota) * 100 : 0;
    var remaining = Math.max(0, quota - achieved);

    setOutputText('quota_attainment', attainment.toFixed(2) + '%');
    setOutputText('output_quota_attainment', attainment.toFixed(2) + '%');

    updateCharts({
      achieved: achieved,
      quota: quota,
      remaining: remaining,
      attainment: attainment
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        achievedSales: achieved,
        salesQuota: quota,
        quotaAttainment: attainment.toFixed(2) + '%'
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
          labels: ['Achieved Sales', 'Sales Quota'],
          datasets: [{
            label: 'Amount ($)',
            data: [data.achieved, data.quota],
            backgroundColor: ['#10b981', '#64748b']
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
          labels: ['Achieved', 'Remaining'],
          datasets: [{
            data: [data.achieved, data.remaining],
            backgroundColor: ['#10b981', '#e2e8f0']
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
    var a = document.getElementById('input_achieved_sales');
    var q = document.getElementById('input_sales_quota');
    if (a) a.value = '750000';
    if (q) q.value = '1000000';
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
