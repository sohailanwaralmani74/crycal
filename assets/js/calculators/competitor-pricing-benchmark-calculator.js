(function() {
  var chartInstance = null;
  var currentTab = 'benchmarkChart';
  var lastChartData = null;

  function getInputs() {
    return {
      c1: parseFloat(document.getElementById('input_competitor1Price').value) || 0,
      c2: parseFloat(document.getElementById('input_competitor2Price').value) || 0,
      c3: parseFloat(document.getElementById('input_competitor3Price').value) || 0,
      yourPrice: parseFloat(document.getElementById('input_yourProposedPrice').value) || 0,
      featureIndex: parseFloat(document.getElementById('input_featureFeatureMultiplier').value) || 1.0,
      targetCustomers: parseFloat(document.getElementById('input_targetCustomers').value) || 0
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
    return (val > 0 ? '+' : '') + val.toFixed(1) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function calculateBenchmark(inputs) {
    var comps = [inputs.c1, inputs.c2, inputs.c3].filter(function(x) { return x > 0; });
    var marketAvg = comps.length > 0 ? comps.reduce(function(a, b) { return a + b; }, 0) / comps.length : 0;

    var priceVariance = marketAvg > 0 ? ((inputs.yourPrice - marketAvg) / marketAvg) * 100 : 0;
    var featureAdjustedValue = marketAvg * inputs.featureIndex;

    var marketPosition = 'Market Parity';
    if (priceVariance > 15) marketPosition = 'Premium Quality Leader';
    else if (priceVariance < -15) marketPosition = 'Budget Disruptor';

    var projectedMRR = inputs.yourPrice * inputs.targetCustomers;

    return {
      marketAvg: marketAvg,
      priceVariance: priceVariance,
      featureAdjustedValue: featureAdjustedValue,
      marketPosition: marketPosition,
      projectedMRR: projectedMRR,
      c1: inputs.c1,
      c2: inputs.c2,
      c3: inputs.c3,
      yourPrice: inputs.yourPrice
    };
  }

  function updateTool() {
    var inputs = getInputs();
    var res = calculateBenchmark(inputs);

    setOutputText('output_marketAveragePrice', formatCurrency(res.marketAvg));
    setOutputText('output_priceVariancePercent', formatPercent(res.priceVariance));
    setOutputText('output_featureAdjustedValue', formatCurrency(res.featureAdjustedValue));
    setOutputText('output_marketPosition', res.marketPosition);
    setOutputText('output_projectedMRR', formatCurrency(res.projectedMRR));

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

    if (currentTab === 'benchmarkChart') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Comp A', 'Comp B', 'Comp C', 'Market Avg', 'Feature Target', 'Your Price'],
          datasets: [{
            label: 'Monthly Price ($)',
            data: [data.c1, data.c2, data.c3, data.marketAvg, data.featureAdjustedValue, data.yourPrice],
            backgroundColor: ['#8899aa', '#8899aa', '#8899aa', '#fbbf24', '#a78bfa', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Price Point Comparison ($)', color: '#e8edf0' }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } },
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899aa' } }
          }
        }
      });
    } else if (currentTab === 'positionMatrix') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Your Proposed Price', 'Feature-Adjusted Value'],
          datasets: [{
            label: 'Price ($)',
            data: [data.yourPrice, data.featureAdjustedValue],
            backgroundColor: ['#4A90D9', '#4ade80'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Proposed Price vs Feature-Adjusted Target', color: '#e8edf0' }
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
    document.getElementById('input_competitor1Price').value = 79;
    document.getElementById('input_competitor2Price').value = 99;
    document.getElementById('input_competitor3Price').value = 120;
    document.getElementById('input_yourProposedPrice').value = 95;
    document.getElementById('input_featureFeatureMultiplier').value = 1.10;
    document.getElementById('input_targetCustomers').value = 500;
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
