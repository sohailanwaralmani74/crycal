/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Win Rate Calculator
   Tool ID: win-rate-calculator
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
      wonDeals: parseFloat(document.getElementById('input_won_deals')?.value) || 0,
      totalOpp: parseFloat(document.getElementById('input_total_opportunities')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var wonDeals = inputs.wonDeals;
    var totalOpp = inputs.totalOpp;
    var validWon = Math.min(wonDeals, totalOpp);
    var lostDeals = Math.max(0, totalOpp - validWon);
    var winRate = totalOpp > 0 ? (validWon / totalOpp) * 100 : 0;

    setOutputText('win_rate', winRate.toFixed(2) + '%');
    setOutputText('output_win_rate', winRate.toFixed(2) + '%');

    updateCharts({
      won: validWon,
      lost: lostDeals,
      winRate: winRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        wonDeals: validWon,
        totalOpportunities: totalOpp,
        winRate: winRate.toFixed(2) + '%'
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
          labels: ['Won Deals', 'Lost Deals'],
          datasets: [{
            label: 'Opportunities',
            data: [data.won, data.lost],
            backgroundColor: ['#10b981', '#ef4444']
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
          labels: ['Won Deals', 'Lost Deals'],
          datasets: [{
            data: [data.won, data.lost],
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
    var w = document.getElementById('input_won_deals');
    var t = document.getElementById('input_total_opportunities');
    if (w) w.value = '25';
    if (t) t.value = '100';
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
