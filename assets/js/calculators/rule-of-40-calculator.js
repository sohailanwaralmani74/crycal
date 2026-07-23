(function() {

  var chartInstance = null;
  var currentTab = 'scoreBreakdown';
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

    var arrGrowthRate = parseFloat(document.getElementById('input_arrGrowthRate').value) || 0;
    var fcfMargin = parseFloat(document.getElementById('input_fcfMargin').value) || 0;

    var score = arrGrowthRate + fcfMargin;

    var status = '';
    var recommendation = '';

    if (score >= 40) {
      status = '🚀 Elite SaaS Performance (Score >= 40%)';
      recommendation = 'Outstanding growth-profit balance. Maintain your operational cadence and command premium valuation multiples.';
    } else if (score >= 30) {
      status = '✅ Strong SaaS Execution (30% - 39%)';
      recommendation = 'Solid performance. Identify levers in net revenue retention or sales efficiency to cross the 40% threshold.';
    } else if (score >= 15) {
      status = '🟡 Underperforming Benchmark (15% - 29%)';
      recommendation = 'Evaluate growth vs burn tradeoffs. Either accelerate ARR expansion or cut non-performing marketing spend.';
    } else {
      status = '🔴 Critical Operational Retrenchment (< 15%)';
      recommendation = 'Score is critically low. Restructure sales incentives and optimize pricing to restore unit profitability.';
    }

    setOutputText('output_ruleOf40Score', score.toFixed(1) + '%');
    setOutputText('output_growthContribution', arrGrowthRate.toFixed(1) + '%');
    setOutputText('output_marginContribution', fcfMargin.toFixed(1) + '%');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      arrGrowthRate: arrGrowthRate,
      fcfMargin: fcfMargin,
      score: score
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        arrGrowthRate: arrGrowthRate,
        fcfMargin: fcfMargin,
        ruleOf40Score: score.toFixed(1) + '%',
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
    if (tab === 'scoreBreakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Growth Component', 'FCF Margin Component', 'Total Score'],
          datasets: [{
            label: 'Percentage (%)',
            data: [data.arrGrowthRate, data.fcfMargin, data.score],
            backgroundColor: ['#60A5FA', '#34D399', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { color: '#8899aa' } }, x: { ticks: { color: '#8899aa' } } }
        }
      };
    }
    if (tab === 'benchmarkComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Score', 'Target Benchmark (40%)'],
          datasets: [{
            label: 'Score (%)',
            data: [data.score, 40],
            backgroundColor: ['#60A5FA', '#34D399']
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

    document.getElementById('input_arrGrowthRate').value = 35;
    document.getElementById('input_fcfMargin').value = 10;
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
