/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Time-To-Value Calculator
   Tool ID: time-to-value-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'pie';

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
      onboarding: parseFloat(document.getElementById('input_onboarding_days')?.value) || 0,
      implementation: parseFloat(document.getElementById('input_implementation_days')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var onboarding = inputs.onboarding;
    var implementation = inputs.implementation;

    var ttv = onboarding + implementation;

    setOutputText('ttv', ttv.toFixed(0) + ' Days');
    setOutputText('output_ttv', ttv.toFixed(0) + ' Days');

    updateCharts({
      onboarding: onboarding,
      implementation: implementation,
      ttv: ttv
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        onboardingDays: onboarding,
        implementationDays: implementation,
        timeToValueDays: ttv
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
          labels: ['Onboarding Phase', 'Implementation Phase', 'Total TTV'],
          datasets: [{
            label: 'Days',
            data: [data.onboarding, data.implementation, data.ttv],
            backgroundColor: ['#3b82f6', '#10b981', '#6366f1']
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
          labels: ['Onboarding', 'Implementation'],
          datasets: [{
            data: [data.onboarding, data.implementation],
            backgroundColor: ['#3b82f6', '#10b981']
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
    var o = document.getElementById('input_onboarding_days');
    var i = document.getElementById('input_implementation_days');
    if (o) o.value = '7';
    if (i) i.value = '14';
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
