(function() {

  var chartInstance = null;
  var currentTab = 'contributionDollarChart';
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

    var smbArpu = parseFloat(document.getElementById('input_smbArpu').value) || 0;
    var smbCogs = parseFloat(document.getElementById('input_smbCogs').value) || 0;
    var midArpu = parseFloat(document.getElementById('input_midArpu').value) || 0;
    var midCogs = parseFloat(document.getElementById('input_midCogs').value) || 0;
    var entArpu = parseFloat(document.getElementById('input_entArpu').value) || 0;
    var entCogs = parseFloat(document.getElementById('input_entCogs').value) || 0;

    var smbContrib = smbArpu - smbCogs;
    var smbMargin = smbArpu > 0 ? (smbContrib / smbArpu) : 0;

    var midContrib = midArpu - midCogs;
    var midMargin = midArpu > 0 ? (midContrib / midArpu) : 0;

    var entContrib = entArpu - entCogs;
    var entMargin = entArpu > 0 ? (entContrib / entArpu) : 0;

    var segs = [
      { name: 'SMB Tier', margin: smbMargin, contrib: smbContrib },
      { name: 'Mid-Market Tier', margin: midMargin, contrib: midContrib },
      { name: 'Enterprise Tier', margin: entMargin, contrib: entContrib }
    ];
    segs.sort(function(a, b) { return b.margin - a.margin; });

    var topSegment = segs[0].name + ' (' + (segs[0].margin * 100).toFixed(1) + '%)';
    var recommendation = 'Focus sales incentives on expanding ' + segs[0].name + ' accounts to maximize unit margin performance.';

    setOutputText('output_smbContribution', formatCurrency(smbContrib) + ' / mo');
    setOutputText('output_smbMarginPct', formatPercent(smbMargin));
    setOutputText('output_midContribution', formatCurrency(midContrib) + ' / mo');
    setOutputText('output_midMarginPct', formatPercent(midMargin));
    setOutputText('output_entContribution', formatCurrency(entContrib) + ' / mo');
    setOutputText('output_entMarginPct', formatPercent(entMargin));
    setOutputText('output_topSegment', topSegment);
    setOutputText('output_recommendation', recommendation);

    lastChartData = {
      smbContrib: smbContrib,
      midContrib: midContrib,
      entContrib: entContrib,
      smbMargin: smbMargin,
      midMargin: midMargin,
      entMargin: entMargin
    };
    updateCharts(lastChartData);

    if (typeof window.logHistory === 'function') {
      window.logHistory({
        smbArpu: smbArpu,
        entArpu: entArpu,
        topSegment: topSegment,
        status: 'Calculated'
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
    if (tab === 'contributionDollarChart') {
      return {
        type: 'bar',
        data: {
          labels: ['SMB Tier Contribution', 'Mid-Market Contribution', 'Enterprise Contribution'],
          datasets: [{
            label: 'Monthly Contribution ($)',
            data: [data.smbContrib, data.midContrib, data.entContrib],
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
    if (tab === 'marginPctChart') {
      return {
        type: 'bar',
        data: {
          labels: ['SMB Unit Margin %', 'Mid-Market Unit Margin %', 'Enterprise Unit Margin %'],
          datasets: [{
            label: 'Unit Margin (%)',
            data: [data.smbMargin * 100, data.midMargin * 100, data.entMargin * 100],
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

    document.getElementById('input_smbArpu').value = 50;
    document.getElementById('input_smbCogs').value = 10;
    document.getElementById('input_midArpu').value = 500;
    document.getElementById('input_midCogs').value = 75;
    document.getElementById('input_entArpu').value = 3000;
    document.getElementById('input_entCogs').value = 350;
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
