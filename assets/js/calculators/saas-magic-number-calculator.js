(function() {

  var chartInstance = null;
  var currentTab = 'efficiencyChart';
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

    var currentQRev = parseFloat(document.getElementById('input_currentQRev').value) || 0;
    var prevQRev = parseFloat(document.getElementById('input_prevQRev').value) || 0;
    var prevQSm = parseFloat(document.getElementById('input_prevQSm').value) || 1;

    var quarterlyNetNewArr = (currentQRev - prevQRev) * 4;
    var magicNumber = quarterlyNetNewArr / prevQSm;
    var smEfficiency = magicNumber;

    var status = '';
    var recommendation = '';

    if (magicNumber >= 1.0) {
      status = '🚀 Top-Tier Efficiency (Magic Number >= 1.0x)';
      recommendation = 'GTM engine is highly efficient. Aggressively scale sales headcount and marketing channels.';
    } else if (magicNumber >= 0.75) {
      status = '✅ Efficient Growth (0.75x - 0.99x)';
      recommendation = 'Solid sales efficiency. Continue scaling GTM spend while refining sales rep ramp times.';
    } else if (magicNumber >= 0.50) {
      status = '🟡 Moderate Sales Friction (0.50x - 0.74x)';
      recommendation = 'Efficiency is sub-optimal. Audit sales conversion rates and ad CAC before adding headcount.';
    } else {
      status = '🔴 Inefficient GTM (< 0.50x)';
      recommendation = 'S&M spend is returning low ARR. Freeze growth hiring; fix customer churn and positioning.';
    }

    setOutputText('output_magicNumber', magicNumber.toFixed(2) + 'x');
    setOutputText('output_quarterlyNetNewArr', formatCurrency(quarterlyNetNewArr));
    setOutputText('output_smEfficiency', '$' + smEfficiency.toFixed(2) + ' ARR / $1 S&M');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      prevQSm: prevQSm,
      quarterlyNetNewArr: quarterlyNetNewArr,
      magicNumber: magicNumber
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        currentQRev: currentQRev,
        prevQSm: prevQSm,
        magicNumber: magicNumber.toFixed(2) + 'x',
        status: status
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
    if (tab === 'efficiencyChart') {
      return {
        type: 'bar',
        data: {
          labels: ['S&M Spend (Q-1)', 'Net New Annual ARR Generated'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.prevQSm, data.quarterlyNetNewArr],
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
    if (tab === 'benchmarkChart') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Magic Number', 'Good Target (0.75x)', 'Elite Target (1.0x)'],
          datasets: [{
            label: 'Magic Number Ratio (x)',
            data: [data.magicNumber, 0.75, 1.0],
            backgroundColor: ['#60A5FA', '#F59E0B', '#34D399']
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

    document.getElementById('input_currentQRev').value = 500000;
    document.getElementById('input_prevQRev').value = 400000;
    document.getElementById('input_prevQSm').value = 250000;
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
