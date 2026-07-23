(function() {

  var chartInstance = null;
  var currentTab = 'burnVsArr';
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

    var netBurn = parseFloat(document.getElementById('input_netBurn').value) || 0;
    var netNewArr = parseFloat(document.getElementById('input_netNewArr').value) || 1;

    var burnMultiple = netBurn / netNewArr;
    var arrEfficiency = netNewArr / (netBurn > 0 ? netBurn : 1);
    var capitalBurnPerDollarArr = burnMultiple;

    var status = '';
    var recommendation = '';

    if (burnMultiple < 1.0) {
      status = '🚀 Amazing Efficiency (Burn Multiple < 1.0x)';
      recommendation = 'Elite capital conversion. You burn less than $1 cash for every $1 of net new ARR created.';
    } else if (burnMultiple <= 1.5) {
      status = '✅ Good Efficiency (1.0x - 1.5x)';
      recommendation = 'Healthy capital burn rate. Maintain disciplined operational expenditure while scaling sales.';
    } else if (burnMultiple <= 2.0) {
      status = '🟡 Suspect Efficiency (1.5x - 2.0x)';
      recommendation = 'Capital burn is elevated. Audit non-essential hiring and optimize customer acquisition costs.';
    } else if (burnMultiple <= 2.5) {
      status = '🔴 Bad Efficiency (2.0x - 2.5x)';
      recommendation = 'High cash burn rate. Extend runway by trimming underperforming marketing spend.';
    } else {
      status = '🔴 Dangerous Burn Rate (> 2.5x)';
      recommendation = 'Critical efficiency breakdown. Burn rate is unsustainable. Restructure operational costs immediately.';
    }

    setOutputText('output_burnMultiple', burnMultiple.toFixed(2) + 'x');
    setOutputText('output_arrEfficiency', '$' + arrEfficiency.toFixed(2) + ' ARR / $1 Burn');
    setOutputText('output_capitalBurnPerDollarArr', '$' + capitalBurnPerDollarArr.toFixed(2) + ' Burn / $1 ARR');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      netBurn: netBurn,
      netNewArr: netNewArr,
      burnMultiple: burnMultiple
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        netBurn: netBurn,
        netNewArr: netNewArr,
        burnMultiple: burnMultiple.toFixed(2) + 'x',
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
    if (tab === 'burnVsArr') {
      return {
        type: 'bar',
        data: {
          labels: ['Net Cash Burned', 'Net New ARR Created'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.netBurn, data.netNewArr],
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
    if (tab === 'benchmarkTier') {
      return {
        type: 'bar',
        data: {
          labels: ['Your Multiple', 'Good Target (1.5x)', 'Elite Target (1.0x)'],
          datasets: [{
            label: 'Burn Multiple (x)',
            data: [data.burnMultiple, 1.5, 1.0],
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

    document.getElementById('input_netBurn').value = 300000;
    document.getElementById('input_netNewArr').value = 200000;
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
