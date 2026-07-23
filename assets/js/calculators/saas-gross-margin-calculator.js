(function() {

  var chartInstance = null;
  var currentTab = 'cogsBreakdown';
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

    var revenue = parseFloat(document.getElementById('input_revenue').value) || 0;
    var hostingCost = parseFloat(document.getElementById('input_hostingCost').value) || 0;
    var supportCost = parseFloat(document.getElementById('input_supportCost').value) || 0;
    var thirdPartyCost = parseFloat(document.getElementById('input_thirdPartyCost').value) || 0;
    var onboardingCost = parseFloat(document.getElementById('input_onboardingCost').value) || 0;

    var totalCogs = hostingCost + supportCost + thirdPartyCost + onboardingCost;
    var grossProfit = revenue - totalCogs;
    var grossMarginPct = revenue > 0 ? (grossProfit / revenue) : 0;
    var cogsRatio = revenue > 0 ? (totalCogs / revenue) : 0;

    var status = '';
    var recommendation = '';

    if (grossMarginPct >= 0.80) {
      status = '✅ Elite SaaS Gross Margin (>= 80%)';
      recommendation = 'World-class unit cost structure. Maintain infrastructure efficiency while scaling user volume.';
    } else if (grossMarginPct >= 0.70) {
      status = '✅ Healthy Gross Margin (70% - 79%)';
      recommendation = 'Solid margin profile. Audit cloud server provisioning and third-party API tiers to target 80%+.';
    } else if (grossMarginPct >= 0.60) {
      status = '🟡 Moderate Margin (60% - 69%)';
      recommendation = 'Margins are suppressed. Evaluate customer support headcount and automated self-serve workflows.';
    } else {
      status = '🔴 Low Gross Margin (< 60%)';
      recommendation = 'COGS is too high. Your company resembles a tech services business rather than high-margin pure software.';
    }

    setOutputText('output_grossMarginPct', formatPercent(grossMarginPct));
    setOutputText('output_grossProfit', formatCurrency(grossProfit));
    setOutputText('output_totalCogs', formatCurrency(totalCogs));
    setOutputText('output_cogsRatio', formatPercent(cogsRatio));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      revenue: revenue,
      totalCogs: totalCogs,
      grossProfit: grossProfit,
      hostingCost: hostingCost,
      supportCost: supportCost,
      thirdPartyCost: thirdPartyCost,
      onboardingCost: onboardingCost
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        revenue: revenue,
        totalCogs: totalCogs,
        grossMarginPct: (grossMarginPct * 100).toFixed(1) + '%',
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
    if (tab === 'cogsBreakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Cloud Infrastructure', 'Support Salaries', 'Third-Party APIs', 'Onboarding COGS'],
          datasets: [{
            data: [data.hostingCost, data.supportCost, data.thirdPartyCost, data.onboardingCost],
            backgroundColor: ['#4A90D9', '#F59E0B', '#EC4899', '#8B5CF6'],
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
    if (tab === 'marginVsRevenue') {
      return {
        type: 'bar',
        data: {
          labels: ['Total Revenue', 'Total COGS', 'Gross Profit'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.revenue, data.totalCogs, data.grossProfit],
            backgroundColor: ['#60A5FA', '#EC4899', '#34D399']
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

    document.getElementById('input_revenue').value = 100000;
    document.getElementById('input_hostingCost').value = 8000;
    document.getElementById('input_supportCost').value = 7000;
    document.getElementById('input_thirdPartyCost').value = 3000;
    document.getElementById('input_onboardingCost').value = 2000;
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
