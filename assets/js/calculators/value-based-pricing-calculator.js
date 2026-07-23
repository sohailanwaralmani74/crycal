(function() {
  var chartInstance = null;
  var currentTab = 'valueSplit';
  var lastChartData = null;

  function getInputs() {
    return {
      hoursSavedPerMonth: parseFloat(document.getElementById('input_hoursSavedPerMonth').value) || 0,
      avgHourlyWage: parseFloat(document.getElementById('input_avgHourlyWage').value) || 0,
      directCostSavingsMonthly: parseFloat(document.getElementById('input_directCostSavingsMonthly').value) || 0,
      revenueIncreaseMonthly: parseFloat(document.getElementById('input_revenueIncreaseMonthly').value) || 0,
      targetValueSharePercent: (parseFloat(document.getElementById('input_targetValueSharePercent').value) || 0) / 100
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

  function calculateValueBased(inputs) {
    var laborSavings = inputs.hoursSavedPerMonth * inputs.avgHourlyWage;
    var totalMonthlyValueCreated = laborSavings + inputs.directCostSavingsMonthly + inputs.revenueIncreaseMonthly;
    var annualValueCreated = totalMonthlyValueCreated * 12;

    var recommendedPrice = totalMonthlyValueCreated * inputs.targetValueSharePercent;
    var customerRetainedValue = Math.max(0, totalMonthlyValueCreated - recommendedPrice);

    var customerNetROI = recommendedPrice > 0 ? (totalMonthlyValueCreated / recommendedPrice) : 0;
    var paybackPeriodDays = totalMonthlyValueCreated > 0 ? (recommendedPrice / totalMonthlyValueCreated) * 30.4 : 0;

    // Test share rates
    var shares = [10, 15, 20, 25, 30];
    var sharePrices = shares.map(function(s) {
      return totalMonthlyValueCreated * (s / 100);
    });

    return {
      totalMonthlyValueCreated: totalMonthlyValueCreated,
      annualValueCreated: annualValueCreated,
      recommendedPrice: recommendedPrice,
      customerRetainedValue: customerRetainedValue,
      customerNetROI: customerNetROI,
      paybackPeriodDays: paybackPeriodDays,
      shares: shares,
      sharePrices: sharePrices
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateValueBased(inputs);

    setOutputText('output_totalMonthlyValueCreated', formatCurrency(res.totalMonthlyValueCreated));
    setOutputText('output_annualValueCreated', formatCurrency(res.annualValueCreated));
    setOutputText('output_recommendedMonthlyPrice', formatCurrency(res.recommendedPrice));
    setOutputText('output_customerNetROI', res.customerNetROI.toFixed(1) + 'x');
    setOutputText('output_paybackPeriodDays', Math.round(res.paybackPeriodDays) + ' Days');

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

    if (currentTab === 'valueSplit') {
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Customer Retained ROI Value', 'SaaS Subscription Fee Captured'],
          datasets: [{
            data: [data.customerRetainedValue, data.recommendedPrice],
            backgroundColor: ['#4ade80', '#4A90D9'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#8899aa' } },
            title: { display: true, text: 'Monthly Value Distribution ($)', color: '#e8edf0' }
          }
        }
      });
    } else if (currentTab === 'roiComparison') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.shares.map(function(s) { return s + '% Capture'; }),
          datasets: [{
            label: 'Monthly Subscription Price ($)',
            data: data.sharePrices,
            backgroundColor: '#fbbf24',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Monthly Price Point across Value Capture %', color: '#e8edf0' }
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
    document.getElementById('input_hoursSavedPerMonth').value = 35;
    document.getElementById('input_avgHourlyWage').value = 45;
    document.getElementById('input_directCostSavingsMonthly').value = 500;
    document.getElementById('input_revenueIncreaseMonthly').value = 1000;
    document.getElementById('input_targetValueSharePercent').value = 20;
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
