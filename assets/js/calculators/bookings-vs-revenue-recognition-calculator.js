/* ═══════════════════════════════════════════════════════════
   CRYCAL — Bookings vs Revenue Recognition Calculator
   Tool ID: bookings-vs-revenue-recognition-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'schedule';

  function getInputs() {
    return {
      contractAcv: parseFloat(document.getElementById('input_contractAcv').value) || 0,
      contractTermMonths: parseFloat(document.getElementById('input_contractTermMonths').value) || 12,
      upfrontPaymentPct: parseFloat(document.getElementById('input_upfrontPaymentPct').value) || 100
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

  function updateTool() {
    var inputs = getInputs();
    var acv = inputs.contractAcv;
    var term = Math.max(1, inputs.contractTermMonths);
    var upfrontPct = inputs.upfrontPaymentPct;

    var monthlyRevenue = acv / term;
    var cashCollected = acv * (upfrontPct / 100);
    var initialDeferred = Math.max(0, cashCollected - monthlyRevenue);

    var elBookings = document.getElementById('output_totalBookings');
    if (elBookings) elBookings.querySelector('.output-number').textContent = formatCurrency(acv);

    var elMonthly = document.getElementById('output_monthlyRecognizedRevenue');
    if (elMonthly) elMonthly.querySelector('.output-number').textContent = formatCurrency(monthlyRevenue);

    var elCash = document.getElementById('output_upfrontCashCollected');
    if (elCash) elCash.querySelector('.output-number').textContent = formatCurrency(cashCollected);

    var elDeferred = document.getElementById('output_initialDeferredRevenue');
    if (elDeferred) elDeferred.querySelector('.output-number').textContent = formatCurrency(initialDeferred);

    updateCharts({
      term: term,
      monthlyRevenue: monthlyRevenue,
      cashCollected: cashCollected
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        contractAcv: acv,
        contractTermMonths: term,
        monthlyRecognizedRevenue: monthlyRevenue,
        upfrontCashCollected: cashCollected
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

    var months = [];
    var recRevData = [];
    var cashData = [];
    var cumRecData = [];
    var cumRec = 0;

    for (var i = 1; i <= data.term; i++) {
      months.push('Mo ' + i);
      recRevData.push(data.monthlyRevenue);
      cashData.push(i === 1 ? data.cashCollected : 0);
      cumRec += data.monthlyRevenue;
      cumRecData.push(cumRec);
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Monthly Recognized Revenue ($)',
            data: recRevData,
            backgroundColor: '#2563eb'
          },
          {
            label: 'Cash Inflow ($)',
            data: cashData,
            backgroundColor: '#16a34a'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Monthly ASC 606 Recognized Revenue vs. Cash Billings', font: { size: 14 } }
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
    document.getElementById('input_contractAcv').value = 120000;
    document.getElementById('input_contractTermMonths').value = 12;
    document.getElementById('input_upfrontPaymentPct').value = 100;
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
