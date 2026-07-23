(function() {

  var chartInstance = null;
  var currentTab = 'channelCacComparison';
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

    var paidSpend = parseFloat(document.getElementById('input_paidSpend').value) || 0;
    var organicSpend = parseFloat(document.getElementById('input_organicSpend').value) || 0;
    var teamSalaries = parseFloat(document.getElementById('input_teamSalaries').value) || 0;
    var paidCustomers = parseFloat(document.getElementById('input_paidCustomers').value) || 0;
    var organicCustomers = parseFloat(document.getElementById('input_organicCustomers').value) || 0;

    var totalCustomers = paidCustomers + organicCustomers;
    var totalSpend = paidSpend + organicSpend + teamSalaries;
    var blendedCac = totalCustomers > 0 ? (totalSpend / totalCustomers) : 0;
    var organicMixPct = totalCustomers > 0 ? (organicCustomers / totalCustomers) : 0;

    // Allocate salary proportional to spend
    var totalDirectSpend = paidSpend + organicSpend;
    var paidSalaries = totalDirectSpend > 0 ? (teamSalaries * (paidSpend / totalDirectSpend)) : (teamSalaries / 2);
    var organicSalaries = totalDirectSpend > 0 ? (teamSalaries * (organicSpend / totalDirectSpend)) : (teamSalaries / 2);

    var paidCac = paidCustomers > 0 ? ((paidSpend + paidSalaries) / paidCustomers) : 0;
    var organicCac = organicCustomers > 0 ? ((organicSpend + organicSalaries) / organicCustomers) : 0;

    var status = '';
    var recommendation = '';

    if (organicMixPct >= 0.50) {
      status = '🚀 Organic-Led Acquisition (>= 50% Organic)';
      recommendation = 'Strong organic engine. Blended CAC is heavily subsidized by low-cost inbound traffic.';
    } else if (organicMixPct >= 0.30) {
      status = '✅ Balanced Hybrid Mix (30% - 49% Organic)';
      recommendation = 'Healthy acquisition balance. Continue scaling organic content to lower overall blended CAC.';
    } else {
      status = '🟡 Paid Dependent (< 30% Organic)';
      recommendation = 'Acquisition is heavily dependent on paid ads. Invest in SEO content marketing to reduce long-term CAC.';
    }

    setOutputText('output_blendedCac', formatCurrency(blendedCac));
    setOutputText('output_paidCac', formatCurrency(paidCac));
    setOutputText('output_organicCac', formatCurrency(organicCac));
    setOutputText('output_totalCustomers', totalCustomers.toFixed(0));
    setOutputText('output_organicMixPct', formatPercent(organicMixPct));
    setOutputText('output_status', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      paidCac: paidCac,
      organicCac: organicCac,
      blendedCac: blendedCac,
      paidCustomers: paidCustomers,
      organicCustomers: organicCustomers
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        paidSpend: paidSpend,
        totalCustomers: totalCustomers,
        blendedCac: formatCurrency(blendedCac),
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
    if (tab === 'channelCacComparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Paid Channel CAC', 'Organic Channel CAC', 'Blended CAC'],
          datasets: [{
            label: 'Cost Per Customer ($)',
            data: [data.paidCac, data.organicCac, data.blendedCac],
            backgroundColor: ['#EC4899', '#34D399', '#60A5FA']
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
    if (tab === 'customerShare') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Paid Ads Customers', 'Organic / Inbound Customers'],
          datasets: [{
            data: [data.paidCustomers, data.organicCustomers],
            backgroundColor: ['#EC4899', '#34D399'],
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

    document.getElementById('input_paidSpend').value = 20000;
    document.getElementById('input_organicSpend').value = 5000;
    document.getElementById('input_teamSalaries').value = 15000;
    document.getElementById('input_paidCustomers').value = 40;
    document.getElementById('input_organicCustomers').value = 60;
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
