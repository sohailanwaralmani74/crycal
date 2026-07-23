(function() {
  var chartInstance = null;
  var currentTab = 'comparison';
  var lastChartData = null;

  function getInputs() {
    return {
      activeAccounts: parseFloat(document.getElementById('input_activeAccounts').value) || 0,
      avgSeatsPerAccount: parseFloat(document.getElementById('input_avgSeatsPerAccount').value) || 0,
      pricePerSeatMonthly: parseFloat(document.getElementById('input_pricePerSeatMonthly').value) || 0,
      avgMonthlyUnitsPerAccount: parseFloat(document.getElementById('input_avgMonthlyUnitsPerAccount').value) || 0,
      pricePerUsageUnit: parseFloat(document.getElementById('input_pricePerUsageUnit').value) || 0,
      annualSeatGrowth: (parseFloat(document.getElementById('input_annualSeatGrowth').value) || 0) / 100,
      annualUsageGrowth: (parseFloat(document.getElementById('input_annualUsageGrowth').value) || 0) / 100
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(0);
    }
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateRevenue(inputs) {
    var totalSeats = inputs.activeAccounts * inputs.avgSeatsPerAccount;
    var perSeatMRR = totalSeats * inputs.pricePerSeatMonthly;
    var perSeatARR = perSeatMRR * 12;

    var totalUsageUnits = inputs.activeAccounts * inputs.avgMonthlyUnitsPerAccount;
    var usageMRR = totalUsageUnits * inputs.pricePerUsageUnit;
    var usageARR = usageMRR * 12;

    var deltaARR = usageARR - perSeatARR;
    var winnerModel = usageARR > perSeatARR ? 'Usage-Based Pricing' : (perSeatARR > usageARR ? 'Per-Seat Pricing' : 'Equal Yield');

    var monthLabels = [];
    var seatTimeline = [];
    var usageTimeline = [];

    for (var m = 1; m <= 12; m++) {
      monthLabels.push('M' + m);
      var seatGrowthFactor = 1 + (inputs.annualSeatGrowth * ((m - 1) / 12));
      var usageGrowthFactor = 1 + (inputs.annualUsageGrowth * ((m - 1) / 12));

      seatTimeline.push(perSeatMRR * seatGrowthFactor);
      usageTimeline.push(usageMRR * usageGrowthFactor);
    }

    return {
      perSeatMRR: perSeatMRR,
      perSeatARR: perSeatARR,
      usageMRR: usageMRR,
      usageARR: usageARR,
      deltaARR: deltaARR,
      winnerModel: winnerModel,
      monthLabels: monthLabels,
      seatTimeline: seatTimeline,
      usageTimeline: usageTimeline
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateRevenue(inputs);

    setOutputText('output_perSeatMRR', formatCurrency(res.perSeatMRR));
    setOutputText('output_perSeatARR', formatCurrency(res.perSeatARR));
    setOutputText('output_usageMRR', formatCurrency(res.usageMRR));
    setOutputText('output_usageARR', formatCurrency(res.usageARR));
    setOutputText('output_revenueDifference', (res.deltaARR >= 0 ? '+' : '') + formatCurrency(res.deltaARR));
    setOutputText('output_winnerModel', res.winnerModel);

    lastChartData = res;
    updateCharts(res);
  }

  function updateCharts(data) {
    var canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data) return;

    if (currentTab === 'comparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Per-Seat Model', 'Usage-Based Model'],
          datasets: [
            {
              label: 'MRR ($)',
              data: [data.perSeatMRR, data.usageMRR],
              backgroundColor: '#4A90D9',
              borderRadius: 4
            },
            {
              label: 'ARR ($)',
              data: [data.perSeatARR, data.usageARR],
              backgroundColor: '#4ade80',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: 'Current Revenue Comparison', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'projection') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [
            {
              label: 'Per-Seat MRR',
              data: data.seatTimeline,
              borderColor: '#4A90D9',
              backgroundColor: 'rgba(74, 144, 217, 0.1)',
              fill: true,
              tension: 0.2
            },
            {
              label: 'Usage-Based MRR',
              data: data.usageTimeline,
              borderColor: '#4ade80',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              fill: true,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: '12-Month MRR Growth Trajectory', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    }
  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) updateCharts(lastChartData);
  }

  function resetTool() {
    document.getElementById('input_activeAccounts').value = 100;
    document.getElementById('input_avgSeatsPerAccount').value = 15;
    document.getElementById('input_pricePerSeatMonthly').value = 30;
    document.getElementById('input_avgMonthlyUnitsPerAccount').value = 5000;
    document.getElementById('input_pricePerUsageUnit').value = 0.08;
    document.getElementById('input_annualSeatGrowth').value = 15;
    document.getElementById('input_annualUsageGrowth').value = 30;
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
