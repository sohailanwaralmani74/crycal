/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Seat-Based Churn Calculator
   Tool ID: seat-based-churn-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'overview';

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
      startSeats: parseFloat(document.getElementById('input_start_seats')?.value) || 0,
      addedSeats: parseFloat(document.getElementById('input_added_seats')?.value) || 0,
      endSeats: parseFloat(document.getElementById('input_end_seats')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var startSeats = inputs.startSeats;
    var addedSeats = inputs.addedSeats;
    var endSeats = inputs.endSeats;

    var expectedSeats = startSeats + addedSeats;
    var churnedSeats = Math.max(0, expectedSeats - endSeats);
    var churnRate = startSeats > 0 ? (churnedSeats / startSeats) * 100 : 0;
    var netGrowth = addedSeats - churnedSeats;

    setOutputText('churned_seats', churnedSeats.toFixed(0));
    setOutputText('output_churned_seats', churnedSeats.toFixed(0));
    setOutputText('seat_churn_rate', churnRate.toFixed(2) + '%');
    setOutputText('output_seat_churn_rate', churnRate.toFixed(2) + '%');
    setOutputText('net_seat_growth', netGrowth.toFixed(0));
    setOutputText('output_net_seat_growth', netGrowth.toFixed(0));

    updateCharts({
      startSeats: startSeats,
      addedSeats: addedSeats,
      churnedSeats: churnedSeats,
      endSeats: endSeats,
      netGrowth: netGrowth
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        startSeats: startSeats,
        addedSeats: addedSeats,
        endSeats: endSeats,
        churnedSeats: churnedSeats,
        churnRate: churnRate.toFixed(2) + '%',
        netGrowth: netGrowth
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
          labels: ['Start Seats', 'End Seats', 'Net Growth'],
          datasets: [{
            label: 'Seat Counts',
            data: [data.startSeats, data.endSeats, data.netGrowth],
            backgroundColor: ['#64748b', '#3b82f6', data.netGrowth >= 0 ? '#10b981' : '#ef4444']
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
          labels: ['Added Seats', 'Churned Seats'],
          datasets: [{
            label: 'Seat Changes',
            data: [data.addedSeats, data.churnedSeats],
            backgroundColor: ['#3498db', '#e74c3c']
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
    var startEl = document.getElementById('input_start_seats');
    var addEl = document.getElementById('input_added_seats');
    var endEl = document.getElementById('input_end_seats');
    if (startEl) startEl.value = '1000';
    if (addEl) addEl.value = '150';
    if (endEl) endEl.value = '1050';
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
