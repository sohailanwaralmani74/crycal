/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Lead to Customer Conversion Calculator
   Tool ID: lead-to-customer-conversion-calculator
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
      leads: parseFloat(document.getElementById('input_total_leads')?.value) || 0,
      customers: parseFloat(document.getElementById('input_new_customers')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var leads = inputs.leads;
    var customers = Math.min(inputs.customers, leads);
    var lostLeads = Math.max(0, leads - customers);
    var rate = leads > 0 ? (customers / leads) * 100 : 0;

    setOutputText('l2c_rate', rate.toFixed(2) + '%');
    setOutputText('output_l2c_rate', rate.toFixed(2) + '%');

    updateCharts({
      leads: leads,
      customers: customers,
      lostLeads: lostLeads,
      rate: rate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalLeads: leads,
        newCustomers: customers,
        leadToCustomerRate: rate.toFixed(2) + '%'
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
          labels: ['Total Leads', 'Converted Customers'],
          datasets: [{
            label: 'Count',
            data: [data.leads, data.customers],
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
          labels: ['Converted Customers', 'Unconverted Leads'],
          datasets: [{
            data: [data.customers, data.lostLeads],
            backgroundColor: ['#10b981', '#94a3b8']
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
    var l = document.getElementById('input_total_leads');
    var c = document.getElementById('input_new_customers');
    if (l) l.value = '500';
    if (c) c.value = '25';
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
