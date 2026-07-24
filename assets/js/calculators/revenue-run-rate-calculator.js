/* ═══════════════════════════════════════════════════════════
   Wanjaaro — Revenue Run Rate Calculator
   Tool ID: revenue-run-rate-calculator
═══════════════════════════════════════════════════════════ */

(function() {
  var chartInstance = null;
  var currentTab = 'projection';

  function getInputs() {
    return {
      inputRevenue: parseFloat(document.getElementById('input_inputRevenue').value) || 0,
      periodType: document.getElementById('input_periodType').value || 'monthly',
      monthlyGrowthRatePct: parseFloat(document.getElementById('input_monthlyGrowthRatePct').value) || 0
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

  function formatMultiplier(value) {
    return value.toFixed(2) + 'x';
  }

  function updateTool() {
    var inputs = getInputs();
    var rev = inputs.inputRevenue;
    var period = inputs.periodType;
    var monthlyGrowthDec = inputs.monthlyGrowthRatePct / 100;

    var baseMonthly = period === 'quarterly' ? rev / 3 : rev;
    var currentArr = baseMonthly * 12;

    var totalProjected12Mo = 0;
    var monthlySeries = [];
    var currentMonthRev = baseMonthly;

    for (var m = 1; m <= 12; m++) {
      if (m > 1) {
        currentMonthRev = currentMonthRev * (1 + monthlyGrowthDec);
      }
      monthlySeries.push(currentMonthRev);
      totalProjected12Mo += currentMonthRev;
    }

    var exitArr = currentMonthRev * 12;
    var growthMultiplier = currentArr > 0 ? exitArr / currentArr : 1;

    var elArr = document.getElementById('output_currentArrRunRate');
    if (elArr) elArr.querySelector('.output-number').textContent = formatCurrency(currentArr);

    var elProj = document.getElementById('output_projected12MoRevenue');
    if (elProj) elProj.querySelector('.output-number').textContent = formatCurrency(totalProjected12Mo);

    var elExit = document.getElementById('output_projectedExitArr');
    if (elExit) elExit.querySelector('.output-number').textContent = formatCurrency(exitArr);

    var elMult = document.getElementById('output_annualGrowthMultiplier');
    if (elMult) elMult.querySelector('.output-number').textContent = formatMultiplier(growthMultiplier);

    updateCharts({
      baseMonthly: baseMonthly,
      monthlySeries: monthlySeries
    });

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        inputRevenue: rev,
        periodType: period,
        currentArrRunRate: currentArr,
        projected12MoRevenue: totalProjected12Mo
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
    var arrRunRateSeries = [];

    for (var i = 0; i < data.monthlySeries.length; i++) {
      labels.push('Mo ' + (i + 1));
      arrRunRateSeries.push(data.monthlySeries[i] * 12);
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Projected ARR Run Rate ($)',
            data: arrRunRateSeries,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Projected 12-Month ARR Run Rate Trajectory', font: { size: 14 } }
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
    document.getElementById('input_inputRevenue').value = 50000;
    document.getElementById('input_periodType').value = 'monthly';
    document.getElementById('input_monthlyGrowthRatePct').value = 5;
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
