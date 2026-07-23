(function() {

  var chartInstance = null;
  var currentTab = 'costBreakdown';
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

    var awsCost = parseFloat(document.getElementById('input_awsCost').value) || 0;
    var thirdPartyApis = parseFloat(document.getElementById('input_thirdPartyApis').value) || 0;
    var csSalaries = parseFloat(document.getElementById('input_csSalaries').value) || 0;
    var devOpsSalaries = parseFloat(document.getElementById('input_devOpsSalaries').value) || 0;
    var activeAccounts = parseFloat(document.getElementById('input_activeAccounts').value) || 1;

    var totalCostOfService = awsCost + thirdPartyApis + csSalaries + devOpsSalaries;
    var costPerAccount = totalCostOfService / activeAccounts;
    var annualCostPerAccount = costPerAccount * 12;

    var infrastructureCostPerAccount = (awsCost + thirdPartyApis) / activeAccounts;
    var humanCostPerAccount = (csSalaries + devOpsSalaries) / activeAccounts;

    var status = '';
    var recommendation = '';

    if (costPerAccount <= 50) {
      status = '✅ Low Cost to Serve ($' + costPerAccount.toFixed(0) + '/acct)';
      recommendation = 'Highly scalable cost structure. Automated workflows keep per-account overhead lean.';
    } else if (costPerAccount <= 200) {
      status = '✅ Moderate Cost to Serve ($' + costPerAccount.toFixed(0) + '/acct)';
      recommendation = 'Healthy cost profile. Ensure customer ARPU is at least 4x-5x higher than cost to serve.';
    } else {
      status = '🟡 High Cost to Serve ($' + costPerAccount.toFixed(0) + '/acct)';
      recommendation = 'Cost to serve is high. Evaluate customer success headcount efficiency and AWS database queries.';
    }

    setOutputText('output_totalCostOfService', formatCurrency(totalCostOfService));
    setOutputText('output_costPerAccount', formatCurrency(costPerAccount) + ' / mo');
    setOutputText('output_annualCostPerAccount', formatCurrency(annualCostPerAccount) + ' / yr');
    setOutputText('output_infrastructureCostPerAccount', formatCurrency(infrastructureCostPerAccount) + ' / mo');
    setOutputText('output_humanCostPerAccount', formatCurrency(humanCostPerAccount) + ' / mo');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      awsCost: awsCost,
      thirdPartyApis: thirdPartyApis,
      csSalaries: csSalaries,
      devOpsSalaries: devOpsSalaries,
      infrastructureCostPerAccount: infrastructureCostPerAccount,
      humanCostPerAccount: humanCostPerAccount
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalCostOfService: totalCostOfService,
        activeAccounts: activeAccounts,
        costPerAccount: formatCurrency(costPerAccount),
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
    if (tab === 'costBreakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['AWS Cloud Hosting', 'Third-Party APIs', 'CS/Support Salaries', 'DevOps Salaries'],
          datasets: [{
            data: [data.awsCost, data.thirdPartyApis, data.csSalaries, data.devOpsSalaries],
            backgroundColor: ['#4A90D9', '#EC4899', '#F59E0B', '#8B5CF6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#e8edf0' } } }
        }
      };
    }
    if (tab === 'perAccountComponent') {
      return {
        type: 'bar',
        data: {
          labels: ['Infrastructure Cost / Acct', 'Human CS Cost / Acct'],
          datasets: [{
            label: 'Cost Per Account ($)',
            data: [data.infrastructureCostPerAccount, data.humanCostPerAccount],
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

    document.getElementById('input_awsCost').value = 12000;
    document.getElementById('input_thirdPartyApis').value = 4000;
    document.getElementById('input_csSalaries').value = 24000;
    document.getElementById('input_devOpsSalaries').value = 10000;
    document.getElementById('input_activeAccounts').value = 500;
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
