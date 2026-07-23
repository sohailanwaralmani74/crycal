(function() {
  var chartInstance = null;
  var currentTab = 'breakdown';
  var lastChartData = null;

  function getInputs() {
    return {
      hostingCost: parseFloat(document.getElementById('input_hostingCostPerUser').value) || 0,
      supportCost: parseFloat(document.getElementById('input_supportCostPerUser').value) || 0,
      cogsOther: parseFloat(document.getElementById('input_cogsOther').value) || 0,
      targetMargin: (parseFloat(document.getElementById('input_targetGrossMargin').value) || 80) / 100,
      hoursSaved: parseFloat(document.getElementById('input_customerMonthlyHoursSaved').value) || 0,
      hourlyValue: parseFloat(document.getElementById('input_customerHourlyValue').value) || 0,
      valueCapture: (parseFloat(document.getElementById('input_valueCapturePercent').value) || 20) / 100
    };
  }

  function formatCurrency(amount) {
    try {
      var currencyCode = (typeof getGlobalCurrency === 'function') ? getGlobalCurrency() : 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }

  function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateSaaSPricing(inputs) {
    var totalCogs = inputs.hostingCost + inputs.supportCost + inputs.cogsOther;
    var marginDenominator = Math.max(0.01, 1 - inputs.targetMargin);
    var costPlusPrice = totalCogs / marginDenominator;

    var monthlyValueCreated = inputs.hoursSaved * inputs.hourlyValue;
    var valueBasedPrice = monthlyValueCreated * inputs.valueCapture;

    var hybridPrice = Math.max(costPlusPrice, (costPlusPrice * 0.30) + (valueBasedPrice * 0.70));
    var grossMarginAtTarget = hybridPrice > 0 ? (hybridPrice - totalCogs) / hybridPrice : 0;

    return {
      totalCogs: totalCogs,
      costPlusPrice: costPlusPrice,
      valueBasedPrice: valueBasedPrice,
      monthlyValueCreated: monthlyValueCreated,
      optimalTargetPrice: hybridPrice,
      grossMarginAtTarget: grossMarginAtTarget
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateSaaSPricing(inputs);

    setOutputText('output_costPlusPrice', formatCurrency(res.costPlusPrice));
    setOutputText('output_valueBasedPrice', formatCurrency(res.valueBasedPrice));
    setOutputText('output_monthlyValueCreated', formatCurrency(res.monthlyValueCreated));
    setOutputText('output_optimalTargetPrice', formatCurrency(res.optimalTargetPrice));
    setOutputText('output_grossMarginAtTarget', formatPercent(res.grossMarginAtTarget));

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

    if (currentTab === 'breakdown') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['COGS Floor', 'Cost-Plus Price', 'Value-Based Ceiling', 'Hybrid Target'],
          datasets: [{
            label: 'Monthly Price ($)',
            data: [data.totalCogs, data.costPlusPrice, data.valueBasedPrice, data.optimalTargetPrice],
            backgroundColor: ['#f87171', '#fbbf24', '#4A90D9', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Price Model Comparison ($ / User / Mo)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'margin') {
      var costPlusMargin = data.costPlusPrice > 0 ? ((data.costPlusPrice - data.totalCogs) / data.costPlusPrice) * 100 : 0;
      var valueMargin = data.valueBasedPrice > 0 ? ((data.valueBasedPrice - data.totalCogs) / data.valueBasedPrice) * 100 : 0;
      var hybridMargin = data.grossMarginAtTarget * 100;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Cost-Plus Model', 'Value-Based Model', 'Hybrid Target Model'],
          datasets: [{
            label: 'Gross Margin %',
            data: [costPlusMargin, valueMargin, hybridMargin],
            backgroundColor: ['#fbbf24', '#4A90D9', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Gross Margin % Comparison', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
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
    document.getElementById('input_hostingCostPerUser').value = 5;
    document.getElementById('input_supportCostPerUser').value = 10;
    document.getElementById('input_cogsOther').value = 5;
    document.getElementById('input_targetGrossMargin').value = 80;
    document.getElementById('input_customerMonthlyHoursSaved').value = 20;
    document.getElementById('input_customerHourlyValue').value = 50;
    document.getElementById('input_valueCapturePercent').value = 20;
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
