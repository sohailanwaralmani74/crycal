/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Sales Funnel Conversion Calculator
   Tool ID: sales-funnel-conversion-calculator
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
      visitors: parseFloat(document.getElementById('input_visitors')?.value) || 0,
      leads: parseFloat(document.getElementById('input_leads')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var visitors = inputs.visitors;
    var leads = Math.min(inputs.leads, visitors);
    var rate = visitors > 0 ? (leads / visitors) * 100 : 0;

    setOutputText('conversion_rate', rate.toFixed(2) + '%');
    setOutputText('output_conversion_rate', rate.toFixed(2) + '%');

    updateCharts({
      visitors: visitors,
      leads: leads,
      rate: rate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        visitors: visitors,
        leads: leads,
        conversionRate: rate.toFixed(2) + '%'
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

    if (currentTab === 'pie' || currentTab === 'doughnut') {
      var nonLeads = Math.max(0, data.visitors - data.leads);
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Converted Leads', 'Non-Converted Visitors'],
          datasets: [{
            data: [data.leads, nonLeads],
            backgroundColor: ['#10b981', '#cbd5e1']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Visitors', 'Generated Leads'],
          datasets: [{
            label: 'Count',
            data: [data.visitors, data.leads],
            backgroundColor: ['#3b82f6', '#10b981']
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
    var v = document.getElementById('input_visitors');
    var l = document.getElementById('input_leads');
    if (v) v.value = '10000';
    if (l) l.value = '500';
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
