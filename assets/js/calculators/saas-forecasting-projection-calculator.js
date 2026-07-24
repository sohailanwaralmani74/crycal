/* ═══════════════════════════════════════════════════════════
   Wanjaaro — SaaS Revenue Forecasting & Projection Calculator
   Tool ID: saas-forecasting-projection-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'forecast';

  function getInputs() {
    return {
      currentMrr: parseFloat(document.getElementById('input_currentMrr').value) || 0,
      newMrrPerMonth: parseFloat(document.getElementById('input_newMrrPerMonth').value) || 0,
      monthlyExpansionRatePct: parseFloat(document.getElementById('input_monthlyExpansionRatePct').value) || 0,
      monthlyChurnRatePct: parseFloat(document.getElementById('input_monthlyChurnRatePct').value) || 0,
      forecastYears: parseFloat(document.getElementById('input_forecastYears').value) || 3
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
    var startMrr = inputs.currentMrr;
    var newMrr = inputs.newMrrPerMonth;
    var expDec = inputs.monthlyExpansionRatePct / 100;
    var churnDec = inputs.monthlyChurnRatePct / 100;
    var years = Math.max(1, Math.min(5, inputs.forecastYears));
    var totalMonths = years * 12;

    var monthlyMrrSeries = [startMrr];
    var cumulativeRevenue = 0;
    var currentMrr = startMrr;

    var yr1Arr = 0;
    var yr2Arr = 0;
    var yr3Arr = 0;

    for (var m = 1; m <= totalMonths; m++) {
      var expansion = currentMrr * expDec;
      var churn = currentMrr * churnDec;
      currentMrr = currentMrr + newMrr + expansion - churn;
      monthlyMrrSeries.push(currentMrr);
      cumulativeRevenue += currentMrr;

      if (m === 12) yr1Arr = currentMrr * 12;
      if (m === 24) yr2Arr = currentMrr * 12;
      if (m === 36) yr3Arr = currentMrr * 12;
    }

    if (totalMonths < 24) yr2Arr = yr1Arr;
    if (totalMonths < 36) yr3Arr = yr2Arr;

    var elYr1 = document.getElementById('output_yr1EndArr');
    if (elYr1) elYr1.querySelector('.output-number').textContent = formatCurrency(yr1Arr);

    var elYr2 = document.getElementById('output_yr2EndArr');
    if (elYr2) elYr2.querySelector('.output-number').textContent = formatCurrency(yr2Arr);

    var elYr3 = document.getElementById('output_yr3EndArr');
    if (elYr3) elYr3.querySelector('.output-number').textContent = formatCurrency(yr3Arr);

    var elCum = document.getElementById('output_cumulativeRevenueEarned');
    if (elCum) elCum.querySelector('.output-number').textContent = formatCurrency(cumulativeRevenue);

    updateCharts({
      monthlyMrrSeries: monthlyMrrSeries,
      totalMonths: totalMonths
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentMrr: startMrr,
        newMrrPerMonth: newMrr,
        monthlyChurnRatePct: inputs.monthlyChurnRatePct + '%',
        yr1EndArr: yr1Arr,
        yr3EndArr: yr3Arr
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
    var arrSeries = [];

    for (var i = 0; i <= data.totalMonths; i++) {
      labels.push('Mo ' + i);
      arrSeries.push(data.monthlyMrrSeries[i] * 12);
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Forecast ARR ($)',
          data: arrSeries,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Multi-Year Annual Recurring Revenue (ARR) Forecast', font: { size: 14 } }
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
    document.getElementById('input_currentMrr').value = 50000;
    document.getElementById('input_newMrrPerMonth').value = 8000;
    document.getElementById('input_monthlyExpansionRatePct').value = 2;
    document.getElementById('input_monthlyChurnRatePct').value = 1.5;
    document.getElementById('input_forecastYears').value = 3;
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
