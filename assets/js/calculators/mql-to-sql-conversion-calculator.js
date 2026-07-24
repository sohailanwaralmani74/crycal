/* ═══════════════════════════════════════════════════════════
   Wanjaaro — MQL to SQL Conversion Calculator
   Tool ID: mql-to-sql-conversion-calculator
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
      mqls: parseFloat(document.getElementById('input_mqls')?.value) || 0,
      sqls: parseFloat(document.getElementById('input_sqls')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var mqls = inputs.mqls;
    var sqls = Math.min(inputs.sqls, mqls);
    var dropoff = Math.max(0, mqls - sqls);
    var rate = mqls > 0 ? (sqls / mqls) * 100 : 0;

    setOutputText('conversion_rate', rate.toFixed(2) + '%');
    setOutputText('output_conversion_rate', rate.toFixed(2) + '%');

    updateCharts({
      mqls: mqls,
      sqls: sqls,
      dropoff: dropoff,
      rate: rate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        mqls: mqls,
        sqls: sqls,
        mqlToSqlRate: rate.toFixed(2) + '%'
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
          labels: ['Total MQLs', 'Converted SQLs'],
          datasets: [{
            label: 'Leads',
            data: [data.mqls, data.sqls],
            backgroundColor: ['#6c757d', '#007bff']
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
          labels: ['Converted to SQL', 'Dropped / Unqualified'],
          datasets: [{
            data: [data.sqls, data.dropoff],
            backgroundColor: ['#007bff', '#6c757d']
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
    var m = document.getElementById('input_mqls');
    var s = document.getElementById('input_sqls');
    if (m) m.value = '500';
    if (s) s.value = '100';
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
