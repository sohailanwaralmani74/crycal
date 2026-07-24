/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Pipeline Coverage Ratio Calculator
   Tool ID: pipeline-coverage-ratio-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'bar';

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
      pipeline: parseFloat(document.getElementById('input_pipeline_value')?.value) || 0,
      target: parseFloat(document.getElementById('input_sales_target')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var pipe = inputs.pipeline;
    var target = inputs.target;
    var ratio = target > 0 ? pipe / target : 0;

    setOutputText('coverage_ratio', ratio.toFixed(2) + 'x');
    setOutputText('output_coverage_ratio', ratio.toFixed(2) + 'x');

    updateCharts({
      pipeline: pipe,
      target: target,
      ratio: ratio
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        pipelineValue: pipe,
        salesTarget: target,
        coverageRatio: ratio.toFixed(2) + 'x'
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

    if (currentTab === 'benchmark') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Your Coverage', 'Industry Standard (3x)', 'Aggressive Target (5x)'],
          datasets: [{
            label: 'Ratio (x)',
            data: [data.ratio, 3, 5],
            backgroundColor: ['#17a2b8', '#ffc107', '#28a745']
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
          labels: ['Pipeline Value', 'Sales Target'],
          datasets: [{
            label: 'Value ($)',
            data: [data.pipeline, data.target],
            backgroundColor: ['#17a2b8', '#ffc107']
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
    var p = document.getElementById('input_pipeline_value');
    var t = document.getElementById('input_sales_target');
    if (p) p.value = '3000000';
    if (t) t.value = '1000000';
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
