/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Channel Partner Sales Split Calculator
   Tool ID: channel-partner-sales-split-calculator
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
      deal: parseFloat(document.getElementById('input_total_deal_size')?.value) || 0,
      margin: parseFloat(document.getElementById('input_partner_margin')?.value) || 0,
      cost: parseFloat(document.getElementById('input_internal_cost')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var deal = inputs.deal;
    var margin = inputs.margin;
    var cost = inputs.cost;

    var payout = deal * (margin / 100);
    var net = deal - payout - cost;

    setOutputText('partner_payout', formatCurrency(payout));
    setOutputText('output_partner_payout', formatCurrency(payout));
    setOutputText('net_revenue', formatCurrency(net));
    setOutputText('output_net_revenue', formatCurrency(net));

    updateCharts({
      deal: deal,
      payout: payout,
      cost: cost,
      net: net
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalDealSize: deal,
        partnerMargin: margin + '%',
        partnerPayout: formatCurrency(payout),
        internalCost: formatCurrency(cost),
        netRevenue: formatCurrency(net)
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
          labels: ['Net Revenue', 'Partner Payout', 'Internal Cost'],
          datasets: [{
            label: 'Distribution ($)',
            data: [Math.max(0, data.net), data.payout, data.cost],
            backgroundColor: ['#10b981', '#3b82f6', '#ef4444']
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
          labels: ['Net Revenue', 'Partner Payout', 'Internal Cost'],
          datasets: [{
            data: [Math.max(0, data.net), data.payout, data.cost],
            backgroundColor: ['#10b981', '#3b82f6', '#ef4444']
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
    var d = document.getElementById('input_total_deal_size');
    var m = document.getElementById('input_partner_margin');
    var c = document.getElementById('input_internal_cost');
    if (d) d.value = '50000';
    if (m) m.value = '20';
    if (c) c.value = '5000';
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
