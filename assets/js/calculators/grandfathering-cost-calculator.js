(function() {
  var chartInstance = null;
  var currentTab = 'cumulativeOpportunityCost';
  var lastChartData = null;

  function getInputs() {
    return {
      grandfatheredCustomers: parseFloat(document.getElementById('input_grandfatheredCustomers').value) || 0,
      legacyPrice: parseFloat(document.getElementById('input_legacyPrice').value) || 0,
      newPrice: parseFloat(document.getElementById('input_newPrice').value) || 0,
      grandfatheringDurationMonths: parseFloat(document.getElementById('input_grandfatheringDurationMonths').value) || 0,
      estimatedChurnIfPriceRaised: (parseFloat(document.getElementById('input_estimatedChurnIfPriceRaised').value) || 0) / 100
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

  function formatPercent(val) {
    return (val * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateGrandfathering(inputs) {
    var priceDelta = Math.max(0, inputs.newPrice - inputs.legacyPrice);
    var monthlyUnrealizedRevenue = inputs.grandfatheredCustomers * priceDelta;
    var annualGrandfatheringCost = monthlyUnrealizedRevenue * 12;

    var totalDurationCost = monthlyUnrealizedRevenue * inputs.grandfatheringDurationMonths;

    var retainedMigrated = inputs.grandfatheredCustomers * (1 - inputs.estimatedChurnIfPriceRaised);
    var netRevenueIfPriceRaised = retainedMigrated * inputs.newPrice;
    var baselineLegacyMRR = inputs.grandfatheredCustomers * inputs.legacyPrice;
    var netMRRDeltaFromHike = netRevenueIfPriceRaised - baselineLegacyMRR;

    var breakevenChurnRate = inputs.newPrice > 0 ? (priceDelta / inputs.newPrice) : 0;

    // Timeline for cumulative opportunity cost
    var monthLabels = [];
    var cumulativeTimeline = [];
    var runningSum = 0;
    var maxMonths = Math.min(60, inputs.grandfatheringDurationMonths);

    for (var m = 1; m <= maxMonths; m++) {
      monthLabels.push('M' + m);
      runningSum += monthlyUnrealizedRevenue;
      cumulativeTimeline.push(runningSum);
    }

    return {
      monthlyUnrealizedRevenue: monthlyUnrealizedRevenue,
      annualGrandfatheringCost: annualGrandfatheringCost,
      totalDurationCost: totalDurationCost,
      breakevenChurnRate: breakevenChurnRate,
      baselineLegacyMRR: baselineLegacyMRR,
      netRevenueIfPriceRaised: netRevenueIfPriceRaised,
      netMRRDeltaFromHike: netMRRDeltaFromHike,
      monthLabels: monthLabels,
      cumulativeTimeline: cumulativeTimeline
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateGrandfathering(inputs);

    setOutputText('output_monthlyUnrealizedRevenue', formatCurrency(res.monthlyUnrealizedRevenue));
    setOutputText('output_annualGrandfatheringCost', formatCurrency(res.annualGrandfatheringCost));
    setOutputText('output_totalDurationCost', formatCurrency(res.totalDurationCost));
    setOutputText('output_breakevenChurnRate', formatPercent(res.breakevenChurnRate));
    setOutputText('output_netRevenueIfPriceRaised', formatCurrency(res.netRevenueIfPriceRaised));

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

    if (currentTab === 'cumulativeOpportunityCost') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.monthLabels,
          datasets: [{
            label: 'Cumulative Foregone Revenue ($)',
            data: data.cumulativeTimeline,
            borderColor: '#f87171',
            backgroundColor: 'rgba(248, 113, 113, 0.15)',
            fill: true,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: '#8899aa' } },
            title: { display: true, text: 'Cumulative Opportunity Cost ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'scenarioComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Grandfathered MRR', 'Price Hike MRR (Post-Churn)'],
          datasets: [{
            label: 'Monthly Revenue ($)',
            data: [data.baselineLegacyMRR, data.netRevenueIfPriceRaised],
            backgroundColor: ['#fbbf24', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Grandfathered vs Price Hike MRR ($)', color: '#e8edf0' }
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
    document.getElementById('input_grandfatheredCustomers').value = 400;
    document.getElementById('input_legacyPrice').value = 49;
    document.getElementById('input_newPrice').value = 89;
    document.getElementById('input_grandfatheringDurationMonths').value = 24;
    document.getElementById('input_estimatedChurnIfPriceRaised').value = 8.0;
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
