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

    var adSpend = parseFloat(document.getElementById('input_adSpend').value) || 0;
    var salaries = parseFloat(document.getElementById('input_salaries').value) || 0;
    var softwareCost = parseFloat(document.getElementById('input_softwareCost').value) || 0;
    var agencyCost = parseFloat(document.getElementById('input_agencyCost').value) || 0;
    var newCustomers = parseFloat(document.getElementById('input_newCustomers').value) || 1;

    var totalSpend = adSpend + salaries + softwareCost + agencyCost;
    var cac = totalSpend / newCustomers;
    var paidCac = adSpend / newCustomers;
    var overheadPerCustomer = (salaries + softwareCost + agencyCost) / newCustomers;

    var status = '';
    var recommendation = '';

    if (cac < 200) {
      status = '✅ Highly Efficient Acquisition';
      recommendation = 'Excellent CAC efficiency. Consider scaling ad spend to capture market share faster.';
    } else if (cac < 1000) {
      status = '✅ Healthy Unit Economics';
      recommendation = 'Solid acquisition efficiency. Maintain current sales & marketing mix while testing new channels.';
    } else if (cac < 3500) {
      status = '🟡 Moderate CAC Burden';
      recommendation = 'Monitor your payback period closely to ensure ARPU justifies higher acquisition investment.';
    } else {
      status = '🔴 High Acquisition Cost';
      recommendation = 'CAC is high. Audit ad conversions, shorten sales cycles, and improve organic channel mix.';
    }

    setOutputText('output_totalSpend', formatCurrency(totalSpend));
    setOutputText('output_cac', formatCurrency(cac));
    setOutputText('output_paidCac', formatCurrency(paidCac));
    setOutputText('output_overheadPerCustomer', formatCurrency(overheadPerCustomer));
    setOutputText('output_benchmarkStatus', status);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      adSpend: adSpend,
      salaries: salaries,
      softwareCost: softwareCost,
      agencyCost: agencyCost,
      cac: cac,
      paidCac: paidCac
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        totalSpend: totalSpend,
        newCustomers: newCustomers,
        cac: cac,
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
    if (tab === 'breakdown') {
      return {
        type: 'doughnut',
        data: {
          labels: ['Ad Spend', 'Salaries & Comms', 'Software Tools', 'Agency Fees'],
          datasets: [{
            data: [data.adSpend, data.salaries, data.softwareCost, data.agencyCost],
            backgroundColor: ['#4A90D9', '#34D399', '#F59E0B', '#EC4899'],
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
    if (tab === 'comparison') {
      return {
        type: 'bar',
        data: {
          labels: ['Direct Ad CAC', 'Fully-Loaded CAC'],
          datasets: [{
            label: 'Cost Per Customer ($)',
            data: [data.paidCac, data.cac],
            backgroundColor: ['#60A5FA', '#34D399']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#8899aa' } },
            x: { ticks: { color: '#8899aa' } }
          }
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

    document.getElementById('input_adSpend').value = 15000;
    document.getElementById('input_salaries').value = 25000;
    document.getElementById('input_softwareCost').value = 5000;
    document.getElementById('input_agencyCost').value = 5000;
    document.getElementById('input_newCustomers').value = 50;
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
