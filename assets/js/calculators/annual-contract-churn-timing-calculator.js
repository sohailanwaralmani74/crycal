/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Annual Contract Churn Timing Calculator
   Tool ID: annual-contract-churn-timing-calculator
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
      totalChurned: parseFloat(document.getElementById('input_total_churned')?.value) || 0,
      earlyChurn: parseFloat(document.getElementById('input_month_1_to_3')?.value) || 0,
      renewalChurn: parseFloat(document.getElementById('input_month_11_to_12')?.value) || 0
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var totalChurned = inputs.totalChurned;
    var earlyChurn = inputs.earlyChurn;
    var renewalChurn = inputs.renewalChurn;

    var validEarly = Math.min(earlyChurn, totalChurned);
    var validRenewal = Math.min(renewalChurn, totalChurned - validEarly);
    var midTermChurn = Math.max(0, totalChurned - validEarly - validRenewal);

    var earlyRate = totalChurned > 0 ? (validEarly / totalChurned) * 100 : 0;
    var midTermRate = totalChurned > 0 ? (midTermChurn / totalChurned) * 100 : 0;
    var renewalRate = totalChurned > 0 ? (validRenewal / totalChurned) * 100 : 0;

    setOutputText('early_churn_rate', earlyRate.toFixed(2) + '%');
    setOutputText('output_early_churn_rate', earlyRate.toFixed(2) + '%');
    setOutputText('mid_term_churn_rate', midTermRate.toFixed(2) + '%');
    setOutputText('output_mid_term_churn_rate', midTermRate.toFixed(2) + '%');
    setOutputText('renewal_churn_rate', renewalRate.toFixed(2) + '%');
    setOutputText('output_renewal_churn_rate', renewalRate.toFixed(2) + '%');

    updateCharts({
      early: validEarly,
      mid: midTermChurn,
      late: validRenewal,
      earlyRate: earlyRate,
      midRate: midTermRate,
      lateRate: renewalRate
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalChurned: totalChurned,
        earlyChurn: validEarly,
        renewalChurn: validRenewal,
        earlyRate: earlyRate.toFixed(2) + '%',
        renewalRate: renewalRate.toFixed(2) + '%'
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
          labels: ['Early (1-3 Mo)', 'Mid-Term (4-10 Mo)', 'Renewal (11-12 Mo)'],
          datasets: [{
            label: 'Churn %',
            data: [data.earlyRate, data.midRate, data.lateRate],
            backgroundColor: ['#e74c3c', '#f1c40f', '#3498db']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    } else {
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Early (Months 1-3)', 'Mid-Term (4-10)', 'Renewal (11-12)'],
          datasets: [{
            data: [data.early, data.mid, data.late],
            backgroundColor: ['#e74c3c', '#f1c40f', '#3498db']
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
    var totalEl = document.getElementById('input_total_churned');
    var earlyEl = document.getElementById('input_month_1_to_3');
    var renEl = document.getElementById('input_month_11_to_12');
    if (totalEl) totalEl.value = '100';
    if (earlyEl) earlyEl.value = '15';
    if (renEl) renEl.value = '70';
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
