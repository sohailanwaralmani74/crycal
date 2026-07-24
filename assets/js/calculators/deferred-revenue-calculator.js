/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Deferred Revenue Calculator
   Tool ID: deferred-revenue-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'burndown';

  function getInputs() {
    return {
      annualBillingAmount: parseFloat(document.getElementById('input_annualBillingAmount').value) || 0,
      billingPeriodMonths: parseFloat(document.getElementById('input_billingPeriodMonths').value) || 12,
      monthsElapsed: parseFloat(document.getElementById('input_monthsElapsed').value) || 0
    };
  }

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

  function formatPercentage(value) {
    return value.toFixed(1) + '%';
  }

  function updateTool() {
    var inputs = getInputs();
    var upfront = inputs.annualBillingAmount;
    var duration = Math.max(1, inputs.billingPeriodMonths);
    var elapsed = Math.min(duration, Math.max(0, inputs.monthsElapsed));

    var monthlyEarned = upfront / duration;
    var cumulativeEarned = monthlyEarned * elapsed;
    var remainingDeferred = Math.max(0, upfront - cumulativeEarned);
    var recognizedPct = upfront > 0 ? (cumulativeEarned / upfront) * 100 : 0;

    var elRemaining = document.getElementById('output_remainingDeferredRevenue');
    if (elRemaining) elRemaining.querySelector('.output-number').textContent = formatCurrency(remainingDeferred);

    var elMonthly = document.getElementById('output_monthlyEarnedRevenue');
    if (elMonthly) elMonthly.querySelector('.output-number').textContent = formatCurrency(monthlyEarned);

    var elCum = document.getElementById('output_cumulativeEarnedRevenue');
    if (elCum) elCum.querySelector('.output-number').textContent = formatCurrency(cumulativeEarned);

    var elPct = document.getElementById('output_recognizedPct');
    if (elPct) elPct.querySelector('.output-number').textContent = formatPercentage(recognizedPct);

    updateCharts({
      upfront: upfront,
      duration: duration,
      monthlyEarned: monthlyEarned
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        annualBillingAmount: upfront,
        monthsElapsed: elapsed,
        remainingDeferredRevenue: remainingDeferred,
        monthlyEarnedRevenue: monthlyEarned
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

    var labels = [];
    var deferredData = [];
    var cumulativeData = [];
    var cum = 0;

    for (var m = 0; m <= data.duration; m++) {
      labels.push('Mo ' + m);
      var rem = Math.max(0, data.upfront - (data.monthlyEarned * m));
      deferredData.push(rem);
      cumulativeData.push(Math.min(data.upfront, data.monthlyEarned * m));
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Remaining Deferred Revenue ($)',
            data: deferredData,
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            fill: true,
            tension: 0.2
          },
          {
            label: 'Cumulative Recognized Revenue ($)',
            data: cumulativeData,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            fill: true,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Deferred Revenue Balance Burndown vs Cumulative Recognized Revenue', font: { size: 14 } }
        },
        scales: {
          y: {
            ticks: {
              callback: function(v) { return '$' + v.toLocaleString(); }
            }
          }
        }
      }
    });
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    updateTool();
  }

  function resetTool() {
    document.getElementById('input_annualBillingAmount').value = 120000;
    document.getElementById('input_billingPeriodMonths').value = 12;
    document.getElementById('input_monthsElapsed').value = 4;
    updateTool();
  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      el.addEventListener('input', updateTool);
      el.addEventListener('change', updateTool);
    });
    setTimeout(updateTool, 150);
  });
})();
