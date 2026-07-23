(function() {

  var chartInstance = null;
  var currentTab = 'ratioChart';
  var lastChartData = null;

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

  function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '—';
    return (value * 100).toFixed(2) + '%';
  }

  function setOutputText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      var numEl = el.querySelector('.output-number');
      if (numEl) numEl.textContent = text;
      else el.textContent = text;
    }
  }

  function updateTool() {

    var ltv = parseFloat(document.getElementById('input_ltv').value) || 0;
    var cac = parseFloat(document.getElementById('input_cac').value) || 1;
    var targetRatio = parseFloat(document.getElementById('input_targetRatio').value) || 3.0;

    var ratio = ltv / cac;
    var netValueCreated = ltv - cac;
    var roi = ((ltv - cac) / cac) * 100;

    var status = '';
    var recommendation = '';

    if (ratio >= 5.0) {
      status = '🚀 Under-invested Growth (LTV:CAC >= 5x)';
      recommendation = 'Ratio is extremely high. You are under-investing in acquisition. Increase S&M spend to capture market share.';
    } else if (ratio >= targetRatio) {
      status = '✅ Optimal Unit Economics (LTV:CAC >= ' + targetRatio + 'x)';
      recommendation = 'Healthy scalable engine. Maintain your current acquisition mix and test new growth channels.';
    } else if (ratio >= 1.5) {
      status = '🟡 Underperforming (LTV:CAC 1.5x - ' + targetRatio + 'x)';
      recommendation = 'Unit economics are tight. Focus on reducing sales friction or increasing ARPU to reach 3x target.';
    } else {
      status = '🔴 Unsustainable (LTV:CAC < 1.5x)';
      recommendation = 'Unit economics are negative or fragile. Audit acquisition spend and churn root causes immediately.';
    }

    setOutputText('output_ratio', ratio.toFixed(2) + 'x');
    setOutputText('output_netValueCreated', formatCurrency(netValueCreated));
    setOutputText('output_roi', roi.toFixed(0) + '%');
    setOutputText('output_benchmarkStatus', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      ltv: ltv,
      cac: cac,
      targetRatio: targetRatio,
      ratio: ratio
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        ltv: ltv,
        cac: cac,
        ratio: ratio.toFixed(2) + 'x',
        benchmarkStatus: status
      });
    }

  }

  function updateCharts(data) {
    var ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    var chartData = generateChartData(currentTab, data);
    if (!chartData) return;
    chartInstance = new Chart(ctx, chartData);
  }

  function generateChartData(tab, data) {

    if (!data) return null;
    if (tab === 'ratioChart') {
      return {
        type: 'bar',
        data: {
          labels: ['CAC (Investment)', 'LTV (Return)'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.cac, data.ltv],
            backgroundColor: ['#EC4899', '#34D399']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'benchmark') {
      return {
        type: 'bar',
        data: {
          labels: ['Current Ratio', 'Target Benchmark'],
          datasets: [{
            label: 'Ratio (x)',
            data: [data.ratio, data.targetRatio],
            backgroundColor: ['#60A5FA', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    return null;

  }

  function switchChartTab(tabId) {
    currentTab = tabId;
    if (lastChartData) {
      updateCharts(lastChartData);
    } else {
      updateTool();
    }
  }

  function resetTool() {

    document.getElementById('input_ltv').value = 4800;
    document.getElementById('input_cac').value = 1200;
    document.getElementById('input_targetRatio').value = 3.0;
    updateTool();

  }

  window.updateTool = updateTool;
  window.resetTool = resetTool;
  window.switchChartTab = switchChartTab;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#inputsArea input, #inputsArea select').forEach(function(el) {
      var defaultVal = el.dataset.default || el.getAttribute('value') || '';
      if (defaultVal && el.value === '') el.value = defaultVal;
    });

    setTimeout(function() {
      if (typeof window.updateTool === 'function') window.updateTool();
    }, 150);

    var picker = document.getElementById('baseCurrency');
    if (picker) {
      picker.addEventListener('change', function() {
        if (typeof window.updateTool === 'function') window.updateTool();
      });
    }
  });

})();
