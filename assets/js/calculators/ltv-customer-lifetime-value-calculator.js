(function() {

  var chartInstance = null;
  var currentTab = 'breakdown';
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

    var arpu = parseFloat(document.getElementById('input_arpu').value) || 0;
    var grossMargin = (parseFloat(document.getElementById('input_grossMargin').value) || 0) / 100;
    var churnRate = (parseFloat(document.getElementById('input_churnRate').value) || 0.1) / 100;
    var expansionRate = (parseFloat(document.getElementById('input_expansionRate').value) || 0) / 100;

    var netChurnRate = churnRate - expansionRate;
    if (netChurnRate <= 0.001) netChurnRate = 0.001;

    var avgLifespanMonths = 1 / (churnRate > 0 ? churnRate : 0.01);
    var ltv = (arpu * grossMargin) / netChurnRate;
    var lifetimeGrossProfit = arpu * avgLifespanMonths * grossMargin;

    var status = '';
    var recommendation = '';

    if (ltv > 20000) {
      status = '✅ Enterprise Grade LTV';
      recommendation = 'High LTV supports account-based sales (ABM) and high-touch customer success models.';
    } else if (ltv > 5000) {
      status = '✅ Strong Mid-Market LTV';
      recommendation = 'Solid lifetime value. Focus on expanding account seat count and cross-selling add-on modules.';
    } else if (ltv > 1500) {
      status = '🟡 Moderate SMB LTV';
      recommendation = 'Healthy SMB tier. Keep acquisition costs lean via automated self-serve onboarding.';
    } else {
      status = '🔴 Low LTV';
      recommendation = 'LTV is low. Evaluate pricing tiers, improve retention onboarding, and expand ARPU.';
    }

    setOutputText('output_ltv', formatCurrency(ltv));
    setOutputText('output_avgLifespan', avgLifespanMonths.toFixed(1) + ' mo');
    setOutputText('output_lifetimeGrossProfit', formatCurrency(lifetimeGrossProfit));
    setOutputText('output_netChurn', (netChurnRate * 100).toFixed(2) + '%');
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      arpu: arpu,
      grossMargin: grossMargin,
      avgLifespanMonths: avgLifespanMonths,
      ltv: ltv
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        arpu: arpu,
        churnRate: (churnRate * 100).toFixed(1),
        ltv: ltv,
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
    if (tab === 'breakdown') {
      return {
        type: 'bar',
        data: {
          labels: ['Gross Revenue / Mo', 'Gross Profit / Mo', 'Total LTV'],
          datasets: [{
            label: 'Dollars ($)',
            data: [data.arpu, data.arpu * data.grossMargin, data.ltv],
            backgroundColor: ['#60A5FA', '#34D399', '#F59E0B']
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
    if (tab === 'lifespan') {
      var months = [6, 12, 18, 24, 30, 36];
      var values = months.map(function(m) { return Math.min(data.ltv, data.arpu * data.grossMargin * m); });
      return {
        type: 'line',
        data: {
          labels: months.map(function(m){ return 'Month ' + m; }),
          datasets: [{
            label: 'Cumulative LTV ($)',
            data: values,
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

    document.getElementById('input_arpu').value = 150;
    document.getElementById('input_grossMargin').value = 80;
    document.getElementById('input_churnRate').value = 2.5;
    document.getElementById('input_expansionRate').value = 0.5;
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
